import { Request, Response, NextFunction } from 'express';
import { factory, formatFilename } from 'common-common/src/logging';
import { DB } from '../models';
import { AppError, ServerError } from 'common-common/src/errors';
import { findAllRoles } from '../util/roles';

const log = factory.getLogger(formatFilename(__filename));
const bulkMembers = async (
  models: DB,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const chain = req.chain;
  const members = await findAllRoles(
    models,
    {
      include: [
        {
          model: models.Address,
          required: true,
        },
      ],
      order: [['created_at', 'DESC']],
    },
    chain.id
  );

  return res.json({
    status: 'Success',
    result: members.map((p) => p.toJSON()),
  });
};

export default bulkMembers;
