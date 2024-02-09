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
  Keyboard,
} from 'react-native';

import {
  APP_THEME_COLOR,
  BOLD,
  strings,
  TRANSPARENT,
  WHITE_COLOR,
} from '../constants';
var valid = require('card-validator');
import RBSheet from 'react-native-raw-bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckoutInstance from '@iamport-intl/portone-sdk';
import MobileNumberFlow from './MobileFlow';

const {width} = Dimensions.get('screen');
class CreditCardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      cardNumber: '',
      expirationYear: '',
      expirationMonth: '',
      cvv: '',
      saveForLater: false,
      isFocused: false,
      cardNumberError: false,
      expiryError: false,
      cardValidation: {},
      autoFocusCardNumber: false,
      autoFocusCardName: false,
      autoFocusExpiryMonth: false,
      autoFocusCVV: false,
      containerHeight: props.containerHeight,
    };
    this.cardNumberRef = React.createRef();
    this.cardNameRef = React.createRef();
    this.expiryMonthRef = React.createRef();
    this.cvvRef = React.createRef();
    this.focusAnim = React.createRef(new Animated.Value(0)).current;
  }

  onSubmit() {
    console.log('form submitted');
  }

  componentDidMount() {
    this.RBSheet.open();
    setTimeout(() => this.cardNameRef?.current?.focus(), 150);
  }

  handlingCardExpiryMonth(text) {
    if (text.indexOf('.') >= 0 || text.length > 5) {
      return;
    }

    this.setState({
      expirationMonth: text,
    });

    if (text.length === 5) {
      this.expiryMonthRef.current.focus();

      this.setState({
        autoFocusExpiryMonth: false,
        autoFocusCVV: true,
        autoFocusCardNumber: false,
      });
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
      this.setState({autoFocusCVV: false});
      this.setState({autoFocusCardName: true});
      this.setState({autoFocusExpiryMonth: false});
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

  handleCardName(text) {
    if (text.indexOf('.') >= 0) {
      return;
    }

    this.setState({autoFocusCardNumber: false});
    this.setState({autoFocusCardName: false});
    this.setState({autoFocusCVV: false});
    this.setState({autoFocusExpiryMonth: false});

    this.setState({name: text});
  }

  onFocusCardNumber = () => {
    this.setState({
      highlightCVVView: false,
      highlightExpiryMonthView: false,
      highlightCardNumView: true,
      highlightCardNameView: false,
      containerHeight:
        parseInt(this.props.containerHeight.slice(0, -1), 10) < 70
          ? '70%'
          : this.props.containerHeight,
    });
  };
  onFocusCardName = () => {
    this.setState({
      highlightCVVView: false,
      highlightExpiryMonthView: false,

      highlightCardNumView: false,
      highlightCardNameView: true,
      containerHeight:
        parseInt(this.props.containerHeight.slice(0, -1), 10) < 70
          ? '70%'
          : this.props.containerHeight,
    });
  };

  onFocusExpiryMonth = () => {
    this.setState({
      highlightCVVView: false,
      highlightExpiryMonthView: true,
      highlightCardNumView: false,
      highlightCardNameView: false,
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
      highlightCardNumView: false,
      highlightCardNameView: false,
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

  onBlurCardName = () => {
    this.setState({
      highlightCardNameView: false,
      containerHeight: this.props.containerHeight,
    });
  };

  onBlurExpiryMonth = () => {
    this.setState({
      highlightExpiryMonthView: false,
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
    return text?.replace(/ /g, '') || '';
  };

  containCardNumber = text => {
    return this.removeWhiteSpaces(text).length > 0;
  };

  containExpiryMonth = text => {
    return this.removeWhiteSpaces(text).length > 0;
  };

  containCVV = text => {
    return this.removeWhiteSpaces(text).length > 0;
  };

  headerView = () => {
    let image = this.props.headerImage
      ? {uri: this.props.headerImage}
      : require('../../assets/card.png');

    let style = stylesWithProps(this.props);
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
        <TouchableOpacity style={{flexDirection: 'row', marginHorizontal: 25}}>
          <Text>Input my </Text>
          <Text style={{color: this.props.themeColor || '#FC6B2D'}}>
            Credit Card
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  getSavedCardsNow = () => {
    return (
      <>
        <View
          style={{
            borderColor: '#DCDCDC',
            borderWidth: 0.3,
            marginTop: 28,
            backgroundColor: '#FBFBFB',
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginVertical: 7,
            marginHorizontal: 15,
          }}
          onPress={() => {
            this.setState({showMobileInputFlow: true});
          }}>
          <Image
            source={require('../../assets/CardPayment.png')}
            style={{
              alignSelf: 'center',
              width: 40,
              height: 40,
              resizeMode: 'contain',
              marginTop: 0,
            }}
          />
          <Text
            style={{
              marginHorizontal: 5,
              fontSize: 16,
              color: this.props.themeColor || '#FC6B2D',
            }}>
            {'Get saved Cards flow'}
          </Text>
          <Image
            source={require('../../assets/orangeRightIndicator.png')}
            style={{
              alignSelf: 'center',
              width: 15,
              height: 14,
              resizeMode: 'contain',
              marginTop: 0,
            }}
          />
        </TouchableOpacity>
        {this.state.showMobileInputFlow ? (
          <MobileNumberFlow
            onClose={() => {
              this.setState({showMobileInputFlow: false});
            }}
            savedCardsData={this.savedCardsData}
            shouldShowOTP={this.state.shouldShowOTP}
            themeColor={this.props.themeColor}
            headerTitle={this.props.headerTitle}
          />
        ) : null}
      </>
    );
  };

  CardNumberView = ({autoFocusCardNumber}) => {
    let style = stylesWithPropsAndStates(this.props, this.state);
    return (
      <TouchableOpacity
        style={style.cardNumberContainerView}
        onPress={() => {
          this.cardNumberRef.current.focus();
          this.cardNameRef.current.blur();
        }}>
        <Image
          source={
            this.state.highlightCardNumView
              ? require('../../assets/selectedCard.png')
              : require('../../assets/unselectedCard.png')
          }
          style={{
            alignSelf: 'center',
            width: this.state.highlightCardNumView ? 22 : 22,
            height: this.state.highlightCardNumView ? 12 : 22,
            resizeMode: 'contain',
            marginLeft: -3,
          }}
        />
        <View>
          <Text>{'Card Number'}</Text>
          <View style={style.cardNumberTextInputView}>
            <TextInput
              style={[styles.input, style.cardNumberView]}
              autoFocus={autoFocusCardNumber}
              placeholder={'XXXX XXXX XXXX XXXX'}
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
          </View>
        </View>
        {this.state.cardNumberError ? (
          <Text style={{color: APP_THEME_COLOR, marginTop: 5}}>
            Wrong card details
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  CardNameView = ({autoFocusCardName}) => {
    let style = stylesWithPropsAndStates(this.props, this.state);
    return (
      <TouchableOpacity
        style={style.cardNameContainerView}
        onPress={() => {
          this.cardNameRef.current.focus();
        }}>
        <Image
          source={
            this.state.highlightCardNameView
              ? require('../../assets/selectedCard.png')
              : require('../../assets/unselectedCard.png')
          }
          style={{
            alignSelf: 'center',
            width: this.state.highlightCardNameView ? 22 : 22,
            height: this.state.highlightCardNameView ? 12 : 22,
            resizeMode: 'contain',
            marginLeft: -3,
          }}
        />
        <View>
          <Text style={{marginLeft: 10}}>{'Name'}</Text>
          <View style={style.cardNameTextInputView}>
            <TextInput
              style={[styles.input, style.cardNumberView]}
              autoFocus={autoFocusCardName}
              placeholder={'Cardholder name' || strings.enterCardName}
              placeholderTextColor={'#B9C4CA'}
              ref={this.cardNameRef}
              value={this.state.cardName}
              selectTextOnFocus={true}
              onFocus={this.onFocusCardName}
              onBlur={this.onBlurCardName}
              onChangeText={text => {
                this.handleCardName(text);
              }}
              returnKeyType="done"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  expiryView = ({autoFocusExpiryMonth}) => {
    let style = stylesWithPropsAndStates(this.props, this.state);
    return (
      <TouchableOpacity
        style={style.cardExpiryContainerView}
        onPress={() => {
          this.cardNameRef.current.focus();
        }}>
        <Image
          source={
            this.state.highlightExpiryMonthView
              ? require('../../assets/selectedCard.png')
              : require('../../assets/unselectedCard.png')
          }
          style={{
            alignSelf: 'center',
            width: this.state.highlightExpiryMonthView ? 22 : 22,
            height: this.state.highlightExpiryMonthView ? 12 : 22,
            resizeMode: 'contain',
            marginLeft: -3,
          }}
        />
        <View>
          <Text style={{marginLeft: 10}}>{'Expiry date'}</Text>
          <View style={style.cardNameTextInputView}>
            <TextInput
              style={[styles.input]}
              autoFocus={autoFocusExpiryMonth}
              placeholder={'MM/YY'}
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
        </View>
      </TouchableOpacity>
    );
  };

  cvvView = ({autoFocusCVV}) => {
    let style = stylesWithPropsAndStates(this.props, this.state);
    return (
      <TouchableOpacity
        style={style.cardCVVContainerView}
        onPress={() => {
          this.cardNameRef.current.focus();
        }}>
        <Image
          source={
            this.state.highlightCVVView
              ? require('../../assets/selectedCard.png')
              : require('../../assets/unselectedCard.png')
          }
          style={{
            alignSelf: 'center',
            width: this.state.highlightCVVView ? 22 : 22,
            height: this.state.highlightCVVView ? 12 : 22,
            resizeMode: 'contain',
            marginLeft: -3,
          }}
        />
        <View>
          <Text style={{marginLeft: 10}}>{'CVV'}</Text>
          <View style={style.cardNameTextInputView}>
            <TextInput
              style={[styles.input]}
              autoFocus={autoFocusCVV}
              placeholder={'CVV'}
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
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  SaveForLater = () => {
    let style = stylesWithPropsAndStates(this.props, this.state);
    return (
      <TouchableOpacity
        style={styles.saveContainerView}
        onPress={() => {
          this.setState({saveForLater: !this.state.saveForLater});
        }}>
        <View style={styles.saveView}>
          <View
            style={[
              styles.saveForlaterView,
              ,
              this.state.saveForLater
                ? {backgroundColor: this.props.themeColor || '#FC6B2D'}
                : {backgroundColor: 'transparent'},
            ]}>
            <View
              style={[
                style.saveForlaterInnerView,
                ,
                this.state.saveForLater
                  ? {backgroundColor: this.props.themeColor || '#FC6B2D'}
                  : {backgroundColor: 'transparent'},
              ]}
            />
          </View>
          <Text style={styles.saveTextView}>
            {'Remember my card for next purchases'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  PayNowView = () => {
    let style = stylesWithProps(this.props);
    return (
      <>
        <View
          style={{
            marginHorizontal: 30,
            flexDirection: 'row',
            shadowColor: '#000000',
            shadowOffset: {width: 0, height: 2},
            borderWidth: 0.5,
            borderColor: '#ECECEC',
            padding: 10,
            borderRadius: 10,
          }}>
          <Image
            source={require('../../assets/shield.png')}
            style={{
              alignSelf: 'center',
              width: 28,
              height: 28,

              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: this.props.themeColor || '#FC6B2D',
              justifyContent: 'center',
              flex: 1,
              flexWrap: 'wrap',
            }}>
            {' '}
            Secure payments as per PCI-DSS standards{' '}
          </Text>
          <TouchableOpacity>
            <Image
              source={require('../../assets/cancelSmall.png')}
              style={{
                alignSelf: 'center',
                width: 20,
                height: 20,
                marginRight: 5,

                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={style.payNowContainerView}
          disabled={
            !this.containCardNumber(this.state.cardNumber) &&
            !this.containCardNumber(this.state.cardName) &&
            !this.containExpiryMonth(this.state.expirationMonth) &&
            !this.containCVV(this.state.cvv)
          }
          onPress={() => {
            this.props.newCardData({
              name: this.state.name,
              cardNumber: this.state.cardNumber,
              expirationYear: this.state.expirationMonth.slice(3, 5),
              expirationMonth: this.state.expirationMonth.slice(0, 2),
              cvv: this.state.cvv,
              saveForLater: this.state.saveForLater,
            });
          }}>
          <View>
            <Text style={styles.payNowTextView}>
              {this.props?.payNowButtonText || strings.payNow}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  render() {
    return (
      <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        enableOnAndroid={true}
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
              height:
                parseInt(this.props.containerHeight.slice(0, -1), 10) < 70
                  ? '85%'
                  : this.props.containerHeight,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}>
          <View style={styles.viewContainer}>
            <this.headerView />
            <this.getSavedCardsNow />

            <this.CardNameView
              autoFocusCardName={this.state.autoFocusCardName}
            />

            <this.CardNumberView
              autoFocusCardNumber={this.state.autoFocusCardNumber}
            />
            <this.expiryView
              autoFocusExpiryMonth={this.state.autoFocusExpiryMonth}
            />
            <this.cvvView autoFocusCVV={this.state.autoFocusCVV} />
            {this.props.showSaveForLater ? <this.SaveForLater /> : null}

            <this.PayNowView />
          </View>
        </RBSheet>
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  saveForlaterView: {
    height: 20,
    width: 20,
    borderColor: 'lightgray',
    borderRadius: 10,
    borderWidth: 1,
  },

  keyBoardContainerView: {
    flex: 1,
  },
  viewContainer: {
    marginHorizontal: 5,
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

  saveTextView: {
    marginLeft: 10,
    color: 'black',
    fontFamily: 'Avenir-light',
    fontSize: 12,
  },
  saveView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveContainerView: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
});
const stylesWithProps = props =>
  StyleSheet.create({
    payNowContainerView: {
      backgroundColor: props.themeColor || '#FC6B2D' || 'black',
      height: 50,
      marginTop: 15,
      marginBottom: 15,
      marginHorizontal: 20,
      justifyContent: 'center',
      borderRadius: 10 || 25,
    },

    headerContainerView: {
      flexDirection: 'row',
      marginBottom: 15,

      marginRight: 15,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    headerViewImage: {
      alignSelf: 'center',
      width: 20,
      height: 20,
      resizeMode: props.headerImageResizeMode || 'contain',
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
    saveForlaterInnerView: {
      height: 16,
      width: 16,
      backgroundColor: state.saveForLater
        ? props.themeColor || 'lightgray'
        : 'transparent',
      borderRadius: 8,
      marginTop: 1,
      marginLeft: 1,
    },

    headerContainerView: {flexDirection: 'row', marginBottom: 15},

    headerViewImage: {
      alignSelf: 'center',
      width: 20,
      height: 20,
      resizeMode: props.headerImageResizeMode || 'contain',
      marginLeft: 15,
    },

    headerViewText: {
      marginLeft: 15,
      fontSize: props.headerTitleFont || 15,
      fontWeight: props.headerTitleWeight || '400',
    },

    cardNameContainerView: {
      marginHorizontal: 15,
      marginVertical: 5,
      marginTop: 3,
      borderWidth: 0.5,
      borderColor: state.highlightCardNameView
        ? props.themeColor || '#FC6B2D'
        : 'transparent',
      padding: 8,
      borderRadius: 15,
      flexDirection: 'row',
    },

    cardNumberContainerView: {
      marginHorizontal: 15,
      marginVertical: 5,
      marginTop: 3,
      borderWidth: 0.5,
      borderColor: state.highlightCardNumView
        ? props.themeColor || '#FC6B2D'
        : 'transparent',
      padding: 8,
      borderRadius: 15,
      flexDirection: 'row',
    },

    cardCVVContainerView: {
      marginHorizontal: 15,
      marginVertical: 5,
      marginTop: 3,
      borderWidth: 0.5,
      borderColor: state.highlightCVVView
        ? props.themeColor || '#FC6B2D'
        : 'transparent',
      padding: 8,
      borderRadius: 15,
      flexDirection: 'row',
    },
    cardExpiryContainerView: {
      marginHorizontal: 15,
      marginVertical: 5,
      marginTop: 3,
      borderWidth: 0.5,
      borderColor: state.highlightExpiryMonthView
        ? props.themeColor || '#FC6B2D'
        : 'transparent',
      padding: 8,
      borderRadius: 15,
      flexDirection: 'row',
    },
    cardNumberTextInputView: {
      flexDirection: 'row',
      marginTop: 0,
      borderRadius: 5,
      marginLeft: -5,
      justifyContent: 'space-between',
    },
    cardNameTextInputView: {
      flexDirection: 'row',
      marginTop: 0,
      borderRadius: 5,
      justifyContent: 'space-between',
    },
    cardNumberImage: {
      alignSelf: 'center',
      width: 20,
      height: 20,
      resizeMode: props.headerImageResizeMode || 'contain',
      marginRight: 15,
      marginLeft: -25,
    },
    cardNumberView: {
      marginRight: 10,
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
      resizeMode: 'contain',
      marginRight: 15,
    },
  });
export default CreditCardForm;
