import React, {useState} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {IMGEXAMPLE} from '../../assets';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import ItemCard from '../Card/ItemCard';
const sliderWidth = Dimensions.get('window').width;

const CarouselComponentsCard = ({data}) => {
  const [state, setstate] = useState(0);
  const temp = data.slice(0, 3);


  const PaginationDots = ({index}) => {
    return (
      <Pagination
        dotsLength={index}
        activeDotIndex={state}
        containerStyle={{
          position: 'absolute',
          right: 0,
          left: 0,
          bottom: 0,
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
        height: 160,
        paddingHorizontal: 40,
      }}>
      {temp.length > 0 && (
        <>
          <Carousel
            data={temp}
            renderItem={({item, index}) => (
              <ItemCard item={item} index={index} />
            )}
            onSnapToItem={index => setstate(index)}
            autoplay={true}
            enableMomentum={false}
            autoplayInterval={8000}
            windowSize={1}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
          />
          <PaginationDots index={temp.length} />
        </>
      )}
    </View>
  );
};

export default CarouselComponentsCard;
