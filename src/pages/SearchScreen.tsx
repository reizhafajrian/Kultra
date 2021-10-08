import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IconSolid from 'react-native-vector-icons/FontAwesome';
import ItemCard from '../components/Card/ItemCard';
import {color} from '../utils/color';

import BottomSheet from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/core';
const ShowModal = React.createContext();
const Header = () => {
  const {showModalFunction} = useContext(ShowModal);
  return (
    <>
      <Text style={{fontSize: 16, fontWeight: '600'}}>
        Rekomendasi dari kami
      </Text>
      <View style={{height: 20}} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
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
        <Icon
          name="sliders"
          onPress={() => showModalFunction(1)}
          size={25}
          color={color.colorPrimary}
        />
      </View>
      <View style={{height: 20}} />
    </>
  );
};

const SearchScreen = () => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SHOWMODAL':
        return {
          ...state,
          modal: action.modal,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, {modal: 0});
  const showModal = useMemo(
    () => ({
      showModalFunction: index => {
        dispatch({type: 'SHOWMODAL', modal: index});
      },
    }),
    [state],
  );

  return (
    <ShowModal.Provider value={showModal}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{paddingHorizontal: 20, flex: 1}}>
          <FlatList
            data={[]}
            renderItem={() => <ItemCard />}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            ListHeaderComponent={Header}
          />
        </View>
        <BottomSheetMemo index={state.modal} />
      </SafeAreaView>
    </ShowModal.Provider>
  );
};

const BottomSheetComponent = ({index}) => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {showModalFunction} = useContext(ShowModal);
  // variables
  const snapPoints = useMemo(() => ['0%', '50%'], []);

  console.log('test');
  const handleSheetChanges = useCallback(
    (id: number) => {
      console.log('example');
      if (id === 0) {
        showModalFunction(0);
      }
    },
    [index],
  );
  useFocusEffect(
    useCallback(() => {
      if (index === 0) {
        bottomSheetRef.current?.collapse();
      } else {
        bottomSheetRef.current?.expand();
      }
    }, [index]),
  );

  const RenderItem = ({item, index, title}) => {
    return (
      <TouchableOpacity
        style={{
          minWidth: 42,
          height: 24,
          paddingHorizontal: 5,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#E7E7E7',
          borderRadius: 4,
        }}>
        {title === 'Rating' && (
          <IconSolid name="star" size={20} color={'yellow'} />
        )}
        <Text style={{color: '#6C6C6C'}}>{item}</Text>
      </TouchableOpacity>
    );
  };

  // renders

  const RenderItemBottom = ({itemData}) => {
    return (
      <View style={{padding: 20, flexDirection: 'column'}}>
        <Text style={{fontWeight: '600', fontSize: 20}}>{itemData.title}</Text>
        <View height={10} />

        <FlatList
          data={itemData.items}
          horizontal={true}
          ItemSeparatorComponent={() => <View style={{width: 10}} />}
          scrollEnabled={false}
          renderItem={({item, index}) => (
            <RenderItem item={item} title={itemData.title} />
          )}
        />
      </View>
    );
  };

  const data = [
    {
      title: 'Rating',
      items: [5, 4, 3, 2, 1],
    },
    {
      title: 'Jarak',
      items: ['<10km', '10km-20km', '>20km'],
    },
    {
      title: 'Harga',
      items: ['<Rp50.000', 'Rp50.000-Rp100.000', '>Rp100.000'],
    },
    {
      title: 'Jam',
      items: ['24 jam', '08.00-18.00', '>18.00'],
    },
  ];
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View>
        <FlatList
          data={data}
          scrollEnabled={false}
          renderItem={({item, index}) => <RenderItemBottom itemData={item} />}
        />
      </View>
    </BottomSheet>
  );
};
const BottomSheetMemo = React.memo(BottomSheetComponent, (prevState, state) => {
  return prevState.index === state.index;
});

export default SearchScreen;
