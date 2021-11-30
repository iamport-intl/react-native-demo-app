/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Localization from './src/helpers/Localization';

Localization.setI18nConfig();

AppRegistry.registerComponent(appName, () => App);
