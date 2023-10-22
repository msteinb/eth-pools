import '@ethersproject/shims';
import {AlchemyProvider, ethers} from 'ethers';
import lidoStakingRouterABI from './abi/lidoStakingRouterABI.json';
import {
  PoolInfoProviderErrorCode,
  PoolInfoProvider,
  PoolInfoProviderError,
  fetchERC20Token,
} from './poolInfoProvider';
import {ALCHEMY_API_KEY, MAINNET_CHAIN_ID} from './consts';
import {appConfig} from '../config';

// Lido organizes node operators and validators into Staking Modules
// that are regitered with a StakingRouter contract. The 'curated' staking module manages the
// set of Lido, DAO-vetted operators.
const LIDO_STAKING_ROUTER_ADDR = '0xFdDf38947aFB03C621C71b06C9C70bce73f12999';
const CURATED_STAKING_MODULE_ID = 1;

export const lidoProvider: PoolInfoProvider = {
  fetchStakingToken: async () => {
    return fetchERC20Token(
      appConfig.pools.lido.stakingToken,
      MAINNET_CHAIN_ID,
      ALCHEMY_API_KEY,
    );
  },

  fetchValidatorCount: async () => {
    const provider = new AlchemyProvider(MAINNET_CHAIN_ID, ALCHEMY_API_KEY);
    const contract = new ethers.Contract(
      LIDO_STAKING_ROUTER_ADDR,
      lidoStakingRouterABI,
      provider,
    );

    try {
      const count = await contract.getStakingModuleActiveValidatorsCount(
        CURATED_STAKING_MODULE_ID,
      );
      return Number(count);
    } catch (err) {
      throw new PoolInfoProviderError(
        PoolInfoProviderErrorCode.Generic,
        `error fetching lido validator count, ${err}`,
      );
    }
  },
};
