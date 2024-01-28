import React, { ReactNode, createContext } from 'react';
import TrackPlayer, { RepeatMode, Track } from 'react-native-track-player';
import { storage } from '../../App';
import { ToastAndroid } from 'react-native';

interface PlayerProviderProps {
  children: ReactNode;
}

interface PlayerProps {
  isMuted: () => boolean;

  isShuffled: () => boolean;

  repeatMode: () => RepeatMode;

  updateMuted: () => void;

  updateShuffle: () => void;

  updateRepeatMode: () => void;
}

export const PlayerContext = createContext<PlayerProps | undefined>(undefined);

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const getRepeatModeByIndex = (index: number): RepeatMode => {
    switch (index) {
      case 0:
        return RepeatMode.Off;
      case 1:
        return RepeatMode.Track;
      case 2:
        return RepeatMode.Queue;
      default:
        return RepeatMode.Off;
    }
  };

  const toast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const isMuted = () => {
    return storage.getBoolean('isMuted') ?? false;
  };

  const isShuffled = () => {
    return storage.getBoolean('isShuffled') ?? false;
  };

  const repeatMode = () => {
    return getRepeatModeByIndex(storage.getNumber('repeatMode') ?? 0);
  };

  const updateMuted = () => {
    if (isMuted()) {
      TrackPlayer.setVolume(0);
    } else {
      TrackPlayer.setVolume(1);
    }
    storage.set('isMuted', !isMuted());
  };

  const updateShuffle = async () => {
    const activeTrack = await TrackPlayer.getActiveTrack();

    let defaultQueue = (
      JSON.parse(
        storage.getString('shuffle.defaultQueue') ?? '',
      ) as unknown as Track[]
    ).filter(track => track.url !== activeTrack?.url);

    await TrackPlayer.getQueue().then(async queue => {
      const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();

      const tracks = queue
        .map((_, index) => {
          return index;
        })
        .filter(index => index !== activeTrackIndex);

      TrackPlayer.remove(tracks);
    });

    if (!isShuffled()) {
      const shuffled = defaultQueue.sort(() => Math.random() - 0.5);
      await TrackPlayer.add(shuffled);
      toast('Modo aleatório ativado.');
    } else {
      await TrackPlayer.add(defaultQueue);
      toast('Modo aleatório desativado.');
    }

    storage.set('isShuffled', !isShuffled());
  };

  const updateRepeatMode = () => {
    TrackPlayer.setRepeatMode(getRepeatModeByIndex(repeatMode().valueOf() + 1));

    storage.set('repeatMode', repeatMode().valueOf());
  };

  return (
    <PlayerContext.Provider
      value={{
        isMuted,
        isShuffled,
        repeatMode,
        updateMuted,
        updateShuffle,
        updateRepeatMode,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};
