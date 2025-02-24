import passport from 'passport';
import { Magic, MagicUserMetadata } from '@magic-sdk/admin';
import { Strategy as MagicStrategy } from 'passport-magic';
import { factory, formatFilename } from 'common-common/src/logging';
import { NotificationCategories, WalletId } from 'common-common/src/types';

import '../types';
import { DB } from '../models';
import { sequelize } from '../database';
import { MAGIC_API_KEY, MAGIC_SUPPORTED_BASES } from '../config';
import validateChain from '../middleware/validateChain';
import { ProfileAttributes } from '../models/profile';

import { AppError, ServerError } from 'common-common/src/errors';
import { createRole } from '../util/roles';
const log = factory.getLogger(formatFilename(__filename));

export function useMagicAuth(models: DB) {
  // allow magic login if configured with key
  if (MAGIC_API_KEY) {
    // TODO: verify we are in a community that supports magic login
    const magic = new Magic(MAGIC_API_KEY);
    passport.use(new MagicStrategy({ passReqToCallback: true }, async (req, user, cb) => {
      // determine login location
      let chain, error;
      if (req.body.chain || req.body.community) {
        [ chain, error ] = await validateChain(models, req.body);
        if (error) return cb(error);
      }
      const registrationChain = chain;

      // fetch user data from magic backend
      let userMetadata: MagicUserMetadata;
      try {
        userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
      } catch (e) {
        return cb(new ServerError(`Magic fetch failed: ${e.message} - ${JSON.stringify(e.data)}`));
      }

      // check if this is a new signup or a login
      const existingUser = await models.User.scope('withPrivateData').findOne({
        where: {
          email: userMetadata.email,
        },
        include: [{
          model: models.Address,
          where: { wallet_id: WalletId.Magic },
          required: false,
        }, {
          model: models.Profile
        }]
      });

      // if not on root URL and we don't support the chain base for magic don't allow users to sign up
      if (!existingUser && registrationChain?.base && !MAGIC_SUPPORTED_BASES.includes(registrationChain.base)) {
        // unsupported chain -- client should send through old email flow
        return cb(new AppError('Unsupported magic chain.'));
      }

      // if on root URL, no chain base, we allow users to sign up and generate an Ethereum Address
      if (!existingUser) {
        const chainId = registrationChain.id || 'ethereum';
        const ethAddress = userMetadata.publicAddress;
        const result = await sequelize.transaction(async (t) => {
          // create new user and unverified address if doesn't exist
          const newUser = await models.User.createWithProfile(models, {
            email: userMetadata.email,
            emailVerified: true,
          }, { transaction: t });

          // create an address on their selected chain
          const newAddress = await models.Address.create({
              address: ethAddress,
              chain: chainId,
              verification_token: 'MAGIC',
              verification_token_expires: null,
              verified: new Date(), // trust addresses from magic
              last_active: new Date(),
              user_id: newUser.id,
              profile_id: (newUser.Profiles[0] as ProfileAttributes).id,
              wallet_id: WalletId.Magic,
            }, { transaction: t });

          await createRole(
            models,
            newAddress.id,
            chainId,
            'member',
            false,
            t
          );

          // Automatically create subscription to their own mentions
          await models.Subscription.create({
            subscriber_id: newUser.id,
            category_id: NotificationCategories.NewMention,
            object_id: `user-${newUser.id}`,
            is_active: true,
          }, { transaction: t });

          // Automatically create a subscription to collaborations
          await models.Subscription.create({
            subscriber_id: newUser.id,
            category_id: NotificationCategories.NewCollaboration,
            object_id: `user-${newUser.id}`,
            is_active: true,
          }, { transaction: t });

          // Automatically create subscription to chat mentions
          await models.Subscription.create({
            subscriber_id: newUser.id,
            category_id: NotificationCategories.NewChatMention,
            object_id: `user-${newUser.id}`,
            is_active: true,
          }, { transaction: t });

          // create token with provided user/address
          await models.SsoToken.create({
            issuer: userMetadata.issuer,
            issued_at: user.claim.iat,
            address_id: newAddress.id, // always ethereum address
            created_at: new Date(),
            updated_at: new Date(),
          }, { transaction: t });

          return newUser;
        });

        // re-fetch user to include address object
        const newUser = await models.User.findOne({
          where: {
            id: result.id,
          },
          include: [ models.Address ],
        });
        return cb(null, newUser);
      } else if (existingUser.Addresses?.length > 0) {
        // each user should only ever have one token issued by Magic
        const ssoToken = await models.SsoToken.findOne({
          where: {
            issuer: user.issuer
          },
          include: [{
            model: models.Address,
            where: { address: user.publicAddress },
            required: true,
          }]
        });
        // login user if they registered via magic
        if (user.claim.iat <= ssoToken.issued_at) {
          console.log('Replay attack detected.');
          return cb(null, null, {
            message: `Replay attack detected for user ${user.publicAddress}}.`,
          });
        }
        ssoToken.issued_at = user.claim.iat;
        ssoToken.updated_at = new Date();
        await ssoToken.save();
        console.log(`Found existing user: ${JSON.stringify(existingUser)}`);
        return cb(null, existingUser);
      } else {
        // migrate to magic if email already exists
        await sequelize.transaction(async (t) => {
          const ethAddress = userMetadata.publicAddress;
          const newAddress = await models.Address.create({
            address: ethAddress,
            chain: 'ethereum',
            verification_token: 'MAGIC',
            verification_token_expires: null,
            verified: new Date(), // trust addresses from magic
            last_active: new Date(),
            user_id: existingUser.id,
            profile_id: (existingUser.Profiles[0] as ProfileAttributes).id,
            wallet_id: WalletId.Magic
          }, { transaction: t });

          await models.SsoToken.create({
            issuer: userMetadata.issuer,
            issued_at: user.claim.iat,
            address_id: newAddress.id, // always ethereum address
            created_at: new Date(),
            updated_at: new Date(),
          }, { transaction: t });
        });
        console.log(`Migrated old email user to magic: ${existingUser.email}`);
        return cb(null, existingUser);
      }
    }));
  }
}