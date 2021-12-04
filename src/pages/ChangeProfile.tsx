import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../assets';
import Button from '../components/Button/Button';
import InputText from '../components/InputText/InputText';
import Loading from '../components/Loading/Loading';
import {color} from '../utils/color';
import {changeProfileFirebase, getProfile} from '../utils/firebase';

const ChangeProfile = () => {
  const [loading, setloading] = useState(true);
  const [name, setname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setimage] = useState(
    'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg',
  );
  const changeProfile = async () => {
    setloading(true);
    await changeProfileFirebase(name, image, phone, email);
    setloading(false);
  };
  const getData = async () => {
    setloading(true);
    const result = await getProfile();
    setimage(result?.photoURL);
    setEmail(result?.email);
    setname(result?.displayName);
    setPhone(result?.phoneNumber);
    setloading(false);
  };
  let options = {
    mediaType: 'photo',
    maxWidth: 360,
    maxHeight: 360,
  };
  const changeImage = async () => {
    await launchImageLibrary(options, response => {
      setimage(response?.assets[0]?.uri);
    });
  };
  useEffect(() => {
    getData();
    return () => {};
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{height: 21}} />
          <View
            style={{
              alignSelf: 'center',
              height: 100,
              width: 100,
            }}>
            <Image
              source={{uri: image}}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                resizeMode: 'cover',
              }}
            />
            <TouchableOpacity
              onPress={changeImage}
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
          {/* <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
        <Text>Email</Text>
        <View height={5} />
        <InputText
          title={'reizha77@gmail.com'}
          setChangeText={setEmail}
          value={email}
        />
      </View> */}
          <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
            <Text>Name</Text>
            <View height={5} />
            <InputText
              title={'reizha77@gmail.com'}
              setChangeText={setname}
              value={name}
            />
          </View>
          <View style={{width: '90%', alignSelf: 'center', marginVertical: 8}}>
            <Text>Phone Number</Text>
            <View height={5} />
            <InputText
              title={'reizha77@gmail.com'}
              setChangeText={setPhone}
              value={phone}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 30,
              width: '90%',
              alignSelf: 'center',
            }}>
            <Button title={'Save'} onPress={changeProfile} />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default ChangeProfile;
