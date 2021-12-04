import React from 'react';
import {View, Text, TextInput, ViewStyle} from 'react-native';
import {color} from '../../utils/color';

interface props {
  title: string;
  styleInput?: ViewStyle;
  secureTextEntry?: boolean;
  value?: String;
  setChangeText: (text: string) => void;
}
export default function InputText({
  title,
  styleInput,
  secureTextEntry = false,
  setChangeText,
  value,
}: props) {
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
      onChangeText={val => {
        setChangeText(val);
      }}
      value={value}
      placeholder={title ? title : 'Type your input'}
      secureTextEntry={secureTextEntry}
      autoCapitalize={'none'}
    />
  );
}
