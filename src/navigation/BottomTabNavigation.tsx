import React from 'react';
import {View, Text} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../pages/HomeScreen';
import SearchScreen from '../pages/SearchScreen';
import AccountScreen from '../pages/AccountScreen';
import SavedScreen from '../pages/SavedScreen';
import Icon from 'react-native-vector-icons/Feather';
import {color} from '../utils/color';

const Tab = createMaterialBottomTabNavigator();
const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      barStyle={{backgroundColor: 'white'}}
      activeColor={color.buttonPrimary}
      inactiveColor={'#B4B4B4'}
      labeled={false}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={() => {
          return {
            tabBarIcon: ({focused}) => (
              <Icon
                name="home"
                color={focused ? color.colorPrimary : color.grey}
                size={24}
              />
            ),
          };
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={() => {
          return {
            tabBarIcon: ({focused}) => (
              <Icon
                name="search"
                color={focused ? color.colorPrimary : color.grey}
                size={24}
              />
            ),
          };
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={() => {
          return {
            tabBarIcon: ({focused}) => (
              <Icon
                name="bookmark"
                color={focused ? color.colorPrimary : color.grey}
                size={24}
              />
            ),
          };
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={() => {
          return {
            tabBarIcon: ({focused}) => (
              <Icon
                name="user"
                color={focused === true ? color.colorPrimary : color.grey}
                size={24}
              />
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
