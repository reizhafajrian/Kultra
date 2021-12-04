import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Loading from '../components/Loading/Loading';
import {getFood, postFood} from '../utils/firebase';

const RenderItem = ({item, index}) => {
  const navigation = useNavigation();
  const [dataItem] = useState(item);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DetailMakanan', {dataItem});
      }}
      style={{
        width: 146,
        height: 152,
        borderRadius: 10,
        shadowColor: '#000',
        marginHorizontal: 5,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        borderRadius: 16,
        alignSelf: 'center',
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        backgroundColor: 'white',
        marginVertical: 8,
      }}>
      <FastImage
        source={{uri: item['LINK GAMBAR']}}
        style={{
          width: 146,
          height: 100,
          resizeMode: 'center',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      />
      <Text numberOfLines={1} style={{padding: 8}}>
        {item['NAMA MAKANAN']}
      </Text>
    </TouchableOpacity>
  );
};
export default function Food() {
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(true);
  const getData = async () => {
    const res = await getFood();
    setdata(res);
    setloading(false);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={data}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
          numColumns={2}
          columnWrapperStyle={{
            flex: 1,
            justifyContent: 'space-evenly',
          }}
        />
      )}
    </SafeAreaView>
  );
}
