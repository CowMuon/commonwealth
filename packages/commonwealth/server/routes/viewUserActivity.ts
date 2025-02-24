import { Request, Response, NextFunction } from 'express';
import { DB } from '../models';
import { AppError, ServerError } from 'common-common/src/errors';

export const Errors = {
  NotLoggedIn: 'Must be logged in to view user dashboard',
};

export default async (
  models: DB,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError(Errors.NotLoggedIn));
  }
  const { id } = req.user;

  const query = `
    SELECT nt.thread_id, nts.created_at as last_activity, nts.notification_data, nts.category_id,
      MAX(ovc.view_count) as view_count,
      COUNT(DISTINCT oc.id) AS comment_count,
      COUNT(DISTINCT tr.id) + COUNT(DISTINCT cr.id) AS reaction_count
    FROM
      (SELECT nnn.mx_not_id, nnn.thread_id,
          ROW_NUMBER() OVER (ORDER BY mx_not_id DESC) as thread_rank
        FROM
        (SELECT DISTINCT nn.thread_id, nn.mx_not_id
          FROM (SELECT (n.notification_data::jsonb->>'root_id') AS thread_id,
                  MAX(n.id) OVER (PARTITION BY (n.notification_data::jsonb->>'root_id')) AS mx_not_id
                FROM "Notifications" n
                WHERE n.category_id IN('new-thread-creation','new-comment-creation')
                  AND n.chain_id IN(SELECT a."chain" FROM "Addresses" a WHERE a.user_id = ?)
                ORDER BY id DESC
                FETCH FIRST 500 ROWS ONLY
                ) nn
          ) nnn
      ) nt
    INNER JOIN "Notifications" nts ON nt.mx_not_id = nts.id
    LEFT JOIN "ViewCounts" ovc ON nt.thread_id = CAST(ovc.object_id AS VARCHAR)
    LEFT JOIN "Comments" oc ON 'discussion_'||CAST(nt.thread_id AS VARCHAR) = oc.root_id
      --TODO: eval execution path with alternate aggregations
    LEFT JOIN "Reactions" tr ON nt.thread_id = CAST(tr.thread_id AS VARCHAR)
    LEFT JOIN "Reactions" cr ON oc.id = cr.comment_id
    LEFT JOIN "Threads" thr ON thr.id = CAST(nt.thread_id AS int)
    WHERE nt.thread_rank <= 50
    GROUP BY nt.thread_id, nts.created_at, nts.notification_data, nts.category_id
    ORDER BY nts.created_at DESC;
  `;

  const notifications = await models.sequelize.query(query, {
    type: 'SELECT',
    raw: true,
    replacements: [id],
  });

  return res.json({ status: 'Success', result: notifications });
};
