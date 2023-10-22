import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Assets} from '../../assets';
import {PoolDetailProps} from './navigationTypes';
import {useGetPoolsQuery} from '../redux/poolApi';
import {formatEth} from '../../util';
import {getPoolIds} from '../redux/poolId';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    margin: 10,
    marginTop: 50,
  },
  name: {
    fontSize: 26,
    alignSelf: 'center',
  },
  statsContainer: {
    flex: 1,
    flexWrap: 'wrap',
    padding: 20,
    flexDirection: 'row',
  },
  stat: {
    alignItems: 'center',
    width: '50%',
    padding: 10,
  },
  title: {
    fontSize: 20,
  },
});

const PoolStat = (props: {title: String; value: String; subValue?: String}) => {
  const hasSubValue = props.subValue != undefined;

  return (
    <View style={styles.stat}>
      <Text style={styles.title}>{props.title}</Text>
      <Text>{props.value}</Text>
      {hasSubValue && <Text>{props.subValue}</Text>}
    </View>
  );
};

const PoolDetailScreen = ({route}: PoolDetailProps) => {
  const poolId = route.params.poolId;
  const poolIds = getPoolIds();
  const {pool} = useGetPoolsQuery(poolIds, {
    selectFromResult: ({data}) => ({
      pool: data?.find(pool => pool.id === poolId),
    }),
  });

  if (pool === undefined) {
    return <Text>Pool details unavailable</Text>;
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Assets[`${pool.id}Icon`]}></Image>
      <Text style={styles.name}>{pool.name}</Text>
      <View style={styles.statsContainer}>
        <PoolStat
          title="Token Supply"
          value={formatEth(pool.stakingTokenSupply) + ' ETH'}></PoolStat>
        <PoolStat
          title="Validator Count"
          value={pool.validatorCount.toString()}></PoolStat>
      </View>
    </View>
  );
};

export default PoolDetailScreen;
