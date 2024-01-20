import './src/libs/unistyles.ts';

import React from 'react';
import { Home } from './src/pages/home/index.tsx';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MusicProvider from './src/contexts/music-player-context.tsx';
import { useStyles } from 'react-native-unistyles';
import TrackPlayer, {
  AndroidAudioContentType,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';

function App(): React.JSX.Element {
  const { theme } = useStyles();

  TrackPlayer.setupPlayer({
    androidAudioContentType: AndroidAudioContentType.Music,
  })
    .then(() => {
      TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
        },
        progressUpdateEventInterval: 1,
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
      <MusicProvider>
        <Home />
      </MusicProvider>
    </NavigationContainer>
  );
}

export default App;
