import React, { ReactNode } from 'react';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface PlaylistRootProps {
  children: ReactNode;
  onPress?: () => void;
  onClick: () => void;
}

export const PlaylistRoot = ({
  children,
  onPress,
  onClick,
}: PlaylistRootProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={onPress}
      onPress={onClick}>
      {children}
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(() => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
}));
