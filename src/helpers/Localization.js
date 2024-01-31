import {find, get, isEmpty, memoize, toUpper} from 'lodash';

import {I18nManager} from 'react-native';

// import i18n from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {strings} from '../constants';

// import {localeCodes} from './localeCodes';

const translationGetters = {
  en: () => require('../localizations/EN.json'),
  th: () => require('../localizations/TH.json'),
  vn: () => require('../localizations/VN.json'),
};

const translate = memoize(
  (key, config) => {
    //return i18n.t(key, config);
    return key;
  },
  (key, config) => {
    return config ? key + JSON.stringify(config) : key;
  },
);

const getLanguagePref = async () => {
  const data = await AsyncStorage.getItem('selectedLanguage');
  return JSON.parse(data)?.code;
};
// "chaipay-sdk": "file:paymentSDK",

const setI18nConfig = async () => {
  const languagePref = await getLanguagePref();
  console.log('211111');
  console.log('211111', languagePref);

  if (languagePref) {
    strings.setLanguage(languagePref);
  }

  // const customTag = {languageTag: `${languagePref}`, isRTL: false};

  // const {languageTag, isRTL} = customTag;

  // const d = {[languageTag]: translationGetters[languageTag]()};

  // console.log('isRTL', customTag, d);

  // translate.cache.clear();
  // I18nManager.forceRTL(isRTL);
  // i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  // i18n.locale = languageTag;
};

const handleLocalizationChange = () => {
  setI18nConfig();
};

export default {
  setI18nConfig,

  getLanguagePref,

  translate,
};
