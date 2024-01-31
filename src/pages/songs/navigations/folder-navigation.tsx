import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TrackerContext } from '../../../contexts/tracker-context';
import RNFS from 'react-native-fs';
import { Folder } from 'lucide-react-native';
import { storage } from '../../../../App';

export const FolderNavigation = () => {
  const { styles, theme } = useStyles(stylesheet);
  const [folders, setFolders] = useState<RNFS.ReadDirItem[]>([]);
  const [refreshing, setRefreshing] = useState(true);
  const [path, setPath] = useState('');
  const trackerContext = useContext(TrackerContext);

  useEffect(() => {
    loadDirectories()
      .then(() => {
        const musicPath = storage.getString('musicPath');

        if (musicPath) {
          setPath(musicPath);
        }
      })
      .catch(error => console.log(error))
      .finally(() => setRefreshing(false));
  }, []);

  const loadDirectories = async () => {
    const result = await RNFS.readDir(RNFS.ExternalStorageDirectoryPath);
    setFolders(result.filter(value => value.isDirectory));
    return result;
  };

  if (!trackerContext || !path) {
    return;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadDirectories} />
      }>
      {folders.map((folder, index) => (
        <View style={styles.card} key={index}>
          <Folder strokeWidth={2} color={theme.colors.white} size={35} />
          <Text style={styles.typography}>{folder.name}</Text>
          {path === folder.path ? (
            <TouchableOpacity style={styles.buttonSelected} activeOpacity={1}>
              <Text style={styles.typography}>Selecionado</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonUnselected}
              activeOpacity={0.5}
              onPress={() => {
                setPath(folder.path);
                trackerContext.setMusicPath(folder.path);
              }}>
              <Text style={styles.typography}>Selecionar</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typography: {
    color: theme.colors.white,
    textAlign: 'center',
  },
  buttonSelected: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  buttonUnselected: {
    backgroundColor: theme.colors.secondary,
    padding: 10,
    borderRadius: 10,
  },
}));
