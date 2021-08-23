import React, { useState } from "react";
import { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import ThemedDialog from "react-native-elements/dist/dialog/Dialog";
import {
  APP_THEME_COLOR,
  BOLD,
  descriptionText,
  HEADERBLACK,
  TRANSPARENT,
  WHITE_COLOR,
} from "../constants";

//import TextField from "../helpers/TextField";
const { width, height } = Dimensions.get("screen");
class CreditCardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      cardNumber: "",
      expiration: "",
      cvv: "",
      isFocused: false,
    };
    this.inputRef = React.createRef();
    this.focusAnim = React.createRef(new Animated.Value(0)).current;
  }
  onSubmit() {
    console.log("form submitted");
  }

  TextField = ({
    value,
    defaultPlaceholder,
    label,
    onChangeText,
    containerStyles,
    onFocus,
    onBlur,
  }) => {
    let color = descriptionText;

    return (
      <View style={{ marginVertical: 8, ...containerStyles }}>
        <Text
          style={[
            styles.label,
            {
              color,
              paddingVertical: 4,
            },
          ]}
        >
          {label}
        </Text>
        <TextInput
          style={[styles.input]}
          placeholder={defaultPlaceholder}
          placeholderTextColor={"#B9C4CA"}
          ref={this.inputRef}
          value={value}
          selectTextOnFocus={true}
          onBlur={(event) => {
            this.setState({ isFocused: false });
            onBlur(value);
          }}
          onFocus={(event) => {
            this.setState({ isFocused: true });
          }}
          onChangeText={onChangeText}
        />
      </View>
    );
  };
  render() {
    return (
      <View style={{ backgroundColor: TRANSPARENT, padding: 10 }}>
        <this.TextField
          style={styles.textField}
          label="Cardholder Name"
          value={this.state.name}
          defaultPlaceholder={"Name"}
          onChangeText={(text) => {
            this.setState({ name: text });
            this.props.newCardData({
              name: text,
              cardNumber: this.state.cardNumber,
              expiration: this.state.expiration,
              cvv: this.state.cvv,
            });
          }}
          onBlur={(text) => {
            console.log(" text", text);
          }}
        />
        <this.TextField
          style={styles.textField}
          label="Card Number"
          defaultPlaceholder={"1234 1234 1234 1234"}
          value={this.state.cardNumber}
          onChangeText={(text) => {
            this.setState({ cardNumber: text });
            this.props.newCardData({
              name: this.state.name,
              cardNumber: text,
              expiration: this.state.expiration,
              cvv: this.state.cvv,
            });
          }}
          onBlur={(text) => {}}
        />
        <View style={styles.row}>
          <this.TextField
            containerStyles={{ width: (width - 120) / 2 }}
            label="Expiration Date"
            defaultPlaceholder={"MM/YY"}
            value={this.state.expiration}
            onChangeText={(text) => {
              this.setState({ expiration: text });
              console.log("text", text);
              this.props.newCardData({
                name: this.state.name,
                cardNumber: this.state.cardNumber,
                expiration: text,
                cvv: this.state.cvv,
              });
            }}
            onBlur={(text) => {}}
          />
          <this.TextField
            containerStyles={{ marginHorizontal: 30, width: (width - 40) / 2 }}
            label="Security Code"
            value={this.state.cvv}
            defaultPlaceholder={"X X X"}
            onChangeText={(text) => {
              this.setState({ cvv: text });
              console.log("text", text);
              this.props.newCardData({
                name: this.state.name,
                cardNumber: this.state.cardNumber,
                expiration: this.state.expiration,
                cvv: text,
              });
            }}
            onBlur={(text) => {}}
          />
        </View>
        {/* <View style={styles.verifyContainerView}>
          <TouchableOpacity
            style={styles.verifyButtonView}
            onPress={async () => {
              //TODO: Call the Payment with necessary Data changes
              this.props.confirmCardPayment({
                cardNumber: this.state.cardNumber,
                cardType: "VISA",
                name: this.state.name,
                serviceCode: this.state.cvv,
                month: this.state.expiration.slice(0, -3),
                year: this.state.expiration.slice(3, 5),
              });
            }}
          >
            <Text style={styles.verifyTextView}>Confirm payment</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  textField: {
    flex: 1,
    marginTop: 24,
  },
  input: {
    padding: 14,

    borderRadius: 4,
    fontSize: 16,
    backgroundColor: "#F2F2F2",
  },
  labelContainer: {
    position: "absolute",
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333333",
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: "#B00020",
    fontFamily: "Avenir-Medium",
  },
  verifyButtonView: {
    height: 50,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 5,
    paddingVertical: 5,
    width: width - 60,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: APP_THEME_COLOR,
    flex: 1,
  },
  verifyTextView: {
    alignSelf: "center",
    textAlign: "center",
    alignItems: "center",
    color: WHITE_COLOR,

    fontWeight: BOLD,
    fontSize: 16,
  },
  verifyContainerView: {
    backgroundColor: TRANSPARENT,
    width: width - 40,
    alignItems: "center",
  },
});
export default CreditCardForm;
