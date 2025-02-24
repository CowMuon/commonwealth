import { AppError } from 'common-common/src/errors';
import { success, TypedRequestQuery, TypedResponse } from '../types';
import { DB } from '../models';
import validateRoles from '../util/validateRoles';
import { BanAttributes } from '../models/ban';

enum GetBannedAddressesErrors {
  NoChain = 'Must supply a chain ID',
  NoPermission = 'You do not have permission to ban an address',
}

type GetBannedAddressesReq = {
  chain_id: string;
};

type GetBannedAddressesResp = BanAttributes[];

const getBannedAddresses = async (
  models: DB,
  req: TypedRequestQuery<GetBannedAddressesReq>,
  res: TypedResponse<GetBannedAddressesResp>
) => {
  const chain = req.chain;
  const isAdmin = await validateRoles(models, req.user, 'admin', chain.id);
  if (!isAdmin) throw new AppError(GetBannedAddressesErrors.NoPermission);

  const bans = await models.Ban.findAll({ where: { chain_id: chain.id } });
  return success(
    res,
    bans.map((b) => b.toJSON())
  );
};

export default getBannedAddresses;
