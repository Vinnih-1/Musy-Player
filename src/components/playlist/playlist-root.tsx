import React, { ReactNode } from 'react';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface PlaylistRootProps {
  children: ReactNode;
}

export const PlaylistRoot = ({ children }: PlaylistRootProps) => {
  const { styles } = useStyles(stylesheet);
  return (
    <TouchableOpacity style={styles.container}>{children}</TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
}));
