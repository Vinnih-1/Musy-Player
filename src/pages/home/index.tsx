import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { PermissionsAndroid, DeviceEventEmitter } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { SongPage } from '../songs';
import { PlayerPage } from '../player';
import TrackerProvider from '../../contexts/tracker-context.tsx';
import { PlayerProvider } from '../../contexts/player-context.tsx';
import { PermissionPage } from '../permission/index.tsx';

const Drawer = createDrawerNavigator();

export const Home = () => {
  const { theme } = useStyles();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  const READ_EXTERNAL_STORAGE = 'android.permission.READ_EXTERNAL_STORAGE';
  const WRITE_EXTERNAL_STORAGE = 'android.permission.WRITE_EXTERNAL_STORAGE';

  PermissionsAndroid.check(READ_EXTERNAL_STORAGE).then(read => {
    if (read) {
      PermissionsAndroid.check(WRITE_EXTERNAL_STORAGE)
        .then(write => {
          setPermissionGranted(write);

          if (write) {
            DeviceEventEmitter.emit('reload');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  });

  if (loading) {
    return null;
  }

  if (!permissionGranted) {
    return <PermissionPage setPermissionGranted={setPermissionGranted} />;
  }

  return (
    <TrackerProvider>
      <PlayerProvider>
        <Drawer.Navigator
          initialRouteName="Music"
          screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: theme.colors.primary,
            drawerActiveTintColor: theme.colors.white,
            drawerInactiveTintColor: theme.colors.white,
            drawerContentContainerStyle: {
              backgroundColor: theme.colors.background,
              height: '100%',
            },
          }}>
          <Drawer.Screen
            name="Music"
            component={SongPage}
            options={{ lazy: true }}
            initialParams={{ initialRoute: 'Songs' }}
          />

          <Drawer.Screen
            name="Player"
            options={{ lazy: true }}
            component={PlayerPage}
          />
        </Drawer.Navigator>
      </PlayerProvider>
    </TrackerProvider>
  );
};
