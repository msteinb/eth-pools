import {AlchemyProvider, ethers, isError} from 'ethers';
import erc20ABI from './abi/erc20ABI.json';

export interface StakingToken {
  name: string;
  symbol: string;
  totalSupply: BigInt;
  decimals: number;
}

/**
 * Represents a type that provides information about an etheresum staking pool
 */
export interface PoolInfoProvider {
  fetchStakingToken(): Promise<StakingToken>;
  fetchValidatorCount(): Promise<number>;
}

export enum PoolInfoProviderErrorCode {
  Network,
  Throttle,
  Blockchain,
  Generic,
}
export class PoolInfoProviderError extends Error {
  code: PoolInfoProviderErrorCode;

  constructor(code: PoolInfoProviderErrorCode, msg?: string) {
    super(msg);
    this.code = code;
  }
}

// Helper function to fetch ERC20 token info
export const fetchERC20Token = async (
  address: string,
  chainId: string,
  apiKey: string,
) => {
  const provider = new AlchemyProvider(chainId, apiKey);
  const contract = new ethers.Contract(address, erc20ABI, provider);

  try {
    const [name, symbol, totalSupply, decimals] = await Promise.all([
      await contract.name(),
      await contract.symbol(),
      await contract.totalSupply(),
      await contract.decimals(),
    ]);

    return {
      name,
      symbol,
      totalSupply: totalSupply,
      decimals: Number(decimals),
    };
  } catch (err) {
    // log error somewhere, maybe to a third party service

    let error: PoolInfoProviderError;

    if (isError(err, 'SERVER_ERROR')) {
      const status = err.response?.statusCode;

      // The ethers library handles 429 responses internally by retrying the request with an exponential backoff.
      // The current implementation relies on defaults, but if needed, can be overrided by using the lower level
      // JsonRpcProvider directly instead of the Alchemy community provider.

      if (status == 429) {
        error = new PoolInfoProviderError(
          PoolInfoProviderErrorCode.Throttle,
          'too many requests, try again later',
        );
      } else {
        error = new PoolInfoProviderError(
          PoolInfoProviderErrorCode.Network,
          `error fetching token, ${err}`,
        );
      }
    } else if (
      isError(err, 'CALL_EXCEPTION') ||
      isError(err, 'INSUFFICIENT_FUNDS') ||
      isError(err, 'NETWORK_ERROR')
    ) {
      error = new PoolInfoProviderError(
        PoolInfoProviderErrorCode.Blockchain,
        `error fetching token, ${err}`,
      );
    } else {
      error = new PoolInfoProviderError(
        PoolInfoProviderErrorCode.Generic,
        `error fetching token, ${err}`,
      );
    }

    throw error;
  }
};
