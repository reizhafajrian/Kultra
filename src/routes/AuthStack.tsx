import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../pages/LoginScreen';
const Screen = createStackNavigator();
export default function AuthStack() {
  return (
    <Screen.Navigator>
      <Screen.Screen
        name="Login"
        component={LoginScreen}
        options={() => {
          return {
            headerShown: false,
          };
        }}
      />
    </Screen.Navigator>
  );
}
