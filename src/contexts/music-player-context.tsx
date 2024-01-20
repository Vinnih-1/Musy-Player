import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { MusicProps, musicScanner } from '../services/music-scanner-service';
import TrackPlayer, { Event } from 'react-native-track-player';

export const MusicContext = createContext<TrackerProps | undefined>(undefined);

interface MusicPropsProvider {
  children: ReactNode;
}

interface TrackerProps {
  musics: MusicProps[];
  queue: MusicProps[];
  loading: boolean;

  setQueue: (queue: MusicProps[]) => void;
}

const MusicProvider = ({ children }: MusicPropsProvider) => {
  const setQueue = useCallback((queue: MusicProps[]) => {
    setTracker(prevState => ({
      ...prevState,
      queue: queue,
    }));
  }, []);

  const [tracker, setTracker] = useState<TrackerProps>({
    musics: [],
    queue: [],
    setQueue,
    loading: true,
  });

  useEffect(() => {
    musicScanner()
      .then(scannedMusics => {
        if (scannedMusics) {
          setTracker(prevState => ({
            ...prevState,
            musics: scannedMusics,
          }));
        }
        setTracker(prevState => ({
          ...prevState,
          loading: false,
        }));
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    if (tracker.queue.length) {
      TrackPlayer.setQueue(tracker.queue).then(() => TrackPlayer.play());
    }

    const queueEvent = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      () => {
        setTracker(prevState => ({
          ...prevState,
          queue: [],
          selected: undefined,
        }));
      },
    );

    const stateEvent = TrackPlayer.addEventListener(
      Event.PlaybackState,
      event => {
        setTracker(prevState => ({
          ...prevState,
          state: event.state.toLowerCase(),
        }));
      },
    );

    const trackChange = TrackPlayer.addEventListener(
      Event.PlaybackTrackChanged,
      async event => {
        const trackIndex = event.nextTrack;
        const track = await TrackPlayer.getTrack(trackIndex);

        if (track) {
          setTracker(prevState => ({
            ...prevState,
            selected: {
              artist: track.artist ?? '',
              title: track.title ?? '',
              url: track.url,
              playing: true,
              duration: 0,
              position: 0,
            },
          }));
        }
      },
    );

    return () => {
      queueEvent.remove();
      stateEvent.remove();
      trackChange.remove();
    };
  }, [tracker.queue]);

  return (
    <MusicContext.Provider value={tracker}>{children}</MusicContext.Provider>
  );
};

export default MusicProvider;
