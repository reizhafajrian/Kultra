import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {Text} from 'react-native';
import {color} from '../../utils/color';

interface props {
  title?: string;
  styleButton?: ViewStyle;
  styleText?: ViewStyle;
  onPress: () => void;
}

export default function Button({
  title,
  styleButton,
  styleText,
  onPress,
}: props) {
  return (
    <TouchableOpacity
      testID="button"
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
      ]}
      onPress={() => onPress()}>
      <Text
        testID="button-text"
        style={[styleText, {color: 'white', fontSize: 16, fontWeight: '500'}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
