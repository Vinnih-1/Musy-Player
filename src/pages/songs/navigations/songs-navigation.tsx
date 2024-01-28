import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TrackerContext } from '../../../contexts/tracker-context';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { Song } from '../../../components/song';
import { FileAudio, ListPlus, Music2, Play, Trash2 } from 'lucide-react-native';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import { MusicProps } from '../../../services/music-scanner-service';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Playlist } from '../../../components/playlist';
import { storage } from '../../../../App';
import Animated, { FadeInLeft } from 'react-native-reanimated';

export const SongsNavigation = () => {
  const { styles, theme } = useStyles(stylesheet);

  const [selectMusic, setSelectMusic] = useState<MusicProps>();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const musicContext = useContext(TrackerContext);

  const track = useActiveTrack();

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '100%'], []);

  const filteredMusics =
    search === ''
      ? musicContext?.musics
      : musicContext?.musics.filter(music =>
          music.title.toLowerCase().includes(search),
        );

  const toast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };

  const onRefresh = useCallback(() => {
    musicContext?.loadMusics().then(() => setRefreshing(false));
  }, [musicContext]);

  useEffect(() => {
    setSearch(
      musicContext && musicContext.search !== undefined
        ? musicContext.search.toLowerCase()
        : '',
    );
  }, [musicContext, musicContext?.search]);

  if (!musicContext) {
    return null;
  }

  if (musicContext.loading) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.content}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredMusics ? (
          filteredMusics.map((music, index) => (
            <Animated.View
              entering={FadeInLeft.springify().delay(200)}
              style={styles.hover}
              key={index}>
              <Song.Root
                onClick={async () => {
                  if (selectMusic) {
                    setSelectMusic(undefined);
                    return;
                  }
                  const selected = musicContext.musics.findIndex(
                    select => select.url === music.url,
                  );

                  if (selected === -1) {
                    return;
                  }

                  await TrackPlayer.setQueue(musicContext.musics).then(
                    async () => {
                      const queue = await TrackPlayer.getQueue();
                      storage.set(
                        'shuffle.defaultQueue',
                        JSON.stringify(queue),
                      );
                    },
                  );

                  await TrackPlayer.skip(selected);
                  await TrackPlayer.play();
                }}
                onPress={() => {
                  setSelectMusic(music);
                }}>
                <Song.Image />
                <Song.Details
                  name={music.title}
                  artist={music.artist}
                  isPlaying={track && track.url === music.url ? true : false}
                />
              </Song.Root>
              {selectMusic?.title === music.title && (
                <View style={styles.pressContent}>
                  <Music2 strokeWidth={3} color={'#FFF'} size={40} />
                  <Text style={styles.pressContentText}>{music.title}</Text>
                  <View style={styles.musicButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        TrackPlayer.setQueue([music]).then(() =>
                          TrackPlayer.play(),
                        );
                      }}
                      activeOpacity={0.5}>
                      <Play
                        strokeWidth={3}
                        color={theme.colors.green}
                        size={30}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        sheetRef.current?.snapToIndex(1);
                      }}
                      activeOpacity={0.5}>
                      <ListPlus
                        strokeWidth={3}
                        color={theme.colors.primary}
                        size={30}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Excluir música?',
                          'Ao confirmar, você removerá esta música do seu dispositivo.',
                          [
                            {
                              text: 'Confirmar',
                              style: 'destructive',
                            },
                            {
                              text: 'Cancelar',
                              style: 'cancel',
                            },
                          ],
                        );
                      }}
                      activeOpacity={0.5}>
                      <Trash2
                        strokeWidth={3}
                        color={theme.colors.danger}
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Animated.View>
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
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetStyleContainer}
        handleIndicatorStyle={styles.sheetIndicatorStyle}
        index={-1}>
        <BottomSheetScrollView>
          {Array.from(musicContext.playlists).map(([key, value]) => (
            <Playlist.Root
              key={key}
              onClick={() => {
                if (selectMusic) {
                  musicContext.addMusicToPlaylist(value.name, selectMusic);
                  toast(
                    `A música ${selectMusic.title} foi adicionada a playlist ${value.name}`,
                  );
                  sheetRef.current?.close();
                  setSelectMusic(undefined);
                }
              }}>
              <Playlist.Content name={value.name} musics={value.musics} />
            </Playlist.Root>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  content: {
    backgroundColor: theme.colors.background,
    width: '100%',
    height: '100%',
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
  hover: {
    position: 'relative',
  },
  pressContent: {
    position: 'absolute',
    flex: 1,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.bottom,
  },
  pressContentText: {
    maxWidth: '40%',
    overflow: 'hidden',
    color: theme.colors.white,
    textAlign: 'center',
  },
  musicButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  sheetStyleContainer: {
    backgroundColor: theme.colors.bottom,
  },
  sheetIndicatorStyle: {
    backgroundColor: theme.colors.white,
  },
}));
