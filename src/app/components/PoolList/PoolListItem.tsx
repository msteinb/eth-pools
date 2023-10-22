import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Pressable, Image, StyleSheet} from 'react-native';
import {Assets} from '../../../assets';
import {Pool} from '../../redux/poolApi';
import {formatEth} from '../../../util';
import {PoolDetailScreenNavigationProp} from '../../screens/navigationTypes';

interface PoolListItemProps {
  pool: Pool;
}

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  chevron: {
    width: 25,
    height: 25,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontSize: 26,
  },
});

const PoolListItem = (props: PoolListItemProps) => {
  const navigation = useNavigation<PoolDetailScreenNavigationProp>();

  return (
    <View>
      <Pressable
        style={styles.container}
        onPress={() =>
          navigation.navigate('PoolDetail', {poolId: props.pool.id})
        }>
        <View style={styles.itemInfo}>
          <Image
            style={styles.logo}
            source={Assets[`${props.pool.id}Icon`]}></Image>
          <View>
            <Text style={styles.title}>{props.pool.name}</Text>
            <Text>{formatEth(props.pool.stakingTokenSupply)} ETH</Text>
          </View>
        </View>
        <Image style={styles.chevron} source={Assets.chevron}></Image>
      </Pressable>
    </View>
  );
};

export default PoolListItem;
