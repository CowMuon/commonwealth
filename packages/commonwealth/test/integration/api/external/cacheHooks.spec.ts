import { BalanceProvider, IChainNode, TokenBalanceCache } from 'token-balance-cache/src';
import { BalanceType } from 'common-common/src/types';
import BN from 'bn.js';

class MockTokenBalanceProvider extends BalanceProvider<{ tokenAddress: string, contractType: string }> {
  public name = 'eth-token';
  public opts = {
    tokenAddress: 'string',
    contractType: 'string',
  };
  public validBases = [BalanceType.Ethereum];
  public balanceFn: (tokenAddress: string, userAddress: string) => Promise<BN>;

  public async getBalance(
    node: IChainNode,
    address: string,
    opts: { tokenAddress: string, contractType: string }
  ): Promise<string> {
    if (this.balanceFn) {
      const bal = await this.balanceFn(opts.tokenAddress, address);
      return bal.toString();
    } else {
      throw new Error('unable to fetch token balance');
    }
  }
}

export let tokenBalanceCache: TokenBalanceCache;
export let tokenProvider: MockTokenBalanceProvider;
before(async () => {
  const node: IChainNode[] = [{
    balance_type: BalanceType.Ethereum,
    id: -1,
    name: 'testNode',
    url: '',
    description: '',
    bech32: ''
  }];

  tokenProvider = new MockTokenBalanceProvider();
  tokenBalanceCache = new TokenBalanceCache(
    0,
    0,
    [tokenProvider],
    (_: number) => new Promise((res, _) => res(node))
  );
  await tokenBalanceCache.start();
});