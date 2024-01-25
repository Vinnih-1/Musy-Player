import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Header } from '../../components/header';
import {
  AlignLeft,
  Search,
  SkipBack,
  SkipForward,
  Pause,
  Play,
} from 'lucide-react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SongsNavigation } from '../songs/navigations/songs-navigation';
import { ArtistsNavigation } from '../songs/navigations/artists-navigation';
import { PlaylistNavigation } from '../songs/navigations/playlist-navigation';
import { AlbumsNavigation } from '../songs/navigations/albums-navigation';
import { FolderNavigation } from '../songs/navigations/folder-navigation';
import { Bottom } from '../../components/bottom';
import { DrawerActions } from '@react-navigation/native';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import { MusicContext } from '../../contexts/music-player-context';

const Tab = createMaterialTopTabNavigator();

export const SongPage = ({ navigation, route }: any) => {
  const { styles, theme } = useStyles(stylesheet);
  const [search, setSearch] = useState('');
  const musicContext = useContext(MusicContext);
  const searchRef = useRef<TextInput | null>(null);
  const state = usePlaybackState();
  const track = useActiveTrack();

  const getPlaybackButton = () => {
    const playingStates = ['playing', 'buffering', 'loading', 'ready'];
    if (state.state) {
      if (playingStates.includes(state.state)) {
        return <Pause strokeWidth={3} size={25} color={'#FFF'} />;
      }
      return <Play strokeWidth={3} size={25} color={'#FFF'} />;
    }
  };

  useEffect(() => {
    musicContext?.setSearch(search);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <Header.Root>
        <Header.Container style={styles.container}>
          <Header.Button
            style={styles.items}
            onClick={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <AlignLeft color={'#FFF'} strokeWidth={3} size={30} />
          </Header.Button>
          <Header.Title title="Musy Player" />
        </Header.Container>
        <TextInput
          autoFocus={false}
          ref={searchRef}
          value={search}
          style={styles.searchInput}
          onChangeText={text => {
            setSearch(text);
          }}
        />
        <Header.Button
          style={styles.items}
          onClick={() => {
            if (searchRef.current) {
              if (!searchRef.current.isFocused()) {
                searchRef.current.focus();
              } else {
                searchRef.current.blur();
              }
            }
          }}>
          <Search color={'#FFF'} strokeWidth={3} size={30} />
        </Header.Button>
      </Header.Root>
      <Tab.Navigator
        initialRouteName={route.params.initialRoute as string}
        screenOptions={{
          tabBarActiveTintColor: theme.colors.white,
          tabBarLabelStyle: { fontSize: 10 },
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            height: 40,
          },
        }}>
        <Tab.Screen
          name="Songs"
          component={SongsNavigation}
          options={{ tabBarLabel: 'Songs' }}
        />
        <Tab.Screen
          name="Artists"
          component={ArtistsNavigation}
          options={{ tabBarLabel: 'Artists' }}
        />
        <Tab.Screen
          name="Playlist"
          component={PlaylistNavigation}
          options={{ tabBarLabel: 'Playlist' }}
        />
        <Tab.Screen
          name="Album"
          component={AlbumsNavigation}
          options={{ tabBarLabel: 'Album' }}
        />
        <Tab.Screen
          name="Folder"
          component={FolderNavigation}
          options={{ tabBarLabel: 'Folder' }}
        />
      </Tab.Navigator>
      {track && track.title && track.artist && (
        <Bottom.Root
          onClick={() => {
            navigation.navigate('Player');
          }}>
          <Bottom.Container>
            <Bottom.Image />
            <Bottom.Details
              artist={track.artist}
              title={track.title}
              url={track.url}
            />
          </Bottom.Container>
          <Bottom.Container style={styles.bottomButtonContainer}>
            <Bottom.Button
              onClick={() => {
                TrackPlayer.skipToPrevious();
              }}>
              <SkipBack strokeWidth={5} size={25} color={'#FFF'} />
            </Bottom.Button>
            <Bottom.Button
              onClick={() => {
                switch (state.state) {
                  case 'playing':
                    TrackPlayer.pause();
                    break;
                  case 'paused':
                    TrackPlayer.play();
                    break;
                }
              }}>
              {getPlaybackButton()}
            </Bottom.Button>
            <Bottom.Button
              onClick={() => {
                TrackPlayer.skipToNext();
              }}>
              <SkipForward strokeWidth={5} size={25} color={'#FFF'} />
            </Bottom.Button>
          </Bottom.Container>
        </Bottom.Root>
      )}
    </>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.colors.background,
  },
  searchInput: {
    maxWidth: 100,
    overflow: 'hidden',
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
  },
  permissionScreen: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 20,
  },
  warnScreen: {
    alignItems: 'center',
    marginTop: 70,
    gap: 80,
  },
  typrography: {
    color: theme.colors.white,
  },
  items: {
    marginHorizontal: 20,
  },
  bottomButtonContainer: {
    maxWidth: '30%',
    justifyContent: 'space-around',
  },
}));
