import React, {useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {showMessage} from 'react-native-flash-message';

import Icon from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../assets';
import Button from '../components/Button/Button';
import InputText from '../components/InputText/InputText';
import Loading from '../components/Loading/Loading';
import {color} from '../utils/color';
import {changePasswordAuth} from '../utils/firebase';

const ChangePassword = () => {
  const [password, setpassword] = useState('');
  const [confPassword, setconfPassword] = useState('');
  const [oldpassword, setoldpassword] = useState('');
  const [loading, setloading] = useState(false);
  const changePassword = async () => {
    setloading(true);
    if (password === confPassword) {
      try {
        const res = await changePasswordAuth(oldpassword, password);
        if (res) {
          showMessage({
            message: 'Success',
            type: 'success',
            description: 'Password changed successfully',
          });
        } else {
          showMessage({
            message: 'Error',
            type: 'danger',
            description: 'Password not changed',
          });
        }
      } catch (error) {
        setloading(false);
      }
    } else {
      showMessage({
        message: 'Error',
        type: 'danger',
        description: 'Password not match',
      });
    }
    setloading(false);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{height: 21}} />
          <View height={28} />
          <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
            <Text>Password Lama</Text>
            <View height={5} />
            <InputText
              title={'Password Lama'}
              secureTextEntry={true}
              setChangeText={setoldpassword}
            />
          </View>
          <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
            <Text>Password Baru</Text>
            <View height={5} />
            <InputText
              title={'Password Baru'}
              secureTextEntry={true}
              setChangeText={setpassword}
            />
          </View>
          <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
            <Text>Konfirmasi Password Baru</Text>
            <View height={5} />
            <InputText
              title={'Password Baru'}
              secureTextEntry={true}
              setChangeText={setconfPassword}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 30,
              width: '90%',
              alignSelf: 'center',
            }}>
            <Button title={'Save'} onPress={() => changePassword()} />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default ChangePassword;
