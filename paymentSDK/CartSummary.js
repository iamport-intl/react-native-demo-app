import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import "intl";
import "intl/locale-data/jsonp/en";

import HorizontalTextStackView from "./subElements/HorizontalStackView";
import { WHITE_COLOR } from "./constants";
class CartSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: true,
    };
  }

  formatNumber = (number) => {
    let formattedNumber = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "VND",
    }).format(number);
    return formattedNumber;
  };

  render() {
    var styles = stylesWithProps(this.props);

    let totalAmount = this.props.totalAmount;
    let deliveryAmount = this.props.deliveryAmount || 0;

    return (
      <View style={styles.containerStyle}>
        <View style={styles.innerViewStyle}>
          {this.props.hideHeaderView ? null : (
            <Text style={styles.paymentText}>{this.props.headerTitle}</Text>
          )}
          <HorizontalTextStackView
            item={{
              name: this.props.amountTitle,
              value: `${this.formatNumber(totalAmount)}`,
              fontSize: this.props.amountFont,
              fontWeight: this.props.amountFontWeight,
              color: this.props.amountColor,
            }}
          />
          <HorizontalTextStackView
            item={{
              name: this.props.deliveryTitle,
              value: `${this.formatNumber(deliveryAmount)}`,
              fontSize: this.props.deliveryFont,
              fontWeight: this.props.deliveryFontWeight,
              color: this.props.deliveryColor,
            }}
          />
          <HorizontalTextStackView
            item={{
              name: this.props.summaryTitle,
              value: `${this.formatNumber(totalAmount + deliveryAmount)}`,
              fontSize: this.props.summaryFont,
              fontWeight: this.props.summaryFontWeight,
              color: this.props.summaryColor,
            }}
          />
        </View>
      </View>
    );
  }
}

const stylesWithProps = (props) =>
  StyleSheet.create({
    btnText: {
      textAlign: "center",
      color: props.textColor,
      fontSize: props.textFontSize || 14,
      fontWeight: props.textFontWeight,
    },

    containerStyle: props.removeBorder
      ? { padding: 10 }
      : {
          borderRadius: 9,
          padding: 10,
          borderColor: "lightgray",
          borderWidth: 1,
          marginHorizontal: 10,
        },
    innerViewStyle: {
      marginHorizontal: 15,

      shadowRadius: 1,
      shadowOffset: {
        height: 1,
      },
      backgroundColor: props.backgroundColor
        ? props.backgroundColor
        : WHITE_COLOR,
      paddingTop: 10,
    },
    paymentText: {
      fontWeight: props.headerFontWeight,
      fontSize: props.headerFont,
      color: props.headerColor,
      marginBottom: 15,
    },
  });

export default CartSummary;
