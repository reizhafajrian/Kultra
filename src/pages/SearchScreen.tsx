import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IconSolid from 'react-native-vector-icons/FontAwesome';
import ItemCard from '../components/Card/ItemCard';
import {color} from '../utils/color';

import BottomSheet from '@gorhom/bottom-sheet';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {
  calculateScore,
  getAllResto,
  getResto,
  searchResto,
} from '../utils/firebase';
import {MyStatusBar} from '../../App';
import FastImage from 'react-native-fast-image';
import {AuthContextProvider} from '../routes/Context';
import {distanceBetween} from 'geofire-common';
import Loading from '../components/Loading/Loading';
export const ShowModal = React.createContext();

const Header = () => {
  const {showModalFunction, setDataSearch, getState} = useContext(ShowModal);
  const searchKeyword = async val => {
    if (val.length > 0) {
      const res = await searchResto(val);
      return setDataSearch(res);
    }
    return setDataSearch([]);
  };

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
            onChangeText={val => searchKeyword(val)}
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

const SearchScreen = ({navigation}) => {
  const [loading, setloading] = useState(true);
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SHOWMODAL':
        return {
          ...state,
          modal: action.modal,
        };
      case 'SET_DATA_SEARCH':
        return {
          ...state,
          data: action.data,
          temp: action.temp,
        };
      case 'RATING':
        return {
          ...state,
          rating: action.rating,
        };
      case 'PRICE':
        return {
          ...state,
          price: action.price,
        };
      case 'RANGE':
        return {
          ...state,
          range: action.range,
        };
      case 'TIME':
        return {
          ...state,
          time: action.time,
        };
      case 'FASILITAS':
        return {
          ...state,
          fasilitas: action.fasilitas,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    modal: 0,
    data: [],
    rating: 0,
    range: '',
    price: '',
    time: '',
    fasilitas: '',
    temp: [],
  });
  const showModal = useMemo(
    () => ({
      showModalFunction: index => {
        dispatch({type: 'SHOWMODAL', modal: index});
      },
      setDataSearch: data => {
        setloading(false);
        dispatch({type: 'SET_DATA_SEARCH', data: data});
      },
      setRating: rating => {
        dispatch({type: 'RATING', rating: rating});
      },
      setRange: range => {
        dispatch({type: 'RANGE', range: range});
      },
      setPrice: price => {
        dispatch({type: 'PRICE', price: price});
      },
      setTime: time => {
        dispatch({type: 'TIME', time: time});
      },
      setFasilitas: fasilitas => {
        dispatch({type: 'FASILITAS', fasilitas: fasilitas});
      },
      getState: () => {
        return state;
      },
    }),
    [state],
  );
  const [datas, setdata] = useState({
    temp: [],
    data: [],
  });
  const getDataFilter = async () => {
    let temp = datas.temp;
    if (state.rating > 0) {
      temp = datas.temp.filter(item => item.rate >= state.rating);
    }

    if (state.time !== '') {
      if (state.time === '24 jam') {
        temp = temp.filter(item => item.jam_operasional === '24 Jam');
      } else {
        temp = temp.filter(item => {
          if (item['jam_operasiona'] !== '24 Jam') {
            const time = item.jam_operasional.slice(8, 13).replace('.', '');

            if (Number(time) >= 1800) {
              return item;
            }
          }
        });
      }
    }
    if (state.range !== '') {
      temp = await getRestoRange(temp, Number(state.range.slice(0, 2)));
    }
    if (state.price !== '') {
      const price = state.price
        .replace('Rp', '')
        .replace('.', '')
        .replace('>', '');
      temp = temp.filter(item => {
        if (typeof item['rata_rata_harga_string'] !== 'undefined') {
          const priceItem = item['rata_rata_harga_string']
            .toString()
            .replaceAll(' ', '')
            .replaceAll('.', '')
            .replaceAll('Rp', '')
            .replaceAll(',', '');

          if (Number(price) < 100000) {
            return Number(priceItem) <= Number(price);
          } else {
            return Number(priceItem) >= Number(price);
          }
        }
      });
    }
    if (state.fasilitas !== '') {
      console.log('masuk');
      temp = temp.filter(item => {
        return item.fasilitas === state.fasilitas;
      });
      // console.log(temp,"temo")
    }

    return setdata({
      temp: datas.temp,
      data: temp,
    });
    // setdata({
    //   temp: response[response.length - 1].last,
    //   data: datas.data.concat(temp),
    // });
  };
  const {getLocation} = useContext(AuthContextProvider);
  const getRestoRange = async (res, km = 20) => {
    const center = [getLocation().lat, getLocation().long];
    const radiusInM = km * 1000;
    return Promise.all(res).then(snapshots => {
      const matchingDocs = [];
      console.log(snapshots);
      for (const snap of snapshots) {
        const lat = snap['latitude'];
        const lng = snap['longitude'];
        const distanceInKm = distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          matchingDocs.push(snap);
        }
      }
      return matchingDocs;
    });
  };
  const context = useContext(AuthContextProvider);
  const getData = async () => {
    const res = await calculateScore(context.getLocation());

    setdata({
      temp: res,
      data: res,
    });
    setloading(false);
  };
  useEffect(() => {
    getData();
    return () => {
      showModal.setDataSearch([]);
    };
  }, []);
  useEffect(() => {
    if (datas.data.length > 0) {
      getDataFilter();
    }
    return () => {};
  }, [state.rating, state.range, state.price, state.time, state.fasilitas]);

  const RenderItem = ({item, index}) => {
    const [dataItem] = useState({
      item: item,
      id: item.id,
      rate: item.rate,
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
          source={{uri: item.thumbnail}}
          style={{
            width: 146,
            height: 100,
            resizeMode: 'center',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
        <Text numberOfLines={1} style={{padding: 8}}>
          {item.nama_restoran}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <ShowModal.Provider value={showModal}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{paddingHorizontal: 20, flex: 1}}>
          <Header />
          {loading ? (
            <Loading />
          ) : state.data.length > 0 ? (
            <FlatList
              data={state.data}
              key={'$'}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => <ItemCard item={item} />}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
              showsVerticalScrollIndicator={false}
              numColumns={1}
            />
          ) : (
            <FlatList
              data={datas.data}
              key={datas.length}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => <RenderItem item={item} />}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                flex: 1,
                justifyContent: 'space-between',
                paddingHorizontal: 14,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => {
                    getDataFilter();
                  }}
                />
              }
              // onEndReached={() => getDataFilter()}
            />
          )}
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
  const snapPoints = useMemo(() => ['0%', '80%', '100%'], []);
  const {setRating, setRange, setPrice, setTime, getState, setFasilitas} =
    useContext(ShowModal);
  const handleSheetChanges = useCallback(
    (id: number) => {
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
        bottomSheetRef.current?.snapTo(1);
      }
    }, [index]),
  );

  const RenderItem = ({item, index, title}) => {
    const buttonClick = (itemLocal, titleLocal) => {
      switch (titleLocal) {
        case 'Rating':
          setRating(itemLocal);
          break;
        case 'Jarak':
          setRange(itemLocal);
          break;
        case 'Harga':
          setPrice(itemLocal);
          break;
        case 'Jam':
          setTime(itemLocal);
          break;
        case 'Fasilitas':
          setFasilitas(itemLocal);
          break;
      }
    };
    const borderOn =
      getState().rating === item ||
      getState().range === item ||
      getState().price === item ||
      getState().time === item ||
      getState().fasilitas === item;
    useEffect(() => {
      return () => {};
    }, []);
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
          borderColor: borderOn ? color.buttonPrimary : color.grey,
          borderRadius: 4,
        }}
        onPress={() => {
          buttonClick(item, title);
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
          renderItem={({item, index}) => (
            <RenderItem item={item} title={itemData.title} />
          )}
        />
      </View>
    );
  };

  const data = [
    {
      title: 'Jarak',
      items: ['10km', '20km', '40km'],
    },
    {
      title: 'Harga',
      items: ['Rp50.000', 'Rp100.000', 'Rp150.000'],
    },
    {
      title: 'Jam',
      items: ['24 jam', '08.00-18.00', '>18.00'],
    },
    {
      title: 'Fasilitas',
      items: ['1', '2', '3', '4', '5'],
    },
  ];
  const clearFilter = () => {
    setRating(0);
    setTime('');
    setPrice('');
    setRange('');
    setFasilitas('');
  };
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View style={{flex: 1}}>
        <FlatList
          data={data}
          scrollEnabled={true}
          renderItem={({item, index}) => <RenderItemBottom itemData={item} />}
          ListFooterComponent={() => {
            return (
              <TouchableOpacity
                style={{
                  minWidth: 42,
                  height: 30,
                  paddingHorizontal: 5,
                  backgroundColor: color.buttonPrimary,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: color.grey,
                  borderRadius: 4,
                }}
                onPress={() => {
                  clearFilter();
                }}>
                <Text style={{color: 'white'}}>Hapus filter</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </BottomSheet>
  );
};
const BottomSheetMemo = React.memo(BottomSheetComponent, (prevState, state) => {
  return prevState.index === state.index;
});

export default SearchScreen;
