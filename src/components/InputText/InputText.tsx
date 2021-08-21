import React from 'react';
import {View, Text, TextInput, ViewStyle} from 'react-native';
import {color} from '../../utils/color';

interface props {
  title: string;
  styleInput: ViewStyle;
}
export default function InputText({title, styleInput}: props) {
  return (
    <TextInput
      style={[
        {
          borderWidth: 1,
          borderColor: color.borderColor,
          borderRadius: 10,
          height: 48,
          paddingHorizontal: 16,
        },
        styleInput,
      ]}
      placeholder={title ? title : 'Type your input'}
    />
  );
}
