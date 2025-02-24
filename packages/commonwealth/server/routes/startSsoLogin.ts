import { v4 as uuidv4 } from 'uuid';

import { TypedRequestBody, TypedResponse, success } from '../types';
import { AppError, ServerError } from 'common-common/src/errors';
import { Issuers } from './finishSsoLogin';
import { DB } from '../models';
import { AXIE_SHARED_SECRET } from '../config';

const Errors = {
  InvalidIssuer: 'Invalid issuer',
  NoSharedSecret: 'No shared secret',
};

type StartSsoLoginReq = { issuer: Issuers };
type StartSsoLoginRes = { stateId: string };

const startSsoLogin = async (
  models: DB,
  req: TypedRequestBody<StartSsoLoginReq>,
  res: TypedResponse<StartSsoLoginRes>
) => {
  if (req.body.issuer === Issuers.AxieInfinity) {
    if (!AXIE_SHARED_SECRET) {
      throw new ServerError(Errors.NoSharedSecret);
    }
    const stateId: string = uuidv4();
    await models.SsoToken.create({
      state_id: stateId,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return success(res, { stateId });
  } else {
    throw new AppError(Errors.InvalidIssuer);
  }
};

export default startSsoLogin;
