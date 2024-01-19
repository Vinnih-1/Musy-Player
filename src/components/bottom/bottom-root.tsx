import React, { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface BottomRootProps {
  children: ReactNode;
  onClick: () => void;
}

export const BottomRoot = ({ children, onClick }: BottomRootProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => onClick()}>
      {children}
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    maxHeight: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bottom,
    gap: 20,
  },
}));
