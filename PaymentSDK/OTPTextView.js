import React, { Component } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { filter } from "lodash";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    height: 50,
    width: 50,
    borderBottomWidth: 4,
    margin: 5,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "500",
    color: "#000000",
  },
});

const getOTPTextChucks = (inputCount, inputCellLength, text) => {
  let otpText =
    text.match(new RegExp(".{1," + inputCellLength + "}", "g")) || [];

  otpText = otpText.slice(0, inputCount);

  return otpText;
};

class OTPTextView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: 0,
      otpText: getOTPTextChucks(
        props.inputCount,
        props.inputCellLength,
        props.defaultValue
      ),
    };

    this.inputs = [];
  }

  basicValidation = (text) => {
    const validText = /^[0-9a-zA-Z]+$/;
    return text.match(validText);
  };

  onTextChange = (text, i) => {
    const { inputCellLength, inputCount, handleTextChange, defaultValue } =
      this.props;

    if (defaultValue) {
      this.setState({
        otpText: getOTPTextChucks(inputCount, inputCellLength, defaultValue),
      });
    }

    let otpText = filter(this.state.otpText, (val) => val !== "");

    if (
      (text && !this.basicValidation(text)) ||
      (otpText.length === 6 && text.length !== 0)
    ) {
      return;
    }

    this.setState(
      (prevState) => {
        let { otpText } = prevState;

        let x = [...text];
        if (x.length === 6) {
          otpText = x;
        } else if (x.length <= 6) {
          otpText[i] = text;
        }

        return {
          otpText,
        };
      },
      () => {
        handleTextChange(this.state.otpText.join(""));

        if (text.length === inputCellLength && i !== inputCount - 1) {
          this.inputs[i + 1].focus();
        }
        if (text.length === 6) {
          this.inputs[inputCount - 1].focus();
        }
      }
    );
  };

  onInputFocus = (i) => {
    const { defaultValue, inputCount, inputCellLength } = this.props;

    if (defaultValue) {
      this.setState({
        otpText: getOTPTextChucks(inputCount, inputCellLength, defaultValue),
      });
    }
    const { otpText } = this.state;

    const prevIndex = i - 1;

    if (prevIndex > -1 && !otpText[prevIndex] && !otpText.join("")) {
      this.inputs[prevIndex].focus();
      return;
    }
    // if (otpText[0].length > 0) {
    //   this.setState({otpText: otpText[0]});
    // }
    console.log("onInoutFocus", otpText);
    this.setState({ focusedInput: i });
  };

  onKeyPress = (e, i) => {
    const val = this.state.otpText[i] || "";

    if (e.nativeEvent.key === "Backspace" && i !== 0 && !val.length) {
      this.inputs[i - 1].focus();
    }
  };

  onSubmitEditing = (data) => {
    console.log("onSubmitEditing", data);
  };
  onEndEditing = (data) => {
    console.log("onEndEditing", data);
  };
  clear = () => {
    this.setState(
      {
        otpText: [],
      },
      () => {
        this.inputs[0].focus();
        this.props.handleTextChange("");
      }
    );
  };

  setValue = (value) => {
    const { inputCount, inputCellLength } = this.props;

    const updatedFocusInput = value.length - 1;

    this.setState(
      {
        otpText: getOTPTextChucks(inputCount, inputCellLength, value),
      },
      () => {
        if (this.inputs[updatedFocusInput]) {
          this.inputs[updatedFocusInput].focus();
        }

        this.props.handleTextChange(value);
      }
    );
  };

  onEndEditing = (text) => {
    // console.log('ONEND EDITINF', text);
  };
  render() {
    const {
      inputCount,
      offTintColor,
      tintColor,
      defaultValue,
      inputCellLength,
      containerStyle,
      textInputStyle,
      keyboardType,
      ...textInputProps
    } = this.props;

    const { focusedInput, otpText } = this.state;
    let val = getOTPTextChucks(inputCount, inputCellLength, defaultValue);

    let otp = defaultValue ? val : otpText;
    const TextInputs = [];

    for (let i = 0; i < inputCount; i += 1) {
      const inputStyle = [
        styles.textInput,
        textInputStyle,
        { borderColor: offTintColor },
      ];

      if (focusedInput === i) {
        inputStyle.push({ borderColor: tintColor });
      }

      TextInputs.push(
        <TextInput
          ref={(e) => {
            this.inputs[i] = e;
          }}
          key={i}
          autoCorrect={false}
          keyboardType={keyboardType}
          autoFocus={false}
          value={otp[i] || ""}
          style={inputStyle}
          maxLength={6}
          onFocus={() => this.onInputFocus(i)}
          onChangeText={(text) => this.onTextChange(text, i)}
          onChange={this.onChange}
          onEndEditing={this.onEndEditing}
          multiline={false}
          onKeyPress={(e) => this.onKeyPress(e, i)}
          {...textInputProps}
        />
      );
    }

    return <View style={[styles.container, containerStyle]}>{TextInputs}</View>;
  }
}

OTPTextView.propTypes = {
  defaultValue: PropTypes.string,
  inputCount: PropTypes.number,
  containerStyle: PropTypes.any,
  textInputStyle: PropTypes.any,
  inputCellLength: PropTypes.number,
  tintColor: PropTypes.string,
  offTintColor: PropTypes.string,
  handleTextChange: PropTypes.func,
  inputType: PropTypes.string,
  keyboardType: PropTypes.string,
};

OTPTextView.defaultProps = {
  defaultValue: "",
  inputCount: 4,
  tintColor: "#3CB371",
  offTintColor: "#DCDCDC",
  inputCellLength: 1,
  containerStyle: {},
  textInputStyle: {},
  handleTextChange: () => {},
  keyboardType: "numeric",
};

export default OTPTextView;
