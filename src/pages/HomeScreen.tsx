import {useNavigation, useFocusEffect} from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {Alert, Dimensions, FlatList, Pressable} from 'react-native';
import {Image, SafeAreaView} from 'react-native';
import {View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {LocationContext} from '../../App';
import {IMGBG, IMGEXAMPLE} from '../assets';
import Button from '../components/Button/Button';
import CarouselComponents from '../components/Carousel/CarouselComponents';
import CarouselComponentsCard from '../components/Carousel/CarouselComponentsCard';
import InputText from '../components/InputText/InputText';
import {ModalComponent} from '../components/Modal/Modal';
import {AuthContextProvider} from '../routes/Routes';
import {color} from '../utils/color';
import {getResto, nearbyResto} from '../utils/firebase.js';
const {height} = Dimensions.get('screen');

export const ModalContext = React.createContext();
const database = [
  {
    name: 'sate madura',
  },
  {
    name: 'sate betawi',
  },
  {
    name: 'sop iga',
  },
  {
    name: 'indomie goreng',
  },
];
const Header = () => {
  const [data, setdata] = useState([]);
  const nearby = async () => {
    const res = await nearbyResto();
    console.log(res);
    setdata(res);
  };
  useEffect(() => {
    nearby();
    return () => {
      setdata([]);
    };
  }, []);
  return (
    <>
      <View height={12} />
      <View style={{height: 270}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, fontWeight: '600'}}>
            Kumpulan artikel untukmu
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              color: color.colorPrimary,
            }}>
            Lihat semua
          </Text>
        </View>
        <View height={12} />
        <CarouselComponents />
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, fontWeight: '600'}}>
            Rekomendasi restoran terbaik
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              color: color.colorPrimary,
            }}>
            Lihat semua
          </Text>
        </View>
        <View height={12} />
        <CarouselComponentsCard data={data} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, fontWeight: '600'}}>
            Informasi Kuliner Nusantara
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              color: color.colorPrimary,
            }}>
            Lihat semua
          </Text>
        </View>
      </View>
    </>
  );
};
const HeaderMemo = React.memo(Header);
export default function HomeScreen() {
  const navigation = useNavigation();
  console.log('home');
  const reducer = (prevState, action) => {
    switch (action.key) {
      case 'MODAL':
        return {
          ...prevState,
          modal: action.modal,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, {modal: false});
  const functionMemo = useMemo(
    () => ({
      modal: visible => {
        dispatch({key: 'MODAL', modal: visible});
      },
    }),
    [state],
  );
  // const [temp, settemp] = useState([]);
  const [datas, setdata] = useState({
    temp: [],
    data: [],
  });
  const getData = async () => {
    const response = await getResto(
      datas.temp.length === 0 ? null : datas.temp,
    );
    setdata({
      temp: response[response.length - 1].last,
      data: datas.data.concat(response),
    });
  };
  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  const RenderItem = ({item, index}) => {
    const [dataItem] = useState({
      item: item.data,
      id: item.id,
    });

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailRestaurant', {dataItem});
        }}
        style={{
          width: 146,
          height: 152,
          borderRadius: 10,
          shadowColor: '#000',
          marginHorizontal: 5,
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
          marginVertical: 8,
        }}>
        <FastImage
          source={{uri: item.data.thumbnail}}
          style={{
            width: 146,
            height: 100,
            resizeMode: 'center',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
        <Text numberOfLines={1} style={{padding: 8}}>
          {item.data['Nama Restoran']}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <ModalContext.Provider value={functionMemo}>
      <SafeAreaView style={{flex: 1, backgroundColor: color.buttonPrimary}}>
        <View style={{paddingHorizontal: 16}}>
          <Text style={{fontSize: 30, color: 'white'}}>Kultra</Text>
          <Text style={{fontSize: 16, color: 'white'}}>
            Selamat datang, Reizha Fajrian!
          </Text>
        </View>
        {/* <HeaderMemo /> */}
        <View
          style={{
            marginTop: 30,
            width: '100%',
            backgroundColor: 'white',
            flex: 1,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            paddingHorizontal: 24,
          }}>
          <View>
            {datas.data.length > 0 && (
              <FlatList
                data={datas.data}
                renderItem={({item, index}) => (
                  <RenderItem item={item} index={index} />
                )}
                ListHeaderComponent={() => <HeaderMemo />}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={{
                  flex: 1,
                  justifyContent: 'space-evenly',
                }}
                onEndReached={() => getData()}
              />
            )}
          </View>
          <ModalComponent
            visible={state.modal}
            onClose={() => {
              functionMemo.modal(false);
            }}
          />
        </View>
      </SafeAreaView>
    </ModalContext.Provider>
  );
}
