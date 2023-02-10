/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Localization from './src/helpers/Localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.setItem('layout', JSON.stringify(0));
AsyncStorage.setItem('fontSize', JSON.stringify(12));
AsyncStorage.setItem('fontWeight', '300');
AsyncStorage.setItem('color', '#FF2229');
AsyncStorage.setItem('borderRadius', JSON.stringify(5));
AppRegistry.registerComponent(appName, () => App);
