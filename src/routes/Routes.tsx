import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {View, Text} from 'react-native';
import AuthStack from './AuthStack';
const AuthContextProvider = React.createContext();
export default function Routes() {
  return (
    // <AuthContextProvider.Provider>
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
    // </AuthContextProvider.Provider>
  );
}
