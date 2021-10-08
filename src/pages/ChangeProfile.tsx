import React from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';

import Icon from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../assets';
import Button from '../components/Button/Button';
import InputText from '../components/InputText/InputText';
import {color} from '../utils/color';

const ChangeProfile = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{height: 21}} />
      <View
        style={{
          alignSelf: 'center',

          height: 100,
          width: 100,
        }}>
        <Image
          source={IMGEXAMPLE}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            resizeMode: 'cover',
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: color.colorPrimary,
            width: 36,
            height: 36,
            borderRadius: 36 / 2,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 0,
            bottom: -10,
          }}>
          <Icon name="edit-2" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View height={28} />
      <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
        <Text>Email</Text>
        <View height={5} />
        <InputText title={'reizha77@gmail.com'} />
      </View>
      <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
        <Text>Name</Text>
        <View height={5} />
        <InputText title={'reizha77@gmail.com'} />
      </View>
      <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
        <Text>Phone Number</Text>
        <View height={5} />
        <InputText title={'reizha77@gmail.com'} />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 30,
          width: '90%',
          alignSelf: 'center',
        }}>
        <Button title={'Save'} />
      </View>
    </SafeAreaView>
  );
};

export default ChangeProfile;
