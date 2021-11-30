import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Platform,
} from 'react-native';
import {
  APP_THEME_COLOR,
  BOLD,
  currency,
  DARKBLACK,
  descriptionText,
  WHITE_COLOR,
  TRANSPARENT,
  IMAGE_BACKGROUND_COLOR,
  strings,
} from '../constants.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {FlatList} from 'react-native';
import CheckboxView from '../helpers/CheckboxView.js';
import RNExitApp from 'react-native-exit-app';

const {width, height} = Dimensions.get('window');
const gutter = 15;

let languageData = [
  {
    name: 'English',
    code: 'en-EN',
    languageCode: 'en',
  },
  {
    name: 'Thai',
    code: 'th-TH',
    languageCode: 'th',
  },
  {
    name: 'Vietnamese',
    code: 'vn-VN',
    languageCode: 'vn',
  },
];
class Language extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'en',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('selectedLanguage').then(value => {
      this.setState({selectedLanguage: value});
    });
  }

  onClickPaymentSelected = data => {
    AsyncStorage.setItem('selectedLanguage', data.code);
    strings.setLanguage(data.code);
    this.setState({selectedLanguage: data.code}, () => {
      RNExitApp.exitApp();
    });
  };
  save = () => {};
  render() {
    return (
      <View style={{backgroundColor: IMAGE_BACKGROUND_COLOR, flex: 1}}>
        <View style={{backgroundColor: WHITE_COLOR}}>
          <Text
            style={[
              styles.featuredText,
              Platform.OS === 'ios' ? {marginTop: 5} : {marginTop: 30},
            ]}>
            Change Language
          </Text>
        </View>
        <FlatList
          data={languageData}
          renderItem={product => {
            console.log('product', product);
            return (
              <CheckboxView
                fromSavedCards={false}
                item={{...product.item, fromLanguage: true}}
                image={{uri: product.item.logo}}
                isSelected={product.item.code === this.state.selectedLanguage}
                didSelected={this.onClickPaymentSelected}
              />
            );
          }}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: DARKBLACK,
    fontSize: 14,
    fontWeight: BOLD,
    flex: 1,
    flexWrap: 'wrap',
    paddingVertical: 6,
    paddingBottom: 0,
    textAlign: 'center',
  },

  price: {
    fontWeight: BOLD,
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
    color: APP_THEME_COLOR,
    fontSize: 14,
    textAlign: 'center',
  },

  description: {
    fontSize: 12,
    fontWeight: '600',
    color: descriptionText,
    paddingBottom: 2,
    textAlign: 'center',
  },
  product: {
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center',
    width: (width - gutter * 3) / 2,
    marginBottom: gutter,
    backgroundColor: WHITE_COLOR,
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    alignSelf: 'flex-start',
    borderRadius: 8,
    elevation: 6,
  },
  productName: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    backgroundColor: TRANSPARENT,
  },
  featuredText: {
    textAlign: 'left',
    color: APP_THEME_COLOR,
    fontSize: 30,
    fontWeight: BOLD,
    marginLeft: 15,
    backgroundColor: WHITE_COLOR,
    paddingBottom: 5,
  },
});

export default Language;
