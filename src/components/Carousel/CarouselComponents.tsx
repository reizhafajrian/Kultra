import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {IMGEXAMPLE} from '../../assets';
import {ModalContext} from '../../pages/HomeScreen/HomeScreen';
import {color} from '../../utils/color';
import {getArticle} from '../../utils/firebase';

interface props {
  data?: [];
}
const sliderWidth = Dimensions.get('window').width;
const CarouselComponents = ({data}: props) => {
  const context = useContext(ModalContext);
  const [state, setstate] = useState(0);

  const showModal = (modal, title, desc, image) => {
    context.modal(modal, title, desc, image);
  };

  const RenderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          paddingHorizontal: 30,
          alignItems: 'center',
        }}
        onPress={() => showModal(true, item.title, item.desc, item.image)}>
        <FastImage
          source={{uri: item?.image}}
          style={{width: 280, height: 160, borderRadius: 20}}
        />
        <View height={8} />
        <Text style={{textAlign: 'center'}}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const PaginationDots = () => {
    return (
      <Pagination
        dotsLength={data?.length}
        activeDotIndex={state}
        containerStyle={{
          position: 'absolute',
          right: 0,
          left: 0,
          bottom: -40,
        }}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          backgroundColor: color.colorPrimary,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
        activeOpacity={0}
      />
    );
  };
  // const [article, setarticle] = useState([]);
  // const [articleTemp, setarticleTemp] = useState([]);
  // const getArticles = async () => {
  //   const res = await getArticle();
  //   setarticle(res);

  //   setarticleTemp(res.slice(0, 3));
  // };
  // useEffect(() => {
  //   getArticles();
  // }, []);
  return (
    <View
      style={{
        justifyContent: 'center',
        alignSelf: 'center',
        height: 220,
        paddingHorizontal: 40,
      }}>
      {data?.length > 0 && (
        <Carousel
          data={data}
          renderItem={({item}) => <RenderItem item={item} />}
          onSnapToItem={index => setstate(index)}
          autoplay={true}
          enableMomentum={false}
          autoplayInterval={8000}
          windowSize={1}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
        />
      )}

      <PaginationDots />
    </View>
  );
};

export default CarouselComponents;
