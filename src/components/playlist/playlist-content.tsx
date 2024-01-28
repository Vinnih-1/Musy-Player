import React from 'react';
import { Image, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { PlaylistProps } from '../../contexts/tracker-context';

export const PlaylistContent = (playlist: PlaylistProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.content}>
      <Image
        source={require('../../assets/song-icon.png')}
        style={styles.image}
      />
      <View>
        <Text style={styles.title}>{playlist.name}</Text>
        <Text style={styles.text}>{playlist.musics.length} músicas</Text>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  image: {
    width: 70,
    height: 70,
    backgroundColor: theme.colors.secondary,
    borderRadius: 20,
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: '300',
  },
}));
