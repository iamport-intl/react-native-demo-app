import { isEmpty, sum, sumBy, values } from "lodash";
import React from "react";
import { Dimensions } from "react-native";

import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import {
  APP_THEME_COLOR,
  BOLD,
  currency,
  DARKBLACK,
  descriptionText,
  HEADERBLACK,
  HEDER_TITLES,
  ORDERTEXT,
  SUCCESS_COLOR,
  TRANSPARENT,
  WHITE_COLOR,
} from "../../constants";
import CheckboxView from "../../helpers/CheckboxView";
import HorizontalTextStackView from "../../helpers/HorizontalTextStackView";
import ScheduledProductCell from "../../screens/SelectedProductCell";
import Checkout from "../../../paymentSDK";
import OTPTextInput from "react-native-otp-textinput";
import AsyncStorage from "@react-native-community/async-storage";
import PhoneInput from "react-native-phone-number-input";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import CreditCardForm from "../../helpers/CreditcardForm";

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE_COLOR,
  },

  phoneViewContainer: {
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  container: {
    flex: 1,
  },
  flatListView: {
    flex: 1,
    maxHeight: height / 2,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
    },

    borderColor: "#ddd",
    borderBottomWidth: 0.5,
  },
  cardContainer: {
    width: 300,
    maxWidth: "80%",
    padding: 30,
  },
  name: {
    color: "#3D3D3D",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
    marginVertical: 10,
  },
  price: {
    color: "#3D3D3D",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
    padding: 10,
  },

  payNowContainerView: {
    marginHorizontal: 15,
    width: width - 30,
    backgroundColor: WHITE_COLOR,
    marginBottom: 35,
    justifyContent: "space-between",
    flexDirection: "row",
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
    },

    borderColor: "#ddd",
    borderTopWidth: 0.5,
    paddingTop: 20,
  },
  payNowView: {
    height: 50,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
    paddingVertical: 15,
    alignSelf: "center",
    backgroundColor: APP_THEME_COLOR,
  },
  modalView: {
    flex: 1,
  },

  payNowTextView: {
    alignSelf: "center",
    textAlign: "center",
    alignItems: "center",
    color: WHITE_COLOR,
    fontWeight: BOLD,
    fontSize: 16,
  },
  headerView: {
    marginTop: 15,
    paddingBottom: 10,
    backgroundColor: WHITE_COLOR,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
    },

    borderColor: "#ddd",
    borderBottomWidth: 0.5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
  },
  featuredText: {
    textAlign: "left",
    color: APP_THEME_COLOR,
    fontSize: 40,
    fontWeight: BOLD,
    marginTop: -20,
    marginHorizontal: 20,
  },
  paymentView: {
    marginHorizontal: 15,
    paddingVertical: 20,
    paddingTop: 5,
    flex: 1,
    width: width - 30,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
    },
    borderColor: "#ddd",
    borderBottomWidth: 0.5,
    shadowColor: "#000000",
  },
  paymentText: {
    fontWeight: "700",
    fontSize: 22,
    color: HEDER_TITLES,
    marginBottom: 15,
  },

  stackView: {
    flexDirection: "row",
    marginVertical: 5,
    justifyContent: "space-around",
  },
  leftStackText: { fontSize: 13, flex: 0.4 },
  rightStackText: {
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 5,
    flex: 0.6,
    textAlign: "left",
  },
  successStyle: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 25,
    textAlign: "center",
  },
  modalDismissText: { fontSize: 15, alignSelf: "center" },
  containerView: { marginHorizontal: 20, marginTop: 20, marginTop: 35 },
  nextButtonView: {
    height: 50,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
    paddingVertical: 15,
    width: width - 40,
    alignSelf: "center",
    backgroundColor: APP_THEME_COLOR,
  },
  nextTextView: {
    alignSelf: "center",
    textAlign: "center",
    alignItems: "center",
    color: WHITE_COLOR,
    fontWeight: BOLD,
    fontSize: 16,
  },
  nextContainerView: { backgroundColor: TRANSPARENT, width: width },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: APP_THEME_COLOR,
  },
  OTPContainerStyle: { marginHorizontal: 15 },

  primaryHeadertext: {
    fontSize: 16,
    fontWeight: "500",
    color: HEADERBLACK,
    marginHorizontal: 15,
  },
  paymentHeaderView: {
    marginVertical: 5,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 5,
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
});

class Checkout1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: {},
      callThePayment: false,
      data: {},
      url: "",
      orderDetails: undefined,
      hashKey: "",
      mobileNumber: "",
      formattedText: "",
      shouldShowOTP: false,
      OTP: "",
      shouldShowOrderDetails: false,
      walletCollpse: false,
      mobileNumberVerificationDone: false,
      savedCards: [],
      userData: {},
      callingfromSavedCards: false,
      newCardData: {},
    };
    this.phone = React.createRef();
    this.otpInput = React.createRef();
  }

  componentDidMount() {
    AsyncStorage.getItem("SAVED_CARDS").then((data) => {
      this.setState({ savedCards: JSON.parse(data) });
    });
    AsyncStorage.getItem("USER_DATA").then((data) => {
      this.setState({ userData: JSON.parse(data) });
    });
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: "Techup.co.in",
      headerStyle: {
        backgroundColor: "#0570E9",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },

      headerRight: (
        <TouchableOpacity
          style={{ padding: 5, marginHorizontal: 10 }}
          onPress={() => params.onPressMethod()}
        >
          <Text style={{ color: "#FFFFFF" }}>My Cart</Text>
        </TouchableOpacity>
      ),
    };
  };

  setFormattedNumber(formattedText) {
    this.setState({ formattedText: formattedText });
  }

  setNumber(text) {
    this.setState({ mobileNumber: text });
  }

  clearText = () => {
    this.otpInput.current.clear();
  };

  onClickPaymentSelected = (item, fromSavedCards) => {
    this.setState({ newCardData: {} });
    this.setState({ callingfromSavedCards: fromSavedCards });
    this.setState({ selectedItem: item });
  };

  afterCheckout = (transactionDetails) => {
    if (transactionDetails) {
      if (typeof transactionDetails == "object") {
        this.setState({ orderDetails: transactionDetails });
      } else if (transactionDetails == "Modal closed") {
        this.setState({ orderDetails: transactionDetails });
      } else {
        this.setState({ orderDetails: JSON.parse(transactionDetails) });
      }
    }
  };

  handleTextChange = (text) => {
    console.warn(text);
    this.setState({ OTP: text });
  };

  ResponseView = ({ orderDetails }) => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {orderDetails?.status_reason === "SUCCESS" ||
          orderDetails.is_success === "true" ? (
            <>
              <Image
                style={{ alignSelf: "center", justifyContent: "center" }}
                source={require("../../../assets/Success.png")}
              />
              <View
                style={{
                  marginTop: 15,
                  marginHorizontal: 20,
                  paddingBottom: 15,
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 2,
                  shadowOpacity: 0.3,
                  backgroundColor: WHITE_COLOR,
                  borderRadius: 5,
                }}
              >
                <Text style={styles.successStyle}>
                  Yay! Your order has been successfully placed
                </Text>
                <View style={styles.containerView}>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>
                      Merchant Order Ref:{" "}
                    </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.merchant_order_ref}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>
                      Channel Order Ref:{" "}
                    </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.channel_order_ref}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>Status: </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.status || "SUCCESS"}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : orderDetails?.status_reason === "INVALID_TRANSACTION_ERROR" ||
            orderDetails.is_success === "false" ? (
            <>
              <Image
                style={{ alignSelf: "center", justifyContent: "center" }}
                source={require("../../../assets/failure.png")}
              />
              <View
                style={{
                  marginTop: 15,
                  marginHorizontal: 20,
                  paddingBottom: 15,
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 2,
                  shadowOpacity: 0.3,
                  backgroundColor: WHITE_COLOR,
                  borderRadius: 5,
                }}
              >
                <Text style={styles.successStyle}>Transaction Failed</Text>
                <View style={styles.containerView}>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>
                      Merchant Order Ref:{" "}
                    </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.merchant_order_ref}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>
                      Channel Order Ref:{" "}
                    </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.channel_order_ref}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>Status: </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.status || "FAILED"}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : orderDetails?.message === "Modal closed" ? (
            <>
              <Image
                style={{ alignSelf: "center", justifyContent: "center" }}
                source={require("../../../assets/failure.png")}
              />
              <Text style={styles.successStyle}>Payment Not Done</Text>
              <View style={styles.containerView}>
                <Text style={styles.modalDismissText}>Please try again</Text>
              </View>
            </>
          ) : (
            <Text>{JSON.stringify(orderDetails, null, 4)}</Text>
          )}
          <TouchableOpacity
            style={[
              styles.payNowView,
              {
                marginTop: 50,
                width: width - 40,
                backgroundColor:
                  orderDetails?.status_reason === "SUCCESS" ||
                  orderDetails.is_success === "true"
                    ? SUCCESS_COLOR
                    : APP_THEME_COLOR,
              },
            ]}
            disabled={false}
            onPress={() => {
              if (
                orderDetails?.status_reason === "SUCCESS" ||
                orderDetails.is_success === "true"
              ) {
                this.props.navigation.goBack();
              } else {
                this.setState({ orderDetails: undefined });
              }
            }}
          >
            <Text style={styles.payNowTextView}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  MobileNumberView = ({ shouldShowOTP }) => {
    return (
      <View>
        <Text
          style={{
            marginLeft: 20,
            paddingTop: 15,
            color: descriptionText,
          }}
        >
          Enter {shouldShowOTP ? "OTP" : " Phone Number"}
        </Text>
        {shouldShowOTP ? (
          <View style={{ marginVertical: 15 }}>
            <OTPTextInput
              ref={this.otpInput}
              containerStyle={styles.OTPContainerStyle}
              textInputStyle={styles.roundedTextInput}
              offTintColor={descriptionText}
              tintColor={APP_THEME_COLOR}
              inputCount={6}
              handleTextChange={(text) => this.handleTextChange(text)}
            />
          </View>
        ) : (
          <PhoneInput
            containerStyle={{
              marginVertical: 15,
              alignSelf: "center",
              width: width - 40,
              borderWidth: 0.5,
              borderColor: descriptionText,
              borderRadius: 5,
            }}
            ref={this.phone}
            defaultValue={this.state.mobileNumber}
            defaultCode="IN"
            layout="first"
            onChangeText={(text) => {
              this.setNumber(text);
            }}
            onChangeFormattedText={(text) => {
              this.setFormattedNumber(text);
            }}
            withDarkTheme={false}
            withShadow={false}
            autoFocus
          />
        )}
        <View style={styles.nextContainerView}>
          <TouchableOpacity
            style={styles.nextButtonView}
            onPress={async () => {
              if (this.state.shouldShowOTP) {
                let val = await Checkout.fetchSavedCards(
                  this.state.formattedText,
                  this.state.OTP
                );
                if (val?.status === 200 || val?.status === 201) {
                  AsyncStorage.setItem("SAVED_CARDS", JSON.stringify(val.data));
                  this.setState({ savedCards: val.data });
                  this.setState({ mobileNumberVerificationDone: true });
                }
              } else {
                let val = await Checkout._getOTP(this.state.formattedText);
                if (val.status === 200 || val.status === 201) {
                  this.setState({ shouldShowOTP: true });
                }
              }
            }}
          >
            <Text style={styles.nextTextView}>
              {shouldShowOTP ? "Verify" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  OrderDetailsView = ({ totalAmount, deliveryAmount }) => {
    return (
      <View
        style={{
          marginVertical: 25,
          marginHorizontal: 15,
          width: width - 30,
          shadowRadius: 1,
          shadowOffset: {
            height: 1,
          },

          borderColor: "#ddd",
          borderTopWidth: 0.5,
          paddingTop: 20,
        }}
      >
        <Text style={styles.paymentText}>Order details</Text>
        <HorizontalTextStackView
          item={{
            name: "Order",
            value: `${totalAmount} ${currency}`,
            fontSize: 13,
            fontWeight: "400",
            color: ORDERTEXT,
          }}
        />
        <HorizontalTextStackView
          item={{
            name: "Delivery",
            value: `${deliveryAmount} ${currency}`,
            fontSize: 13,
            fontWeight: "400",
            color: ORDERTEXT,
          }}
        />
        <HorizontalTextStackView
          item={{
            name: "Summary",
            value: `${totalAmount + deliveryAmount} ${currency}`,
            fontSize: 16,
            fontWeight: "500",
            color: ORDERTEXT,
          }}
        />
      </View>
    );
  };
  ListOfItemsView = () => {
    return (
      <FlatList
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.flatListView}
        data={values(this.props.route.params.selectedProducts)}
        renderItem={(product) => {
          return <ScheduledProductCell product={product.item} />;
        }}
        keyExtractor={(item) => item.key}
      />
    );
  };

  _onChange = (form) => {
    console.log(form);
  };

  saveCardDetails = (data) => {
    this.setState({ newCardData: data });
  };

  confirmCardPayment = async (savedCard, fromSavedcards = false) => {
    let totalAmount = sumBy(
      values(this.props.route.params?.selectedProducts),
      "price"
    );
    let response = await Checkout.startPayment(
      fromSavedcards,
      savedCard,
      totalAmount,
      this.state.formattedText
    );

    if (response.val.status === 200 || response.val.status === 201) {
      this.setState({ orderDetails: response.val.data });
    }
    AsyncStorage.setItem("USER_DATA", JSON.stringify(response.data));
    this.setState({ userData: response.data });
  };

  PaymentOptionsView = () => {
    let val = this.state.selectedItem?.name;
    let selectedChannel =
      val === "Pay with Zalo Pay"
        ? "ZALOPAY"
        : val === "Pay with MOMO Pay"
        ? "MOMOPAY"
        : "VNPAY";

    const colapsableImage = !this.state.walletCollpse
      ? require("../../../assets/colapse.png")
      : require("../../../assets/expand.png");
    const creditCardImage = !this.state.creditCardClicked
      ? require("../../../assets/colapse.png")
      : require("../../../assets/expand.png");
    const otherPaymentImage = !this.state.otherPayments
      ? require("../../../assets/colapse.png")
      : require("../../../assets/expand.png");

    return (
      <View style={styles.paymentView}>
        <Text style={styles.paymentText}>Payment Options</Text>

        <View>
          <Collapse>
            <CollapseHeader>
              <View
                style={[
                  styles.paymentHeaderView,
                  {
                    borderColor: descriptionText,
                    borderWidth: 1,
                    alignContent: "center",
                    alignItems: "center",
                    paddingVertical: 18,
                  },
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("../../../assets/card.png")}
                    style={{
                      alignSelf: "center",
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      marginTop: 0,
                      marginLeft: 15,
                    }}
                  />

                  <Text
                    style={[
                      styles.primaryHeadertext,
                      {
                        fontSize: 13,
                        alignSelf: "center",
                        marginLeft: 15,
                      },
                    ]}
                  >
                    SAVED PAYMENT METHODS
                  </Text>
                </View>

                <Image
                  source={require("../../../assets/colapse.png")}
                  style={{
                    alignSelf: "center",
                    width: 20,
                    height: 20,
                    resizeMode: "contain",
                    marginTop: 0,
                  }}
                />
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View
                style={{
                  borderRadius: 10,
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 2,
                  shadowOpacity: 0.2,
                  backgroundColor: WHITE_COLOR,
                  marginVertical: 10,
                }}
              >
                <FlatList
                  renderItem={(product) => {
                    let image =
                      product.item.type === "visa"
                        ? require("../../../assets/visa.png")
                        : product.item.type === "mastercard"
                        ? require("../../../assets/mastercard.png")
                        : require("../../../assets/jcb.png");

                    let isSelected =
                      this.state.selectedItem?.item?.partial_card_number ===
                        product.item.partial_card_number &&
                      this.state.selectedItem?.item?.expiry_month ===
                        product.item.expiry_month &&
                      this.state.selectedItem?.item?.expiry_year ===
                        product.item.expiry_year;

                    console.log(
                      JSON.stringify(this.state.selectedItem, null, 4)
                    );
                    return (
                      <CheckboxView
                        fromSavedCards={true}
                        item={{
                          name: product.item.partial_card_number,
                          description: `Expires: ${product.item.expiry_month} / ${product.item.expiry_year} `,
                          data: this.state.userData,
                          ...product,
                        }}
                        isSelected={isSelected}
                        didSelected={this.onClickPaymentSelected}
                        image={image}
                      />
                    );
                  }}
                  data={this.state.savedCards}
                  keyExtractor={(item, index) => `${index}1`}
                />
              </View>
            </CollapseBody>
          </Collapse>

          <Collapse>
            <CollapseHeader>
              <View
                style={[
                  styles.paymentHeaderView,
                  {
                    borderColor: descriptionText,
                    borderWidth: 1,
                  },
                ]}
                onPress={() =>
                  this.setState({
                    walletCollpse: !this.state.walletCollpse,
                  })
                }
              >
                <View style={{ flexDirection: "row", paddingVertical: 12 }}>
                  <Image
                    source={require("../../../assets/wallet.png")}
                    style={{
                      alignSelf: "center",
                      width: 20,
                      height: 20,
                      resizeMode: "contain",

                      marginLeft: 15,
                    }}
                  />

                  <Text
                    style={[
                      styles.primaryHeadertext,
                      {
                        fontSize: 13,
                        textAlign: "center",
                        alignSelf: "center",
                      },
                    ]}
                  >
                    WALLETS
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("../../../assets/momo.png")}
                    style={{
                      alignSelf: "center",
                      width: 40,
                      height: 40,
                      resizeMode: "contain",
                      marginHorizontal: 8,
                    }}
                  />
                  <Image
                    source={require("../../../assets/ZaloPay.png")}
                    style={{
                      alignSelf: "center",
                      width: 30,
                      height: 30,
                      resizeMode: "contain",
                      marginTop: 0,
                      marginHorizontal: 8,
                    }}
                  />
                  <Image
                    source={colapsableImage}
                    style={{
                      alignSelf: "center",
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      marginTop: 0,
                    }}
                  />
                </View>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View
                style={{
                  borderRadius: 10,
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 2,
                  shadowOpacity: 0.2,
                  backgroundColor: WHITE_COLOR,
                  marginVertical: 10,
                }}
              >
                <CheckboxView
                  fromSavedCards={false}
                  item={{ name: "Pay with MOMO Pay" }}
                  image={require("../../../assets/momo.png")}
                  isSelected={val === "Pay with MOMO Pay"}
                  didSelected={this.onClickPaymentSelected}
                />
                <CheckboxView
                  fromSavedCards={false}
                  item={{ name: "Pay with Zalo Pay" }}
                  image={require("../../../assets/ZaloPay.png")}
                  isSelected={val === "Pay with Zalo Pay"}
                  didSelected={this.onClickPaymentSelected}
                />
              </View>
            </CollapseBody>
          </Collapse>

          <Collapse>
            <CollapseHeader>
              <TouchableOpacity
                activeOpacity={0}
                style={[
                  styles.paymentHeaderView,
                  {
                    borderColor: descriptionText,
                    borderWidth: 1,
                    paddingVertical: 12,
                  },
                ]}
                onPress={() =>
                  this.setState({
                    creditCardClicked: !this.state.creditCardClicked,
                  })
                }
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("../../../assets/card.png")}
                    style={{
                      alignSelf: "center",
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      marginTop: 0,
                      marginLeft: 15,
                    }}
                  />

                  <Text
                    style={[
                      styles.primaryHeadertext,
                      { fontSize: 13, alignSelf: "center" },
                    ]}
                  >
                    CREDIT CARD
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("../../../assets/mastercard.png")}
                    style={{
                      alignSelf: "center",
                      width: 30,
                      height: 30,
                      resizeMode: "contain",
                      marginTop: 0,
                      marginHorizontal: 5,
                    }}
                  />
                  <Image
                    source={require("../../../assets/visa.png")}
                    style={{
                      alignSelf: "center",
                      width: 30,
                      height: 30,
                      resizeMode: "contain",
                      marginTop: 0,
                      marginHorizontal: 5,
                    }}
                  />
                  <Image
                    source={require("../../../assets/jcb.png")}
                    style={{
                      alignSelf: "center",
                      width: 30,
                      height: 30,
                      resizeMode: "contain",
                      marginTop: 0,
                      marginHorizontal: 5,
                    }}
                  />
                  <Image
                    source={creditCardImage}
                    style={{
                      alignSelf: "center",
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      marginTop: 0,
                    }}
                  />
                </View>
              </TouchableOpacity>
              {this.state.creditCardClicked ? (
                <View
                  style={{
                    borderRadius: 10,
                    shadowColor: "#000000",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 2,
                    shadowOpacity: 0.2,
                    backgroundColor: WHITE_COLOR,
                    marginVertical: 10,
                  }}
                >
                  <CreditCardForm newCardData={this.saveCardDetails} />
                </View>
              ) : null}
            </CollapseHeader>
          </Collapse>
          <Collapse>
            <CollapseHeader>
              <TouchableOpacity
                style={[
                  styles.paymentHeaderView,
                  {
                    borderColor: descriptionText,
                    borderWidth: 1,
                  },
                ]}
                onPress={() =>
                  this.setState({
                    otherPayments: !this.state.otherPayments,
                  })
                }
              >
                <View style={{ flexDirection: "row", paddingVertical: 15 }}>
                  <Image
                    source={require("../../../assets/wallet.png")}
                    style={{
                      alignSelf: "center",
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      marginTop: 0,
                      marginLeft: 12,
                    }}
                  />

                  <Text
                    style={[
                      styles.primaryHeadertext,
                      {
                        fontSize: 13,
                        textAlign: "center",
                        alignSelf: "center",
                      },
                    ]}
                  >
                    OTHER PAYMENTS
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={{
                      uri: "https://chaipay-pg-icons.s3-ap-southeast-1.amazonaws.com/checkout_vnpay.jpeg",
                    }}
                    style={{
                      alignSelf: "center",
                      width: 45,
                      height: 45,
                      resizeMode: "contain",
                      marginTop: 0,
                      marginHorizontal: 8,
                    }}
                  />
                  <Image
                    source={otherPaymentImage}
                    style={{
                      alignSelf: "center",
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      marginTop: 0,
                    }}
                  />
                </View>
              </TouchableOpacity>
              {this.state.otherPayments ? (
                <View
                  style={{
                    borderRadius: 10,
                    shadowColor: "#000000",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 2,
                    shadowOpacity: 0.2,
                    backgroundColor: WHITE_COLOR,
                    marginVertical: 10,
                  }}
                >
                  <CheckboxView
                    fromSavedCards={false}
                    item={{ name: "Pay with VNPay" }}
                    image={{
                      uri: "https://chaipay-pg-icons.s3-ap-southeast-1.amazonaws.com/checkout_vnpay.jpeg",
                    }}
                    styles={{ width: 45, height: 45 }}
                    isSelected={val === "Pay with VNPay"}
                    didSelected={this.onClickPaymentSelected}
                  />
                </View>
              ) : null}
            </CollapseHeader>
          </Collapse>
        </View>
      </View>
    );
  };

  SafeAndsecureView = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 7,
        }}
      >
        <Image
          source={require("../../../assets/protected.png")}
          style={{
            alignSelf: "center",
            width: 15,
            height: 15,
            resizeMode: "contain",
            marginTop: 0,
          }}
        />
        <Text style={{ fontSize: 12 }}>Safe and Secure Payments</Text>
      </View>
    );
  };
  PayNowView = ({ image, totalAmount, deliveryAmount }) => {
    const deepLinkURL = "chaipay://checkout";
    let data = this.state.data;
    let val = this.state.selectedItem?.name;
    let selectedChannel =
      val === "Pay with Zalo Pay"
        ? "ZALOPAY"
        : val === "Pay with MOMO Pay"
        ? "MOMOPAY"
        : "VNPAY";
    var payload = {
      key: "lzrYFPfyMLROallZ",
      //navigation "navigation":navigation,
      pmt_channel: this.state.channelData?.channel || "ZALOPAY_WALLET",
      pmt_method: this.state.channelData?.method || "ZALOPAY",
      merchant_order_id: "MERCHANT" + new Date().getTime(),
      amount: totalAmount,
      currency: "VND",
      signature_hash: "123",
      billing_details: {
        billing_name: "Test mark",
        billing_email: "markweins@gmail.com",
        billing_phone: this.state.formattedText || "9998878788",
        billing_address: {
          city: "VND",
          country_code: "VN",
          locale: "en",
          line_1: "address",
          line_2: "address_2",
          postal_code: "400202",
          state: "Mah",
        },
      },
      shipping_details: {
        shipping_name: "xyz",
        shipping_email: "xyz@gmail.com",
        shipping_phone: "1234567890",
        shipping_address: {
          city: "abc",
          country_code: "VN",
          locale: "en",
          line_1: "address_1",
          line_2: "address_2",
          postal_code: "400202",
          state: "Mah",
        },
      },
      order_details: [
        {
          id: "knb",
          name: "kim nguyen bao",
          price: 1000,
          quantity: 1,
        },
      ],
      success_url: "chaipay://",
      failure_url: "chaipay://",
    };

    return (
      <View style={styles.payNowContainerView}>
        <View
          style={{
            flex: 0.5,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              this.setState({
                shouldShowOrderDetails: !this.state.shouldShowOrderDetails,
              })
            }
          >
            <Image
              source={image}
              style={{
                alignSelf: "center",
                width: 25,
                height: 25,
                resizeMode: "stretch",
                marginTop: 0,
              }}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                color: descriptionText,
                fontSize: 14,
              }}
            >
              Grand Total:
            </Text>
            <Text
              style={{
                color: DARKBLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {`${totalAmount + deliveryAmount} ${currency}`}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.payNowView, { flex: 0.5 }]}
          disabled={!this.state.mobileNumberVerificationDone}
          onPress={() => {
            if (
              isEmpty(this.state.newCardData) &&
              isEmpty(this.state.selectedItem)
            ) {
              alert("Hey Please selext one of the payment Type");
            } else if (!isEmpty(this.state.newCardData)) {
              let cardData = this.state.newCardData;
              console.log("cardData ", cardData);
              this.confirmCardPayment({
                cardNumber: cardData.cardNumber,
                name: cardData.name,
                serviceCode: cardData.cvv,
                month: cardData.expiration.slice(0, -5),
                year: cardData.expiration.slice(3, 7),
              });
            } else if (this.state.callingfromSavedCards) {
              this.confirmCardPayment(this.state.selectedItem.item, true);
            } else {
              this.setState({
                channelData: {
                  method:
                    selectedChannel === "ZALOPAY"
                      ? "ZALOPAY_WALLET"
                      : selectedChannel === "MOMOPAY"
                      ? "MOMOPAY_WALLET"
                      : "VNPAY_ALL",
                  channel:
                    selectedChannel === "ZALOPAY"
                      ? "ZALOPAY"
                      : selectedChannel === "MOMOPAY"
                      ? "MOMOPAY"
                      : "VNPAY",
                  orderId: "MERCHANT" + new Date().getTime(),
                  price: totalAmount,
                },
              });

              let newPayload = { ...payload };
              newPayload["merchant_order_id"] =
                "MERCHANT" + new Date().getTime();
              newPayload["pmt_channel"] =
                selectedChannel === "ZALOPAY"
                  ? "ZALOPAY"
                  : selectedChannel === "MOMOPAY"
                  ? "MOMOPAY"
                  : "VNPAY";
              newPayload["pmt_method"] =
                selectedChannel === "ZALOPAY"
                  ? "ZALOPAY_WALLET"
                  : selectedChannel === "MOMOPAY"
                  ? "MOMOPAY_WALLET"
                  : "VNPAY_ALL";
              newPayload["amount"] = totalAmount;
              this.setState({ data: newPayload });
              this.setState({ callThePayment: false }, () => {
                this.setState({ callThePayment: true });
              });
            }
          }}
        >
          <Text style={styles.payNowTextView}>Pay Now</Text>
        </TouchableOpacity>
        {this.state.callThePayment ? (
          <Checkout
            chaipayKey={data["key"]}
            merchantOrderId={data["merchant_order_id"]}
            amount={data["amount"]}
            currency={data["currency"]}
            // fetchHashUrl={domain+"/getHash"}
            secretKey="0e94b3232e1bf9ec0e378a58bc27067a86459fc8f94d19f146ea8249455bf242"
            shippingAddress={data["shipping_details"]}
            billingAddress={data["billing_details"]}
            orderDetails={data["order_details"]}
            //hashKey={this.state.hashKey}
            paymentChannel={this.state.channelData.channel}
            paymentMethod={this.state.channelData.method}
            callbackFunction={this.afterCheckout}
            failureUrl={deepLinkURL}
            successUrl={deepLinkURL}
            redirectUrl={deepLinkURL}
            env={"dev"}
          />
        ) : null}
      </View>
    );
  };

  render() {
    var amount = this.props.route.params.price;
    if (!amount) {
      amount = 1000000;
    }

    let totalAmount = sumBy(
      values(this.props.route.params?.selectedProducts),
      "price"
    );
    let deliveryAmount = 7.2;

    const hasNumber = this.state.mobileNumberVerificationDone;
    const shouldShowOTP = this.state.shouldShowOTP;

    let image = !this.state.shouldShowOrderDetails
      ? require("../../../assets/expand.png")
      : require("../../../assets/colapse.png");

    let orderDetails = this.state.orderDetails;
    return (
      <View style={{ backgroundColor: WHITE_COLOR, flex: 1 }}>
        {orderDetails !== undefined ? (
          <this.ResponseView orderDetails={orderDetails} />
        ) : (
          <>
            <View style={styles.headerView}>
              <Text style={styles.featuredText}>Checkout </Text>
            </View>

            {!hasNumber ? (
              <this.MobileNumberView shouldShowOTP={shouldShowOTP} />
            ) : (
              <>
                <Text
                  style={{
                    marginLeft: 20,
                    paddingVertical: 10,
                    color: descriptionText,
                  }}
                >
                  Current Mobile Number : {this.state.formattedText}
                </Text>
              </>
            )}
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
              <ScrollView
                contentContainerStyle={styles.contentContainerStyle}
                style={styles.container}
                removeClippedSubviews={false}
              >
                <this.ListOfItemsView />

                {this.state.mobileNumberVerificationDone ? (
                  <this.PaymentOptionsView />
                ) : null}
              </ScrollView>
            </KeyboardAvoidingView>
            <View>
              {this.state.shouldShowOrderDetails ? (
                <this.OrderDetailsView
                  totalAmount={totalAmount}
                  deliveryAmount={deliveryAmount}
                />
              ) : null}
              <this.SafeAndsecureView />
              <this.PayNowView
                image={image}
                totalAmount={totalAmount}
                deliveryAmount={deliveryAmount}
              />
            </View>
          </>
        )}
      </View>
    );
  }
}

export default Checkout1;
