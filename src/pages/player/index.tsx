import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { Image, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  ChevronDown,
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  Github,
} from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MusicContext } from '../../contexts/music-player-context';
import { Song } from '../../components/song';
import { MusicProps } from '../../services/music-scanner-service';

const TITLE_CHARACTERS_LIMIT = 60;
const ARTIST_CHARACTERS_LIMIT = 15;

export const PlayerPage = ({ navigation }: any) => {
  const { styles } = useStyles(stylesheet);
  const { position, duration } = useProgress(1000);
  const sheetRef = useRef<BottomSheet>(null);
  const musicContext = useContext(MusicContext);
  const track = useActiveTrack();
  const state = usePlaybackState();

  const getPosition = (): string => {
    const positionString = `${Math.floor(position / 60)}:${(
      Math.floor(position) % 60
    )
      .toString()
      .padStart(2, '0')}`;
    return positionString;
  };

  const getDuration = (): string => {
    const durationString = `${Math.floor(duration / 60)}:${(
      Math.floor(duration) % 60
    )
      .toString()
      .padStart(2, '0')}`;
    return durationString;
  };

  const getPlaybackButton = () => {
    const playingStates = ['playing', 'buffering', 'loading'];
    if (state.state) {
      if (playingStates.includes(state.state)) {
        return <Pause strokeWidth={3} size={45} color={'#FFF'} />;
      }
      return <Play strokeWidth={3} size={45} color={'#FFF'} />;
    }
  };

  const snapPoints = useMemo(() => ['25%', '100%'], []);

  const queueData = useMemo(() => {
    return musicContext?.queue;
  }, [musicContext?.queue]);

  const renderQueueMusics = useCallback((music: MusicProps, index: number) => {
    return (
      <Song.Root
        key={index}
        onClick={() => {
          TrackPlayer.skip(index);
        }}>
        <Song.Image />
        <Song.Details
          name={music.title}
          artist={music.artist}
          isPlaying={false}
        />
      </Song.Root>
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Music')}>
          <ChevronDown strokeWidth={3} color={'#FFF'} size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Musy Player</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Github strokeWidth={3} color={'#FFF'} size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Image
          source={require('../../assets/song-icon.png')}
          style={styles.image}
        />
        <View style={styles.content}>
          <View style={styles.body}>
            <Text style={styles.title}>
              {track &&
                track.title &&
                track.title.substring(0, TITLE_CHARACTERS_LIMIT)}
            </Text>
            <Text style={styles.text}>
              {track &&
                track.artist &&
                track.artist.substring(0, ARTIST_CHARACTERS_LIMIT)}
            </Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity>
              <Volume2 strokeWidth={2} color={'#FFF'} size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                sheetRef.current?.snapToPosition('100%');
              }}>
              <ListMusic strokeWidth={2} color={'#FFF'} size={25} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Shuffle strokeWidth={2} color={'#FFF'} size={25} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Repeat strokeWidth={2} color={'#FFF'} size={25} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Heart strokeWidth={2} color={'#FFF'} size={25} />
            </TouchableOpacity>
          </View>
          <View>
            <Slider
              style={styles.progress}
              minimumTrackTintColor="#ECECEC"
              maximumTrackTintColor="#1A1A1A"
              thumbTintColor="#ECECEC"
              minimumValue={0}
              maximumValue={Math.floor(duration)}
              value={Math.floor(position)}
              onSlidingComplete={value => {
                TrackPlayer.seekTo(Math.floor(value));
              }}
            />
            <View style={styles.timer}>
              <Text style={styles.text}>{getPosition()}</Text>
              <Text style={styles.text}>{getDuration()}</Text>
            </View>
          </View>
          <View style={styles.player}>
            <TouchableOpacity
              onPress={() => {
                TrackPlayer.skipToPrevious();
              }}>
              <SkipBack strokeWidth={3} size={45} color={'#FFF'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                TrackPlayer.skipToNext();
              }}>
              <SkipForward strokeWidth={3} size={45} color={'#FFF'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetStyleContainer}
        handleIndicatorStyle={styles.sheetIndicatorStyle}>
        <BottomSheetScrollView>
          {queueData?.map((music, index) => renderQueueMusics(music, index))}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    width: '80%',
    height: '100%',
  },
  header: {
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 400,
    height: 400,
  },
  body: {
    alignItems: 'center',
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: '300',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  progress: {
    height: 2,
    padding: 10,
    marginTop: 40,
  },
  timer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  player: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    gap: 20,
  },
  sheetStyleContainer: {
    backgroundColor: theme.colors.bottom,
  },
  sheetIndicatorStyle: {
    backgroundColor: theme.colors.white,
  },
}));
