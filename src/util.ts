import {ethers} from 'ethers';

const ETHER_DECIMALS = 18n;
export const formatEth = (amount: string) => {
  const decimalsToShow = 6n;
  const decimalsToTrunc = 10n ** (ETHER_DECIMALS - decimalsToShow);

  let eth = BigInt(amount);
  eth = (eth / decimalsToTrunc) * decimalsToTrunc;
  return ethers.formatEther(eth);
};
