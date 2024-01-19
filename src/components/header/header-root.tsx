import React from 'react';

import { ReactNode } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface HeaderContainerProps {
  children: ReactNode;
}

export const HeaderRoot = ({ children }: HeaderContainerProps) => {
  const { styles } = useStyles(stylesheet);

  return <View style={styles.container}>{children}</View>;
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    height: 78,
  },
}));
