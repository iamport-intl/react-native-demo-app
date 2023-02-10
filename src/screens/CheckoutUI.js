import {
  clone,
  cloneDeep,
  filter,
  first,
  forEach,
  isEmpty,
  map,
  sum,
  sumBy,
  values,
} from 'lodash';
import React from 'react';
import {Dimensions, PermissionsAndroid, LayoutAnimation} from 'react-native';

import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import {
  APP_THEME_COLOR,
  BOLD,
  BORDERCOLOR,
  CHAIPAY_KEY,
  ENVIRONMENT,
  currency,
  DARKBLACK,
  DARKGRAY,
  descriptionText,
  GRAYSHADE,
  HEADERBLACK,
  HEDER_TITLES,
  IMAGE_BACKGROUND_COLOR,
  ORDERTEXT,
  SECRET_KEY,
  strings,
  SUCCESS_COLOR,
  TRANSPARENT,
  WHITE_COLOR,
} from '../../src/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Checkout,
  CheckoutInstance,
  helpers,
  PayNowButton,
  PaymentMethods,
  CartDetails,
  TransactionStatusView,
  CartSummary,
} from '@iamport-intl/chaipay-sdk';

import SmsListener from 'react-native-android-sms-listener';
const {width, height} = Dimensions.get('screen');
const deliveryAmount = 0;
const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: IMAGE_BACKGROUND_COLOR,
    paddingBottom: 100,
  },

  indicatorView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneViewContainer: {
    alignItems: 'center',
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
    marginBottom: 10,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
    },
  },
  cardContainer: {
    width: 300,
    maxWidth: '80%',
    padding: 30,
  },
  name: {
    color: '#3D3D3D',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  price: {
    color: '#3D3D3D',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    padding: 10,
  },

  payNowContainerView: {
    marginHorizontal: 15,
    width: width - 30,
    backgroundColor: WHITE_COLOR,
    marginBottom: 35,
    justifyContent: 'space-between',
    flexDirection: 'row',
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
    },
    alignItems: 'center',
    borderColor: '#ddd',
    borderTopWidth: 0.5,
    paddingTop: 15,
  },
  payNowView: {
    height: 50,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    paddingVertical: 15,
    alignSelf: 'center',
    backgroundColor: APP_THEME_COLOR,
  },
  modalView: {
    flex: 1,
  },

  payNowTextView: {
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: WHITE_COLOR,
    fontWeight: BOLD,
    fontSize: 16,
  },
  headerView: {
    marginTop: 0,
    paddingBottom: 10,
    backgroundColor: WHITE_COLOR,
    shadowRadius: 1,

    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
  },
  featuredText: {
    textAlign: 'left',
    color: APP_THEME_COLOR,
    fontSize: 40,
    fontWeight: BOLD,
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
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    shadowColor: '#000000',
  },
  paymentText: {
    fontWeight: '700',
    fontSize: 22,
    color: HEDER_TITLES,
    marginBottom: 15,
  },

  stackView: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-around',
  },
  leftStackText: {fontSize: 13, flex: 0.4},
  rightStackText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
    flex: 0.6,
    textAlign: 'left',
  },
  successStyle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 15,
    textAlign: 'center',
  },
  modalDismissText: {fontSize: 15, alignSelf: 'center'},
  containerView: {marginTop: 25},
  nextButtonView: {
    height: 50,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    paddingVertical: 15,
    width: width - 40,
    alignSelf: 'center',
    backgroundColor: APP_THEME_COLOR,
  },
  nextTextView: {
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: WHITE_COLOR,
    fontWeight: BOLD,
    fontSize: 16,
  },
  nextContainerView: {backgroundColor: TRANSPARENT, width: width, marginTop: 5},
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: APP_THEME_COLOR,
  },
  OTPContainerStyle: {
    marginHorizontal: 18,
  },

  primaryHeadertext: {
    fontSize: 16,
    fontWeight: '500',
    color: HEADERBLACK,
    marginHorizontal: 15,
  },
  paymentHeaderView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: WHITE_COLOR,
  },
});

class CheckoutUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: {},
      selectedItem1: {},
      callThePayment: false,
      data: {},
      url: '',
      orderDetails: undefined,
      hashKey: '',
      mobileNumber: '',
      formattedText: '',
      shouldShowOTP: false,
      OTP: '',
      shouldShowOrderDetails: false,
      walletCollpse: false,
      mobileNumberVerificationDone: false,
      savedCards: [],
      userData: {},
      callingfromSavedCards: false,
      newCardData: {},
      walletsList: [],
      totalListOfPayments: [],
      paymentCardType: {},
      cardList: [],
      showList: true,
      showSavedCards: false,
      showOtherPayments: false,
      showList1: true,
      creditCardClicked: false,
      showLoader: false,
      savedCardsData: undefined,
      enablePayNow: false,
    };
    this.phone = React.createRef();
    this.otpInput = React.createRef();
    this.checkout = React.createRef();
  }

  async requestReadSmsPermission() {
    try {
      var granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'Auto Verification OTP',
          message: 'need access to read sms, to verify OTP',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('READ_SMS permissions granted', granted);
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: 'Receive SMS',
            message: 'Need access to receive sms, to verify OTP',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('RECEIVE_SMS permissions granted', granted);
          SmsListener.addListener(message => {
            console.log('Message', message);
            var numb = message.body.match(/\d/g);
            numb = numb.join('');
            this.setState({OTP: numb});
            console.log(numb);
          });
        } else {
          console.log('RECEIVE_SMS permissions denied');
        }
      } else {
        console.log('READ_SMS permissions denied');
      }
    } catch (err) {
      alert(err);
    }
  }

  componentDidMount() {
    helpers
      .fetchAvailablePaymentGateway()
      .then(data => {
        this.setSelectedProducts();

        this.setState({totalListOfPayments: data.data});
        let filteredWalletList = filter(data.data.WALLET, item => {
          return item.is_enabled;
        });

        this.setState({walletsList: filteredWalletList});
        let filterCardList = filter(data.data.CARD, item => {
          return (
            item.is_default &&
            item.is_enabled &&
            item.sub_type.includes('INT_CREDIT_CARD')
          );
        });
        this.setState({
          paymentCardType: filterCardList,
          cardList: data.data.CARD,
        });
      })
      .catch(error => {
        console.log('error', error);
      });

    AsyncStorage.getItem('formattedMobileNumber').then(value => {
      this.setState({formattedText: value});
    });

    AsyncStorage.getItem('mobileNumber').then(value => {
      this.setState({mobileNumber: value});
    });

    AsyncStorage.getItem('fontWeight').then(value => {
      console.log('FontWeight 102', value);
      this.setState({fontWeight: value || '400'});
    });
    AsyncStorage.getItem('fontSize').then(data => {
      let value = JSON.parse(data);

      this.setState({fontSize: value || 14});
    });

    AsyncStorage.getItem('color').then(value => {
      this.setState({color: value});
    });

    AsyncStorage.getItem('borderRadius').then(data => {
      let value = JSON.parse(data);
      this.setState({borderRadius: value || 15});
    });

    // AsyncStorage.setItem('SavedCardsData', JSON.stringify({}));
    this.requestReadSmsPermission();
    AsyncStorage.getItem('SavedCardsData').then(value => {
      let data = JSON.parse(value);
      this.setState({savedCardsData: data});
    });
  }

  setSelectedProducts = () => {
    let selectedProducts = values(this.props.selectedProducts);

    this.setState({selectedProducts: selectedProducts});
  };
  setFormattedNumber(formattedText) {
    AsyncStorage.setItem('formattedMobileNumber', formattedText);
    this.setState({formattedText: formattedText});
  }

  setNumber(text) {
    AsyncStorage.setItem('mobileNumber', text);
    this.setState({mobileNumber: text});
  }

  clearText = () => {
    this.otpInput.current.clear();
  };

  onClickPaymentSelected = (item, fromSavedCards) => {
    this.setState({creditCardClicked: false, otherPayments: false});
    this.setState({newCardData: {}});
    this.setState({callingfromSavedCards: fromSavedCards});
    this.setState({selectedItem: item});
    this.setState({selectedItem1: item});
  };

  afterCheckout = transactionDetails => {
    Checkout.close();
    console.log('DEtails', transactionDetails);
    if (transactionDetails) {
      this.setState({orderDetails: transactionDetails});
    }
  };

  handleTextChange = text => {
    console.warn(text);
    this.setState({OTP: text});
  };

  onCloseTransactionViewPressed = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.setState({orderDetails: undefined});
    this.props.goBack();
  };

  ResponseView = ({orderDetails}) => {
    Checkout.getInstance().close();
    let totalAmount = sumBy(values(this.state.selectedProducts), 'price');
    let selectedProducts = values(this.state.selectedProducts);

    return (
      <TransactionStatusView
        selectedProducts={selectedProducts}
        deliveryAmount={deliveryAmount}
        orderDetails={orderDetails}
        showSheet={true}
        onClose={this.onCloseTransactionViewPressed}
        themeColor={this.props.themeColor}
      />
    );
  };

  formatNumber = number => {
    let formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'VND',
    }).format(number);
    return formattedNumber;
  };

  OrderDetailsView = ({totalAmount}) => {
    return (
      <CartSummary
        deliveryAmount={deliveryAmount}
        totalAmount={totalAmount}
        headerTitle={'Price Details'}
        headerFont={25}
        headerColor={this.state.color}
        headerFontWeight={'500'}
        amountTitle={'Order'}
        amountFont={this.state.fontSize}
        amountColor={this.state.color}
        amountFontWeight={this.state.fontWeight}
        deliveryTitle={'Delivery'}
        deliveryFont={this.state.fontSize}
        deliveryColor={this.state.color}
        deliveryFontWeight={this.state.fontWeight}
        summaryTitle={'Summary'}
        summaryFont={this.state.fontSize}
        summaryColor={this.state.color}
        summaryFontWeight={this.state.fontWeight}
      />
    );
  };
  removeItem = data => {
    console.log(
      'values(this.props.selectedProducts)',
      values(this.props.selectedProducts),
    );
    console.log('Data', data);
    let filteredItems = filter(this.state.selectedProducts, item => {
      return item.key !== data.key;
    });
    this.setState({selectedProducts: filteredItems});
  };
  ListOfItemsView = () => {
    let selectedProducts = this.state.selectedProducts;
    let listCount = selectedProducts?.length;

    return (
      <>
        <CartDetails
          selectedProducts={selectedProducts || []}
          nameFontSize={this.state.fontSize - 1}
          nameColor={'black'}
          nameFontWeight={`${Number(this.state.fontWeight) - 100}`}
          descriptionSize={this.state.fontWeight - 3}
          descriptionFontWeight={`${Number(this.state.fontWeight) - 200}`}
          amountFontSize={this.state.fontSize}
          amountFontWeight={this.state.fontWeight}
          amountColor={'black'}
          borderRadius={this.state.borderRadius}
          borderWidth={1}
          headerText={'Cart Details'}
          headerTextColor={this.props.themeColor}
          headerFont={25}
          headerFontWeight={'500'}
          removeItem={this.removeItem}
          removeBorder={false}
          borderColor={'#E3E3E3'}
        />
      </>
    );
  };

  _onChange = form => {
    console.log(form);
  };

  saveCardDetails = data => {
    this.setState({newCardData: data});
  };

  getData = () => {
    let totalAmount = sumBy(this.state.selectedProducts, 'price');
    let selectedItem = first(values(this.state.selectedItem));
    return {
      source: 'mobile',
      environment: ENVIRONMENT,
      chaipayKey: CHAIPAY_KEY,
      secretKey: SECRET_KEY,
      paymentChannel: selectedItem?.payment_channel_key,
      paymentMethod: selectedItem?.payment_method_key,
      merchantOrderId: 'MERCHANT' + new Date().getTime(),
      amount: totalAmount + deliveryAmount,
      currency: 'THB',
      signature_hash: '123',
      billingAddress: {
        billing_name: 'Test mark',
        billing_email: 'markweins@gmail.com',
        billing_phone: '+84332234567',
        billing_address: {
          city: 'TH',
          country_code: 'TH',
          locale: 'en',
          line_1: 'address',
          line_2: 'address_2',
          postal_code: '400202',
          state: 'Mah',
        },
      },
      shippingAddress: {
        shipping_name: 'xyz',
        shipping_email: 'xyz@gmail.com',
        shipping_phone: '84332234567',
        shipping_address: {
          city: 'abc',
          country_code: 'VNH',
          locale: 'en',
          line_1: 'address_1',
          line_2: 'address_2',
          postal_code: '400202',
          state: 'Mah',
        },
      },
      orderDetails: [
        {
          id: 'knb',
          name: 'kim nguyen bao',
          price: 1900,
          quantity: 1,
        },
      ],
      successUrl: 'chaiport://checkout',
      failureUrl: 'chaiport://checkout',
      redirectUrl: 'chaiport://checkout/PAYPAL',
      mobileRedirectUrl: 'chaiport://checkout',
    };
  };

  confirmCardPayment = async (savedCard, fromSavedcards = false) => {
    let data = this.getData();

    let cardType = first(this.state.paymentCardType);

    data.paymentChannel = cardType.payment_channel_key;
    data.paymentMethod = cardType.payment_method_key;
    data.merchantOrderId = 'MERCHANT' + new Date().getTime();
    data.secretKey = SECRET_KEY;

    let response;
    if (fromSavedcards) {
      response = await Checkout.getInstance().startPaymentWithSavedCard(
        savedCard,
        data,
      );
    } else {
      response = await Checkout.getInstance().startPaymentWithNewCard(
        savedCard,
        data,
      );
    }

    this.setState({showLoader: false});

    if (response.val.status === 200 || response.val.status === 201) {
      this.setState({orderDetails: response.val.data});
    } else {
      this.setState({orderDetails: response.val});
    }
    // AsyncStorage.setItem('USER_DATA', JSON.stringify(response.data));
    this.setState({userData: response.data});
  };

  selectedData = async data => {
    console.log('SelectedData', data);
    this.setState({selectedItem: data});
    if (data?.fromNewCard) {
      this.confirmCardPayment({
        card_number: data.cardNumber,
        card_holder_name: data.name || 'NGUYEN VAN A',
        cvv: data.cvv,
        expiry_month: data.expirationMonth,
        expiry_year: data.expirationYear,
      });
    } else if (data?.fromATmCard) {
      var payload = this.getData();
      var newPayload = {...payload};
      let totalAmount = sumBy(values(this.state.selectedProducts), 'price');

      newPayload.merchantOrderId = 'MERCHANT' + new Date().getTime();
      newPayload.paymentChannel = data?.payment_channel_key;
      newPayload.paymentMethod = data?.payment_method_key;

      newPayload.amount = totalAmount;
      newPayload.secretKey = SECRET_KEY;

      var response = await Checkout.getInstance().startPaymentWithWallets(
        newPayload,
      );
      this.setState({showLoader: false});

      this.afterCheckout(response);
      this.setState({selectedItem: data});
    }
  };

  creditCardDetails = cardData => {
    this.selectedData({...cardData, fromNewCard: true});
  };
  atmCardClicked = (data, enable) => {
    this.setState({
      enablePayNow: enable,
      selectedItem: data,
      fromATMCard: true,
      fromNewCard: false,
    });

    //this.selectedData({...data, fromATmCard: true});
  };

  PaymentOptionsView = () => {
    let val = first(values(this.state.selectedItem))?.payment_method_key;
    let cardvalue = first(values(this.state.selectedItem))?.partial_card_number;

    let VNPAYData = filter(
      values(this.state.totalListOfPayments?.WALLET),
      item => {
        return item.payment_channel_key === 'VNPAY';
      },
    );
    var data = this.getData();
    var payload = {...data};

    const filteredCards = filter(this.state.cardList, item => {
      return item?.sub_type === 'ATM_CARD';
    });

    let selectedProducts = values(this.state.selectedProducts);
    let themeColor = this.props.themeColor;

    return (
      <View style={{width: width, marginTop: -5}}>
        <PaymentMethods
          themeColor={themeColor}
          payload={payload}
          headerTitle={'Payment Methods'}
          fontSize={this.state.fontSize}
          fontWeight={this.state.fontWeight}
          headerFontSize={15}
          headerFontWeight={'500'}
          selectedData={this.selectedData}
          customHandle={false}
          env={'dev'}
          callbackFunction={this.afterCheckout}
          redirectUrl={'chaiport://checkout'}
          secretKey={SECRET_KEY}
          chaipayKey={CHAIPAY_KEY}
          environment={ENVIRONMENT}
          selectedProducts={selectedProducts}
          deliveryAmount={deliveryAmount}
          newCardData={this.creditCardDetails}
          atmCardClicked={this.atmCardClicked}
          onClose={this.onCloseTransactionViewPressed}
          removeBorder={true}
          walletStyles={{
            themeColor: themeColor,
            borderRadius: this.state.borderRadius,
            nameFontSize: this.state.fontSize,
            nameFontWeight: this.state.fontWeight,
            buttonBorderRadius: this.state.borderRadius,
          }}
          cardStyles={{
            themeColor: themeColor,
            borderRadius: this.state.borderRadius,
            nameFontSize: this.state.fontSize,
            nameFontWeight: this.state.fontWeight,
            buttonBorderRadius: this.state.borderRadius,
          }}
          transactionStyles={{
            themeColor: themeColor,
            borderRadius: this.state.borderRadius,
            nameFontSize: this.state.fontSize,
            nameFontWeight: this.state.fontWeight,
            buttonBorderRadius: this.state.borderRadius,
          }}
        />
      </View>
    );
  };

  SafeAndsecureView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 7,
        }}>
        <Image
          source={require('../.././assets/protected.png')}
          style={{
            alignSelf: 'center',
            width: 15,
            height: 15,
            resizeMode: 'contain',
            marginTop: 0,
          }}
        />
        <Text style={{fontSize: 12}}>{strings.safe_and_secure_payments}</Text>
      </View>
    );
  };

  hideOrderDetailsAlert = () => {
    this.setState({orderDetails: undefined});
  };

  getPayload = () => {
    let payload = this.getData();
    let newPayload = {...payload};

    let selectedItem = this.state.selectedItem;

    let totalAmount = sumBy(values(this.state.selectedProducts), 'price');

    newPayload.merchantOrderId = 'MERCHANT' + new Date().getTime();
    newPayload.paymentChannel = selectedItem?.payment_channel_key;
    newPayload.paymentMethod =
      selectedItem?.payment_channel_key === 'VNPAY'
        ? 'VNPAY_ALL'
        : selectedItem?.payment_method_key;

    newPayload.amount = totalAmount + deliveryAmount;
    newPayload.secretKey = SECRET_KEY;
    return newPayload;
  };

  PayNowView = ({image, totalAmount}) => {
    const deepLinkURL = 'chaiport://checkout';

    var payload = this.getData();
    let formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'VND',
    }).format(totalAmount + deliveryAmount);

    return (
      <View style={{width: width, backgroundColor: WHITE_COLOR}}>
        <View style={styles.payNowContainerView}>
          <View
            style={{
              flex: 0.5,
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              height: 50,
            }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() =>
                this.setState({
                  shouldShowOrderDetails: !this.state.shouldShowOrderDetails,
                })
              }>
              <Image
                source={image}
                style={{
                  alignSelf: 'center',
                  width: 25,
                  height: 25,
                  resizeMode: 'stretch',
                  marginTop: 0,
                }}
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  color: descriptionText,
                  fontSize: 14,
                }}>
                {strings.total}
              </Text>
              <Text
                style={{
                  color: DARKBLACK,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {`${formattedNumber}`}
              </Text>
            </View>
          </View>
          <PayNowButton
            disabled={!this.state.enablePayNow}
            themeColor={this.state.color}
            textFontSize={16}
            textFontWeight={'800'}
            textColor={'white'}
            borderRadius={this.state.borderRadius}
            height={50}
            width={150}
            text={'Pay Now'}
            payload={this.getPayload()}
            env={'dev'}
            currency={'VND'}
            afterCheckout={this.afterCheckout}
            redirectUrl={'chaiport://checkout'}
            secretKey={SECRET_KEY}
            chaipayKey={CHAIPAY_KEY}
            environment={ENVIRONMENT}
          />
        </View>
      </View>
    );
  };

  render() {
    let totalAmount = sumBy(values(this.state.selectedProducts), 'price');

    let image = !this.state.shouldShowOrderDetails
      ? require('../.././assets/expand.png')
      : require('../.././assets/colapse.png');

    let orderDetails = this.state.orderDetails;

    return (
      <View style={{backgroundColor: WHITE_COLOR, flex: 1}}>
        {false ? (
          <>
            <ScrollView>
              <this.ResponseView orderDetails={orderDetails} />
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.payNowView,
                {
                  marginTop: 10,
                  marginBottom: 15,
                  width: width - 60,
                  backgroundColor:
                    orderDetails?.status_reason === 'SUCCESS' ||
                    orderDetails?.is_success === true
                      ? SUCCESS_COLOR
                      : APP_THEME_COLOR,
                  shadowColor: '#000000',
                  shadowOffset: {
                    width: 1,
                    height: 3,
                  },
                  shadowRadius: 5,
                  shadowOpacity: 0.2,
                  elevation: 6,
                },
              ]}
              disabled={false}
              onPress={() => {
                if (
                  orderDetails?.status_reason === 'SUCCESS' ||
                  orderDetails?.is_success === true
                ) {
                  this.props.goBack();
                } else {
                  this.setState({orderDetails: undefined});
                }
              }}>
              <Text style={styles.payNowTextView}>Go Back</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={[styles.headerView]}>
              <Text style={styles.featuredText}>{strings.checkout} </Text>
            </View>
            <>
              <KeyboardAvoidingView
                behavior="padding"
                style={{flex: 1, marginBottom: 15}}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.contentContainerStyle}
                  style={styles.container}>
                  <View style={{flex: 1}}>
                    <this.ListOfItemsView />
                    <this.PaymentOptionsView />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>

              <View>
                {this.state.shouldShowOrderDetails ? (
                  <this.OrderDetailsView totalAmount={totalAmount} />
                ) : null}
                <this.SafeAndsecureView />
                <this.PayNowView image={image} totalAmount={totalAmount} />
              </View>
            </>
            {orderDetails !== undefined ? (
              <this.ResponseView orderDetails={orderDetails} />
            ) : null}
          </>
        )}
        {/* <Checkout
          ref={this.checkout}
          env={'dev'}
          currency={'VND'}
          callbackFunction={this.afterCheckout}
          redirectUrl={'chaiport://checkout'}
          secretKey={SECRET_KEY}
          chaipayKey={CHAIPAY_KEY}
          environment={ENVIRONMENT}
        /> */}
      </View>
    );
  }
}

export default CheckoutUI;
