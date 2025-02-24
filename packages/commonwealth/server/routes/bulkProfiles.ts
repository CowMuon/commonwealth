import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { factory, formatFilename } from 'common-common/src/logging';
import { DB } from '../models';
import { AppError, ServerError } from 'common-common/src/errors';

const log = factory.getLogger(formatFilename(__filename));
const bulkProfiles = async (models: DB, req: Request, res: Response, next: NextFunction) => {
  let chains;
  let addrs;
  if (req.body['chains[]'] && typeof req.body['chains[]'] === 'string') {
    chains = [ req.body['chains[]'] ];
  } else if (req.body['chains[]']) {
    chains = req.body['chains[]'];
  } else {
    return next(new AppError('Must specify chain'));
  }

  if (req.body['addresses[]'] && typeof req.body['addresses[]'] === 'string') {
    addrs = [ req.body['addresses[]'] ];
  } else if (req.body['addresses[]']) {
    addrs = req.body['addresses[]'];
  } else {
    return next(new AppError('Must specify addresses'));
  }

  if (chains.length !== addrs.length) {
    return next(new AppError('Must specify exactly one address for each one chain'));
  }

  let addrObjs;
  // if all profiles are on the same chain, make a fast query, otherwise, make multiple queries
  if (_.uniq(chains).length === 1) {
    addrObjs = await models.Address.findAll({
      where: {
        chain: chains[0],
        address: addrs,
      }
    });
  } else {
    let query;
    addrObjs = [];
    for (const chain in chains) {
      if (chains[chain]) {
        query = await models.Address.findAll({
          where: {
            chain: chains[chain],
            address: addrs,
          }
        });
        addrObjs.push(query);
      }
    }
    addrObjs = addrObjs.flat();
  }

  const profiles = await models.OffchainProfile.findAll({
    where: { address_id: addrObjs.map((obj) => obj.id) },
    include: [ models.Address ]
  });

  return res.json({
    status: 'Success',
    result: profiles.map((profile) => profile.toJSON())
  });
};

export default bulkProfiles;
