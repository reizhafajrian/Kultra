import React, {useContext} from 'react';
import {View, Text, SafeAreaView, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../assets';
import {AuthContextProvider} from '../routes/Routes';
import {color} from '../utils/color';
import {signOut} from '../utils/firebase.js';
interface Button {
  name: string;
  click: () => void;
}

const ButtonEvent = ({name, click}: Button) => {
  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          backgroundColor: color.grey,
          height: 48,
          borderRadius: 20,
          alignSelf: 'center',
        }}
        onPress={click}>
        <Text>{name}</Text>
        <Icon name="chevron-right" size={30} color={'white'} />
      </TouchableOpacity>
    </>
  );
};

const AccountScreen = ({navigation}) => {
  const {logOut} = useContext(AuthContextProvider);
  const logOutFunc = async () => {
    await signOut();
    logOut('');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View height={33} />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            resizeMode: 'cover',
            alignSelf: 'center',
          }}
          source={IMGEXAMPLE}
        />
        <View height={20} />
        <Text style={{fontSize: 16, fontWeight: '600'}}>Reizha Fajrian</Text>
      </View>
      <View height={44} />
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontWeight: '500'}}>Tersimpan</Text>
          <View style={{height: 20}} />
          <Text style={{fontWeight: '300'}}>10</Text>
        </View>
        <View style={{width: 40}} />
        <View style={{width: 2, backgroundColor: '#E0E0E0', height: 100}} />
        <View style={{width: 40}} />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontWeight: '500'}}>Ulasan</Text>
          <View style={{height: 20}} />
          <Text style={{fontWeight: '300'}}>10</Text>
        </View>
      </View>
      <View height={24} />
      <View>
        <ButtonEvent
          name={'Change Profile'}
          click={() => navigation.navigate('ChangeProfile')}
        />
        <View height={12} />
        <ButtonEvent
          name={'Change Password'}
          click={() => navigation.navigate('ChangePassword')}
        />
        <View height={12} />
        <ButtonEvent name={'Sign Out'} click={logOutFunc} />
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
