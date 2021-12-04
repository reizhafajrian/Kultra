import React, {useEffect, useMemo, useReducer} from 'react';
import {View, Text, StatusBar, StyleSheet, Platform} from 'react-native';
import Routes from './src/routes/Routes';
import data from './data.json';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {color} from './src/utils/color';
import Context from './src/routes/Context';
export const LocationContext = React.createContext();
import codePush from 'react-native-code-push';

export const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar
        backgroundColor={backgroundColor}
        translucent={true}
        {...props}
      />
    </SafeAreaView>
  </View>
);
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 0 : StatusBar.currentHeight - 40;
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: 'black',
  },
});
export const ColorContext = React.createContext();
function App() {
  return (
    <>
      {/* <LocationContext.Provider value={LocationMemo}> */}
      <Context>
        <Routes />
      </Context>

      {/* </LocationContext.Provider> */}
    </>
  );
}

export default codePush(App);
