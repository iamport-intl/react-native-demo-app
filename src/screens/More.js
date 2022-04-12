import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Platform,
} from 'react-native';
import {Image} from 'react-native-elements';
import {
  APP_THEME_COLOR,
  BOLD,
  currency,
  DARKBLACK,
  descriptionText,
  WHITE_COLOR,
  TRANSPARENT,
  IMAGE_BACKGROUND_COLOR,
} from '../constants.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native';
const {width, height} = Dimensions.get('window');
const gutter = 15;

class More extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: null,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('mobileNumber')
      .then(value => {
        this.setState({mobileNumber: value});
      })
      .then(res => {
        //do something else
      });
  }

  render() {
    return (
      <View style={{backgroundColor: IMAGE_BACKGROUND_COLOR, flex: 1}}>
        <View style={{backgroundColor: WHITE_COLOR}}>
          <Text
            style={[
              styles.featuredText,
              Platform.OS === 'ios' ? {marginTop: 5} : {marginTop: 30},
            ]}>
            More
          </Text>
        </View>
        <View
          style={{
            backgroundColor: WHITE_COLOR,
            marginHorizontal: 15,
            borderRadius: 6,
            marginTop: 15,
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 0.2,
            elevation: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{width: 20, height: 20, marginLeft: 15}}
            source={require('../../assets/orders.png')}
          />
          <Text style={{padding: 15}}>FAQs</Text>
        </View>
        <View
          style={{
            backgroundColor: WHITE_COLOR,
            marginHorizontal: 15,
            borderRadius: 6,
            marginTop: 15,
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 0.2,
            elevation: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{width: 20, height: 20, marginLeft: 15}}
            source={require('../../assets/wishlist.png')}
          />
          <Text style={{padding: 15}}>About us</Text>
        </View>
        <View
          style={{
            backgroundColor: WHITE_COLOR,
            marginHorizontal: 15,
            borderRadius: 6,
            marginTop: 15,
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 0.2,
            elevation: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{width: 20, height: 20, marginLeft: 15}}
            source={require('../../assets/audit.png')}
          />
          <Text style={{padding: 15}}>TERMS OF USE</Text>
        </View>
        <View
          style={{
            backgroundColor: WHITE_COLOR,
            marginHorizontal: 15,
            borderRadius: 6,
            marginTop: 15,
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 0.2,
            elevation: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{width: 20, height: 20, marginLeft: 15}}
            source={require('../../assets/privacy.png')}
          />
          <Text style={{padding: 15}}>PRIVACY POLICY</Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: WHITE_COLOR,
            marginHorizontal: 15,
            borderRadius: 6,
            marginTop: 15,
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 0.2,
            elevation: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            this.props.navigation.navigate('LanguageScreen');
          }}>
          <Image
            style={{width: 20, height: 20, marginLeft: 15}}
            source={require('../../assets/privacy.png')}
          />
          <Text style={{padding: 15}}>Change Language</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: WHITE_COLOR,
            marginHorizontal: 15,
            borderRadius: 6,
            marginTop: 15,
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 0.2,
            elevation: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            this.props.navigation.navigate('ChangeToCustomStyles');
          }}>
          <Image
            style={{width: 20, height: 20, marginLeft: 15}}
            source={require('../../assets/privacy.png')}
          />
          <Text style={{padding: 15}}>Custom styles</Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: WHITE_COLOR,
            marginHorizontal: 15,
            borderRadius: 6,
            marginTop: 85,
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 0.2,
            elevation: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              padding: 15,
              textAlign: 'center',
              justifyContent: 'center',
              color: APP_THEME_COLOR,
            }}>
            LOG OUT
          </Text>
        </View>
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

export default More;
