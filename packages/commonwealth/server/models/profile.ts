import * as Sequelize from 'sequelize';
import { Model, DataTypes } from 'sequelize';

import { UserAttributes, UserInstance } from './user';
import { ModelStatic, ModelInstance } from './types';
import { AddressAttributes, AddressInstance } from './address';

export type ProfileAttributes = {
  id?: number;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
  profile_name?: string;
  email?: string;
  website?: string;
  bio?: string;
  is_default?: boolean;
  avatar_url?: string;
  slug?: string;

  // associations
  User?: UserAttributes;
  Addresses?: AddressAttributes[];
};

export type ProfileInstance = ModelInstance<ProfileAttributes> & {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  getAddresses: Sequelize.HasManyGetAssociationsMixin<AddressInstance>;
};

export type ProfileModelStatic = ModelStatic<ProfileInstance>;

export default (
  sequelize: Sequelize.Sequelize,
  dataTypes: typeof DataTypes
): ProfileModelStatic => {
  const Profile = <ProfileModelStatic>sequelize.define(
    'Profile',
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      user_id: { type: dataTypes.INTEGER, allowNull: false },
      created_at: { type: dataTypes.DATE, allowNull: true },
      updated_at: { type: dataTypes.DATE, allowNull: true },
      profile_name: { type: dataTypes.STRING, allowNull: true },
      email: { type: dataTypes.STRING, allowNull: true },
      website: { type: dataTypes.STRING, allowNull: true },
      bio: { type: dataTypes.TEXT, allowNull: true },
      is_default: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      avatar_url: { type: dataTypes.STRING, allowNull: true },
      slug: { type: dataTypes.STRING, allowNull: true },
    },
    {
      tableName: 'Profiles',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{ fields: ['user_id'] }],
    }
  );

  Profile.associate = (models) => {
    models.Profile.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
    });
    models.Profile.hasMany(models.Address, { foreignKey: 'profile_id' });
  };

  return Profile;
};
