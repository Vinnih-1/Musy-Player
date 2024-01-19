import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface BottomContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const BottomContainer = ({ children, style }: BottomContainerProps) => {
  const { styles } = useStyles(stylesheet);
  return <View style={[styles.container, style]}>{children}</View>;
};

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    gap: 20,
  },
}));
