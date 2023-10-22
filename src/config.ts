interface PoolConfig {
  name: string;
  stakingToken: string;
}

interface AppConfig {
  pools: Record<string, PoolConfig>;
}

export const appConfig: AppConfig = {
  pools: {
    rocketpool: {
      name: 'Rocket Pool',
      stakingToken: '0xae78736cd615f374d3085123a210448e74fc6393',
    },
    lido: {
      name: 'Lido',
      stakingToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    },
  },
};
