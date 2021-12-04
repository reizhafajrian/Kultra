import {useNavigation} from '@react-navigation/core';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CarouselComponents from '../../components/Carousel/CarouselComponents';
import CarouselComponentsCard from '../../components/Carousel/CarouselComponentsCard';
import Loading from '../../components/Loading/Loading';
import {AuthContextProvider} from '../../routes/Context';
import {color} from '../../utils/color';
import {getArticle, nearbyResto} from '../../utils/firebase';

const Header = () => {
  const fade = useRef(new Animated.Value(0)).current;
  const fadeSecond = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [data, setdata] = useState<any>([]);
  const [article, setarticle] = useState<any>({data: [], temp: []});
  const context: any = useContext(AuthContextProvider);
  const [loading, setloading] = useState(true);

  const nearby = async () => {
    setloading(true);
    const res = await nearbyResto(context.getLocation());
    setdata(res);
    setloading(false);
  };
  const fadeAnimated = () => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeSecond, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getArticles = async () => {
    setloading(true);
    const res = await getArticle();
    setarticle({
      temp: res.slice(0, 3),
      data: res,
    });
    setloading(false);
  };
  useEffect(() => {
    nearby();
    getArticles();
    return () => {
      setdata([]);
    };
  }, [context.getLocation()]);
  useEffect(() => {
    fadeAnimated();
    return () => {
      fade.setValue(1);
      fadeSecond.setValue(1);
    };
  }, [fade, fadeSecond]);
  return (
    <>
      <View height={12} />
      <Animated.View style={style.animated(fade)}>
        <View style={style.containerArticle}>
          <Text style={style.textArticle}>Kumpulan artikel untukmu</Text>
          <Text
            onPress={() => {
              navigation.navigate('AllItem', {
                title: 'Kumpulan Artikel',
                data: article.data,
              });
            }}
            style={style.seeAll}>
            Lihat semua
          </Text>
        </View>
        <View height={12} />
        <CarouselComponents data={article.temp} />
      </Animated.View>
      <Animated.View>
        <View style={style.containerResto}>
          <Text style={style.textArticle}>Rekomendasi restoran terbaik</Text>
          <Text
            onPress={() => {
              navigation.navigate('AllItem', {
                title: 'Rekomendasi restoran terbaik',
                data: data,
              });
            }}
            style={style.seeAll}>
            Lihat semua
          </Text>
        </View>
        <View height={12} />
        {loading ? (
          <View style={{justifyContent: 'center', flex: 1, height: 120}}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : (
          <CarouselComponentsCard data={data} />
        )}

        <View style={style.containerArticle}>
          <Text style={style.textArticle}>Informasi Kuliner Nusantara</Text>
        </View>
      </Animated.View>
    </>
  );
};
const style = StyleSheet.create({
  animated: (fade: Animated.Value) => ({height: 270, opacity: fade}),
  containerArticle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textArticle: {
    fontSize: 14,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '400',
    color: color.colorPrimary,
  },
  containerResto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export const HeaderMemo = React.memo(Header);
