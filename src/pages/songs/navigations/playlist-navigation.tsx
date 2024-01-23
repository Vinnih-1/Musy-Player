import React, { useContext, useState } from 'react';
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
import { MusicContext } from '../../../contexts/music-player-context';
import { Playlist } from '../../../components/playlist';
import { ListVideo, ListPlus, X } from 'lucide-react-native';

export const PlaylistNavigation = () => {
  const { styles, theme } = useStyles(stylesheet);
  const musicContext = useContext(MusicContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

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
            <Playlist.Root key={key}>
              <Playlist.Content name={value.name} musics={value.musics} />
              <ListVideo
                strokeWidth={3}
                color={'#FFF'}
                size={30}
                style={styles.icon}
              />
            </Playlist.Root>
          ))}
      </ScrollView>
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
}));
