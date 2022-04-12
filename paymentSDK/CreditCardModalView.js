import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Animated,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {
  APP_THEME_COLOR,
  BOLD,
  strings,
  TRANSPARENT,
  WHITE_COLOR,
} from './constants.js';
var valid = require('card-validator');
import RBSheet from 'react-native-raw-bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CreditCardView from '../paymentSDK/CreditCardView';

//import TextField from "../helpers/TextField";
const {width} = Dimensions.get('screen');
class CreditCardModalView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      cardNumber: '',
      expirationYear: '',
      expirationMonth: '',
      cvv: '',
      isFocused: false,
      cardNumberError: false,
      expiryError: false,
      cardValidation: {},
      autoFocusCardNumber: false,
      autoFocusExpiryMonth: false,
      autoFocusExpiryYear: false,
      autoFocusCVV: false,
      containerHeight: props.containerHeight,
    };
    this.cardNumberRef = React.createRef();
    this.monthRef = React.createRef();
    this.expiryYearRef = React.createRef();
    this.expiryMonthRef = React.createRef();
    this.cvvRef = React.createRef();
    this.focusAnim = React.createRef(new Animated.Value(0)).current;
  }

  onSubmit() {
    console.log('form submitted');
  }

  componentDidMount() {
    if (this.props.showSheet) {
      this.RBSheet.open();
    }
  }

  handlingCardExpiryYear(text) {
    if (text.indexOf('.') >= 0 || text.length > 2) {
      return;
    }

    this.setState({
      expirationYear: text,
    });

    if (text.length === 2) {
      console.log('Enterd');
      this.cvvRef.current.focus();
      this.setState({
        autoFocusCVV: true,
        autoFocusCardNumber: false,
        autoFocusExpiryYear: false,
        autoFocusExpiryMonth: false,
      });
    }
  }

  handlingCardExpiryMonth(text) {
    if (text.indexOf('.') >= 0 || text.length > 2) {
      return;
    }

    this.setState({
      expirationMonth: text,
    });

    if (text.length === 2) {
      this.expiryYearRef.current.focus();

      this.setState({autoFocusCardNumber: false});
      this.setState({autoFocusExpiryYear: true});
      this.setState({autoFocusCVV: false});
      this.setState({autoFocusExpiryMonth: false});
    }
  }

  handleCardNumber(text) {
    if (text.indexOf('.') >= 0) {
      return;
    }

    var numberValidation = valid.number(text);
    this.setState({cardValidation: numberValidation});
    if (numberValidation.isValid) {
      this.expiryMonthRef.current.focus();

      this.setState({autoFocusCardNumber: false});
      this.setState({autoFocusExpiryYear: false});
      this.setState({autoFocusCVV: false});
      this.setState({autoFocusExpiryMonth: true});
    }
    if (text.length > 13) {
      if (!numberValidation.isValid) {
        this.setState({cardNumberError: !numberValidation.isValid});
      } else {
        this.setState({cardNumberError: false});
      }
    } else {
      this.setState({cardNumberError: false});
    }
    let formattedText = text
      .replace(/\s?/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
    this.setState({cardNumber: formattedText});
  }

  onFocusCardNumber = () => {
    this.setState({
      highlightCVVView: false,
      highlightExpiryMonthView: false,
      highlightExpiryYearView: false,
      highlightCardNumView: true,
      containerHeight:
        parseInt(this.props.containerHeight.slice(0, -1), 10) < 70
          ? '70%'
          : this.props.containerHeight,
    });
  };

  onFocusExpiryMonth = () => {
    console.log('sjdbcsjkdcbdsj');

    this.setState({
      highlightCVVView: false,
      highlightExpiryMonthView: true,
      highlightExpiryYearView: false,
      highlightCardNumView: false,
      containerHeight:
        parseInt(this.props.containerHeight.slice(0, -1), 10) < 70
          ? '70%'
          : this.props.containerHeight,
    });
  };

  onFocusExpiryYear = () => {
    this.setState({
      highlightCVVView: false,
      highlightExpiryMonthView: false,
      highlightExpiryYearView: true,
      highlightCardNumView: false,
      containerHeight:
        parseInt(this.props.containerHeight.slice(0, -1), 10) < 70
          ? '70%'
          : this.props.containerHeight,
    });
  };

  onFocusCVV = () => {
    this.setState({
      highlightCVVView: true,
      highlightExpiryMonthView: false,
      highlightExpiryYearView: false,
      highlightCardNumView: false,
      containerHeight:
        parseInt(this.props.containerHeight.slice(0, -1), 10) < 70
          ? '70%'
          : this.props.containerHeight,
    });
  };

  onBlurCardNumber = () => {
    this.setState({
      highlightCardNumView: false,
      containerHeight: this.props.containerHeight,
    });
  };

  onBlurExpiryMonth = () => {
    this.setState({
      highlightExpiryMonthView: false,
      containerHeight: this.props.containerHeight,
    });
  };

  onBlurExpiryYear = () => {
    this.setState({
      highlightExpiryYearView: false,
      containerHeight: this.props.containerHeight,
    });
  };

  onBlurCVV = () => {
    this.setState({
      highlightCVVView: false,
      containerHeight: this.props.containerHeight,
    });
  };

  removeWhiteSpaces = text => {
    return text.replace(/ /g, '');
  };

  containCardNumber = text => {
    return this.removeWhiteSpaces(text).length > 0;
  };

  containExpiryMonth = text => {
    return this.removeWhiteSpaces(text).length > 0;
  };

  containExpiryYear = text => {
    return this.removeWhiteSpaces(text).length > 0;
  };

  containCVV = text => {
    return this.removeWhiteSpaces(text).length > 0;
  };

  headerView = () => {
    let image = this.props.headerImage
      ? {uri: this.props.headerImage}
      : require('../assets/card.png');

    let style = stylesWithProps(this.props);
    return (
      <View style={style.headerContainerView}>
        <Image source={image} style={style.headerViewImage} />
        <Text style={style.headerViewText}>{this.props.headerTitle}</Text>
      </View>
    );
  };

  CardNumberView = ({autoFocusCardNumber}) => {
    let style = stylesWithPropsAndStates(this.props, this.state);
    return (
      <View style={style.cardNumberContainerView}>
        <Text>Credit / Debit card</Text>
        <View style={style.cardNumberTextInputView}>
          <TextInput
            style={[styles.input, style.cardNumberView]}
            autoFocus={autoFocusCardNumber}
            placeholder={'XXXX XXXX XXXX XXXX'}
            textAlign={'center'}
            placeholderTextColor={'#B9C4CA'}
            ref={this.cardNumberRef}
            value={this.state.cardNumber}
            selectTextOnFocus={true}
            onFocus={this.onFocusCardNumber}
            onBlur={this.onBlurCardNumber}
            onChangeText={text => {
              this.handleCardNumber(text);
            }}
            keyboardType={'numeric'}
            returnKeyType="done"
          />
          <Image
            source={require('../assets/card.png')}
            style={style.cardNumberImage}
          />
        </View>
        {this.state.cardNumberError ? (
          <Text style={{color: APP_THEME_COLOR}}>Wrong card details</Text>
        ) : null}
      </View>
    );
  };

  ExpirationDateView = ({
    autoFocusExpiryMonth,
    autoFocusExpiryYear,
    autoFocusCVV,
  }) => {
    let style = stylesWithPropsAndStates(this.props, this.state);
    return (
      <View style={style.expiryDateContainerView}>
        <View style={style.expiryDateView}>
          <Text>Expiry Date</Text>
          <View style={style.textInputContainerView}>
            <View style={style.expiryMonthView}>
              <TextInput
                style={[styles.input]}
                autoFocus={autoFocusExpiryMonth}
                placeholder={'MM'}
                textAlign={'center'}
                placeholderTextColor={'#B9C4CA'}
                ref={this.expiryMonthRef}
                value={this.state.expirationMonth}
                selectTextOnFocus={true}
                onFocus={this.onFocusExpiryMonth}
                onBlur={this.onBlurExpiryMonth}
                onChangeText={text => {
                  this.handlingCardExpiryMonth(text);
                }}
                keyboardType={'numeric'}
                returnKeyType={'done'}
              />
            </View>
            <View style={[style.expiryMonthView, style.expiryYearView]}>
              <TextInput
                autoFocus={autoFocusExpiryYear}
                style={[styles.input]}
                placeholder={'YY'}
                textAlign={'center'}
                placeholderTextColor={'#B9C4CA'}
                ref={this.expiryYearRef}
                value={this.state.expirationYear}
                onBlur={this.onBlurExpiryYear}
                selectTextOnFocus={true}
                onFocus={this.onFocusExpiryYear}
                onChangeText={text => {
                  this.handlingCardExpiryYear(text);
                }}
                keyboardType={'numeric'}
                returnKeyType={'done'}
              />
            </View>
          </View>
        </View>
        <View style={style.cvvContainerView}>
          <Text>CVV</Text>
          <View style={style.cvvView}>
            <TextInput
              style={[styles.input]}
              autoFocus={autoFocusCVV}
              placeholder={'XXX'}
              textAlign={'center'}
              placeholderTextColor={'#B9C4CA'}
              ref={this.cvvRef}
              value={this.state.cvv}
              selectTextOnFocus={true}
              onFocus={this.onFocusCVV}
              onBlur={this.onBlurCVV}
              onChangeText={text => {
                if (text.indexOf('.') >= 0 || text.length > 3) {
                  return;
                }

                this.setState({cvv: text});
              }}
              keyboardType={'numeric'}
              returnKeyType={'done'}
            />
            <Image
              source={require('../assets/card.png')}
              style={style.cvvImageView}
            />
          </View>
        </View>
      </View>
    );
  };

  PayNowView = () => {
    let style = stylesWithProps(this.props);
    return (
      <TouchableOpacity
        style={style.payNowContainerView}
        disabled={
          !this.containCardNumber(this.state.cardNumber) &&
          !this.containExpiryMonth(this.state.expirationMonth) &&
          !this.containExpiryYear(this.state.expirationYear) &&
          !this.containCVV(this.state.cvv)
        }
        onPress={() => {
          this.props.newCardData({
            name: this.state.name,
            cardNumber: this.state.cardNumber,
            expirationYear: this.state.expirationYear,
            expirationMonth: this.state.expirationMonth,
            cvv: this.state.cvv,
          });
        }}>
        <View>
          <Text style={styles.payNowTextView}>Pay Now</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={70}
        extraScrollHeight={70}
        enableOnAndroid={false}
        extraHeight={70}
        style={styles.keyBoardContainerView}>
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
              height: this.state.containerHeight || '70%',
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}>
          <CreditCardView
            showSheet={this.props.showSheet}
            containerHeight={'45%'}
            headerTitle={'Debit / Credit Card'}
            onClose={this.props.onCloseCardPressed}
            showSaveForLater={true}
            themeColor={this.props.themeColor}
          />
        </RBSheet>
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  keyBoardContainerView: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
  },
  textField: {
    flex: 1,
    marginTop: 24,
  },
  input: {
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: 'white',
  },
  labelContainer: {
    position: 'absolute',
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: '#B00020',
    fontFamily: 'Avenir-Medium',
  },
  verifyButtonView: {
    height: 50,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 5,
    paddingVertical: 5,
    width: width - 60,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME_COLOR,
    flex: 1,
  },
  verifyTextView: {
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: WHITE_COLOR,

    fontWeight: BOLD,
    fontSize: 16,
  },
  verifyContainerView: {
    backgroundColor: TRANSPARENT,
    width: width - 40,
    alignItems: 'center',
  },

  payNowTextView: {
    paddingHorizontal: 20,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
  },
});
const stylesWithProps = props =>
  StyleSheet.create({
    payNowContainerView: {
      backgroundColor: props.themeColor,
      height: 50,
      marginTop: 15,
      marginHorizontal: 20,
      justifyContent: 'center',
      borderRadius: 25,
    },

    headerContainerView: {flexDirection: 'row', marginBottom: 15},

    headerViewImage: {
      alignSelf: 'center',
      width: 20,
      height: 20,
      resizeMode: props.headerImageResizeMode,
      marginLeft: 15,
    },

    headerViewText: {
      marginLeft: 15,
      fontSize: props.headerTitleFont || 15,
      fontWeight: props.headerTitleWeight || '400',
    },
  });
const stylesWithPropsAndStates = (props, state) =>
  StyleSheet.create({
    headerContainerView: {flexDirection: 'row', marginBottom: 15},

    headerViewImage: {
      alignSelf: 'center',
      width: 20,
      height: 20,
      resizeMode: props.headerImageResizeMode,
      marginLeft: 15,
    },

    headerViewText: {
      marginLeft: 15,
      fontSize: props.headerTitleFont || 15,
      fontWeight: props.headerTitleWeight || '400',
    },

    cardNumberContainerView: {
      marginHorizontal: 15,
      marginVertical: 5,
    },
    cardNumberTextInputView: {
      flexDirection: 'row',
      marginTop: 8,
      borderRadius: 5,
      borderColor: state.highlightCardNumView
        ? props.themeColor || 'black'
        : 'lightgray',
      borderWidth: 1,
      justifyContent: 'space-between',
    },
    cardNumberImage: {
      alignSelf: 'center',
      width: 20,
      height: 20,
      resizeMode: props.headerImageResizeMode,
      marginRight: 15,
      marginLeft: -25,
    },
    cardNumberView: {
      marginRight: 15,
    },
    expiryDateContainerView: {
      marginHorizontal: 15,
      marginVertical: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    expiryDateView: {
      flex: 0.75,
    },
    textInputContainerView: {
      flexDirection: 'row',
    },
    expiryMonthView: {
      alignContent: 'flex-start',
      borderRadius: 5,
      borderColor: state.highlightExpiryMonthView
        ? props.themeColor || 'black'
        : 'lightgray',
      borderWidth: 1,
      marginTop: 8,
      width: 55,
    },
    expiryYearView: {marginLeft: 10},
    cvvContainerView: {width: '25%'},
    cvvView: {
      flexDirection: 'row',
      alignContent: 'flex-start',
      borderRadius: 5,
      borderColor: state.highlightCVVView
        ? props.themeColor || 'black'
        : 'lightgray',
      borderWidth: 1,
      marginTop: 8,
      justifyContent: 'space-between',
    },
    cvvImageView: {
      alignSelf: 'center',
      width: 20,
      height: 20,
      resizeMode: props.headerImageResizeMode,
      marginRight: 15,
    },
  });
export default CreditCardModalView;
