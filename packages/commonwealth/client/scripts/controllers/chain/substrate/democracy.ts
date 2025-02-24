import { ApiPromise } from '@polkadot/api';
import { BlockNumber } from '@polkadot/types/interfaces';
import { ISubstrateDemocracyReferendum, SubstrateCoin } from 'adapters/chain/substrate/types';
import { ITXModalData, ProposalModule } from 'models';
import { SubstrateTypes } from 'chain-events/src';
import { IApp } from 'state';
import SubstrateChain from './shared';
import SubstrateAccounts, { SubstrateAccount } from './account';
import { SubstrateDemocracyReferendum } from './democracy_referendum';
import { chainToEventNetwork } from '../../server/chain_entities';

class SubstrateDemocracy extends ProposalModule<
  ApiPromise,
  ISubstrateDemocracyReferendum,
  SubstrateDemocracyReferendum
> {
  private _enactmentPeriod: number = null;
  private _cooloffPeriod: number = null;
  private _votingPeriod: number = null;
  private _emergencyVotingPeriod: number = null;
  private _preimageByteDeposit: SubstrateCoin = null;
  get enactmentPeriod() { return this._enactmentPeriod; }
  get cooloffPeriod() { return this._cooloffPeriod; }
  get votingPeriod() { return this._votingPeriod; }
  get emergencyVotingPeriod() { return this._emergencyVotingPeriod; }
  get preimageByteDeposit() { return this._preimageByteDeposit; }

  private _Chain: SubstrateChain;
  private _Accounts: SubstrateAccounts;

  public getByHash(hash: string) {
    return this.store.getAll().find((referendum) => referendum.hash === hash);
  }

  constructor(app: IApp) {
    super(app, (e) => new SubstrateDemocracyReferendum(this._Chain, this._Accounts, this, e));
  }

  // Loads all proposals and referendums currently present in the democracy module
  public async init(ChainInfo: SubstrateChain, Accounts: SubstrateAccounts): Promise<void> {
    this._disabled = !ChainInfo.api.query.democracy;
    if (this._initializing || this._initialized || this.disabled) return;
    this._initializing = true;
    this._Chain = ChainInfo;
    this._Accounts = Accounts;

    // load server referenda
    const entities = this.app.chainEntities.store.getByType(SubstrateTypes.EntityKind.DemocracyReferendum);
    entities.forEach((e) => this._entityConstructor(e));

    // save parameters
    this._enactmentPeriod = +(ChainInfo.api.consts.democracy.enactmentPeriod as BlockNumber);
    this._cooloffPeriod = +(ChainInfo.api.consts.democracy.cooloffPeriod as BlockNumber);
    this._votingPeriod = +(ChainInfo.api.consts.democracy.votingPeriod as BlockNumber);
    this._emergencyVotingPeriod = +(ChainInfo.api.consts.democracy.emergencyVotingPeriod as BlockNumber);
    this._preimageByteDeposit = this._Chain.coins(ChainInfo.api.consts.democracy.preimageByteDeposit);

    // register chain-event handlers
    this.app.chainEntities.registerEntityHandler(
      SubstrateTypes.EntityKind.DemocracyReferendum, (entity, event) => {
        this.updateProposal(entity, event);
      }
    );
    this.app.chainEntities.registerEntityHandler(
      SubstrateTypes.EntityKind.DemocracyPreimage, (entity, event) => {
        if (event.data.kind === SubstrateTypes.EventKind.PreimageNoted) {
          const referendum = this.getByHash(entity.typeId);
          if (referendum) referendum.update(event);
        }
      }
    );

    this._initialized = true;
    this._initializing = false;
  }

  public reapPreimage(author: SubstrateAccount, hash: string) {
    // TODO: verify that hash corresponds to an actual preimage & is in a reap-able state
    return this._Chain.createTXModalData(
      author,
      (api: ApiPromise) => (api.tx.democracy.reapPreimage as any)(hash),
      'reapPreimage',
      `Preimage hash: ${hash}`,
    );
  }

  /*
  * Proxying and Delegation currently unsupported...
  * If we decide to support them, we'll update the controllers.

  public async setProxyTx(who: SubstrateAccount, proxy: SubstrateAccount) {
    const proxyFor = await proxy.proxyFor.pipe(first()).toPromise();
    if (proxyFor) {
      throw new Error('already a proxy');
    }
    return this._Chain.createTXModalData(
      who,
      (api: ApiPromise) => api.tx.democracy.setProxy(proxy.address),
      'setProxy',
      `${who.address} sets proxy to ${proxy.address}`
    );
  }

  public async resignProxyTx(who: SubstrateAccount) {
    const proxyFor = await who.proxyFor.pipe(first()).toPromise();
    if (proxyFor) {
      throw new Error('not a proxy');
    }
    return this._Chain.createTXModalData(
      who,
      (api: ApiPromise) => api.tx.democracy.resignProxy(),
      'resignProxy',
      `${who.address} resigns as proxy`
    );
  }

  public async removeProxyTx(who: SubstrateAccount, proxy: SubstrateAccount) {
    const proxyFor = await proxy.proxyFor.pipe(first()).toPromise();
    if (!proxyFor) {
      throw new Error('not a proxy');
    }
    return this._Chain.createTXModalData(
      who,
      (api: ApiPromise) => api.tx.democracy.removeProxy(proxy.address),
      'removeProxy',
      `${who.address} removes proxy ${proxy.address}`
    );
  }

  public delegateTx(who: SubstrateAccount, toAccount: SubstrateAccount, conviction: Conviction) {
    return this._Chain.createTXModalData(
      who,
      (api: ApiPromise) => api.tx.democracy.delegate(toAccount.address, conviction),
      'delegate',
      `${who.address} delegates to ${toAccount.address}`
    );
  }

  public undelegateTx(who: SubstrateAccount) {
    if (!who.delegation) {
      throw new Error('Account not delegated');
    }
    return this._Chain.createTXModalData(
      who,
      (api: ApiPromise) => api.tx.democracy.undelegate(),
      'undelegate',
      `undelegating ${who.address}`
    );
  }
  */

  public createTx(...args): ITXModalData {
    throw new Error('cannot directly create democracy referendum');
  }
}

export default SubstrateDemocracy;
