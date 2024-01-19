import React, { useContext, useState, useEffect } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { MusicContext } from '../../../contexts/music-player-context';
import { MusicProps } from '../../../services/music-scanner-service';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { Song } from '../../../components/song';
import { ArchiveX, FileAudio } from 'lucide-react-native';

export const SongsNavigation = () => {
  const { styles } = useStyles(stylesheet);
  const musicContext = useContext(MusicContext);
  const [filtered, setFiltered] = useState<MusicProps[]>([]);
  useEffect(() => {
    if (musicContext && musicContext.titleFilter !== '') {
      setFiltered(
        musicContext.musics.filter(music =>
          music.title
            .toLowerCase()
            .includes(musicContext.titleFilter.toLowerCase()),
        ),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicContext?.titleFilter]);

  if (!musicContext) {
    return null;
  }

  if (musicContext.titleFilter !== '') {
    return (
      <ScrollView style={styles.content}>
        {filtered.length ? (
          filtered.map((music, index) => (
            <Song.Root
              key={index}
              onClick={() => {
                const selected = musicContext.musics.slice(
                  index,
                  musicContext.musics.length,
                );
                musicContext.setSelected(music);
                musicContext.setQueue(selected);
              }}>
              <Song.Image />
              <Song.Details
                name={music.title}
                artist={music.artist}
                isPlaying={musicContext.selected.url.includes(music.url)}
              />
            </Song.Root>
          ))
        ) : (
          <SafeAreaView style={styles.warnScreen}>
            <ArchiveX color={'#FFF'} strokeWidth={2} size={150} />
            <Text style={styles.typrography}>
              We couldn't find any songs with this name
            </Text>
          </SafeAreaView>
        )}
      </ScrollView>
    );
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
              musicContext.setSelected(music);
              musicContext.setQueue(selected);
            }}>
            <Song.Image />
            <Song.Details
              name={music.title}
              artist={music.artist}
              isPlaying={musicContext.selected.url.includes(music.url)}
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
