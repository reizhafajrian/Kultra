import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../pages/LoginScreen';
import RegisterScreen from '../pages/RegisterScreen';
const Screen = createStackNavigator();
export type RootStackAuthList = {
  Login: undefined;
  Register: undefined;
};
export default function AuthStack() {
  return (
    <Screen.Navigator initialRouteName={'Login'}>
      <Screen.Screen
        name="Login"
        component={LoginScreen}
        options={() => {
          return {
            headerShown: false,
          };
        }}
      />
      <Screen.Screen
        name="Register"
        component={RegisterScreen}
        options={() => {
          return {
            headerShown: false,
          };
        }}
      />
    </Screen.Navigator>
  );
}
