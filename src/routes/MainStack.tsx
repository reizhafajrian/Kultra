import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../pages/HomeScreen';
import BottomTabNavigation from '../navigation/BottomTabNavigation';
import ChangeProfile from '../pages/ChangeProfile';
import ChangePassword from '../pages/ChangePassword';
import DetailRestaurant from '../pages/DetailRestaurant';

export type RootStackMainList = {
  BottomNavigation: undefined;
  ChangeProfile: undefined;
  ChangePassword: undefined;
  DetailRestaurant: undefined;
};
const Screen = createStackNavigator();
export default function MainStack() {
  return (
    <Screen.Navigator initialRouteName={'BottomNavigation'}>
      <Screen.Screen
        name="BottomNavigation"
        component={BottomTabNavigation}
        options={() => {
          return {
            headerShown: false,
          };
        }}
      />
      <Screen.Screen
        name="ChangeProfile"
        component={ChangeProfile}
        options={() => {
          return {
            headerShown: true,
            title: 'Change Profile',
          };
        }}
      />
      <Screen.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={() => {
          return {
            headerShown: true,
            title: 'Change Password',
          };
        }}
      />
      <Screen.Screen
        name="DetailRestaurant"
        component={DetailRestaurant}
        options={() => {
          return {
            headerShown: false,
          };
        }}
      />
    </Screen.Navigator>
  );
}
