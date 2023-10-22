import {appConfig} from '../../config';

export enum PoolId {
  rocketpool = 'rocketpool',
  lido = 'lido',
}

export const PoolIdFromStr = (str: string): PoolId | undefined => {
  switch (str) {
    case 'rocketpool':
      return PoolId.rocketpool;
    case 'lido':
      return PoolId.lido;
  }
};

export const getPoolIds = () => {
  const poolKeys = Object.keys(appConfig.pools);

  return poolKeys
    .map(key => PoolIdFromStr(key))
    .filter((poolId): poolId is PoolId => !!poolId);
};
