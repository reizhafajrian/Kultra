import React from 'react';
import {View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function DetailMakananKhas({route}) {
  const {dataItem} = route.params;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View height={20} />
      <Text style={{fontSize: 24, alignSelf: 'center', padding: 20}}>
        {dataItem['NAMA MAKANAN']}
      </Text>
      <View height={16} />
      <FastImage
        source={{uri: dataItem['LINK GAMBAR']}}
        style={{
          width: '100%',
          height: 200,
          resizeMode: 'cover',
          borderRadius: 20,
        }}
      />
      <View height={16} />
      <Text style={{fontSize: 16, padding: 20}}>{dataItem['DESK SIGKAT']}</Text>
    </SafeAreaView>
  );
}
