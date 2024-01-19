import React from 'react';

import { TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface SongRootProps {
  children: ReactNode;
  onClick: () => void;
}

export const SongRoot = ({ children, onClick }: SongRootProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      style={styles.root}
      activeOpacity={0.8}
      onPress={() => onClick()}>
      {children}
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(() => ({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
    minHeight: 100,
  },
}));
