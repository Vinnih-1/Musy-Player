import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  PermissionsAndroid,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AlignLeft, ArchiveX, Search } from 'lucide-react-native';
import { Header } from '../../components/header/index.ts';

interface PermissionProps {
  setPermissionGranted: (granted: boolean) => void;
}

export const PermissionPage = ({ setPermissionGranted }: PermissionProps) => {
  const { styles, theme } = useStyles(stylesSheet);

  const READ_EXTERNAL_STORAGE = 'android.permission.READ_EXTERNAL_STORAGE';
  const WRITE_EXTERNAL_STORAGE = 'android.permission.WRITE_EXTERNAL_STORAGE';

  const handlePermissionsRequest = () => {
    PermissionsAndroid.requestMultiple([
      READ_EXTERNAL_STORAGE,
      WRITE_EXTERNAL_STORAGE,
    ]).then(result => {
      console.log(result);
      if (result[READ_EXTERNAL_STORAGE] && result[WRITE_EXTERNAL_STORAGE]) {
        setPermissionGranted(true);
      }
    });
  };

  return (
    <SafeAreaView style={styles.permissionScreen}>
      <Header.Root>
        <Header.Container style={styles.container}>
          <Header.Button style={styles.items}>
            <AlignLeft color={'#FFF'} strokeWidth={3} size={30} />
          </Header.Button>
          <Header.Title title="Musy Player" />
        </Header.Container>
        <Header.Button style={styles.items}>
          <Search color={'#FFF'} strokeWidth={3} size={30} />
        </Header.Button>
      </Header.Root>
      <View style={styles.content}>
        <ArchiveX strokeWidth={2} color={theme.colors.white} size={128} />
        <Text style={styles.permissionText}>You need allow access to Musy</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          activeOpacity={0.8}
          onPress={() => {
            handlePermissionsRequest();
          }}>
          <Text style={styles.typrography}>Allow Access</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const stylesSheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 32,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  items: {
    marginHorizontal: 20,
  },
  permissionScreen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 20,
  },
  permissionText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
  },
  typrography: {
    color: theme.colors.white,
  },
}));
