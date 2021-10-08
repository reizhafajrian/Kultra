import React from 'react';
import {View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

const Loading = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
};

export default Loading;
