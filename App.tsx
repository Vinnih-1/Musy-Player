import './src/libs/unistyles.ts';

import React from 'react';
import { Home } from './src/pages/home/index.tsx';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';
import TrackPlayer, {
  AndroidAudioContentType,
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'musyplayer' });

function App(): React.JSX.Element {
  const { theme } = useStyles();
  const capabilities = [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
  ];

  TrackPlayer.setupPlayer({
    androidAudioContentType: AndroidAudioContentType.Music,
  })
    .then(() => {
      TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
        },
        capabilities: capabilities,
        compactCapabilities: capabilities,
      });
    })
    .catch(() => {
      console.log('TrackPlayer is already initialized!');
    });

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.background}
      />
      <Home />
    </NavigationContainer>
  );
}

export default App;
