import React from 'react';
import {View, Text, SafeAreaView, TextInput, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ItemCard from '../components/Card/ItemCard';
import {color} from '../utils/color';

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
const SavedScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <FlatList
          data={[0, 1, 2, 3]}
          renderItem={() => <ItemCard />}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          ListHeaderComponent={Header}
        />
      </View>
    </SafeAreaView>
  );
};

export default SavedScreen;
