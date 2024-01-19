import React, { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface BottomButtonProps {
  children: ReactNode;

  onClick: () => void;
}

export const BottomButton = ({ children, onClick }: BottomButtonProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      onPress={() => onClick()}
      activeOpacity={0.8}
      style={styles.button}>
      {children}
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(() => ({
  button: {
    padding: 20,
  },
}));
