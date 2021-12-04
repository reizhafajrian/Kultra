import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

import Icon from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../../assets';

interface props {
  item?: Object;
  index?: Number;
}

const ItemCard = ({item, index}: props) => {
  const navigation = useNavigation();

  const [dataItem] = useState({
    item: item?.item,
    id: item?.id,
    rate: item?.rate,
    image: item?.item?.thumbnail,
  });

  return (
    <>
      {typeof item?.item !== 'undefined' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('DetailRestaurant', {dataItem});
          }}>
          <View style={styles.container}>
            <FastImage
              source={{
                uri: item?.item?.thumbnail
                  ? item?.item?.thumbnail
                  : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg',
              }}
              style={styles.image}
            />
            <View style={styles.containerText}>
              <Text style={styles.title} numberOfLines={1}>
                {item?.item.nama_restoran}
              </Text>
              <View height={4} />
              <View style={styles.containerCard}>
                <Icon name={'star'} color={'#FFBA0A'} />
                <View width={4} />
                <Text>{item?.rate ? item.rate.toFixed(1) : 0}</Text>
                <View width={8} />
              </View>
              <View height={4} />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  button: {
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
  },
  container: {flexDirection: 'row'},
  image: {
    width: 102,
    height: 68,
    borderRadius: 12,
  },
  containerCard: {flexDirection: 'row', alignItems: 'center'},
  title: {
    fontWeight: '600',
    width: 180,
  },
  containerText: {paddingHorizontal: 10, justifyContent: 'center'},
});

export default ItemCard;
