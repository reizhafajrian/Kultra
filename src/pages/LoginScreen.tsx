import React from 'react';
import {Dimensions, Pressable} from 'react-native';
import {Image, SafeAreaView} from 'react-native';
import {View, Text} from 'react-native';
import {IMGBG} from '../assets';
import Button from '../components/Button/Button';
import InputText from '../components/InputText/InputText';
import {color} from '../utils/color';
const {width, height} = Dimensions.get('screen');

export default function LoginScreen() {
  console.log(width);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'red'}}>
      <Image
        source={IMGBG}
        style={{
          resizeMode: 'cover',
          width: '100%',
          height: height,
          position: 'absolute',
          top: 0,
        }}
      />
      <View
        style={{
          height: 416,
          width: '100%',
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,
          borderRadius: 30,
          paddingHorizontal: 40,
          paddingVertical: 28,
        }}>
        <Text
          style={{
            color: color.textPrimary,
            fontWeight: '600',
            fontSize: 18,
            width: 189,
          }}>
          Masuk ke dalam akun anda
        </Text>
        <View height={24} />
        <InputText title={'Email'} />
        <View height={16} />
        <InputText title={'Password'} />
        <View height={36} />
        <Button title={'Masuk'} />
        <View height={36} />
        <Text style={{alignSelf: 'center'}}>
          Belum punya akun?{' '}
          <Text onPress={() => alert('test')}>Daftar sekarang</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
