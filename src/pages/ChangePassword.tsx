import React from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';

import Icon from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../assets';
import Button from '../components/Button/Button';
import InputText from '../components/InputText/InputText';
import {color} from '../utils/color';

const ChangePassword = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{height: 21}} />
      <View height={28} />
      <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
        <Text>Old Password</Text>
        <View height={5} />
        <InputText title={'reizha77@gmail.com'} secureTextEntry={true} />
      </View>
      <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
        <Text>New Password</Text>
        <View height={5} />
        <InputText title={'reizha77@gmail.com'} secureTextEntry={true} />
      </View>
      <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
        <Text>Confirm New Password</Text>
        <View height={5} />
        <InputText title={'reizha77@gmail.com'} secureTextEntry={true} />
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

export default ChangePassword;
