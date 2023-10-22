import '@ethersproject/shims';
import {AlchemyProvider, ethers} from 'ethers';
import rocketMinipoolManagerABI from './abi/rocketMinipoolManagerABI.json';
import {
  PoolInfoProviderErrorCode,
  PoolInfoProvider,
  PoolInfoProviderError,
  StakingToken,
  fetchERC20Token,
} from './poolInfoProvider';
import {ALCHEMY_API_KEY, MAINNET_CHAIN_ID} from './consts';
import {appConfig} from '../config';

// A minipool is how RocketPool refers to a validator whose staked Eth comprises deposits from
// stakers and node operators
const ROCKETPOOL_MINIPOOL_MANAGER_ADDR =
  '0x6d010c43d4e96d74c422f2e27370af48711b49bf';

export const rocketPoolProvider: PoolInfoProvider = {
  fetchStakingToken: async (): Promise<StakingToken> => {
    return fetchERC20Token(
      appConfig.pools.rocketpool.stakingToken,
      MAINNET_CHAIN_ID,
      ALCHEMY_API_KEY,
    );
  },

  fetchValidatorCount: async () => {
    const provider = new AlchemyProvider(MAINNET_CHAIN_ID, ALCHEMY_API_KEY);
    const contract = new ethers.Contract(
      ROCKETPOOL_MINIPOOL_MANAGER_ADDR,
      rocketMinipoolManagerABI,
      provider,
    );

    try {
      const count = await contract.getMinipoolCount();
      return Number(count);
    } catch (err) {
      throw new PoolInfoProviderError(
        PoolInfoProviderErrorCode.Generic,
        `error fetching minipool count, ${err}`,
      );
    }
  },
};
