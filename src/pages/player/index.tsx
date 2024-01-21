import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  Repeat1,
} from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  RepeatMode,
  Track,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Song } from '../../components/song';
import { storage } from '../../../App';

const TITLE_CHARACTERS_LIMIT = 60;
const ARTIST_CHARACTERS_LIMIT = 15;

export const PlayerPage = ({ navigation }: any) => {
  const { styles } = useStyles(stylesheet);
  const { position, duration } = useProgress();
  const [queue, setQueue] = useState<Track[]>();
  const sheetRef = useRef<BottomSheet>(null);
  const track = useActiveTrack();
  const state = usePlaybackState();
  const [repeatMode, setRepeatMode] = useState<RepeatMode>();

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

  useEffect(() => {
    if (track) {
      TrackPlayer.getQueue().then(trackQueue => setQueue(trackQueue));
    }
  }, [track]);

  useEffect(() => {
    if (!repeatMode) {
      setRepeatMode(RepeatMode.Off);
    } else {
      TrackPlayer.setRepeatMode(repeatMode).then(() =>
        storage.set('repeatMode', repeatMode.toString()),
      );
    }
  }, [repeatMode]);

  const getPlaybackButton = () => {
    const playingStates = ['playing', 'buffering', 'loading', 'ready'];
    if (state.state) {
      if (playingStates.includes(state.state)) {
        return <Pause strokeWidth={3} size={45} color={'#FFF'} />;
      }
      return <Play strokeWidth={3} size={45} color={'#FFF'} />;
    }
  };

  const snapPoints = useMemo(() => ['25%', '90%'], []);

  const renderQueueMusics = useCallback((music: Track, index: number) => {
    return (
      <Song.Root
        key={index}
        onClick={() => {
          TrackPlayer.skip(index);
        }}>
        <Song.Image />
        <Song.Details
          name={music.title ?? ''}
          artist={music.artist ?? ''}
          isPlaying={false}
        />
      </Song.Root>
    );
  }, []);

  const renderRepeatModeButton = () => {
    switch (repeatMode) {
      case RepeatMode.Queue:
        return <Repeat strokeWidth={2} color={'#FFF'} size={25} />;
      case RepeatMode.Track:
        return <Repeat1 strokeWidth={2} color={'#FFF'} size={25} />;
      default:
        return <Repeat strokeWidth={2} color={'#71717a'} size={25} />;
    }
  };

  const handleRepeatButton = () => {
    switch (repeatMode) {
      case RepeatMode.Queue:
        setRepeatMode(RepeatMode.Track);
        break;
      case RepeatMode.Track:
        setRepeatMode(RepeatMode.Off);
        break;
      default:
        setRepeatMode(RepeatMode.Queue);
    }
  };

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
                sheetRef.current?.snapToPosition('90%');
              }}>
              <ListMusic strokeWidth={2} color={'#FFF'} size={25} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Shuffle strokeWidth={2} color={'#FFF'} size={25} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRepeatButton}>
              {renderRepeatModeButton()}
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
          {queue &&
            queue.map((music, index) => renderQueueMusics(music, index))}
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
