import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState } from 'react';
import {
  PermissionsAndroid,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SongPage } from '../songs';
import { PlayerPage } from '../player';

const Drawer = createDrawerNavigator();

export const Home = () => {
  const { styles, theme } = useStyles(stylesheet);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  const READ_EXTERNAL_STORAGE = 'android.permission.READ_EXTERNAL_STORAGE';

  PermissionsAndroid.check(READ_EXTERNAL_STORAGE)
    .then(result => {
      setPermissionGranted(result);
    })
    .finally(() => setLoading(false));

  const handlePermissionsRequest = () => {
    PermissionsAndroid.request(READ_EXTERNAL_STORAGE).then(result => {
      console.log(result);
      if (result === 'granted') {
        setPermissionGranted(true);
      }
    });
  };

  if (loading) {
    return null;
  }

  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <TouchableOpacity
          style={styles.permissionButton}
          activeOpacity={0.8}
          onPress={() => {
            handlePermissionsRequest();
          }}>
          <Text style={styles.typrography}>Allow Access</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
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
  );
};

const stylesheet = createStyleSheet(theme => ({
  permissionScreen: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 20,
  },
  typrography: {
    color: theme.colors.white,
  },
}));
