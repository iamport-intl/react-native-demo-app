import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  Keyboard,
  TextInput,
  Image,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {WHITE_COLOR, APP_THEME_COLOR} from '../constants.js';
import {
  Checkout,
  helpers,
  PayNowButton,
  PaymentMethods,
  CartDetails,
  TransactionStatusView,
  CartSummary,
  CheckoutInstance,
} from '@iamport-intl/chaipay-sdk';
import PhoneInput from 'react-native-phone-number-input';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {strings} from '../constants';
const {width} = Dimensions.get('screen');

class MobileNumberView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowOTP:
        props.shouldShowOTP !== undefined ? props.shouldShowOTP : false,
      highLightMobileNumView: false,
      highLightOTPView: false,
      shouldShowOTP: false,
    };

    this.focusAnim = React.createRef(new Animated.Value(0)).current;
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded: !this.state.expanded});
  };

  setNumber = number => {
    this.setState({mobileNumber: number});
  };

  setFormattedNumber = number => {
    AsyncStorage.setItem('formattedMobileNumber', number);

    this.setState({formattedMobileNumber: number});
  };

  handleTextChange = text => {
    this.setState({OTP: text});
  };

  componentDidMount() {
    this.RBSheet.open();

    AsyncStorage.getItem('formattedMobileNumber').then(number => {
      this.setState({formattedMobileNumber: number});
    });
  }

  onFocusMobileNumView = () => {
    this.setState({
      highLightOTPView: false,
      highLightMobileNumView: true,
    });
  };

  onFocusOTPView = () => {
    this.setState({
      highLightOTPView: true,
      highLightMobileNumView: false,
    });
  };
  handleCardNumber = text => {
    this.setState({OTP: text});
  };
  headerView = () => {
    let image = this.props.headerImage
      ? {uri: this.props.headerImage}
      : require('../../assets/card.png');

    let style = stylesWithProps(this.props, this.state);
    return (
      <View>
        <View style={style.headerContainerView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginHorizontal: 15,
            }}>
            <Text style={{color: '#333333', fontSize: 24}}>
              {this.props.headerTitle + ' '}
            </Text>
            <Text style={{color: '#DDDDDD', fontSize: 24}}>
              {CheckoutInstance.state.currency}
            </Text>
          </View>

          <>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                width: 30,
                height: 30,
                alignSelf: 'center',
              }}
              onPress={() => {
                Keyboard.dismiss();
                console.log('presses');
                this.RBSheet.close();
                this.props.onClose();
              }}>
              <Image
                source={require('../../assets/cancel.png')}
                style={{
                  alignSelf: 'center',
                  width: 12,
                  height: 12,

                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </>
        </View>
        <TouchableOpacity style={{flexDirection: 'row', marginHorizontal: 20}}>
          <Text>Input phone number and OTP for </Text>
          <Text style={{color: this.props.themeColor || '#FC6B2D'}}>
            Saved Cards
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  NextView = () => {
    let style = stylesWithProps(this.props, this.state);
    return (
      <TouchableOpacity
        style={style.nextViewContainerStyle}
        disabled={!this.state.shouldShowOTP}
        onPress={async () => {
          if (this.state.shouldShowOTP) {
            let value = await helpers.fetchSavedCards(
              this.state.formattedMobileNumber,
              this.state.OTP,
            );

            if (
              value?.status_code === '4000' ||
              value?.status_code === '400' ||
              value?.status_code === '4001'
            ) {
              AsyncStorage.setItem('SavedCardsData', JSON.stringify({}));
              this.setState({
                shouldShowOTP: true,
                errorMessage: value?.message,
              });
              this.props.savedCardsData({});
            } else {
              if (value?.data.status_code === '2000') {
                this.setState({
                  shouldShowOTP: false,
                  errorMessage: undefined,
                });

                AsyncStorage.setItem(
                  'SavedCardsData',
                  JSON.stringify(value.data),
                );
                this.setState({savedCardsData: value.data});
                this.props.savedCardsData(value.data);
              }
            }
          } else {
            AsyncStorage.setItem('SavedCardsData', JSON.stringify({}));
            this.setState({savedCards: {}});

            let val = await helpers.getOTP(this.state.formattedMobileNumber);
            if (val.status === 200 || val.status === 201) {
              this.setState({shouldShowOTP: true});
            }
          }
        }}>
        <Text style={{color: 'white'}}>{strings.next}</Text>
      </TouchableOpacity>
    );
  };

  mobileInputView = () => {
    var shouldShowOTP = this.state.shouldShowOTP;
    let style = stylesWithProps(this.props, this.state);
    return (
      <View style={styles.mobileContainerStyle}>
        <View
          style={{
            flexDirection: 'row',
            borderColor: this.props.themeColor,
            borderWidth: 1,
            padding: 8,
            borderRadius: 15,
            marginVertical: 10,
            marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <Text style={{marginLeft: 15}}>{'Enter Mobile Number'}</Text>
            <PhoneInput
              placeholder={'+00-00000 00000'}
              autoFocus
              textContainerStyle={styles.textContainerStyle}
              textInputStyle={styles.textInputStyle}
              ref={this.phone}
              defaultValue={this.state.mobileNumber}
              defaultCode="IN"
              layout="first"
              onChangeText={text => {
                this.setNumber(text);
              }}
              autoFocus
              onFocus={this.onFocusMobileNumView}
              onChangeFormattedText={text => {
                this.setFormattedNumber(text);
              }}
              withDarkTheme={false}
              withShadow={false}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: this.props.themeColor,
              width: 30,
              height: 30,
              marginLeft: -12,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
            }}
            onPress={async () => {
              let val = await helpers.getOTP(this.state.formattedMobileNumber);
              if (val.status === 200 || val.status === 201) {
                this.setState({shouldShowOTP: true});
              }
            }}>
            <Image
              source={require('../../assets/unselectedCard.png')}
              style={{
                alignSelf: 'center',
                width: this.state.highLightOTPView ? 22 : 22,
                height: this.state.highLightOTPView ? 12 : 22,
                resizeMode: 'contain',
                marginTop: 5,
              }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={style.otpContainerView}
          onPress={() => {
            this.onFocusOTPView();
          }}>
          <Image
            source={
              this.state.highLightOTPView
                ? require('../../assets/selectedCard.png')
                : require('../../assets/unselectedCard.png')
            }
            style={{
              alignSelf: 'center',
              width: this.state.highLightOTPView ? 22 : 22,
              height: this.state.highLightOTPView ? 12 : 22,
              resizeMode: 'contain',
              marginRight: 5,
              marginLeft: -20,
            }}
          />
          <View>
            <Text>{'Enter OTP'}</Text>
            <View style={style.otpTextInputView}>
              <TextInput
                style={[styles.input, style.cardNumberView]}
                placeholder={'XXXXXX'}
                placeholderTextColor={'#B9C4CA'}
                ref={this.cardNumberRef}
                value={this.state.cardNumber}
                selectTextOnFocus={true}
                onFocus={this.onFocusOTPView}
                onBlur={this.onBlurOTPView}
                onChangeText={text => {
                  this.handleCardNumber(text);
                }}
                keyboardType={'numeric'}
                returnKeyType="done"
              />
            </View>
          </View>

          {this.state.cardNumberError ? (
            <Text style={{color: APP_THEME_COLOR, marginTop: 5}}>
              Wrong card details
            </Text>
          ) : null}
        </TouchableOpacity>

        {this.state.errorMessage ? (
          <Text>{this.state.errorMessage}</Text>
        ) : null}
      </View>
    );
  };
  savedCardsView = () => {
    return (
      <View style={{backgroundColor: 'red', marginVertical: 20}}>
        <Text>{this.state.savedCardsData.content.length}</Text>
      </View>
    );
  };

  render() {
    var style = stylesWithProps(this.props, this.state);
    return (
      <View>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          animationType={'slide'}
          closeOnDragDown={true}
          closeOnPressMask={false}
          onClose={this.props.onClose}
          customStyles={{
            container: {
              height: '85%',
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}>
          <View style={style.containerStyle}>
            <this.headerView />
            {this.state.savedCardsData !== undefined ? (
              <this.savedCardsView />
            ) : (
              <this.mobileInputView />
            )}
            <this.NextView />
          </View>
        </RBSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mobileContainerStyle: {marginVertical: 15},
  textInputStyle: {
    height: 60,
  },
  textContainerStyle: {
    marginLeft: -20,
    height: 50,
    backgroundColor: WHITE_COLOR,
  },

  roundedTextInput: {
    borderRadius: 10,
    borderColor: APP_THEME_COLOR,
    borderWidth: 1,
    height: (width - 40 - 10 * 7) / 7,
    width: (width - 40 - 10 * 7) / 7,
    borderBottomWidth: 1,
  },
  OTPContainerStyle: {},
  container: {
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  text: {fontSize: 17, color: 'black', padding: 10},
  btnText: {textAlign: 'center', color: 'white', fontSize: 20},
  btnTextHolder: {borderWidth: 1, borderColor: 'rgba(0,0,0,0.5)'},
  Btn: {padding: 10, backgroundColor: 'rgba(0,0,0,0.5)'},
});
const stylesWithProps = (props, state) =>
  StyleSheet.create({
    otpTextInputView: {
      flexDirection: 'row',
      marginTop: 10,
      borderRadius: 5,
      marginLeft: 5,
      justifyContent: 'space-between',
    },
    headerContainerView: {
      flexDirection: 'row',
      marginBottom: 15,

      marginRight: 15,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    otpContainerView: {
      marginHorizontal: 15,
      marginVertical: 10,
      marginTop: 3,
      borderWidth: 0.5,
      borderColor: state.highLightOTPView
        ? props.themeColor || '#FC6B2D'
        : 'transparent',
      padding: 20,
      borderRadius: 15,
      flexDirection: 'row',
    },
    input: {
      padding: 8,
      borderRadius: 4,
      fontSize: 16,
      backgroundColor: 'white',
    },

    cardNumberView: {
      marginRight: 10,
    },

    phoneInputContainerStyle: {
      width: '100%',
      borderWidth: 1,
      borderColor: props.themeColor || APP_THEME_COLOR,
      borderRadius: 5,
    },
    nextViewContainerStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.themeColor || APP_THEME_COLOR,
      paddingVertical: 15,
      borderRadius: 8,
      marginHorizontal: 15,
    },
    containerStyle: {
      backgroundColor: 'white',
      paddingTop: props.containerVerticalPadding,
      paddingBottom: props.containerVerticalPadding,
      margin: 4,
      borderRadius: 5,
      marginHorizontal: 10,
    },

    headerViewText: {
      marginLeft: 5,
      fontSize: props.headerTitleFont || 15,
      fontWeight: props.headerTitleWeight || '400',
    },
  });

export default MobileNumberView;
