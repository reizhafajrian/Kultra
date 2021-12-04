import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useContext, useState} from 'react';
import {View, Text, SafeAreaView, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../assets';
import Loading from '../components/Loading/Loading';
import {AuthContextProvider} from '../routes/Context';

import {color} from '../utils/color';
import {
  getProfile,
  lengthOfBookmark,
  lengthOfComment,
  signOut,
} from '../utils/firebase.js';
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
  const [object, setObject] = useState({
    comment: 0,
    bookmark: 0,
    image:
      'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg',
    displayName: '',
  });
  const logOutFunc = async () => {
    await signOut();
    logOut('');
  };
  const getDataUserActive = async () => {
    const comment = await lengthOfComment();
    const bookmark = await lengthOfBookmark();
    
    setObject(res => ({
      ...res,
      comment: comment,
      bookmark: bookmark,
    }));
  };
  const getDataUser = async () => {
    const res = await getProfile();

    setObject(result => {
      return {
        ...result,
        displayName: res.displayName,
        image: res.photoURL,
      };
    });
  };
  const [loading, setloading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setloading(true);
      getDataUserActive();
      getDataUser();
      setloading(false);
    }, []),
  );
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
              source={{uri: object?.image}}
            />
            <View height={20} />
            <Text style={{fontSize: 16, fontWeight: '600'}}>
              {object?.displayName}
            </Text>
          </View>
          <View height={44} />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: '500'}}>Tersimpan</Text>
              <View style={{height: 20}} />
              <Text style={{fontWeight: '300'}}>{object.bookmark}</Text>
            </View>
            <View style={{width: 40}} />
            <View style={{width: 2, backgroundColor: '#E0E0E0', height: 100}} />
            <View style={{width: 40}} />
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: '500'}}>Ulasan</Text>
              <View style={{height: 20}} />
              <Text style={{fontWeight: '300'}}>{object.comment}</Text>
            </View>
          </View>
          <View height={24} />
          <View>
            <ButtonEvent
              name={'Ubah Profile'}
              click={() => navigation.navigate('ChangeProfile')}
            />
            <View height={12} />
            <ButtonEvent
              name={'Ganti Password'}
              click={() => navigation.navigate('ChangePassword')}
            />
            <View height={12} />
            <ButtonEvent name={'Keluar'} click={logOutFunc} />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default AccountScreen;
