import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { ModelStatic, ModelInstance } from './types';
import { ChainAttributes } from './chain';
import { ThreadAttributes } from './thread';
import { RuleAttributes } from './rule';

export type TopicAttributes = {
  name: string;
  featured_in_sidebar: boolean;
  featured_in_new_post: boolean;
  order?: number;
  id?: number;
  chain_id: string;
  description?: string;
  telegram?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  token_threshold: string;
  default_offchain_template?: string;
  rule_id?: number;

  // associations
  chain?: ChainAttributes;
  threads?: ThreadAttributes[] | TopicAttributes['id'][];
  Rule?: RuleAttributes;
}

export type TopicInstance = ModelInstance<TopicAttributes> & {
  // no mixins used
  // TODO: do we need to implement the "as" stuff here?
  getRule: Sequelize.BelongsToGetAssociationMixin<RuleAttributes>;
}

export type TopicModelStatic = ModelStatic<TopicInstance>;

export default (
  sequelize: Sequelize.Sequelize,
  dataTypes: typeof DataTypes,
): TopicModelStatic => {
  const Topic = <TopicModelStatic>sequelize.define('Topic', {
    id: { type: dataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: dataTypes.STRING, allowNull: false },
    description: { type: dataTypes.TEXT, allowNull: false, defaultValue: '' },
    telegram: { type: dataTypes.STRING, allowNull: true },
    chain_id: { type: dataTypes.STRING, allowNull: false },
    created_at: { type: dataTypes.DATE, allowNull: false },
    updated_at: { type: dataTypes.DATE, allowNull: false },
    deleted_at: { type: dataTypes.DATE, allowNull: true },
    token_threshold: { type: dataTypes.STRING, allowNull: true },
    featured_in_sidebar: { type: dataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    featured_in_new_post: { type: dataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    order: { type: dataTypes.INTEGER, allowNull: true },
    default_offchain_template: { type: dataTypes.TEXT, allowNull: false, defaultValue: '' },
    rule_id: { type: dataTypes.INTEGER, allowNull: true },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'Topics',
    underscored: true,
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: [ 'created_at', 'updated_at', 'deleted_at' ],
      }
    },
  });

  Topic.associate = (models) => {
    models.Topic.belongsTo(models.Chain, {
      as: 'chain',
      foreignKey: 'chain_id',
      targetKey: 'id',
    });
    models.Topic.hasMany(models.Thread, {
      as: 'threads',
      foreignKey: 'topic_id',
    });
    models.Topic.belongsTo(models.Rule, {
      foreignKey: 'rule_id',
    })
  };

  return Topic;
};
