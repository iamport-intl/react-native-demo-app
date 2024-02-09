import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Checkout} from '@iamport-intl/portone-sdk';

const {width} = Dimensions.get('screen');
class PayNowButton extends Component {
  constructor(props) {
    super(props);
    this.checkout = React.createRef();
  }

  afterCheckout = data => {
    console.log(data);
    this.props.afterCheckout(data);
  };

  NextView = () => {
    let style = stylesWithProps(this.props);
    return (
      <TouchableOpacity
        style={style.nextViewContainerStyle}
        onPress={async () => {
          this.checkout.current.startPaymentWithWallets(this.props.payload);
        }}>
        <Text style={style.btnText}>{this.props.text || 'Pay Now'}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    var style = stylesWithProps(this.props);
    return (
      <View>
        <View style={style.containerStyle}>
          <this.NextView />
        </View>
        {/* <Checkout
          ref={this.checkout}
          env={this.props.env}
          currency={this.props.currency}
          callbackFunction={this.afterCheckout}
          redirectUrl={this.props.redirectUrl}
          secretKey={this.props.secretKey}
          chaipayKey={this.props.chaipayKey}
          environment={this.props.environment}
        /> */}
      </View>
    );
  }
}

const stylesWithProps = props =>
  StyleSheet.create({
    btnText: {
      textAlign: 'center',
      color: props.textColor,
      fontSize: props.textFontSize || 14,
      fontWeight: props.textFontWeight,
    },

    nextViewContainerStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.themeColor || 'red',
      paddingVertical: 15,
      borderRadius: props.borderRadius || 8,
      paddingHorizontal: 15,
      width: props.width,
      height: props.height,
    },
    containerStyle: {
      backgroundColor: 'white',
      margin: 4,
      borderRadius: 5,
      marginHorizontal: 15,
    },
  });

export default PayNowButton;
