import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Checkout from "./Checkout";
import { EventRegister } from "react-native-event-listeners";

const { width } = Dimensions.get("screen");
class PayNowButton extends Component {
  constructor(props) {
    super(props);
    this.checkout = React.createRef();
  }

  afterCheckout = (data) => {
    Checkout.close();
    this.props.afterCheckout(data);
  };

  NextView = ({ SubElement }) => {
    let style = stylesWithProps(this.props);
    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        style={style.nextViewContainerStyle}
        onPress={() => {
          Checkout.startPaymentWithWallets(this.props.payload);
          // EventRegister.emit('myCustomEvent', this.props.payload);
        }}
      >
        {SubElement ? (
          <View style={style.subElementView}>
            <SubElement />
          </View>
        ) : (
          <Text style={style.btnText}>{this.props.text || "Pay Now"}</Text>
        )}
      </TouchableOpacity>
    );
  };

  render() {
    var style = stylesWithProps(this.props);
    return (
      <View>
        <View style={style.containerStyle}>
          <this.NextView SubElement={this.props.SubElement} />
        </View>
      </View>
    );
  }
}

const stylesWithProps = (props) =>
  StyleSheet.create({
    subElementView: {
      padding: 5,
      height: props.height,
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    btnText: {
      textAlign: "center",
      color: props.textColor,
      fontSize: props.textFontSize || 14,
      fontWeight: props.textFontWeight,
    },

    nextViewContainerStyle: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: props.disabled ? "lightgray" : props.themeColor || "red",
      paddingVertical: 15,
      borderRadius: props.borderRadius || 8,
      paddingHorizontal: 15,
      width: props.width,
      height: props.height,
    },
    containerStyle: {
      backgroundColor: "white",
      margin: 4,
      borderRadius: 5,
      marginHorizontal: 15,
    },
  });

export default PayNowButton;
