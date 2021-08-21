import React from 'react';
import {ViewStyle} from 'react-native';
import {View, Text, Pressable} from 'react-native';
import {color} from '../../utils/color';

interface props {
  title: string;
  styleButton: ViewStyle;
  styleText: ViewStyle;
}

export default function Button({title, styleButton, styleText}: props) {
  return (
    <Pressable
      style={[
        styleButton,
        {
          width: '100%',
          height: 48,
          borderRadius: 10,
          backgroundColor: color.buttonPrimary,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <Text
        style={[styleText, {color: 'white', fontSize: 16, fontWeight: '500'}]}>
        {title}
      </Text>
    </Pressable>
  );
}
