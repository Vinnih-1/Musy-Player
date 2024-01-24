import React from 'react';

import { TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface SongRootProps {
  children: ReactNode;
  onClick: () => void;
  onPress?: () => void;
}

export const SongRoot = ({ children, onClick, onPress }: SongRootProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      style={styles.root}
      activeOpacity={0.8}
      onPress={onClick}
      onLongPress={onPress}>
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
    padding: 10,
  },
}));
