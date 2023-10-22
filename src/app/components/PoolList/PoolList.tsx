import React from 'react';
import {FlatList} from 'react-native';
import PoolListItem from './PoolListItem';
import {Pool} from '../../redux/poolApi';

export interface PoolListProps {
  pools: Pool[];
}

const PoolList = (props: PoolListProps) => {
  return (
    <FlatList
      data={props.pools}
      renderItem={({item}) => <PoolListItem pool={item} />}
    />
  );
};

export default PoolList;
