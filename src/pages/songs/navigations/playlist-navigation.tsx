import React, { useContext, useMemo, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  MusicContext,
  PlaylistProps,
} from '../../../contexts/music-player-context';
import { Playlist } from '../../../components/playlist';
import { ListVideo, ListPlus, X, Trash2 } from 'lucide-react-native';
import TrackPlayer from 'react-native-track-player';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Song } from '../../../components/song';
import { storage } from '../../../../App';

export const PlaylistNavigation = () => {
  const { styles, theme } = useStyles(stylesheet);
  const musicContext = useContext(MusicContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [deletePlaylist, setDeletePlaylist] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectPlaylist, setSelectPlaylist] = useState<PlaylistProps>();
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['1%', '100%'], []);

  const toast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };

  return (
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.playlistButton}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}>
        <ListPlus strokeWidth={3} color={'#FFF'} size={30} />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalRoot}>
          <View style={styles.modalBody}>
            <X
              strokeWidth={3}
              color={theme.colors.primary}
              size={30}
              style={styles.closeModalButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            />
            <Text style={styles.modalTitle}>
              Dê um nome para a sua Playlist
            </Text>
            <TextInput
              value={playlistName}
              onChangeText={text => {
                setPlaylistName(text);
              }}
              style={styles.modalInput}
            />
            <TouchableOpacity
              style={styles.savePlaylistButton}
              activeOpacity={0.7}
              onPress={() => {
                musicContext
                  ?.createPlaylist(playlistName)
                  .then(playlist => {
                    toast(`Playlist ${playlist.name} criada.`);
                  })
                  .catch(playlist => {
                    toast(`${playlist} já existe.`);
                  });
                setModalVisible(false);
                setPlaylistName('');
              }}>
              <Text style={styles.text}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView>
        {musicContext?.playlists &&
          Array.from(musicContext.playlists).map(([key, value]) => (
            <Playlist.Root
              key={key}
              onPress={() => {
                setDeletePlaylist(prevState => ({
                  ...prevState,
                  [key]: !prevState[key],
                }));
              }}
              onClick={() => {
                Object.keys(deletePlaylist).forEach(() => {
                  setDeletePlaylist({ [key]: false });
                });
                setSelectPlaylist(value);
                sheetRef.current?.snapToIndex(1);
              }}>
              <Playlist.Content name={value.name} musics={value.musics} />
              {deletePlaylist[key] ? (
                <TouchableOpacity
                  style={styles.playlistCardButton}
                  onPress={() => {
                    musicContext
                      .deletePlaylist(value.name)
                      .then(() => {
                        toast('Você excluir esta playlist.');
                      })
                      .catch(() => {
                        toast('Você não pode excluir esta playlist.');
                      });
                  }}>
                  <Trash2
                    strokeWidth={3}
                    color={theme.colors.danger}
                    size={30}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.playlistCardButton}
                  onPress={() => {
                    if (value.musics.length) {
                      storage.set(
                        'shuffle.defaultQueue',
                        JSON.stringify(value.musics),
                      );

                      TrackPlayer.setQueue(value.musics).then(() =>
                        TrackPlayer.play().then(() =>
                          toast(`Tocando a playlist ${value.name}.`),
                        ),
                      );
                    } else {
                      toast('Esta playlist está vazia.');
                    }
                  }}>
                  <ListVideo
                    strokeWidth={3}
                    color={'#FFF'}
                    size={30}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}
            </Playlist.Root>
          ))}
      </ScrollView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetStyleContainer}
        handleIndicatorStyle={styles.sheetIndicatorStyle}
        bottomInset={-120}
        index={-1}>
        <BottomSheetScrollView>
          {selectPlaylist &&
            selectPlaylist.musics.map((music, index) => (
              <Song.Root
                key={index}
                onClick={() => {
                  TrackPlayer.setQueue(selectPlaylist.musics).then(() =>
                    TrackPlayer.skip(index).then(() => TrackPlayer.play()),
                  );
                }}>
                <Song.Image />
                <Song.Details
                  name={music.title ?? ''}
                  artist={music.artist ?? ''}
                  isPlaying={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    musicContext?.removeMusicFromPlaylist(
                      selectPlaylist.name,
                      music,
                    );
                    toast(`${music.title} removido de ${selectPlaylist.name}`);
                  }}
                  activeOpacity={0.5}>
                  <Trash2
                    strokeWidth={3}
                    color={theme.colors.danger}
                    size={30}
                  />
                </TouchableOpacity>
              </Song.Root>
            ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  content: {
    flex: 1,
    position: 'relative',
    backgroundColor: theme.colors.background,
  },
  playlistButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
    borderRadius: 20,
  },
  closeModalButton: {
    padding: 16,
    alignSelf: 'flex-end',
  },
  savePlaylistButton: {
    padding: 20,
    width: '50%',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    marginVertical: 40,
  },
  playlistCardButton: {
    padding: 10,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 120,
  },
  modalBody: {
    backgroundColor: theme.colors.white,
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: 20,
    textAlign: 'center',
  },
  icon: {
    marginRight: 16,
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
  },
  sheetStyleContainer: {
    backgroundColor: theme.colors.bottom,
  },
  sheetIndicatorStyle: {
    backgroundColor: theme.colors.white,
  },
}));
