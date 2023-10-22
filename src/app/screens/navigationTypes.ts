import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {PoolId} from '../redux/poolId';
import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  PoolList: undefined;
  PoolDetail: {poolId: PoolId};
};

export type PoolDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'PoolDetail'
>;

export type PoolDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PoolDetail'
>;

export type PoolDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'PoolDetail'
>;
