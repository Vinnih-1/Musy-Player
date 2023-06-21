/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import {PlaybackService} from './src/services/PlaybackService';
import {RequestPermissions} from './src/services/PermissionsService';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService);
TrackPlayer.setupPlayer();
RequestPermissions();