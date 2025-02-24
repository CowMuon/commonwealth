import {NextFunction} from 'express';
import {Op} from 'sequelize';
import {factory, formatFilename} from 'common-common/src/logging';
import {AppError} from 'common-common/src/errors';
import {TypedRequestBody, TypedResponse, success} from '../types';
import {DB} from '../models';
import { findOneRole } from '../util/roles';

const log = factory.getLogger(formatFilename(__filename));

export const Errors = {
  NotLoggedIn: 'Not logged in',
  NotAdmin: 'Must be admin',
  NeedChainId: 'Must provide chain id',
  NoChain: 'Chain not found',
  CannotDeleteChain: 'Cannot delete this protected chain',
  NotAcceptableAdmin: 'Not an Acceptable Admin',
  BadSecret: 'Must provide correct secret',
  AdminPresent:
    'There exists an admin in this community, cannot delete if there is an admin!',
};

// const protectedIdList = [];

type deleteChainReq = {
  id: string;
  airplaneSecret?: string;
  airplaneManualSecret?: string;
};

type deleteChainResp = { result: string };

const deleteChain = async (
  models: DB,
  req: TypedRequestBody<deleteChainReq>,
  res: TypedResponse<deleteChainResp>,
  next: NextFunction
) => {
  const { id, airplaneSecret, airplaneManualSecret } = req.body;

  if (
    !process.env.AIRPLANE_DELETE_COMMUNITY_SECRET ||
    airplaneSecret !== process.env.AIRPLANE_DELETE_COMMUNITY_SECRET
  ) {
    return next(new AppError(Errors.BadSecret));
  }

  // Check Manually typed in secret
  if (
    !process.env.AIRPLANE_DELETE_COMMUNITY_MANUAL_SECRET ||
    airplaneManualSecret !== process.env.AIRPLANE_DELETE_COMMUNITY_MANUAL_SECRET
  ) {
    return next(new AppError(Errors.BadSecret));
  }

  if (!id) {
    return next(new AppError(Errors.NeedChainId));
  }

  // if (protectedIdList.includes(id)) {
  //   return next(new AppError(Errors.CannotDeleteChain));
  // }

  const chain = await models.Chain.findOne({
    where: {
      id,
      has_chain_events_listener: false, // make sure no chain events
    },
  });
  if (!chain) {
    return next(new AppError(Errors.NoChain));
  }

  const admin = await findOneRole(models, {}, chain.id, ['admin']);
  if (admin) {
    return next(new AppError(Errors.AdminPresent));
  }

  // eslint-disable-next-line no-new
  new Promise(async (resolve, reject) => {
    await models.sequelize.transaction(async (t) => {
      // TODO: need a parallel API call to chain-events to destroy chain-entities there too
      await models.ChainEntityMeta.destroy({
        where: { chain : chain.id },
        transaction: t,
      });

      await models.User.update(
        {
          selected_chain_id: null,
        },
        {
          where: {
            selected_chain_id: chain.id,
          },
          transaction: t,
        }
      );

      await models.Reaction.destroy({
        where: { chain: chain.id },
        transaction: t,
      });

      await models.Comment.destroy({
        where: { chain : chain.id },
        transaction: t,
      });

      await models.Topic.destroy({
        where: { chain_id: chain.id },
        transaction: t,
      });

      await models.Role.destroy({
        where: { chain_id : chain.id },
        transaction: t,
      });

      await models.InviteCode.destroy({
        where: { chain_id : chain.id },
        transaction: t,
      });

      await models.Subscription.destroy({
        where: { chain_id : chain.id },
        transaction: t,
      });

      await models.Webhook.destroy({
        where: { chain_id : chain.id },
        transaction: t,
      });

      const threads = await models.Thread.findAll({
        where: { chain: chain.id },
      });

      await models.Collaboration.destroy({
        where: { thread_id: { [Op.in]: threads.map((thread) => thread.id) } },
        transaction: t,
      });

    await models.LinkedThread.destroy({
       where: {
         linked_thread: { [Op.in]: threads.map((thread) => thread.id) },
       },
      transaction: t,
    });

      await models.Vote.destroy({
        where: { chain_id : chain.id },
        transaction: t,
      });

      await models.Poll.destroy({
        where: { chain_id : chain.id },
        transaction: t,
      });

      await models.Thread.destroy({
        where: { chain: chain.id },
        transaction: t,
      });

      await models.StarredCommunity.destroy({
        where: { chain : chain.id },
        transaction: t,
      });

    const addresses = await models.Address.findAll({
           where: { chain: chain.id },
         });

      await models.OffchainProfile.destroy({
        where: { address_id: { [Op.in]: addresses.map((a) => a.id) } },
        transaction: t,
      });

      await models.ChainCategory.destroy({
        where: { chain_id : chain.id },
        transaction: t,
      });

      await models.CommunityBanner.destroy({
        where: { chain_id : chain.id },
        transaction: t,
      });

      // TODO: delete chain-event-types in chain-events
      await models.ChainEventType.destroy({
        where: { id : {[Op.like]: `%${chain.id}%`} },
        transaction: t,
      });

      // notifications + notifications_read (cascade)
      await models.Notification.destroy({
        where: { chain_id : chain.id },
        transaction: t,
      });

      await models.RoleAssignment.destroy({
        where: { address_id: { [Op.in]: addresses.map((a) => a.id) } },
        transaction: t,
      });

      await models.Address.destroy({
        where: { chain : chain.id },
        transaction: t,
      });

      const communityRoles = await models.CommunityRole.findAll({
        where: { chain_id: chain.id },
        transaction: t,
      });

      await models.RoleAssignment.destroy({
        where: {
          community_role_id: { [Op.in]: communityRoles.map((r) => r.id) },
        },
        transaction: t,
      });

      await Promise.all(
        communityRoles.map((r) => r.destroy({ transaction: t }))
      );

      await models.Chain.destroy({
        where: { id: chain.id },
        transaction: t,
      });
    });
  });

  return success(res, { result: 'success' });
};

export default deleteChain;
