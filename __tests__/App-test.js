/**
 * @format
 */

import 'react-native';
import React from 'react';
import {create, act} from 'react-test-renderer';
import Button from '../src/components/Button/Button';

const tree = create(<Button />);
test('buttonPress', () => {
  const button = tree.root.findByProps({testID: 'button'}).props;

  button.onPress();
});
