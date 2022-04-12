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
} from 'react-native';

import {APP_THEME_COLOR, WHITE_COLOR} from './constants.js';
import {helpers} from '../paymentSDK/helper';
import PhoneInput from 'react-native-phone-number-input';
import OTPTextInput from '../src/helpers/OTPTextView';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('screen');
class MobileNumberAuthenticationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowOTP:
        props.shouldShowOTP !== undefined ? props.shouldShowOTP : false,
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
    AsyncStorage.getItem('formattedMobileNumber').then(number => {
      this.setState({formattedMobileNumber: number});
    });
  }

  headerView = () => {
    let style = stylesWithProps(this.props);
    return (
      <View style={style.headerContainerView}>
        <Text style={style.headerViewText}>
          {this.state.shouldShowOTP
            ? this.props.otpTitle ||
              `OTP has been sent to ${this.state.formattedMobileNumber}`
            : this.props.numberTitle || 'Enter Mobile Number'}
        </Text>
      </View>
    );
  };

  NextView = () => {
    let style = stylesWithProps(this.props);
    return (
      <TouchableOpacity
        style={style.nextViewContainerStyle}
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
                this.setState({shouldShowOTP: false, errorMessage: undefined});

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
        <Text style={{color: 'white'}}>Next</Text>
      </TouchableOpacity>
    );
  };

  mobileInputView = () => {
    var shouldShowOTP = this.state.shouldShowOTP;

    return (
      <View style={styles.mobileContainerStyle}>
        {shouldShowOTP ? (
          <OTPTextInput
            ref={this.otpInput}
            containerStyle={styles.OTPContainerStyle}
            textInputStyle={[styles.roundedTextInput]}
            defaultValue={this.state.OTP}
            textContentType="oneTimeCode"
            offTintColor={'lightgray'}
            tintColor={'red'}
            inputCount={6}
            handleTextChange={text => this.handleTextChange(text)}
          />
        ) : (
          <PhoneInput
            containerStyle={styles.phoneInputContainerStyle}
            autoFocus
            textContainerStyle={styles.textContainerStyle}
            textInputStyle={styles.textInputStyle}
            ref={this.phone}
            defaultValue={this.state.mobileNumber}
            defaultCode="IN"
            layout="second"
            onChangeText={text => {
              this.setNumber(text);
            }}
            onChangeFormattedText={text => {
              this.setFormattedNumber(text);
            }}
            withDarkTheme={false}
            withShadow={false}
          />
        )}
        {this.state.errorMessage ? (
          <Text>{this.state.errorMessage}</Text>
        ) : null}
      </View>
    );
  };

  render() {
    var style = stylesWithProps(this.props);
    return (
      <View>
        <View style={style.containerStyle}>
          <this.headerView />
          <this.mobileInputView />
          <this.NextView />
        </View>
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
  phoneInputContainerStyle: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 8,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderColor: APP_THEME_COLOR,
    borderWidth: 1,
    height: (width - 40 - 10 * 5) / 7,
    width: (width - 40 - 10 * 5) / 7,
    borderBottomWidth: 1,
  },
  OTPContainerStyle: {
    marginHorizontal: 10,
    marginLeft: 0,
    width: width - 40,
  },
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
const stylesWithProps = props =>
  StyleSheet.create({
    nextViewContainerStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.themeColor || 'red',
      paddingVertical: 15,
      borderRadius: 8,
    },
    containerStyle: {
      backgroundColor: 'white',
      paddingTop: props.containerVerticalPadding,
      paddingBottom: props.containerVerticalPadding,
      margin: 4,
      borderRadius: 5,
      marginHorizontal: 15,
    },
    headerContainerView: {
      marginTop: 15,
    },

    headerViewText: {
      marginLeft: 5,
      fontSize: props.headerTitleFont || 15,
      fontWeight: props.headerTitleWeight || '400',
    },
  });

export default MobileNumberAuthenticationView;
