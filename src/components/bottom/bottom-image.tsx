import React from 'react';
import { Image } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const BottomImage = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <Image
      style={styles.image}
      source={require('../../assets/song-icon.png')}
    />
  );
};

const stylesheet = createStyleSheet(theme => ({
  image: {
    width: 70,
    height: 70,
    backgroundColor: theme.colors.secondary,
    borderRadius: 20,
  },
}));
