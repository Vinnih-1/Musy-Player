import React from 'react';

import { ReactNode } from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface HeaderButtonProps {
  children: ReactNode;
  style?: ViewStyle;
  onClick?: (event: GestureResponderEvent) => void;
}

export const HeaderButton = ({
  children,
  style,
  onClick,
}: HeaderButtonProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={event => {
        if (onClick) {
          onClick(event);
        }
      }}>
      {children}
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(() => ({
  button: {
    padding: 10,
    alignSelf: 'center',
  },
}));
