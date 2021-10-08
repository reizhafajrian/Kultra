import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import Routes from './src/routes/Routes';
import {createResto, nearbyResto} from './src/utils/firebase';
import data from './data.json';
export const LocationContext = React.createContext();

export default function App() {
  return (
    <>
      {/* <LocationContext.Provider value={LocationMemo}> */}
      <Routes />
      {/* </LocationContext.Provider> */}
    </>
  );
}
