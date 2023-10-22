import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  PoolInfoProviderErrorCode,
  PoolInfoProvider,
  PoolInfoProviderError,
} from '../../network/poolInfoProvider';
import {rocketPoolProvider} from '../../network/rocketPool';
import {lidoProvider} from '../../network/lido';
import {appConfig} from '../../config';
import {PoolId, PoolIdFromStr} from './poolId';

export interface Pool {
  id: PoolId;
  name: string;
  validatorCount: number;
  stakingTokenSupply: string;
}

const getProvider = (poolId: PoolId): PoolInfoProvider => {
  switch (poolId) {
    case PoolId.rocketpool:
      return rocketPoolProvider;
    case PoolId.lido:
      return lidoProvider;
  }
};

const fetchPoolInfo = async (poolId: PoolId): Promise<Pool> => {
  const poolInfoProvider = getProvider(poolId);
  const validatorCount = await poolInfoProvider.fetchValidatorCount();
  const stakingToken = await poolInfoProvider.fetchStakingToken();
  const name = appConfig.pools[poolId].name;
  const pool: Pool = {
    id: poolId,
    name,
    validatorCount: Number(validatorCount),
    stakingTokenSupply: stakingToken.totalSupply.toString(),
  };

  return pool;
};

const parseError = (error: any): {error: PoolApiError} => {
  if (error instanceof PoolInfoProviderError) {
    return {
      error: {
        status: 'PROVIDER_ERROR',
        code: error.code,
        msg: error.message,
      },
    };
  } else {
    return {error: {status: 'GENERIC', msg: 'unknown poolApi error'}};
  }
};

type PoolApiError =
  | {status: 'PROVIDER_ERROR'; code: PoolInfoProviderErrorCode; msg: string}
  | {status: 'GENERIC'; msg: string};

export const poolApi = createApi({
  reducerPath: 'poolApi',
  baseQuery: fakeBaseQuery<PoolApiError>(),
  endpoints: build => ({
    getPool: build.query<Pool, PoolId>({
      queryFn: async poolId => {
        try {
          const pool = await fetchPoolInfo(poolId);
          return {data: pool};
        } catch (error) {
          return parseError(error);
        }
      },
    }),
    getPools: build.query<Pool[], PoolId[]>({
      queryFn: async poolIds => {
        try {
          let pools: Pool[] = [];

          for (const poolKey of poolIds) {
            const poolId = PoolIdFromStr(poolKey);

            if (poolId !== undefined) {
              const pool = await fetchPoolInfo(poolId);
              pools.push(pool);
            }
          }

          return {data: pools};
        } catch (error) {
          return parseError(error);
        }
      },
    }),
  }),
});

export const {useGetPoolQuery, useGetPoolsQuery} = poolApi;
