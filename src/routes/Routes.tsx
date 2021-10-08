import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useMemo, useReducer, useState} from 'react';
import FlashMessage from 'react-native-flash-message';
import Loading from '../components/Loading/Loading';
import HomeScreen from '../pages/HomeScreen';
import {checkCurrentUser} from '../utils/firebase.js';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
export const AuthContextProvider = React.createContext();
import RNLocation from 'react-native-location';
export default function Routes() {
  const [loading, setloading] = useState(true);
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
      this.locationSubscription = RNLocation.subscribeToLocationUpdates(
        locations => {
          console.log(locations);
          dispatch({
            type: 'setLocation',
            location: {
              lat: locations[0].latitude,
              long: locations[0].longitude,
            },
          });
        },
      );
    }
  });
  const reducer = (state, action) => {
    switch (action.type) {
      case 'login': {
        return {
          ...state,
          token: action.token,
        };
      }
      case 'setLocation': {
        return {
          ...state,
          location: {
            lat: action.location.lat,
            long: action.location.long,
          },
        };
      }
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    token: '',
    location: {
      lat: 0,
      long: 0,
    },
  });
  const checkToken = async () => {
    try {
      const token = await checkCurrentUser()?.getIdToken();
      if (typeof token === 'string') {
        dispatch({type: 'login', token});
      }
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };
  useEffect(() => {
    checkToken();
    return () => {};
  }, []);

  const MemoFunctionRoutes = useMemo(
    () => ({
      login: async token => {
        dispatch({type: 'login', token: token});
      },
      logOut: async token => {
        dispatch({type: 'login', token: token});
      },
      getLocation: () => {
        return state.location;
      },
    }),
    [state],
  );

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <AuthContextProvider.Provider value={MemoFunctionRoutes}>
          <NavigationContainer>
            <RoutesItemMemo token={state.token} />
          </NavigationContainer>
          <FlashMessage position="top" />
        </AuthContextProvider.Provider>
      )}
    </>
  );
}
const RoutesItem = ({token}) => {
  return <>{token.length > 0 ? <MainStack /> : <AuthStack />}</>;
};
const RoutesItemMemo = React.memo(RoutesItem);
