import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { MusicProps, musicScanner } from '../services/music-scanner-service';
import TrackPlayer from 'react-native-track-player';
import { storage } from '../../App';

export const MusicContext = createContext<TrackerProps | undefined>(undefined);

interface MusicPropsProvider {
  children: ReactNode;
}

export interface Playlist {
  name: string;
  musics: MusicProps[];
}

interface TrackerProps {
  musics: MusicProps[];
  playlists: Map<string, Playlist>;
  search?: string;
  loading: boolean;
  setSearch: (search: string) => void;
  createPlaylist: (playlistName: string) => Promise<Playlist>;
  deletePlaylist: (playlistName: string) => Promise<void>;
  addMusicToPlaylist: (playlistName: string, music: MusicProps) => void;
  removeMusicFromPlaylist: (playlistName: string, music: MusicProps) => void;
  getLovedPlaylist: () => Playlist | undefined;
}

const MusicProvider = ({ children }: MusicPropsProvider) => {
  const setSearch = (search: string) => {
    setTracker(prevState => ({
      ...prevState,
      search: search,
    }));
  };

  const createPlaylist = (playlistName: string): Promise<Playlist> => {
    const newPlayList: Playlist = { name: playlistName, musics: [] };
    return new Promise<Playlist>(resolve => {
      if (!tracker.playlists.has(newPlayList.name)) {
        tracker.playlists.set(playlistName, newPlayList);
        setTracker(prevState => ({
          ...prevState,
          playlists: tracker.playlists,
        }));
        storage.set(
          `playlists.${playlistName}`,
          JSON.stringify(tracker.playlists.get(playlistName)),
        );
        resolve(newPlayList);
      } else {
        throw new Error(newPlayList.name);
      }
    });
  };

  const deletePlaylist = (playlistName: string): Promise<void> => {
    return new Promise<void>(resolve => {
      if (playlistName !== getLovedPlaylist()?.name) {
        tracker.playlists.delete(playlistName);
        setTracker(prevState => ({
          ...prevState,
          playlists: tracker.playlists,
        }));
        storage.delete(`playlists.${playlistName}`);
        resolve();
      } else {
        throw new Error();
      }
    });
  };

  const addMusicToPlaylist = (playlistName: string, music: MusicProps) => {
    const playlist = tracker.playlists.get(playlistName);
    if (playlist) {
      playlist.musics.push(music);
      tracker.playlists.set(playlist.name, playlist);
      setTracker(prevState => ({
        ...prevState,
        playlists: tracker.playlists,
      }));
      storage.set(
        `playlists.${playlist.name}`,
        JSON.stringify(tracker.playlists.get(playlist.name)),
      );
      console.log(
        `Playlist ${storage.getString(`playlists.${playlist.name}`)} salva`,
      );
    }
  };

  const removeMusicFromPlaylist = (playlistName: string, music: MusicProps) => {
    const playlist = tracker.playlists.get(playlistName);
    if (playlist) {
      const index = playlist.musics.findIndex(p => p.url !== music.url);
      playlist.musics.splice(index, 1);
      tracker.playlists.set(playlist.name, playlist);
      setTracker(prevState => ({
        ...prevState,
        playlists: tracker.playlists,
      }));
      storage.set(
        `playlists.${playlist.name}`,
        JSON.stringify(tracker.playlists.get(playlist.name)),
      );
      console.log(
        `Playlist ${storage.getString(`playlists.${playlist.name}`)} salva`,
      );
    }
  };

  const getLovedPlaylist = () => {
    return tracker.playlists.get('loved');
  };

  const [tracker, setTracker] = useState<TrackerProps>({
    musics: [],
    playlists: new Map(),
    loading: true,
    setSearch,
    createPlaylist,
    deletePlaylist,
    addMusicToPlaylist,
    removeMusicFromPlaylist,
    getLovedPlaylist,
  });

  const loadMusics = useCallback(async (): Promise<MusicProps[]> => {
    const scannedMusics = await musicScanner();
    if (scannedMusics) {
      setTracker(prevState => ({
        ...prevState,
        musics: scannedMusics,
        loading: false,
      }));
      return scannedMusics;
    } else {
      return [];
    }
  }, []);

  const loadPlaylists = () => {
    const lovedMusics: Playlist = {
      name: 'loved',
      musics: [],
    };
    if (storage.contains(`playlists.${lovedMusics.name}`)) {
      storage
        .getAllKeys()
        .filter(key => key.includes('playlists'))
        .forEach(p => {
          const playlist = JSON.parse(storage.getString(p) ?? '') as Playlist;
          if (playlist) {
            tracker.playlists.set(playlist.name, playlist);
          }
        });
      setTracker(prevState => ({
        ...prevState,
        playlists: tracker.playlists,
      }));
    } else {
      createPlaylist(lovedMusics.name);
    }
  };

  useEffect(() => {
    loadMusics().then(musics =>
      TrackPlayer.getQueue().then(queue => {
        if (!queue.length && musics.length) {
          TrackPlayer.setQueue(musics);
        }
      }),
    );
    loadPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MusicContext.Provider value={tracker}>{children}</MusicContext.Provider>
  );
};

export default MusicProvider;
