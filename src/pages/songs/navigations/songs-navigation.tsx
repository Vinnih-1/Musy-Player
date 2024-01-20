import React, { useContext } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { MusicContext } from '../../../contexts/music-player-context';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Song } from '../../../components/song';
import { FileAudio } from 'lucide-react-native';
import { useActiveTrack } from 'react-native-track-player';

export const SongsNavigation = () => {
  const { styles } = useStyles(stylesheet);
  const musicContext = useContext(MusicContext);
  const track = useActiveTrack();

  if (!musicContext) {
    return null;
  }

  if (musicContext.loading) {
    return <View style={styles.loading} />;
  }

  return (
    <ScrollView style={styles.content}>
      {musicContext.musics.length ? (
        musicContext.musics.map((music, index) => (
          <Song.Root
            key={index}
            onClick={() => {
              const selected = musicContext.musics.slice(
                index,
                musicContext.musics.length,
              );
              musicContext.setQueue(selected);
            }}>
            <Song.Image />
            <Song.Details
              name={music.title}
              artist={music.artist}
              isPlaying={track && track.url === music.url ? true : false}
            />
          </Song.Root>
        ))
      ) : (
        <SafeAreaView style={styles.warnScreen}>
          <FileAudio color={'#FFF'} strokeWidth={2} size={150} />
          <Text style={styles.typrography}>
            You don't have any songs yet...
          </Text>
        </SafeAreaView>
      )}
    </ScrollView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  content: {
    backgroundColor: theme.colors.background,
  },
  loading: {
    backgroundColor: theme.colors.background,
    flex: 1,
    width: '100%',
  },
  searchInput: {
    maxWidth: 100,
    overflow: 'hidden',
  },
  warnScreen: {
    alignItems: 'center',
    marginTop: 70,
    gap: 80,
  },
  typrography: {
    color: theme.colors.white,
  },
}));
