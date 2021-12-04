import React, {useContext, useState} from 'react';
import {Image, SafeAreaView, Dimensions} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {View, Text} from 'react-native';
// import {showMessage} from 'react-native-flash-message';
import {IconLogo, IMGBG} from '../assets';
import Button from '../components/Button/Button';
import InputText from '../components/InputText/InputText';
import Loading from '../components/Loading/Loading';
import {RootStackAuthList} from '../routes/AuthStack';

import {color} from '../utils/color';
import {signIn} from '../utils/firebase.js';
import {AuthContextProvider} from '../routes/Context';
import {showMessage} from 'react-native-flash-message';
import {Icon} from 'react-native-paper/lib/typescript/components/Avatar/Avatar';

type RegisterHomeScreen = StackNavigationProp<RootStackAuthList, 'Register'>;

export default function LoginScreen() {
  const {height} = Dimensions.get('screen');
  const navigation = useNavigation<RegisterHomeScreen>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const checkInput = email.length > 0 && password.length > 0;
  const {login}: any = useContext(AuthContextProvider);
  const Login = async () => {
    if (checkInput) {
      try {
        setloading(true);
        const res = await signIn(email, password);
        login(await res.user.getIdToken());
        setloading(false);
      } catch (error) {
        setloading(false);
        showMessage({
          message: 'Failed',
          description: 'your email or password is incorrect',
          type: 'danger',
        });
      }
    } else {
      showMessage({
        message: 'Failed',
        description: 'please fill all the fields',
        type: 'danger',
      });
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setloading(false);
        setEmail('');
        setPassword('');
      };
    }, []),
  );

  const moveToRegister = () => {
    navigation.navigate('Register');
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
          <View style={{flex: 1, alignItems: 'center'}}>
            <View height={120} />
            <IconLogo />
            <Text
              style={{
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold',
              }}>
              KULTRA
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 24,
                fontWeight: "500",
                textAlign: 'center',
              }}>
              Rekomendasi Kuliner Nusantara
            </Text>
          </View>
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
            <View style={{height: 24}} />
            <InputText title={'Email'} setChangeText={setEmail} />
            <View style={{height: 16}} />
            <InputText
              title={'Password'}
              setChangeText={setPassword}
              secureTextEntry={true}
            />
            <View style={{height: 36}} />
            <Button title={'Masuk'} onPress={() => Login()} />
            <View style={{height: 36}} />
            <Text style={{alignSelf: 'center'}}>
              Belum punya akun?{' '}
              <Text onPress={() => moveToRegister()}>Daftar sekarang</Text>
            </Text>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
