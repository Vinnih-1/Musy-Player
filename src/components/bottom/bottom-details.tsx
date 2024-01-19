import React from 'react';
import { MusicProps } from '../../services/music-scanner-service';
import { Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const BottomDetails = (music: MusicProps) => {
  const TITLE_CHARACTERS_LIMIT = 40;
  const ARTIST_CHARACTERS_LIMIT = 20;
  const { styles } = useStyles(stylesheet);

  return (
    <View>
      <Text style={styles.title}>
        {music.title.substring(0, TITLE_CHARACTERS_LIMIT)}
      </Text>
      <Text style={styles.text}>
        {music.artist.substring(0, ARTIST_CHARACTERS_LIMIT)}
      </Text>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  title: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: '300',
  },
}));
