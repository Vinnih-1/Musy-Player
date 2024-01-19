import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { MusicProps, musicScanner } from '../services/music-scanner-service';
import TrackPlayer, {
  AndroidAudioContentType,
  AppKilledPlaybackBehavior,
  Event,
} from 'react-native-track-player';

export const MusicContext = createContext<TrackerProps | undefined>(undefined);

interface MusicPropsProvider {
  children: ReactNode;
}

interface TrackerProps {
  musics: MusicProps[];
  queue: MusicProps[];
  selected: {
    artist: string;
    title: string;
    url: string;
    position: number;
    duration: number;
  };
  loading: boolean;
  playing: boolean;
  titleFilter: string;

  setMusics: (musics: MusicProps[]) => void;
  setQueue: (queue: MusicProps[]) => void;
  setSelected: (music: MusicProps) => void;

  setFilter: (filter: string) => void;

  previous: () => void;
  next: () => void;
}

const MusicProvider = ({ children }: MusicPropsProvider) => {
  const setMusics = (musics: MusicProps[]) => {
    setTracker(prevState => ({
      ...prevState,
      musics: musics,
    }));
  };

  const setQueue = (queue: MusicProps[]) => {
    setTracker(prevState => ({
      ...prevState,
      queue: queue,
    }));
  };

  const setSelected = (music: MusicProps) => {
    setTracker(prevState => ({
      ...prevState,
      selected: {
        artist: music.artist,
        title: music.title,
        url: music.url,
        duration: 0,
        position: 0,
      },
    }));
  };

  const setLoading = (loading: boolean) => {
    setTracker(prevState => ({
      ...prevState,
      loading: loading,
    }));
  };

  const setFilter = (filter: string) => {
    setTracker(prevState => ({
      ...prevState,
      titleFilter: filter,
    }));
  };

  const previous = () => {
    TrackPlayer.skipToPrevious();
  };

  const next = () => {
    TrackPlayer.skipToNext();
  };

  const [tracker, setTracker] = useState<TrackerProps>({
    musics: [],
    queue: [],
    selected: {
      title: '',
      artist: '',
      url: '',
      position: 0,
      duration: 0,
    },
    loading: true,
    playing: false,
    titleFilter: '',

    setMusics,
    setQueue,
    setSelected,

    setFilter,

    previous,
    next,
  });

  useEffect(() => {
    musicScanner()
      .then(scannedMusics => {
        if (scannedMusics) {
          setMusics(scannedMusics);
          TrackPlayer.setupPlayer({
            androidAudioContentType: AndroidAudioContentType.Music,
          })
            .then(() => {
              TrackPlayer.updateOptions({
                android: {
                  appKilledPlaybackBehavior:
                    AppKilledPlaybackBehavior.ContinuePlayback,
                },
                progressUpdateEventInterval: 0.7,
              });

              TrackPlayer.addEventListener(Event.PlaybackState, event => {
                setTracker(prevState => ({
                  ...prevState,
                  playing: event.state === 'playing' ? true : false,
                }));
              });
            })
            .catch(() => {
              console.log('TrackPlayer is already initialized!');
            });
        }
        setLoading(false);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    if (tracker.queue.length) {
      TrackPlayer.setQueue(tracker.queue).then(() => TrackPlayer.play());
    }

    const progressEvent = TrackPlayer.addEventListener(
      Event.PlaybackProgressUpdated,
      event => {
        const selected = tracker.queue[event.track];
        if (selected) {
          setTracker(prevState => ({
            ...prevState,
            selected: {
              artist: selected.artist,
              title: selected.title,
              url: selected.url,
              duration: event.duration,
              position: event.position,
            },
          }));
        }
      },
    );

    const queueEvent = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      () => {
        tracker.setQueue([]);
        tracker.setSelected({ artist: '', title: '', url: '' });
      },
    );

    return () => {
      progressEvent.remove();
      queueEvent.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracker.queue]);

  return (
    <MusicContext.Provider value={tracker}>{children}</MusicContext.Provider>
  );
};

export default MusicProvider;
