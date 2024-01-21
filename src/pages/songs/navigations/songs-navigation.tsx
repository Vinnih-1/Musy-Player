import React, { useContext, useEffect, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { MusicContext } from '../../../contexts/music-player-context';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Song } from '../../../components/song';
import { FileAudio } from 'lucide-react-native';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';

export const SongsNavigation = () => {
  const { styles } = useStyles(stylesheet);
  const musicContext = useContext(MusicContext);
  const [search, setSearch] = useState('');
  const track = useActiveTrack();

  useEffect(() => {
    if (musicContext && musicContext.search) {
      setSearch(musicContext.search.toLowerCase());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicContext?.search]);

  if (!musicContext) {
    return null;
  }

  if (musicContext.loading) {
    return <View style={styles.loading} />;
  }

  if (musicContext.search !== undefined) {
    return (
      <ScrollView style={styles.content}>
        {musicContext.musics
          .filter(music => music.title.toLowerCase().includes(search))
          .map((music, index) => (
            <Song.Root
              key={index}
              onClick={async () => {
                await TrackPlayer.skip(index);
                TrackPlayer.play();
              }}>
              <Song.Image />
              <Song.Details
                name={music.title}
                artist={music.artist}
                isPlaying={track && track.url === music.url ? true : false}
              />
            </Song.Root>
          ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.content}>
      {musicContext.musics.length ? (
        musicContext.musics.map((music, index) => (
          <Song.Root
            key={index}
            onClick={async () => {
              await TrackPlayer.skip(index);
              TrackPlayer.play();
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
