import React, {useContext, useState} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {IMGEXAMPLE} from '../../assets';
import {ModalContext} from '../../pages/HomeScreen';
import {color} from '../../utils/color';
const sliderWidth = Dimensions.get('window').width;
const CarouselComponents = () => {
  const context = useContext(ModalContext);
  const [state, setstate] = useState(0);

  const showModal = () => {
    context.modal(true);
  };

  const RenderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          paddingHorizontal: 30,
          alignItems: 'center',
        }}
        onPress={showModal}>
        <FastImage source={IMGEXAMPLE} style={{width: 280, height: 160}} />
        <View height={8} />
        <Text style={{textAlign: 'center'}}>
          Begini Lho Sejarah Lahirnya Sate Hingga Jadi Makanan Nasional
          Indonesia
        </Text>
      </TouchableOpacity>
    );
  };

  const PaginationDots = () => {
    return (
      <Pagination
        dotsLength={4}
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
  return (
    <View
      style={{
        justifyContent: 'center',
        alignSelf: 'center',
        height: 220,
        paddingHorizontal: 40,
      }}>
      <Carousel
        data={[0, 1, 2, 3]}
        renderItem={({item}) => <RenderItem item={item} />}
        onSnapToItem={index => setstate(index)}
        autoplay={true}
        enableMomentum={false}
        autoplayInterval={8000}
        windowSize={1}
        sliderWidth={sliderWidth}
        itemWidth={sliderWidth}
      />

      <PaginationDots />
    </View>
  );
};

export default CarouselComponents;
