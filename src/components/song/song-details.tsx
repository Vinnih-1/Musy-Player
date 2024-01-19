import React from 'react';

import { View, Text } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { AudioLines } from 'lucide-react-native';

interface SongDetailsProps {
  name: string;
  artist: string;
  isPlaying: boolean;
}

export const SongDetails = ({ name, artist, isPlaying }: SongDetailsProps) => {
  const TITLE_CHARACTERS_LIMIT = 60;
  const ARTIST_CHARACTERS_LIMIT = 15;
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {name.substring(0, TITLE_CHARACTERS_LIMIT)}
        </Text>
        <Text style={styles.text}>
          {artist.substring(0, ARTIST_CHARACTERS_LIMIT)}
        </Text>
      </View>
      {isPlaying && (
        <AudioLines
          color={'#FFF'}
          strokeWidth={2}
          size={30}
          style={styles.icon}
        />
      )}
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 10,
    maxWidth: '70%',
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: '300',
  },
  icon: {
    marginRight: 20,
  },
}));
