/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import PoolListScreen from './src/app/screens/PoolListScreen';
import PoolDetailScreen from './src/app/screens/PoolDetailScreen';
import {RootStackParamList} from './src/app/screens/navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PoolList">
        <Stack.Screen
          name="PoolList"
          component={PoolListScreen}
          options={{title: 'Pools'}}></Stack.Screen>
        <Stack.Screen
          name="PoolDetail"
          component={PoolDetailScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
