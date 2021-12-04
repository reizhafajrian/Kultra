import {useNavigation} from '@react-navigation/core';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Modal} from 'react-native-paper';
import {IMGEXAMPLE} from '../assets';
import ItemCard from '../components/Card/ItemCard';
import {ModalComponent} from '../components/Modal/Modal';

interface props {
  navigation?: useNavigation;
  route?: Object;
}
const RenderItem = ({item, index}) => {
  const navigation = useNavigation();
  const context = useContext(ModalContext);
  const showArticle = items => {
    context.modal(true, items.title, items.desc, items.image);
  };
  return (
    <>
      <TouchableOpacity
        style={{
          width: '90%',
          padding: 16,
          shadowColor: '#000',
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
        }}
        onPress={() => {
          showArticle(item);
        }}>
        <View style={{flexDirection: 'row'}}>
          <FastImage
            source={{uri: item?.image}}
            style={{width: 102, height: 68, borderRadius: 12}}
          />
          <View style={{paddingHorizontal: 10, justifyContent: 'center'}}>
            <Text style={{fontWeight: '600', width: 180}} numberOfLines={1}>
              {item?.title}
            </Text>
            <View height={4} />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export const ModalContext = createContext();
const AllItem = ({navigation, route}: props) => {
  const {title, data} = route.params;
  navigation.setOptions({title: title});
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

  return (
    <ModalContext.Provider value={functionMemo}>
      <SafeAreaView style={{padding: 20, flex: 1}}>
        {title === 'Kumpulan Artikel' ? (
          <FlatList
            data={data.length > 0 ? data : []}
            renderItem={({item, index}) => {
              return <RenderItem item={item} index={index} />;
            }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View height={10} />}
            ListHeaderComponent={() => <View height={20} />}
          />
        ) : (
          <FlatList
            data={data.length > 0 ? data : []}
            renderItem={({item, index}) => {
              return <ItemCard item={item} index={index} />;
            }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View height={10} />}
            ListHeaderComponent={() => <View height={20} />}
          />
        )}
        <ModalComponent
          visible={state.modal}
          desc={state.desc}
          title={state.title}
          image={state.image}
          onClose={() => {
            dispatch({
              key: 'MODAL',
              modal: false,
              title: '',
              desc: '',
              image: '',
            });
          }}
        />
      </SafeAreaView>
    </ModalContext.Provider>
  );
};

export default AllItem;
