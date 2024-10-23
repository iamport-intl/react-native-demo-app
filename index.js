/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Localization from './src/helpers/Localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

AppRegistry.registerComponent(appName, () => App);
