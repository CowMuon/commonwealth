import { ApiPromise } from '@polkadot/api';
import { Call, AccountId } from '@polkadot/types/interfaces';
import { Vec } from '@polkadot/types';
import { ISubstrateCollectiveProposal } from 'adapters/chain/substrate/types';
import { SubstrateTypes } from 'chain-events/src';
import { ProposalModule } from 'models';
import { IApp } from 'state';
import SubstrateChain from './shared';
import SubstrateAccounts, { SubstrateAccount } from './account';
import { SubstrateCollectiveProposal } from './collective_proposal';
import { chainToEventNetwork } from '../../server/chain_entities';

class SubstrateCollective extends ProposalModule<
  ApiPromise,
  ISubstrateCollectiveProposal,
  SubstrateCollectiveProposal
> {
  private _members: SubstrateAccount[];
  public get members() { return this._members; }
  public isMember(account: SubstrateAccount): boolean {
    return this._members.find((m) => m.address === account.address) !== undefined;
  }

  constructor(app: IApp, public readonly moduleName: 'council' | 'technicalCommittee') {
    super(app, (e) => new SubstrateCollectiveProposal(this._Chain, this._Accounts, this, e));
  }

  private _Chain: SubstrateChain;
  private _Accounts: SubstrateAccounts;

  // TODO: we may want to track membership here as well as in elections
  public async init(ChainInfo: SubstrateChain, Accounts: SubstrateAccounts): Promise<void> {
    this._disabled = !ChainInfo.api.query[this.moduleName];
    if (this._initializing || this._initialized || this.disabled) return;
    this._initializing = true;
    this._Chain = ChainInfo;
    this._Accounts = Accounts;

    // load server proposals
    const entities = this.app.chainEntities.store.getByType(SubstrateTypes.EntityKind.CollectiveProposal);
    entities.forEach((e) => {
      const event = e.chainEvents[0];
      if (event && (event.data as any).collectiveName === this.moduleName) {
        return this._entityConstructor(e);
      }
    });

    // register new chain-event handlers
    this.app.chainEntities.registerEntityHandler(
      SubstrateTypes.EntityKind.CollectiveProposal, (entity, event) => {
        if ((event.data as any).collectiveName === this.moduleName) {
          this.updateProposal(entity, event);
        }
      }
    );

    const members = await ChainInfo.api.query[this.moduleName].members() as Vec<AccountId>;
    this._members = members.toArray().map((v) => this._Accounts.fromAddress(v.toString()));

    this._initialized = true;
    this._initializing = false;
  }

  public createEmergencyCancellation(author: SubstrateAccount, threshold: number, referendumId: number) {
    const func = this._Chain.getTxMethod('democracy', 'emergencyCancel', [ referendumId ]);
    return this.createTx(author, threshold, func, func.encodedLength);
  }
  public vetoNextExternal(author: SubstrateAccount, hash: string) {
    const func = this._Chain.getTxMethod('democracy', 'vetoExternal', [ hash ]);
    return this.createTx(author, 1, func, func.encodedLength);
  }
  public createTreasuryApprovalMotion(author: SubstrateAccount, threshold: number, treasuryIdx: number) {
    const func = this._Chain.getTxMethod('treasury', 'approveProposal', [ treasuryIdx ]);
    return this.createTx(author, threshold, func, func.encodedLength);
  }
  public createTreasuryRejectionMotion(author: SubstrateAccount, threshold: number, treasuryIdx: number) {
    const func = this._Chain.getTxMethod('treasury', 'rejectProposal', [ treasuryIdx ]);
    return this.createTx(author, threshold, func, func.encodedLength);
  }
  public createExternalProposal(author: SubstrateAccount, threshold: number, action: Call, length: number) {
    const func = this._Chain.getTxMethod('democracy', 'externalPropose', [ action.hash ]);
    return this.createTx(author, threshold, func, length);
  }
  public createExternalProposalMajority(author: SubstrateAccount, threshold: number, action: Call, length) {
    const func = this._Chain.getTxMethod('democracy', 'externalProposeMajority', [ action.hash ]);
    return this.createTx(author, threshold, func, length);
  }
  public createExternalProposalDefault(author: SubstrateAccount, threshold: number, action: Call, length) {
    // only on kusama
    const func = this._Chain.getTxMethod('democracy', 'externalProposeDefault', [ action.hash ]);
    return this.createTx(author, threshold, func, length);
  }
  public createFastTrack(
    author: SubstrateAccount,
    threshold: number,
    hash: string,
    votingPeriod: number,
    delay: number
  ) {
    // only on kusama
    // TODO: we must check if Instant is allowed and if
    // votingPeriod is valid wrt FastTrackVotingPeriod
    const func = (this._Chain.getTxMethod('democracy', 'fastTrack', [ hash, votingPeriod, delay ]));
    return this.createTx(
      author,
      threshold,
      func,
      func.encodedLength,
    );
  }

  public createTx(
    author: SubstrateAccount,
    threshold: number,
    action: Call,
    length?: number,
    fromTechnicalCommittee?: boolean,
  ) {
    // TODO: check council status
    const title = this._Chain.methodToTitle(action);

    // handle differing versions of substrate API
    const txFunc = fromTechnicalCommittee
      ? ((api: ApiPromise) => api.tx.technicalCommittee.propose.meta.args.length === 3
        ? api.tx.technicalCommittee.propose(threshold, action, length)
        : (api.tx.technicalCommittee.propose as any)(threshold, action))
      : ((api: ApiPromise) => api.tx.council.propose.meta.args.length === 3
        ? api.tx.council.propose(threshold, action, length)
        : (api.tx.council.propose as any)(threshold, action, null));
    return this._Chain.createTXModalData(
      author,
      txFunc,
      'createCouncilMotion',
      title
    );
  }
}

export class SubstrateCouncil extends SubstrateCollective {
  constructor(app: IApp) {
    super(app, 'council');
  }
  public init(ChainInfo: SubstrateChain, Accounts: SubstrateAccounts): Promise<void> {
    return super.init(ChainInfo, Accounts);
  }
}

export class SubstrateTechnicalCommittee extends SubstrateCollective {
  constructor(app: IApp) {
    super(app, 'technicalCommittee');
  }
  public init(ChainInfo: SubstrateChain, Accounts: SubstrateAccounts): Promise<void> {
    return super.init(ChainInfo, Accounts);
  }
}

export default SubstrateCollective;
