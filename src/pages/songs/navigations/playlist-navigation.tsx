import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const PlaylistNavigation = () => {
  const { styles } = useStyles(stylesheet);

  return <View style={styles.content} />;
};

const stylesheet = createStyleSheet(theme => ({
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
