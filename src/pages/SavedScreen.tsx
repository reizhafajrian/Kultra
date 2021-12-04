import {useFocusEffect} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, TextInput, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ItemCard from '../components/Card/ItemCard';
import Loading from '../components/Loading/Loading';
import {color} from '../utils/color';
import {
  getCommentResto,
  getDataFromRef,
  getDataSavedFirebase,
} from '../utils/firebase';

const Header = () => {
  return (
    <>
      <Text style={{fontSize: 16, fontWeight: '600'}}>Restoran Tersimpan</Text>
      <View style={{height: 20}} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: color.grey,
            borderRadius: 7,
            paddingHorizontal: 8,
            width: 300,
          }}>
          <Icon name="search" size={20} color={color.colorPrimary} />
          <TextInput
            style={{
              width: 276,
              height: 30,

              paddingVertical: 0,
              paddingHorizontal: 10,
            }}
            placeholder="Cari nama restoran"
          />
        </View>
        <Icon name="sliders" size={25} color={color.colorPrimary} /> */}
      </View>
      <View style={{height: 20}} />
    </>
  );
};
const SavedScreen = ({navigation}) => {
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState([]);
  const getDataSaved = async () => {
    setloading(true);
    const res = await getDataSavedFirebase();
    const temp = [];
    for (const key in res) {
      const result = await getDataFromRef(res[key].path);
      temp.push(result);
    }
    for (const key in temp) {
      let rate = 0;
      const comment = await getCommentResto(temp[key].id);
      for (const kay in comment) {
        const tempRate = await getDataFromRef(comment[kay].ref);
        rate += tempRate.item.rating;
      }
      temp[key].rate = rate / comment.length;
    }

    setdata(temp);
    setloading(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      getDataSaved();
      return () => {
        setdata([]);
      };
    }, []),
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {loading ? (
        <Loading />
      ) : (
        <View style={{paddingHorizontal: 20, flex: 1}}>
          <FlatList
            data={data}
            renderItem={({item, index}) => (
              <ItemCard item={item} index={index} />
            )}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            ListHeaderComponent={Header}
            ListEmptyComponent={() => {
              return (
                <View>
                  <Text style={{textAlign: 'center', color: color.grey}}>
                    Data Tidak Ada
                  </Text>
                </View>
              );
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SavedScreen;
