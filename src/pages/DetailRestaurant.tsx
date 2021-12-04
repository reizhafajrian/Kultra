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
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Platform,
} from 'react-native';
// import ImageView from '../components/react-native-image-view';
import ImageView from 'react-native-image-viewing';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import {IMGEXAMPLE} from '../assets';
import {color} from '../utils/color';
import BottomSheet from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/core';
import {AirbnbRating, Rating, TapRatingProps} from 'react-native-ratings';
import Button from '../components/Button/Button';
import {
  addBookmark,
  currentUser,
  deleteBookMark,
  findBookMark,
  findDocRestobyId,
  getCommentResto,
  getDataFromRef,
  postComment,
} from '../utils/firebase';
import Loading from '../components/Loading/Loading';

const {width} = Dimensions.get('window');

const RenderItemMenu = ({item, onPress}) => {
  return (
    <>
      <TouchableOpacity
        style={{
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderRadius: 10,
        }}
        onPress={onPress}>
        <Image
          style={{
            width: 66,
            height: 100,
            resizeMode: 'cover',
            borderRadius: 10,
          }}
          source={{uri: item}}
        />
      </TouchableOpacity>
    </>
  );
};
const RenderItemMenuMemo = React.memo(RenderItemMenu);
const Menu = ({data}) => {
  const [visible, setvisible] = useState(false);
  const [number, setNumber] = useState(0);
  const image = useMemo(() => {
    const images = [];
    for (let index = 0; index < data.length; index++) {
      images.push({
        uri: data[index],
      });
    }

    return images;
  }, []);
  const onPress = index => {
    setvisible(!visible);
    setNumber(index);
  };
  return (
    <>
      <View height={20} />
      <View>
        <Text style={{fontSize: 18, fontWeight: '600'}}>Menu</Text>
        <View height={10} />
        <FlatList
          data={data}
          renderItem={({item, index}) => (
            <RenderItemMenuMemo item={item} onPress={() => onPress(index)} />
          )}
          horizontal={true}
          ItemSeparatorComponent={() => <View width={10} />}
        />
        <ImageView
          visible={visible}
          onRequestClose={() => setvisible(!visible)}
          images={image}
          imageIndex={number}
        />
      </View>
    </>
  );
};
function Header({item}) {
  const [bookmark, setbookmark] = useState(false);
  const [visible, setvisible] = useState(false);
  const [rating, setrating] = useState(item?.rate || 0);
  const openGps = (lat, lng) => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${lat},${lng}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };

  const addBookMarkItem = async () => {
    if (bookmark) {
      const response = await deleteBookMark(item.id);

      setbookmark(!response[0]);
    } else {
      const res = await addBookmark(item.id);
      setbookmark(res);
    }
  };
  const getBookMark = async () => {
    const res = await findBookMark(item.id);
    if (res !== bookmark) {
      setbookmark(res);
    }
  };
  const image = () => {
    const images = [
      {
        uri: item.item.thumbnail,
      },
    ];
    return images;
  };
  useEffect(() => {
    getBookMark();

    if (typeof item?.rate !== 'undefined') {
      getNewData();
    }
  }, []);
  const getNewData = async () => {
    const res = await findDocRestobyId(item.id);
    if (res > 0) {
      setrating(res);
    }
  };

  return (
    <>
      <View>
        <TouchableOpacity onPress={() => setvisible(!visible)}>
          <Image
            source={{uri: item.item.thumbnail}}
            style={{width: width, height: 240, resizeMode: 'cover'}}
          />
        </TouchableOpacity>
        <View
          style={{
            width: 72,
            height: 36,
            backgroundColor: 'white',
            position: 'absolute',
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,
            flexDirection: 'row',
            right: 20,
            bottom: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
          }}>
          <Icon name="star" size={24} color="#FFBA0A" />
          <View width={6} />
          <Text>{rating?.toFixed(2)}</Text>
        </View>
      </View>
      <View style={{height: 16}} />
      <View style={{paddingHorizontal: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 18, fontWeight: '600', width: '70%'}}>
            {item.item.nama_restoran}
          </Text>
          <TouchableOpacity
            onPress={() => {
              addBookMarkItem();
            }}>
            {bookmark ? (
              <Icon name={'bookmark'} color={color.colorPrimary} size={25} />
            ) : (
              <IconFeather
                name={'bookmark'}
                color={color.colorPrimary}
                size={25}
                backgroundColor={'black'}
              />
            )}
          </TouchableOpacity>
          {/* <Icon name={'bookmark'} color={color.colorPrimary} size={25} /> */}
        </View>
        <View style={{height: 16}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconFeather name={'map-pin'} color={color.colorPrimary} size={25} />
          <View width={8} />
          <Text
            onPress={() => openGps(item.item.latitude, item.item.longitude)}
            style={{fontSize: 14, color: '#6C6C6C', width: '95%'}}>
            {item.item.alamat}
          </Text>
        </View>
        <View style={{height: 8}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconFeather name={'clock'} color={color.colorPrimary} size={25} />
          <View width={8} />
          <Text style={{fontSize: 14, color: '#6C6C6C'}}>
            {item.item.jam_operasional}
          </Text>
        </View>
        <View style={{height: 8}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconFeather
            name={'dollar-sign'}
            color={color.colorPrimary}
            size={25}
          />
          <View width={8} />
          <Text style={{fontSize: 14, color: '#6C6C6C'}}>
            {item.item.rata_rata_harga_string}
          </Text>
        </View>
        <Menu data={item.item.image} />
        <View style={{height: 16}} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 18, fontWeight: '600'}}>Ulasan</Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              color: color.colorPrimary,
            }}>
            Lihat semua
          </Text>
        </View>
      </View>
      <ImageView
        visible={visible}
        onRequestClose={() => setvisible(!visible)}
        images={image()}
        imageIndex={0}
      />
      <Comment item={item} />
    </>
  );
}

const HeaderMemo = React.memo(Header);
const CardReview = ({data}) => {
  const [comment, setcomment] = useState({});
  const getDataComment = async () => {
    const res = await getDataFromRef(data.ref);
    setcomment(res);
  };
  useFocusEffect(
    useCallback(() => {
      if (typeof data.ref !== 'undefined') {
        getDataComment();
      }
    }, []),
  );

  return (
    <>
      <View height={28} />
      <View height={10} />
      <View
        style={{
          borderBottomWidth: 1,
          paddingBottom: 20,
          borderBottomColor: '#E7E7E7',
        }}>
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 14, fontWeight: '500'}}>
            {comment?.item?.user}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="star" size={20} color="#FFBA0A" />
            <View width={6} />
            <Text>{comment?.item?.rating}/5</Text>
          </View>
        </View>
        <View height={20} />
        <View height={10} />
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontSize: 14, fontWeight: '400', color: '#6C6C6C'}}>
            {comment?.item?.comment}
          </Text>
        </View>
      </View>
    </>
  );
};

const Comment = () => {
  const {showModalFunc} = useContext(DetailRestaurantContext);
  const test = () => {
    showModalFunc(1);
  };
  return (
    <TouchableOpacity style={{padding: 16}} onPress={() => test()}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontSize: 14, fontWeight: '500'}}>Tulis ulasan kamu</Text>
        <Icon name={'edit'} color={color.colorPrimary} size={24} />
      </View>
      <View style={{height: 4}} />
      <Text style={{fontSize: 14, fontWeight: '400', color: '#6C6C6C'}}>
        Yuk, ikutan tulis ulasan untuk restoran ini!
      </Text>
    </TouchableOpacity>
  );
};
const CardReviewMemo = React.memo(CardReview);

const DetailRestaurantContext = React.createContext();
const DetailRestaurant = ({route}) => {
  const [item, setItem] = useState(route.params.dataItem);
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SHOWMODAL':
        return {
          ...state,
          modal: action.modal,
        };
      case 'STAR':
        return {
          ...state,
          star: action.star,
        };
      case 'LOADING':
        return {
          ...state,
          loading: action.loading,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    modal: 0,
    star: 0,
    loading: false,
  });
  const memoFunction = useMemo(
    () => ({
      showModalFunc: modal => {
        dispatch({type: 'SHOWMODAL', modal: modal});
      },
      getModal: () => {
        return state.modal;
      },
      pickStar: star => {
        dispatch({type: 'STAR', star: star});
      },
      getAllState: () => {
        return state;
      },
      setloading: loading => {
        dispatch({type: 'LOADING', loading: loading});
      },
    }),
    [state],
  );

  return (
    <>
      {state.loading ? (
        <Loading />
      ) : (
        <DetailRestaurantContext.Provider value={memoFunction}>
          <SafeAreaView>
            <RenderItemDataMemo item={item} />
            {state.modal === 1 && <BottomSheetMemo item={item} />}
          </SafeAreaView>
        </DetailRestaurantContext.Provider>
      )}
    </>
  );
};
const RenderItemData = ({item}) => {
  const [state, setstate] = useState([]);
  const getComment = async () => {
    const res = await getCommentResto(item.id);
    setstate(res);
  };

  useFocusEffect(
    useCallback(() => {
      getComment();
      return () => {};
    }, []),
  );

  return (
    <>
      <FlatList
        data={state.length > 0 ? state : []}
        renderItem={({item, index}) => <CardReviewMemo data={item} />}
        contentContainerStyle={{
          minHeight: '100%',
        }}
        keyExtractor={(item, index) => index.toString()}
        key={item.id}
        initialNumToRender={1}
        extraData={state}
        maxToRenderPerBatch={1}
        ListHeaderComponent={() => <HeaderMemo item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};
const RenderItemDataMemo = React.memo(RenderItemData);
const BottomSheetComponent = ({item}) => {
  const [rating, setrating] = useState(5);
  const [comment, setcomment] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {showModalFunc, getModal, setloading} = useContext(
    DetailRestaurantContext,
  );
  // variables
  const snapPoints = useMemo(() => ['0%', '50%'], []);

  const handleSheetChanges = useCallback((id: number) => {
    if (id === 0) {
      showModalFunc(0);
    }
  }, []);

  const postComments = async () => {
    if (comment.length > 0) {
      setloading(true);
      const uid = currentUser();
      const data = {
        rating: rating,
        comment: comment,
        resto_id: item.id,
        uid: uid?.uid,
        user: uid?.email,
      };
      await postComment(item.id, data);
      showModalFunc(0);
      setTimeout(() => {
        setloading(false);
      }, 1000);
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (getModal() === 0) {
        bottomSheetRef.current?.collapse();
      } else {
        bottomSheetRef.current?.expand();
      }
      return () => {
        bottomSheetRef.current?.collapse();
      };
    }, [getModal()]),
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
        <Text style={{fontWeight: '600', fontSize: 20}}>
          {item.item['Nama Restoran']}
        </Text>
        <View style={{height: 10}} />
        <Text style={{fontWeight: '400', fontSize: 16}}>
          Penilaian kamu terhadap restoran
        </Text>
        <View style={{height: 10}} />
        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
          {/* <FlatList
            data={[1, 2, 3, 4, 5]}
            horizontal={true}
            renderItem={({item, index}) => <Stars item={item} index={index} />}
          /> */}
          <AirbnbRating
            // reviews={['Terrible', 'Bad', 'OK', 'Good', 'Very Good']}

            count={5}
            reviews={['Terrible', 'Bad', 'Meh', 'OK', 'Good']}
            defaultRating={5}
            size={30}
            onFinishRating={rat => {
              setrating(rat);
            }}
          />
        </View>
        <View style={{height: 20}} />
        <View style={{height: 20}} />
        <Text
          style={{
            fontWeight: '400',
            fontSize: 16,
          }}>
          Apa kritik dan saran kamu untuk restoran ini?
        </Text>
        <View style={{height: 10}} />
        <TextInput
          style={{
            width: '90%',
            height: 90,
            borderRadius: 12,
            borderColor: '#E7E7E7',
            borderWidth: 1,
            alignSelf: 'center',
            padding: 10,
          }}
          placeholder={'Tulis kritik dan saran kamu'}
          multiline={true}
          onChangeText={text => {
            return setcomment(text);
          }}
        />
        <View style={{height: 20}} />
        <Button title={'Simpan'} onPress={() => postComments()} />
      </View>
    </BottomSheet>
  );
};
const BottomSheetMemo = React.memo(BottomSheetComponent);

export default DetailRestaurant;
