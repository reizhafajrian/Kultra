import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native';
import {View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MyStatusBar} from '../../../App';
import Loading from '../../components/Loading/Loading';
import {ModalComponent} from '../../components/Modal/Modal';
import Context from '../../routes/Context';
import {color} from '../../utils/color';
import {currentUser, getResto} from '../../utils/firebase.js';
import {HeaderMemo} from './Header';

export const ModalContext = React.createContext();
const height = Dimensions.get('screen').height;
export default function HomeScreen() {
  const navigation = useNavigation();

  const reducer = (prevState, action) => {
    switch (action.key) {
      case 'MODAL':
        return {
          ...prevState,
          modal: action.modal,
          title: action.title,
          desc: action.desc,
          image: action.image,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, {modal: false});
  const functionMemo = useMemo(
    () => ({
      modal: (visible, title, desc, image) => {
        dispatch({
          key: 'MODAL',
          modal: visible,
          title: title,
          desc: desc,
          image: image,
        });
      },
    }),
    [state],
  );
  const [datas, setdata] = useState({
    temp: [],
    data: [],
  });
  const [name, setname] = useState<String>('');
  const getCurrent = async () => {
    const getCurrenData = (await currentUser()?.displayName) || '';
    setname(getCurrenData);
  };
  const getData = async () => {
    const fill = datas.temp.length === 0 ? null : datas.temp;
    const response = await getResto(fill).then(res => res);

    setdata({
      temp: response[response.length - 1]?.last,
      data: datas.data.concat(response),
    });
  };
  const [loading, setloading] = useState(false);
  useEffect(() => {
    setloading(true);
    getData();
    getCurrent();
    setloading(false);
  }, []);

  const RenderItem = ({item, index}) => {
    const [dataItem] = useState({
      item: item.data,
      id: item.id,
      rate: item?.rate,
      image: item?.image,
    });

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailRestaurant', {dataItem});
        }}
        style={styles.ItemButton}>
        <FastImage
          source={{uri: item?.data?.thumbnail}}
          style={{
            width: 146,
            height: 100,
            resizeMode: 'center',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
        <Text numberOfLines={1} style={{padding: 8}}>
          {item?.data.nama_restoran}
        </Text>
      </TouchableOpacity>
    );
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  const scrollA = React.useRef(new Animated.Value(0)).current;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <ModalContext.Provider value={functionMemo}>
          <SafeAreaView style={{flex: 1, backgroundColor: color.buttonPrimary}}>
            <View style={styles.containerText}>
              <Text style={styles.text}>Kultra</Text>
              <Text style={styles.text}>Selamat datang, {name}!</Text>
            </View>
            <View>
              <Animated.FlatList
                style={styles.list(scrollA)}
                data={datas.data}
                renderItem={({item, index}) => (
                  <RenderItem item={item} index={index} />
                )}
                ListHeaderComponent={HeaderMemo}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={styles.columnList}
                onEndReached={getData}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: scrollA}}}],
                  {
                    useNativeDriver: true,
                  },
                )}
                ListFooterComponent={() => (
                  <>
                    <View height={20} />
                    <ActivityIndicator size="large" color="#00ff00" />
                  </>
                )}
              />
            </View>
            <ModalComponent
              visible={state.modal}
              title={state.title}
              desc={state.desc}
              image={state.image}
              onClose={() => {
                functionMemo.modal(false);
              }}
            />
          </SafeAreaView>
        </ModalContext.Provider>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  ItemButton: {
    width: 146,
    height: 152,
    borderRadius: 10,
    shadowColor: '#000',
    marginHorizontal: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    alignSelf: 'center',
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: 'white',
    marginVertical: 8,
  },
  containerText: {
    paddingHorizontal: 16,
  },
  columnList: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  text: {fontSize: 18, color: 'white'},
  list: (scrollA: any) => ({
    width: '100%',
    backgroundColor: 'white',
    height: height - height * 0.09,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    paddingHorizontal: 24,
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [0, 40, 70, 100, 100 + 1],
          outputRange: [0, -20, -50, -70, -70],
        }),
      },
    ],
  }),
});
