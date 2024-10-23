import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Animated,
  Image,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
} from "react-native";
import { isEmpty } from "lodash";
import {
  APP_THEME_COLOR,
  BOLD,
  strings,
  TRANSPARENT,
  WHITE_COLOR,
} from "./constants.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MobileNumberAuthenticationView from "./MobileAuthenticationView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { helpers } from "./helper";

//import TextField from "../helpers/TextField";
const { width } = Dimensions.get("screen");
class SavedCardsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      cardNumber: "",
      expirationYear: "",
      expirationMonth: "",
      cvv: "",
      isFocused: false,
      cardNumberError: false,
      expiryError: false,
      cardValidation: {},
      autoFocusCardNumber: false,
      autoFocusExpiryMonth: false,
      autoFocusExpiryYear: false,
      autoFocusCVV: false,
      selectedItem: {},
      expanded: undefined,
      savedCardsData: undefined,
      showAuthenticationFlow:
        props.showAuthenticationFlow !== undefined
          ? props.showAuthenticationFlow
          : true,
    };
    this.cardNumberRef = React.createRef();
    this.monthRef = React.createRef();
    this.expiryYearRef = React.createRef();
    this.expiryMonthRef = React.createRef();
    this.cvvRef = React.createRef();
    this.focusAnim = React.createRef(new Animated.Value(0)).current;
  }

  componentDidMount() {
    AsyncStorage.getItem("formattedMobileNumber").then((number) => {
      AsyncStorage.getItem("SavedCardsData").then((data) => {
        let value = JSON.parse(data);

        if (value?.token) {
          this.setState({ savedCardsData: value });

          this.setState({ showAuthenticationFlow: false });
          helpers
            .fetchSavedCards(number, this.state.OTP, value.token)
            .then((val) => {
              if (
                val?.status === 200 ||
                val?.status === 201 ||
                val?.status_code === "2000"
              ) {
                this.setState({ savedCards: value?.data?.content });
                this.setState({
                  mobileNumberVerificationDone: true,
                });
                this.setState({ shouldShowOTP: false });
              } else {
                this.setState({
                  mobileNumberVerificationDone: false,
                  shouldShowOTP: true,
                });

                AsyncStorage.setItem("SavedCardsData", JSON.stringify({}));
                this.setState({ savedCards: {} });

                helpers.getOTP(number).then((val) => {
                  if (val.status === 200 || val.status === 201) {
                    this.setState({ showAuthenticationFlow: true });
                    this.setState({ shouldShowOTP: true });
                  }
                });
              }
            });
        } else {
          this.setState({ expanded: true });
        }
      });
    });

    this._didShowListener = Keyboard.addListener(
      "keyboardWillShow",
      this.onKeyboarDidShow.bind(this)
    );
    this._willHideListener = Keyboard.addListener(
      "keyboardWillHide",
      this.onKeyboardWillHide.bind(this)
    );
    if (this.state.showAuthenticationFlow === false) {
      this.setState({ expanded: true });
    }
  }

  componentWillUnmount() {
    this._didShowListener.remove();
    this._willHideListener.remove();
  }
  onKeyboarDidShow(e) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);

    this.setState({ keyboardDismissed: false });
  }

  onKeyboardWillHide(e) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.setState({ keyboardDismissed: true });
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };

  headerView = () => {
    let image = this.props.headerImage
      ? { uri: this.props.headerImage }
      : require("../assets/card.png");

    let style = stylesWithProps(this.props);
    return (
      <>
        <TouchableOpacity
          style={style.headerContainerView}
          activeOpacity={0.8}
          onPress={this.changeLayout}
        >
          {this.props.headerImage ? (
            <Image source={image} style={style.headerViewImage} />
          ) : null}
          <Text style={style.headerViewText}>{this.props.headerTitle}</Text>

          <View>
            <Image
              source={
                this.state.expanded
                  ? require("../assets/expand.png")
                  : require("../assets/colapse.png")
              }
              style={style.headerViewImage}
            />
          </View>
        </TouchableOpacity>
        {this.state.expanded && !this.state.showAuthenticationFlow ? (
          <View style={style.dashedContainerView}>
            <View style={style.dashedView} />
          </View>
        ) : null}
      </>
    );
  };

  PayNowView = () => {
    let style = stylesWithProps(this.props);
    return (
      <TouchableOpacity
        style={style.payNowContainerView}
        disabled={false}
        onPress={() => {
          this.props.newCardData({
            name: this.state.name,
            cardNumber: this.state.cardNumber,
            expirationYear: this.state.expirationYear,
            expirationMonth: this.state.expirationMonth,
            cvv: this.state.cvv,
          });
        }}
      >
        <View>
          <Text style={style.payNowTextView}>Pay Now</Text>
        </View>
      </TouchableOpacity>
    );
  };

  didSelected = (item) => {
    this.setState({ selectedItem: item });
    this.props.selectedItem(item);
  };

  savedCardsData = (data) => {
    if (isEmpty(data)) {
      this.setState({
        shouldShowOTP: true,
        showAuthenticationFlow: true,
        mobileNumberVerificationDone: false,
        expanded: false,
        savedCardsData: undefined,
      });
    } else {
      this.setState({
        shouldShowOTP: false,
        showAuthenticationFlow: false,
        mobileNumberVerificationDone: true,
        expanded: true,
        savedCardsData: data,
      });
    }
  };
  renderFlatList = ({ data }) => {
    return data.map((item) => {
      const isSelected = item.name === this.state.selectedItem.name;

      let product = {
        name: `${item.partial_card_number}`,
        description: `${item.expiry_month} / ${item.expiry_year}`,
        ...item,
      };
      let image = item.logo
        ? { uri: item.logo }
        : require("../assets/card.png");
      let style = stylesWithProps(this.props);
      return (
        <View style={styles.flatListContainerView}>
          <TouchableOpacity
            style={styles.flatListButtonContainerView}
            onPress={() => {
              this.didSelected(item);
            }}
          >
            <View style={styles.flatListButtonView}>
              <View style={style.checkBoxContainerView}>
                <View
                  style={[
                    style.checkBoxView,
                    {
                      backgroundColor: isSelected
                        ? this.props.checkBoxSelectionColor
                        : "transparent",
                    },
                  ]}
                />
              </View>
              <View style={styles.checkBoxTextView}>
                <Text style={style.checkBoxText}>{product.name}</Text>
                {item.description ? (
                  <Text style={style.checkBoxDescriptionText}>
                    {product.description}
                  </Text>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
          {false ? (
            <View style={styles.cvvContainerView}>
              <View style={styles.cvvView}>
                <TextInput
                  autoFocus={false}
                  placeholder={"XXX"}
                  textAlign={"center"}
                  placeholderTextColor={"#B9C4CA"}
                  ref={this.cvvRef}
                  value={this.state.cvv}
                  selectTextOnFocus={true}
                  onFocus={this.onFocusCVV}
                  onBlur={this.onBlurCVV}
                  onChangeText={(text) => {
                    if (text.indexOf(".") >= 0 || text.length > 3) {
                      return;
                    }

                    this.setState({ cvv: text });
                  }}
                  keyboardType={"numeric"}
                  returnKeyType={"done"}
                />
              </View>
              <View style={styles.cvvImageView}>
                <Image source={image} style={styles.cvvImage} />
              </View>
            </View>
          ) : null}
        </View>
      );
    });
  };

  render() {
    let style = stylesWithPropsAndState(this.props, this.state);
    let styleWithProps = stylesWithProps(this.props);

    return (
      <View style={[style.mainView, style.mainFlexView]}>
        <KeyboardAwareScrollView
          contentContainerStyle={[styles.keyboardContainerView]}
          enableOnAndroid={true}
          scrollEnabled={true}
        >
          <View style={styleWithProps.subView}>
            <this.headerView />
            {this.state.showAuthenticationFlow || this.state.shouldShowOTP ? (
              <MobileNumberAuthenticationView
                savedCardsData={this.savedCardsData}
                shouldShowOTP={this.state.shouldShowOTP}
                themeColor={this.props.themeColor}
              />
            ) : this.state.expanded ? (
              <this.renderFlatList
                data={
                  this.state.savedCardsData?.content?.length > 0
                    ? this.state.savedCardsData?.content
                    : this.props.data
                }
              />
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cvvContainerView: {
    borderColor: "#E7E9F1",
    width: "25%",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  cvvView: {
    width: "70%",
    alignContent: "center",
    justifyContent: "center",
  },
  cvvImageView: {
    width: "30%",
    flex: 1,
  },
  cvvImage: {
    flex: 1,
    resizeMode: "contain",
    margin: 4,
    marginLeft: 0,
  },
  checkBoxTextView: { marginLeft: 15 },
  keyboardContainerView: {
    flexGrow: 1,
    marginVertical: 10,
  },
  flatListContainerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 10,
  },
  flatListButtonContainerView: {
    flexDirection: "row",
    marginVertical: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatListButtonView: {
    flexDirection: "row",
    alignItems: "center",
  },
});
const stylesWithPropsAndState = (props, state) =>
  StyleSheet.create({
    mainView: { backgroundColor: "white" },
    mainFlexView:
      !state.keyboardDismissed && state.showAuthenticationFlow
        ? { flexGrow: 1 }
        : {},
  });
const stylesWithProps = (props) =>
  StyleSheet.create({
    checkBoxContainerView: {
      borderRadius: props.checkBoxHeight / 2,
      height: props.checkBoxHeight,
      width: props.checkBoxHeight,
      borderWidth: 1,
      borderColor: props.checkBoxColor,
      justifyContent: "center",
      alignItems: "center",
    },
    checkBoxView: {
      borderRadius: (props.checkBoxHeight - 6) / 2,
      height: props.checkBoxHeight - 6,
      width: props.checkBoxHeight - 6,
    },
    checkBoxText: {
      fontSize: props.nameFontSize || 15,
      fontWeight: props.nameFontWeight || "300",
    },
    checkBoxDescriptionText: {
      fontSize: props.subNameFontSize || 12,
      fontWeight: props.subNameFontWeight || "200",
      marginTop: 3,
    },
    mainView: {
      backgroundColor: "white",
      paddingTop: props.containerVerticalPadding,
      paddingBottom: props.containerVerticalPadding,
      borderColor: "lightgray",
      borderWidth: 2,
      margin: 4,
      borderRadius: 5,
    },
    subView: {
      backgroundColor: "white",
      paddingTop: props.containerVerticalPadding,
      paddingBottom: props.containerVerticalPadding,
      borderColor: "lightgray",
      borderWidth: 2,
      margin: 4,
      borderRadius: 5,
    },
    dashedContainerView: {
      height: 1,
      marginHorizontal: 15,
      marginTop: 10,
      borderRadius: 1,
      borderWidth: 1,
      borderColor: "#D5D5D5",
      borderStyle: "dashed",
      zIndex: 0,
    },

    dashedView: {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      height: 1,
      backgroundColor: "white",
      zIndex: 1,
    },
    payNowTextView: {
      paddingHorizontal: 20,
      textAlign: "center",
      color: "white",
      fontFamily: "Avenir-Medium",
      fontSize: 20,
    },

    payNowContainerView: {
      backgroundColor: props.themeColor,
      height: 50,
      marginTop: 15,
      marginHorizontal: 20,
      justifyContent: "center",
      borderRadius: 25,
    },

    headerContainerView: {
      flexDirection: "row",

      alignItems: "center",
      marginHorizontal: 15,
      justifyContent: "space-between",
      backgroundColor: "transparent",
    },

    headerViewImage: {
      alignSelf: "center",
      width: 20,
      height: 20,
      resizeMode: props.headerImageResizeMode,
      marginLeft: 15,
    },

    headerViewText: {
      marginLeft: 5,
      fontSize: props.headerTitleFont || 15,
      fontWeight: props.headerTitleWeight || "400",
    },
  });

export default SavedCardsView;
