import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import FlashMessage from 'react-native-flash-message';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import RNLocation from 'react-native-location';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContextProvider} from './Context';
import {Platform} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default function Routes() {
  const {getToken, setLocation} = React.useContext(AuthContextProvider);
  const setLocationFunc = () => {
    RNLocation.configure({
      distanceFilter: 10.0,
    });
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
      },
    }).then(granted => {
      if (granted) {
        RNLocation.subscribeToLocationUpdates(locations => {
          setLocation(locations[0].latitude, locations[0].longitude);
        });
      }
    });
  };

  useEffect(() => {
    location();
  }, []);
  const location = () => {
    if (Platform.OS === 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          setLocationFunc();
        })
        .catch(err => {
          location();
        });
    } else {
      setLocationFunc();
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <RoutesItemMemo token={getToken()} />
        </NavigationContainer>
        <FlashMessage position="top" />
      </SafeAreaView>
    </>
  );
}
const RoutesItem = ({token}) => {
  return <>{token.length > 0 ? <MainStack /> : <AuthStack />}</>;
};
const RoutesItemMemo = React.memo(RoutesItem);
