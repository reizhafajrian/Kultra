import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {IMGBG} from '../assets';
import {color} from '../utils/color';
import InputText from '../components/InputText/InputText';
import Button from '../components/Button/Button';
import {useNavigation} from '@react-navigation/core';
import {signUp} from '../utils/firebase.js';
import Loading from '../components/Loading/Loading';
import {showMessage} from 'react-native-flash-message';
const {height, width} = Dimensions.get('screen');
const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setname] = useState('');
  const [phone, setphone] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [loading, setloading] = useState(false);

  const check =
    email.length > 0 &&
    password.length > 0 &&
    name.length > 0 &&
    phone.length > 0 &&
    confPassword.length > 0 &&
    password === confPassword;
  const Register = async () => {
    setloading(true);
    if (check) {
      try {
        const res = await signUp(email, password, name, phone);
        showMessage({
          message: 'Success',
          description: "You're account has been created",
          type: 'success',
        });
        navigation.navigate('Login');
      } catch (error) {
        setloading(false);
        showMessage({
          message: 'Failed',
          description: "You're failed to register",
          type: 'danger',
        });
        setname('');
        setemail('');
        setphone('');
        setPassword('');
        setConfPassword('');
      }
    } else {
      showMessage({
        message: 'Failed',
        description: 'Please fill the form correctly',
        type: 'danger',
      });
    }
    setloading(false);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <SafeAreaView style={{flex: 1, backgroundColor: 'red', paddingTop: 16}}>
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
              height: '100%',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 30,
              top: 10,
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
              Buat akun anda
            </Text>
            <Text
              style={{
                color: color.textPrimary,
                fontWeight: '400',
                fontSize: 12,
              }}>
              Buat akun anda untuk melanjutkan
            </Text>
            <View height={24} />
            <InputText title={'Email'} setChangeText={setemail} />
            <View height={16} />
            <InputText title={'Nama'} setChangeText={setname} />
            <View height={16} />
            <InputText
              title={'Nomor Telepon'}
              setChangeText={setphone}
 
            />
            <View height={16} />
            <InputText
              title={'Kata Sandi'}
              setChangeText={setPassword}
              secureTextEntry={true}
            />
            <View height={16} />
            <InputText
              title={'Konfirmasi Kata Sandi'}
              secureTextEntry={true}
              setChangeText={setConfPassword}
            />
            <View height={36} />
            <Button title={'Daftar'} onPress={Register} />
            <View height={36} />
            <Text style={{alignSelf: 'center'}}>
              Sudah punya akun?{' '}
              <Text onPress={() => navigation.navigate('Login')}>Masuk</Text>
            </Text>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
