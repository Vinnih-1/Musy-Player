import { theme } from './theme';
import { breakpoints } from './theme/breakpoints';
import { UnistylesRegistry } from 'react-native-unistyles';

type AppBreakpoints = typeof breakpoints;

type AppThemes = {
  dark: typeof theme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addBreakpoints(breakpoints).addThemes({
  dark: theme,
});
