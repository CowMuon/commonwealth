import { Request, Response, NextFunction } from 'express';
import { WalletId } from 'common-common/src/types';
import { factory, formatFilename } from 'common-common/src/logging';
import { DB } from '../models';
import { AppError, ServerError } from 'common-common/src/errors';

export const Errors = {
  NotLoggedIn: 'Not logged in',
  NeedAddress: 'Must provide address',
  NeedChain: 'Must provide chain',
  AddressNotFound: 'Address not found',
  CannotDeleteMagic: 'Cannot delete Magic Link address',
};

const deleteAddress = async (models: DB, req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError(Errors.NotLoggedIn));
  }
  if (!req.body.address) {
    return next(new AppError(Errors.NeedAddress));
  }
  if (!req.body.chain) {
    return next(new AppError(Errors.NeedChain));
  }

  const addressObj = await models.Address.findOne({
    where: { chain: req.body.chain, address: req.body.address }
  });
  if (!addressObj || addressObj.user_id !== req.user.id) {
    return next(new AppError(Errors.AddressNotFound));
  }
  if (addressObj.wallet_id === WalletId.Magic) {
    return next(new AppError(Errors.CannotDeleteMagic));
  }

  try {
    addressObj.user_id = null;
    addressObj.verified = null;
    const result = await addressObj.save();
    return res.json({ status: 'Success', response: 'Deleted address' });
  } catch (err) {
    return next(new ServerError(err));
  }
};

export default deleteAddress;
