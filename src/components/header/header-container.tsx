import React from 'react';

import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';

interface HeaderContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const HeaderContainer = ({ children, style }: HeaderContainerProps) => {
  return <View style={style}>{children}</View>;
};
