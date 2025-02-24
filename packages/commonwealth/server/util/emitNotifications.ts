import { factory, formatFilename } from 'common-common/src/logging';
import { StatsDController } from 'common-common/src/statsd';
import { ChainBase, ChainType } from 'common-common/src/types';
import Sequelize, { QueryTypes } from 'sequelize';
import {
  IChainEventNotificationData,
  IChatNotification,
  ICommunityNotificationData,
  IPostNotificationData
} from '../../shared/types';
import { SERVER_URL } from '../config';
import { DB } from '../models';
import { NotificationInstance } from '../models/notification';
import {
  createImmediateNotificationEmailObject,
  sendImmediateNotificationEmail
} from '../scripts/emails';
import send, { WebhookContent } from '../webhookNotifier';

const log = factory.getLogger(formatFilename(__filename));

const { Op } = Sequelize;

export default async function emitNotifications(
  models: DB,
  category_id: string,
  object_id: string,
  notification_data: IPostNotificationData | ICommunityNotificationData | IChainEventNotificationData | IChatNotification,
  webhook_data?: Partial<WebhookContent>,
  excludeAddresses?: string[],
  includeAddresses?: string[],
): Promise<NotificationInstance> {
  // get subscribers to send notifications to
  StatsDController.get().increment(
    'cw.notifications.created',
    {
      category_id,
      object_id,
      chain: (notification_data as any).chain || (notification_data as any).chain_id,
    }
  );
  const findOptions: any = {
    [Op.and]: [
      { category_id },
      { object_id },
      { is_active: true },
    ],
  };

  // typeguard function to differentiate between chain event notifications as needed
  const isChainEventData = (<IChainEventNotificationData>notification_data).chainEvent !== undefined;

  // retrieve distinct user ids given a set of addresses
  const fetchUsersFromAddresses = async (addresses: string[]): Promise<number[]> => {
    // fetch user ids from address models
    const addressModels = await models.Address.findAll({
      where: {
        address: {
          [Op.in]: addresses,
        },
      },
    });
    if (addressModels && addressModels.length > 0) {
      const userIds = addressModels.map((a) => a.user_id);

      // remove duplicates
      const userIdsDedup = userIds.filter((a, b) => userIds.indexOf(a) === b);
      return userIdsDedup;
    } else {
      return [];
    }
  };

  // currently excludes override includes, but we may want to provide the option for both
  if (excludeAddresses && excludeAddresses.length > 0) {
    const ids = await fetchUsersFromAddresses(excludeAddresses);
    if (ids && ids.length > 0) {
      findOptions[Op.and].push({ subscriber_id: { [Op.notIn]: ids } });
    }
  } else if (includeAddresses && includeAddresses.length > 0) {
    const ids = await fetchUsersFromAddresses(includeAddresses);
    if (ids && ids.length > 0) {
      findOptions[Op.and].push({ subscriber_id: { [Op.in]: ids } });
    }
  }

  // get all relevant subscriptions
  const subscriptions = await models.Subscription.findAll({
    where: findOptions,
    include: models.User,
  });

  // get notification if it already exists
  let notification: NotificationInstance;
  notification = await models.Notification.findOne(isChainEventData ? {
    where: {
      chain_event_id: (<IChainEventNotificationData>notification_data).chainEvent.id
    }
  } : {
    where: {
      notification_data: JSON.stringify(notification_data)
    }
  });

  // if the notification does not yet exist create it here
  if (!notification) {
    if (isChainEventData) {
      const event: any = (<IChainEventNotificationData>notification_data).chainEvent;
      event.ChainEventType = (<IChainEventNotificationData>notification_data).chainEventType;

      notification = await models.Notification.create({
        notification_data: JSON.stringify(event),
        chain_event_id: (<IChainEventNotificationData>notification_data).chainEvent.id,
        category_id: 'chain-event',
        chain_id: (<IChainEventNotificationData>notification_data).chain_id
      });
    } else {
      notification = await models.Notification.create({
        notification_data: JSON.stringify(notification_data),
        category_id,
        chain_id: (<IPostNotificationData>notification_data).chain_id
          || (<ICommunityNotificationData>notification_data).chain
          || (<IChatNotification>notification_data).chain_id
      });
    }
  }

  let msg;
  try {
    msg = await createImmediateNotificationEmailObject(notification_data, category_id, models);
  } catch (e) {
    console.log('Error generating immediate notification email!');
    console.trace(e);
  }

  // create NotificationsRead instances
  // await models.NotificationsRead.bulkCreate(subscribers.map((subscription) => ({
  //   subscription_id: subscription.id,
  //   notification_id: notification.id,
  //   is_read: false,
  //   user_id: subscription.subscriber_id
  // })));

  let query = `INSERT INTO "NotificationsRead" VALUES `;
  const replacements = [];
  for (const subscription of subscriptions) {
    if (subscription.subscriber_id) {
      StatsDController.get().increment(
        'cw.notifications.emitted',
        {
          category_id,
          object_id,
          chain: (notification_data as any).chain || (notification_data as any).chain_id,
          subscriber: `${subscription.subscriber_id}`,
        }
      );
      query += `(?, ?, ?, ?, (SELECT COALESCE(MAX(id), 0) + 1 FROM "NotificationsRead" WHERE user_id = ?)), `;
      replacements.push(notification.id, subscription.id, false, subscription.subscriber_id, subscription.subscriber_id);
    } else {
      // TODO: rollbar reported issue originates from here
      log.info(`Subscription: ${JSON.stringify(subscription.toJSON())}\nNotification_data: ${JSON.stringify(notification_data)}`);
    }
  }
  if (replacements.length > 0) {
    query = query.slice(0, -2) + ';';
    await models.sequelize.query(query, { replacements, type: QueryTypes.INSERT });
  }

  // send emails
  for (const subscription of subscriptions) {
    if (msg && isChainEventData && (<IChainEventNotificationData>notification_data).chainEventType?.chain) {
      msg.dynamic_template_data.notification.path = `${
        SERVER_URL
      }/${
        (<IChainEventNotificationData>notification_data).chainEventType.chain
      }/notifications?id=${
        notification.id
      }`;
    }
    if (msg && subscription?.immediate_email && subscription?.User) {
      // kick off async call and immediately return
      sendImmediateNotificationEmail(subscription.User, msg);
    }
  }

  const erc20Tokens = (await models.Chain.findAll({
    where: {
      base: ChainBase.Ethereum,
      type: ChainType.Token,
    }
  })).map((o) => o.id);

  // send data to relevant webhooks
  if (webhook_data && (
    // TODO: this OR clause seems redundant?
    webhook_data.chainEventType?.chain || !erc20Tokens.includes(webhook_data.chainEventType?.chain)
  )) {
    await send(models, {
      notificationCategory: category_id,
      ...webhook_data as any
    });
  }

  return notification;
}