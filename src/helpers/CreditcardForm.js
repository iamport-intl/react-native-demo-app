import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Animated,
} from 'react-native';
import {
  APP_THEME_COLOR,
  BOLD,
  descriptionText,
  HEADERBLACK,
  strings,
  TRANSPARENT,
  WHITE_COLOR,
} from '../constants';
var valid = require('card-validator');

//import TextField from "../helpers/TextField";
const {width, height} = Dimensions.get('screen');
class CreditCardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      cardNumber: '',
      expiration: '',
      cvv: '',
      isFocused: false,
      cardNumberError: false,
      expiryError: false,
      cardValidation: {},
    };
    this.carNumberRef = React.createRef();
    this.cardNameRef = React.createRef();
    this.expiryRef = React.createRef();
    this.cvvRef = React.createRef();
    this.focusAnim = React.createRef(new Animated.Value(0)).current;
  }
  onSubmit() {
    console.log('form submitted');
  }

  handlingCardExpiry(text) {
    if (text.indexOf('.') >= 0 || text.length > 7) {
      return;
    }
    if (text.length === 2 && this.state.expiration.length === 1) {
      text += '/';
    }
    this.setState({
      expiration: text,
    });
    this.props.newCardData({
      name: this.state.name,
      cardNumber: this.state.cardNumber,
      expiration: text,
      cvv: this.state.cvv,
    });
    var numberValidation = valid.expirationDate(text);
    this.setState({expiryError: !numberValidation.isValid});
  }

  handleCardNumber(text) {
    if (text.indexOf('.') >= 0) {
      return;
    }

    var numberValidation = valid.number(text);
    this.setState({cardValidation: numberValidation});
    if (text.length > 13) {
      this.setState({cardNumberError: !numberValidation.isValid});
    } else {
      this.setState({cardNumberError: false});
    }
    let formattedText = text
      .replace(/\s?/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
    this.setState({cardNumber: formattedText});
    this.props.newCardData({
      name: this.state.name,
      cardNumber: text,
      expiration: this.state.expiration,
      cvv: this.state.cvv,
    });
  }

  TextField = ({
    value,
    defaultPlaceholder,
    label,
    onChangeText,
    containerStyles,
    onFocus,
    onBlur,
    keyboardType = 'default',
    ref,
    cardNumberError,
    expiryError,
  }) => {
    let color = descriptionText;

    return (
      <View style={{marginVertical: 5, ...containerStyles}}>
        <Text
          style={[
            styles.label,
            {
              color,
              paddingVertical: 4,
            },
          ]}>
          {label}
        </Text>
        <TextInput
          style={[styles.input]}
          placeholder={defaultPlaceholder}
          placeholderTextColor={'#B9C4CA'}
          ref={ref}
          value={value}
          selectTextOnFocus={true}
          onFocus={event => {}}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
        {cardNumberError ? (
          <Text style={{color: APP_THEME_COLOR}}>Wrong card details</Text>
        ) : null}
      </View>
    );
  };
  render() {
    return (
      <View
        style={{
          backgroundColor: WHITE_COLOR,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          borderRadius: 5,
        }}>
        <View
          style={{
            backgroundColor: WHITE_COLOR,
            margin: 15,
            marginTop: 5,
          }}>
          <this.TextField
            style={styles.textField}
            label={strings.card_holder_name}
            value={this.state.name}
            defaultPlaceholder={strings.card_holder_name}
            onChangeText={text => {
              this.setState({name: text});
              this.props.newCardData({
                name: text,
                cardNumber: this.state.cardNumber,
                expiration: this.state.expiration,
                cvv: this.state.cvv,
              });
            }}
            onBlur={text => {}}
            ref={this.cardNameRef}
          />
          <this.TextField
            style={styles.textField}
            label={strings.card_number}
            defaultPlaceholder={'1234 1234 1234 1234'}
            value={this.state.cardNumber}
            keyboardType="numeric"
            onChangeText={text => {
              this.handleCardNumber(text);
            }}
            onBlur={this.onCardNumberBlur}
            ref={this.carNumberRef}
            cardNumberError={this.state.cardNumberError}
          />
          <View style={styles.row}>
            <this.TextField
              containerStyles={{
                marginHorizontal: 5,
                width: (width - 80) / 2,
              }}
              label={strings.exp_date}
              defaultPlaceholder={'MM/YYYY'}
              value={this.state.expiration}
              keyboardType="numeric"
              onChangeText={text => {
                this.handlingCardExpiry(text);
              }}
              onBlur={this.onExpiryBlur}
              ref={this.expiryRef}
              expiryError={this.state.expiryError}
            />
            <this.TextField
              containerStyles={{
                marginHorizontal: 15,
                width: (width - 100) / 2,
              }}
              label={strings.cvv}
              value={this.state.cvv}
              defaultPlaceholder={'X X X'}
              keyboardType="numeric"
              onChangeText={text => {
                this.setState({cvv: text});
                this.props.newCardData({
                  name: this.state.name,
                  cardNumber: this.state.cardNumber,
                  expiration: this.state.expiration,
                  cvv: text,
                });
              }}
              onBlur={text => {}}
              ref={this.cvvRef}
            />
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
    backgroundColor: '#F2F2F2',
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
});
export default CreditCardForm;
