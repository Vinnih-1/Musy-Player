import React from 'react';

import { Text } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface HeaderTitleProps {
  title: string;
}

export const HeaderTitle = ({ title }: HeaderTitleProps) => {
  const { styles } = useStyles(stylesheet);

  return <Text style={styles.typography}>{title}</Text>;
};

const stylesheet = createStyleSheet(theme => ({
  typography: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
}));
