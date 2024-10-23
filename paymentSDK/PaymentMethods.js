import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import { first, filter, isEmpty } from "lodash";
import { hexToRgb, formatNumber } from "./helper";

import {
  APP_THEME_COLOR,
  BOLD,
  strings,
  TRANSPARENT,
  WHITE_COLOR,
  IMAGE_BACKGROUND_COLOR,
} from "./constants.js";
import DashedLine from "./subElements/DashedLine";
import Indicator from "../assets/indicator.svg";
import Wallet from "../assets/wallet.svg";
import Card from "../assets/card.svg";

import { helpers } from "./helper";
import PayNowButton from "./PayNowButton";
import CreditCardForm from "./CreditCardForm.js";
import WalletView from "./WalletView.js";

//import TextField from "../helpers/TextField";
const { width, height } = Dimensions.get("screen");
class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = { walletsList: [], showCreditCardUI: false };
  }

  componentDidMount() {
    helpers
      .fetchAvailablePaymentGateway()
      .then((data) => {
        let filteredWalletList = filter(data.data.WALLET, (item) => {
          return item.is_enabled;
        });

        let filterCardList = filter(data.data.CARD, (item) => {
          return (
            item.is_default &&
            item.is_enabled &&
            item.sub_type.includes("INT_CREDIT_CARD")
          );
        });
        this.setState({
          totalListOfPayments: data.data,
          all: data.data.ALL,
          walletsList: filteredWalletList,
          paymentCardType: filterCardList,
          cardList: data.data.CARD,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  headerView = () => {
    return (
      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            paddingTop: 15,
            paddingBottom: 6,
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "white",
            marginHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontSize: this.props.headerFontSize || 15,
              fontWeight: this.props.headerFontWeight || "400",
              color: this.props.headerColor,
            }}
          >
            {this.props.headerTitle}
          </Text>
        </View>
      </View>
    );
  };

  itemView = ({
    titleName,
    style,
    onPress,
    subElement,
    showIndicator = true,
    isSelected,
    creditCardView,
    showUnderline = true,
    itemIcon,
  }) => {
    const colapsableImage = require("../assets/Indicator.png");
    const layout = this.props.layout;
    return (
      <>
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
          <View
            style={[
              style?.paymentHeaderView,
              { paddingVertical: 8 },
              layout == 0
                ? {}
                : layout === 1
                ? {
                    borderWidth: 0.5,
                    borderColor: hexToRgb(this.props.themeColor, 0.5),
                    borderRadius: 27.5,
                    marginHorizontal: 12,
                    marginVertical: 8,
                    height: 55,
                  }
                : layout === 2
                ? {
                    backgroundColor: hexToRgb(this.props.themeColor, 0.05),
                    borderRadius: 15,
                    marginHorizontal: 12,
                    marginVertical: 8,
                    height: 55,
                  }
                : layout === 3
                ? {
                    backgroundColor: hexToRgb(this.props.themeColor, 0.05),
                    borderRadius: 27.5,
                    marginHorizontal: 12,
                    marginVertical: 8,
                    height: 55,
                  }
                : {},
              isSelected
                ? layout == 0
                  ? {
                      backgroundColor: hexToRgb(this.props.themeColor, 0.05),

                      marginHorizontal: 15,
                      borderRadius: 5,
                    }
                  : layout === 1
                  ? {
                      borderWidth: 0.5,
                      borderColor: hexToRgb(this.props.themeColor, 0.5),
                      backgroundColor: hexToRgb(this.props.themeColor, 0.05),
                      borderRadius: 27.5,
                      marginHorizontal: 12,
                      marginVertical: 8,
                      height: 55,
                    }
                  : layout === 2
                  ? {
                      borderColor: hexToRgb(this.props.themeColor, 0.5),
                      borderWidth: 0.5,
                      borderRadius: 15,
                      marginHorizontal: 12,
                      marginVertical: 8,
                      height: 55,
                    }
                  : layout === 3
                  ? {
                      borderColor: hexToRgb(this.props.themeColor, 0.5),
                      borderWidth: 0.5,
                      borderRadius: 27.5,
                      marginHorizontal: 12,
                      marginVertical: 8,
                      height: 55,
                    }
                  : {}
                : {},
            ]}
          >
            <View style={{ flexDirection: "row", paddingVertical: 12 }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  marginLeft: 15,
                }}
              >
                {itemIcon ? (
                  itemIcon()
                ) : (
                  <Wallet fill={this.props.themeColor} />
                )}
              </View>

              <Text
                style={[
                  style?.primaryHeadertext,
                  {
                    fontSize: this.props.fontSize || 13,
                    textAlign: "center",
                    alignSelf: "center",
                    fontWeight: this.props.fontWeight || "300",
                  },
                ]}
              >
                {titleName}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              {subElement ? subElement() : null}
              {showIndicator ? (
                <View
                  style={{
                    alignSelf: "center",
                    width: 20,
                    height: 10,
                    resizeMode: "contain",
                    marginTop: 0,
                    marginRight: 5,
                    marginLeft: 10,
                  }}
                >
                  <Indicator
                    fill={this.props.themeColor}
                    width={20}
                    height={10}
                  />
                </View>
              ) : null}
            </View>
          </View>

          {(layout === 0) & showUnderline ? (
            <View
              style={{
                height: 2,
                backgroundColor: "#70707014",
                flex: 1,
                marginHorizontal: 20,
              }}
            />
          ) : null}
        </TouchableOpacity>
      </>
    );
  };

  payNow = (data) => {
    setTimeout(() => {
      this.props.callbackFunction(data);
    }, 150);
  };

  newCardData = (props) => {
    this.props.newCardData(props);
    setTimeout(() => {
      this.setState({
        showCreditCardUI: false,
      });
    }, 300);
  };

  selectedData = (data) => {
    this.setState({
      selectedData: data,
      showWalletUI: false,
      walletCardClicked: true,
    });
    this.props.selectedData(data);
  };
  onClosePressed = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ showWalletUI: false, walletCardClicked: false });
  };

  onCloseCardPressed = () => {
    console.log("Closed");
    this.setState({
      showCreditCardUI: false,
      creditCardClicked: false,
      showWalletUI: false,
    });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  getPayload = () => {
    let newPayload = { ...this.props.payload };
    newPayload.merchantOrderId = "MERCHANT" + new Date().getTime();
    newPayload.paymentChannel = "PAYPAL";
    newPayload.paymentMethod = "PAYPAL_ALL";

    return newPayload;
  };

  getTrueMoneyPayload = () => {
    let newPayload = { ...this.props.payload };
    newPayload.merchantOrderId = "MERCHANT" + new Date().getTime();
    newPayload.paymentChannel = "TRUEMONEY";
    newPayload.paymentMethod = "TRUEMONEY_ALL";

    return newPayload;
  };

  afterCheckout = (transactionDetails) => {
    console.log("transactionDetails", transactionDetails);
    if (transactionDetails) {
      this.setState({ orderDetails: transactionDetails });
      this.props.callbackFunction(transactionDetails);
    }
  };

  render() {
    const showCardForm = first(
      this.state.paymentCardType
    )?.tokenization_possible;

    const filteredCards = filter(this.state.cardList, (item) => {
      return item?.sub_type === "ATM_CARD";
    });
    const showATMCardFlow = filteredCards.length > 0;
    const showCreditCardFlow = !isEmpty(this.state.paymentCardType);
    const showWalletFlow = !isEmpty(this.state.walletsList);

    let firstItem =
      this.state.walletsList.length > 0
        ? first(this.state.walletsList).logo
        : null;
    let secondItem =
      this.state.walletsList.length > 1 ? this.state.walletsList[1].logo : null;
    const style = stylesWithPropsAndStates(this.props, this.state);
    let payPalObject = filter(this.state.all, (item) => {
      return (
        item.payment_channel_key === "PAYPAL" &&
        item.is_default &&
        item.is_enabled
      );
    });

    let trueMoneyObject = filter(this.state.all, (item) => {
      return item.payment_channel_key === "TRUEMONEY" && item.is_enabled;
    });

    const showPayPalButton = payPalObject.length > 0;
    const showtrueMoneyButton = trueMoneyObject.length > 0;

    return (
      <View
        style={[
          {
            borderRadius: 5,
            margin: 15,
            flex: 1,
            padding: 3,
            backgroundColor: "white",
          },
          this.props.removeBorder
            ? { marginHorizontal: 0, borderWidth: 0 }
            : {
                borderColor: "lightgray",
                marginHorizontal: 15,
                borderWidth: 1,
              },
        ]}
      >
        <this.headerView />
        {showPayPalButton ? (
          <View>
            <PayNowButton
              themeColor={"#ffc439"}
              borderRadius={this.state.borderRadius}
              height={50}
              width={"100%"}
              payload={this.getPayload()}
              env={this.props.env}
              currency={this.props.currency}
              afterCheckout={this.afterCheckout}
              redirectUrl={this.props.redirectUrl}
              secretKey={this.props.secretKey}
              chaipayKey={this.props.chaipayKey}
              environment={this.props.environment}
              SubElement={() => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: "#253B80",
                        fontWeight: "800",
                        fontSize: 18,
                        fontStyle: "italic",
                        textAlign: "center",
                        width: 32,
                      }}
                    >
                      Pay
                    </Text>
                    <Text
                      style={{
                        color: "#2997DB",
                        fontWeight: "800",
                        fontSize: 18,
                        marginLeft: -2,
                        fontStyle: "italic",
                        textAlign: "center",
                        width: 28,
                      }}
                    >
                      Pal
                    </Text>
                  </View>
                );
              }}
            />
            <View
              style={{
                height: 2,
                backgroundColor: "#70707014",
                marginHorizontal: 20,
              }}
            />
          </View>
        ) : null}
        {showtrueMoneyButton ? (
          <View
            style={{
              borderRadius: 5,
              backgroundColor: "lightgray",
              padding: 1,
              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                borderRadius: 5,
                backgroundColor: "white",
              }}
            >
              <PayNowButton
                themeColor={"white"}
                borderRadius={this.state.borderRadius}
                height={45}
                width={"100%"}
                payload={this.getTrueMoneyPayload()}
                env={this.props.env}
                currency={this.props.currency}
                afterCheckout={this.afterCheckout}
                redirectUrl={this.props.redirectUrl}
                secretKey={this.props.secretKey}
                chaipayKey={this.props.chaipayKey}
                environment={this.props.environment}
                SubElement={() => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          fontWeight: "800",
                          fontSize: 18,
                          fontStyle: "italic",
                          textAlign: "center",
                          width: 38,
                        }}
                      >
                        true
                      </Text>
                      <Text
                        style={{
                          color: "#E1AD01",
                          fontWeight: "800",
                          fontSize: 18,
                          marginLeft: -2,
                          fontStyle: "italic",
                          textAlign: "center",
                          width: 62,
                        }}
                      >
                        money
                      </Text>
                    </View>
                  );
                }}
              />
              <View
                style={{
                  height: 2,
                  backgroundColor: "#70707014",
                  marginHorizontal: 20,
                }}
              />
            </View>
          </View>
        ) : null}
        {showWalletFlow ? (
          <this.itemView
            titleName={"Wallets"}
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );

              this.setState({
                walletCardClicked: !this.state.walletCardClicked,
                ATMCardClicked: false,
                creditCardClicked: false,
                showWalletUI: true,
              });
            }}
            itemIcon={() => {
              return (
                <>
                  <Wallet fill={this.props.themeColor} />
                </>
              );
            }}
            subElement={() => {
              return (
                <>
                  <View style={{ flexDirection: "row", marginRight: 0 }}>
                    {this.state.walletCardClicked &&
                    this.state.selectedData !== undefined ? (
                      <Image
                        source={{ uri: this.state.selectedData.logo }}
                        style={{
                          alignSelf: "center",
                          width: 30,
                          height: 30,
                          resizeMode: "contain",
                          marginHorizontal: 3,
                          marginTop: 0,
                        }}
                      />
                    ) : this.state.walletsList.length > 0 ? (
                      <>
                        <Image
                          source={{ uri: secondItem }}
                          style={{
                            alignSelf: "center",
                            width:
                              this.state.walletsList.length === 1 ? 30 : 35,
                            height:
                              this.state.walletsList.length === 1 ? 30 : 35,
                            resizeMode: "contain",
                            marginHorizontal: 3,
                            marginTop: 0,
                          }}
                        />
                        <Image
                          source={{ uri: firstItem }}
                          style={{
                            alignSelf: "center",
                            width: 30,
                            height: 30,
                            resizeMode: "contain",
                            marginTop: 0,
                            marginHorizontal: 8,
                          }}
                        />
                      </>
                    ) : null}
                    {this.state.walletCardClicked &&
                    this.state.selectedData !== undefined ? null : this.state
                        .walletsList.length > 2 ? (
                      <Text
                        style={{
                          color: "lightgray",
                          alignSelf: "center",
                          textAlign: "center",
                          fontSize: 10,
                        }}
                        adjustsFontSizeToFit
                      >{`+${this.state.walletsList.length - 2} more`}</Text>
                    ) : null}
                  </View>
                </>
              );
            }}
            isSelected={this.state.walletCardClicked}
            showUnderline={showATMCardFlow || showCreditCardFlow}
          />
        ) : null}
        <>
          {showCreditCardFlow ? (
            <this.itemView
              style={style}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );

                const showCardForm = first(
                  this.state.paymentCardType
                )?.tokenization_possible;

                if (!showCardForm) {
                  let selectedItem = first(this.state.paymentCardType);
                  this.setState(
                    {
                      creditCardClicked: !this.state.creditCardClicked,
                      ATMCardClicked: false,
                      walletCardClicked: false,
                    },
                    () => {
                      if (this.state.creditCardClicked) {
                        this.props.selectedData(selectedItem, true);
                      } else {
                        this.props.selectedData({}, false);
                      }
                    }
                  );
                } else {
                  this.setState({
                    creditCardClicked: !this.state.creditCardClicked,
                    ATMCardClicked: false,
                    walletCardClicked: false,
                    selectedItem: {},
                    showCreditCardUI: true,
                  });
                }
              }}
              titleName={"Debit / Credit Card"}
              isSelected={this.state.creditCardClicked}
              subElement={() => {
                return (
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../assets/mastercard.png")}
                      style={{
                        alignSelf: "center",
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                        marginTop: 0,
                        marginHorizontal: 3,
                      }}
                    />
                    <Image
                      source={require("../assets/visa.png")}
                      style={{
                        alignSelf: "center",
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                        marginTop: 0,
                        marginHorizontal: 3,
                      }}
                    />
                    <Image
                      source={require("../assets/jcb.png")}
                      style={{
                        alignSelf: "center",
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                        marginTop: 0,
                        marginHorizontal: 5,
                      }}
                    />
                  </View>
                );
              }}
              itemIcon={() => {
                return (
                  <>
                    <Card fill={this.props.themeColor} height={13} width={26} />
                  </>
                );
              }}
              showUnderline={showATMCardFlow}
            />
          ) : null}

          {showATMCardFlow ? (
            <this.itemView
              style={style}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                let selectedItem = first(filteredCards);

                let showCardForm = selectedItem.tokenization_possible;
                this.setState(
                  {
                    ATMCardClicked: !this.state.ATMCardClicked,
                    creditCardClicked: false,
                  },
                  () => {
                    if (!showCardForm) {
                      this.props.atmCardClicked(
                        selectedItem,
                        this.state.ATMCardClicked
                      );
                    } else {
                      this.setState({
                        selectedItem: selectedItem,
                        creditCardClicked: false,
                        walletCardClicked: false,
                        showATMCardUI: true,
                      });
                    }
                  }
                );
              }}
              titleName={"ATM Card"}
              showIndicator={false}
              isSelected={this.state.ATMCardClicked}
              showUnderline={false}
              itemIcon={() => {
                return (
                  <>
                    <Wallet fill={this.props.themeColor} />
                  </>
                );
              }}
            />
          ) : null}
        </>

        {this.state.showWalletUI ? (
          <WalletView
            selectedProducts={this.props.selectedProducts}
            payload={this.props.payload}
            data={this.state.walletsList}
            showSheet={true}
            payNow={this.payNow}
            onClose={this.onClosePressed}
            themeColor={
              this.props.walletStyles.themeColor ||
              this.props.themeColor ||
              "black"
            }
            nameFontSize={this.props.walletStyles.nameFontSize}
            nameFontWeight={this.props.walletStyles.nameFontWeight}
            payNowButtonCornerRadius={
              this.props.walletStyles.buttonBorderRadius
            }
            imageWidth={this.props.walletStyles.imageWidth} //35
            imageHeight={this.props.walletStyles.imageHeight} //35
            imageResizeMode={"contain"}
            checkBoxHeight={this.props.walletStyles.checkBoxHeight} //25
            containerHeight={this.props.walletStyles.containerHeight} //"70%"
            headerTitle={this.props.walletStyles.headerTitle || "Wallets"}
            headerTitleFont={this.props.walletStyles.headerTitleFont || 25}
            headerTitleWeight={
              this.props.walletStyles.headerTitleFontWeight || "300"
            }
            headerImage={this.props.walletStyles.headerImage}
            headerImageWidth={this.props.walletStyles.headerImageWidth || 30}
            headerImageHeight={this.props.walletStyles.headerImageHeight || 30}
            headerImageResizeMode={"contain"}
            searchPlaceHolder={
              this.props.walletStyles.searchPlaceHolder ||
              "🔍 Search by Channels"
            }
            shouldShowSearch={this.props.walletStyles.shouldShowSearch || true}
            customHandle={this.props.customHandle}
            selectedData={this.selectedData}
            deliveryAmount={this.props.deliveryAmount}
          />
        ) : null}

        {showCardForm &&
        (this.state.showCreditCardUI || this.state.showATMCardUI) ? (
          <CreditCardForm
            showSheet={true}
            containerHeight={"55%"}
            onClose={this.onCloseCardPressed}
            showSaveForLater={true}
            themeColor={this.props.themeColor || "black"}
            newCardData={this.newCardData}
            payNowButtonCornerRadius={this.props.cardStyles.buttonBorderRadius}
          />
        ) : null}
      </View>
    );
  }
}

const stylesWithPropsAndStates = (props, state) =>
  StyleSheet.create({
    roundedTextInput: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "red",
    },
    OTPContainerStyle: {
      marginHorizontal: 18,
    },

    primaryHeadertext: {
      fontSize: 16,
      fontWeight: "500",
      color: "black",
      marginHorizontal: 15,
    },
    paymentHeaderView: {
      justifyContent: "space-between",
      flexDirection: "row",

      backgroundColor: "white",
    },
    onClickATMCard: state.ATMCardClicked
      ? {
          borderRadius: 5,
          borderColor: props.themeColor,
          borderWidth: 0.5,
        }
      : {},
  });

export default PaymentMethods;
