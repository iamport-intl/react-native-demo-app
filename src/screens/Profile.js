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
const {width, height} = Dimensions.get('window');
const gutter = 15;

class Profile extends React.Component {
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
            Profile
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            alignItems: 'center',
            backgroundColor: WHITE_COLOR,
            marginHorizontal: 15,
            borderRadius: 6,
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 0.2,
            elevation: 6,
          }}>
          <View
            style={{
              marginLeft: 40,

              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: WHITE_COLOR,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                alignSelf: 'center',
              }}
              source={{
                uri: 'https://616570b8d97281068a3367ff--jolly-wiles-792d81.netlify.app/Plain%20tshirt.jpeg',
              }}
            />
          </View>
          <Text style={{marginLeft: 30, marginTop: 15, fontWeight: '400'}}>
            {this.state.mobileNumber
              ? 'Mobile Number'
              : 'Test User \n +918341468168'}{' '}
            {'\n'} {this.state.mobileNumber}
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
          }}>
          <Text style={{marginLeft: 15, marginTop: 15, fontWeight: '500'}}>
            Address:
          </Text>
          <Text style={{marginLeft: 85, marginTop: 10, marginBottom: 15}}>
            {'MIG I A7'} {'\n'}
            {'Sujatha Nagar, Pendurthy'}
            {'\n'}
            {'Visakhanpatnam'}
            {'\n'}
            {'Andhra pradesh, 530051'}
            {'\n'}
            {'INDIA'}
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
          <Text style={{padding: 15}}>Orders</Text>
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
          <Text style={{padding: 15}}>Wishlist</Text>
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

export default Profile;
