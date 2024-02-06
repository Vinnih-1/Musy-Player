import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
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
  useProgress,
} from 'react-native-track-player';
import { TrackerContext } from '../../contexts/tracker-context';
import * as Progress from 'react-native-progress';

const Tab = createMaterialTopTabNavigator();

export const SongPage = ({ navigation, route }: any) => {
  const { styles, theme } = useStyles(stylesheet);

  const musicContext = useContext(TrackerContext);
  const searchRef = useRef<TextInput | null>(null);
  const [search, setSearch] = useState('');

  const { position, duration } = useProgress();
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
          <View style={styles.bottomButtonContent}>
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
            <Progress.Bar
              progress={position && duration ? position / duration : 0}
              height={4}
              borderWidth={0}
              width={null}
              color={theme.colors.white}
            />
          </View>
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
  typrography: {
    color: theme.colors.white,
  },
  bottomButtonContainer: {
    justifyContent: 'space-around',
    maxHeight: 32,
  },
  bottomButtonContent: {
    maxWidth: '30%',
    flexDirection: 'column',
    gap: 12,
  },
}));
