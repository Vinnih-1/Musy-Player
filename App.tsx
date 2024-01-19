import './src/libs/unistyles.ts';

import React from 'react';
import { Home } from './src/pages/home/index.tsx';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MusicProvider from './src/contexts/music-player-context.tsx';
import { useStyles } from 'react-native-unistyles';

function App(): React.JSX.Element {
  const { theme } = useStyles();

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
