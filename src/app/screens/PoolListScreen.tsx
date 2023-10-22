import React from 'react';
import PoolList from '../components/PoolList/PoolList';
import {getPoolIds} from '../redux/poolId';
import {StyleSheet, Text, View} from 'react-native';
import {useGetPoolsQuery} from '../redux/poolApi';
import {PoolInfoProviderErrorCode} from '../../network/poolInfoProvider';
import {POLLING_INTERVAL, REFETCH_ON_MOUNT_INTERVAL} from '../consts';

const PoolListScreen = () => {
  const poolIds = getPoolIds();
  const {
    data: pools,
    isLoading,
    error,
  } = useGetPoolsQuery(poolIds, {
    pollingInterval: POLLING_INTERVAL,
    refetchOnMountOrArgChange: REFETCH_ON_MOUNT_INTERVAL,
  });

  if (isLoading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (error !== undefined) {
    console.log(error);

    // default error msg
    let msg = 'There was an issue loading pool information';

    if ('status' in error) {
      // handling specific error codes
      if (error.status == 'PROVIDER_ERROR') {
        if ('code' in error) {
          switch (error.code) {
            case PoolInfoProviderErrorCode.Blockchain:
              msg = 'There was a blockchain error';
              break;
            case PoolInfoProviderErrorCode.Network:
              msg = 'There was a network error';
              break;
            case PoolInfoProviderErrorCode.Throttle:
              msg = 'Requests are being throttled, please try again later';
              break;
            case PoolInfoProviderErrorCode.Generic:
              // use default msg
              break;
          }
        }
      }
    }

    return (
      <View style={styles.errorMsg}>
        <Text>{msg}</Text>
      </View>
    );
  }

  if (pools === undefined) {
    return (
      <View style={styles.errorMsg}>
        <Text style={{fontSize: 20}}>Unable to load pools :(</Text>
      </View>
    );
  }

  return <PoolList pools={pools}></PoolList>;
};

const styles = StyleSheet.create({
  loading: {
    fontSize: 18,
    padding: 10,
  },
  errorMsg: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PoolListScreen;
