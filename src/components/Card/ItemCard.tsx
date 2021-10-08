import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

import Icon from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../../assets';

const ItemCard = ({item, index}) => {
  const navigation = useNavigation();
  // console.log(item);
  return (
    <>
      <TouchableOpacity
        style={{
          width: '90%',
          padding: 16,
          shadowColor: '#000',
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
        }}
        onPress={() => {
          navigation.navigate('DetailRestaurant');
        }}>
        <View style={{flexDirection: 'row'}}>
          <FastImage
            source={IMGEXAMPLE}
            style={{width: 102, height: 68, borderRadius: 12}}
          />
          <View style={{paddingHorizontal: 10, justifyContent: 'center'}}>
            <Text style={{fontWeight: '600'}} numberOfLines={2}>
              {item['Nama Restoran']}
            </Text>
            <View height={4} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name={'star'} color={'#FFBA0A'} />
              <View width={4} />
              <Text>4.5</Text>
              <View width={8} />
              <Text>|</Text>
              <View width={8} />
              <Text>1.8 km</Text>
            </View>
            <View height={4} />
            <Text>{item['Nama Restoran']}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ItemCard;
