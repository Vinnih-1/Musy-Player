import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { MusicProps, musicScanner } from '../services/music-scanner-service';
import TrackPlayer from 'react-native-track-player';

export const MusicContext = createContext<TrackerProps | undefined>(undefined);

interface MusicPropsProvider {
  children: ReactNode;
}

interface TrackerProps {
  musics: MusicProps[];
  search?: string;
  loading: boolean;
  setSearch: (search: string) => void;
}

const MusicProvider = ({ children }: MusicPropsProvider) => {
  const setSearch = (search: string) => {
    setTracker(prevState => ({
      ...prevState,
      search: search,
    }));
  };

  const [tracker, setTracker] = useState<TrackerProps>({
    musics: [],
    loading: true,
    setSearch,
  });

  useEffect(() => {
    musicScanner()
      .then(scannedMusics => {
        if (scannedMusics) {
          setTracker(prevState => ({
            ...prevState,
            musics: scannedMusics,
            loading: false,
          }));
          TrackPlayer.setQueue(scannedMusics);
        }
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <MusicContext.Provider value={tracker}>{children}</MusicContext.Provider>
  );
};

export default MusicProvider;
