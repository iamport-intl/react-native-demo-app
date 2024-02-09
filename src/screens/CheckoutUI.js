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
  omit,
} from 'lodash';
import React, {Component} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import MobileNumberFlow from '../Layouts/MobileFlow';
import {
  Checkout,
  helpers,
  PayNowButton,
  PaymentMethods,
  CartDetails,
  TransactionStatusView,
  CartSummary,
  CheckoutInstance,
  CheckoutUI2,
} from '@iamport-intl/portone-sdk';

import {hexToRgb, formatNumber} from '../helpers/helperFunctions';

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
  Dimensions,
  PermissionsAndroid,
  LayoutAnimation,
  Platform,
} from 'react-native';

import {
  APP_THEME_COLOR,
  BOLD,
  BORDERCOLOR,
  CHAIPAY_KEY,
  CURRENCY,
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
  languageData,
  webRequiredParams,
  webBodyParams,
} from '../constants.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DashedLine from '../subElements/DashedLine';
import {isTooDark} from '../../paymentSDK/helper';
import SmsListener from 'react-native-android-sms-listener';
import {EventRegister} from 'react-native-event-listeners';

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

    alignItems: 'center',
    borderColor: '#ddd',
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
  nextContainerView: {
    backgroundColor: TRANSPARENT,
    width: width,
    marginTop: 5,
  },
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

class CheckoutUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: {},
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
      showShippingAddress: true,
      payload: props.route.params.payload,
      themeColor: props.route.params.themeColor || '#FFFFFF',
    };
    this.phone = React.createRef();
    this.otpInput = React.createRef();
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
    this.RBSheet.open();
    if (CheckoutInstance.state.languageCode?.code) {
      strings.setLanguage(CheckoutInstance.state.languageCode?.code);
    } else {
      strings.setLanguage('en-US');
    }

    helpers
      .fetchAvailablePaymentGateway(
        this.props.route.params.payload.chaipayKey || CHAIPAY_KEY,
        this.props.route.params.payload.currency || CURRENCY,
      )
      .then(data => {
        this.setSelectedProducts();

        this.setState({totalListOfPayments: data?.data});
        let filteredWalletList = filter(data?.data?.WALLET, item => {
          return item.is_enabled;
        });
        console.log('filteredWalletList', filteredWalletList);

        this.setState({walletsList: filteredWalletList});
        let filterCreditCardList = filter(data?.data?.CARD, item => {
          return (
            item.is_default &&
            item.is_enabled &&
            item.sub_type.includes('INT_CREDIT_DEBIT_CARD')
          );
        });
        let filterATMCardList = filter(data?.data?.CARD, item => {
          return (
            item.is_default &&
            item.is_enabled &&
            item.sub_type.includes('ATM_CARD')
          );
        });
        this.setState({
          paymentCreditCardType: filterCreditCardList,
          paymentATMCardType: filterATMCardList,
          cardList: data?.data.CARD,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
    // if (this.state.paymentLinkRef === undefined) {
    //   const payload = this.props?.payload;
    //   let {body} = prepareWebRequestBody({
    //     ...payload,
    //     mobileRedirectUrl: payload.redirectUrl,
    //   });

    //   helpers
    //     .generatePaymentLink(
    //       {...body, chaipay_key: body?.key},
    //       this.props?.JWTToken,
    //       CheckoutInstance.state.env,
    //     )
    //     .then(data => {
    //       this.setState({paymentLinkRef: data}, () =>
    //         console.log('paymentLinkRef', this.state.paymentLinkRef),
    //       );
    //     });
    // }

    AsyncStorage.getItem('formattedMobileNumber').then(value => {
      //this.setState({formattedText: value});
    });

    AsyncStorage.getItem('mobileNumber').then(value => {
      this.setState({mobileNumber: value});
    });

    AsyncStorage.getItem('fontWeight').then(value => {
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

    AsyncStorage.getItem('SavedCardsData').then(value => {
      let data = JSON.parse(value);
      this.setState({savedCardsData: data});
    });

    this.failedListener = EventRegister.addEventListener('Failed', data => {
      console.log('FAILED', data);
      this.afterCheckout(data);
    });
    this.successListener = EventRegister.addEventListener('Success', data => {
      this.RBSheet?.open();
      this.afterCheckout(data);
    });
    this.dismissListener = EventRegister.addEventListener('Dismiss', data => {
      // if (Platform.OS === 'ios') {
      //   this.modalRef.setVisibility(false);
      // } else {
      // }
      this.RBSheet?.close();
    });

    this.closeModalListner = EventRegister.addEventListener(
      'showiOSWebModal',
      async data => {
        console.log('showiOSWebModal', data);
        this.RBSheet?.close();
      },
    );
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.dismissListener);
    EventRegister.removeEventListener(this.successListener);
    EventRegister.removeEventListener(this.failedListener);
    EventRegister.removeEventListener(this.dismissListener);
    EventRegister.removeEventListener(this.closeModalListner);
  }

  setSelectedProducts = () => {
    let selectedProducts = values(this.props.route.params.selectedProducts);

    this.setState({selectedProducts: selectedProducts});
  };
  setFormattedNumber(formattedText) {
    AsyncStorage.setItem('formattedMobileNumber', formattedText);
    //this.setState({formattedText: formattedText});
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
    if (transactionDetails) {
      this.setState({
        orderDetails: transactionDetails,
      });
    }
  };

  handleTextChange = text => {
    console.warn(text);
    this.setState({OTP: text});
  };

  onCloseTransactionViewPressed = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    let status = this.state.orderDetails;
    this.setState({orderDetails: undefined}, () => {
      if (status?.is_success === true) {
        this.props?.onClose();
      }

      this.RBSheet.close();
    });
  };

  ResponseView = ({orderDetails}) => {
    let totalAmount = sumBy(values(this.state.selectedProducts), 'price');
    let selectedProducts = values(this.state.selectedProducts);

    return (
      <TransactionStatusView
        selectedProducts={selectedProducts}
        deliveryAmount={deliveryAmount}
        orderDetails={orderDetails}
        showSheet={true}
        onClose={this.onCloseTransactionViewPressed}
        themeColor={this.state.themeColor}
        payload={this.getPayload()}
        extraSpacing={true}
      />
    );
  };

  removeItem = data => {
    let filteredItems = filter(this.state.selectedProducts, item => {
      return item.key !== data.key;
    });
    this.setState({selectedProducts: filteredItems});
  };

  _onChange = form => {
    console.log('form', form);
  };

  saveCardDetails = data => {
    this.setState({newCardData: data});
  };

  getData = () => {
    return this.props.route.params.payload;
  };

  confirmCardPayment = async (
    savedCard,
    fromSavedcards = false,
    creditCardClicked,
    JWTToken,
    clientKey,
  ) => {
    let data = this.getData();
    let cardType = first(
      creditCardClicked
        ? this.state.paymentCreditCardType
        : this.state.paymentATMCardType,
    );

    data.pmt_channel = cardType?.payment_channel_key;
    data.pmt_method = cardType?.payment_method_key;
    let getMerchantDetails = await helpers.getSignatureHashAndMerchntId(
      this.state.paymentLinkRef,
      CheckoutInstance.state.env,
    );
    let payload = {
      ...data,
      paymentChannel: cardType?.payment_channel_key,
      paymentMethod: cardType?.payment_method_key,
    };
    if (getMerchantDetails !== undefined) {
      payload = {
        ...payload,
        merchantOrderId: getMerchantDetails?.merchant_order_id
          ? getMerchantDetails?.merchant_order_id
          : payload?.merchant_order_id,
        merchant_order_id: getMerchantDetails?.merchant_order_id
          ? getMerchantDetails?.merchant_order_id
          : payload?.merchant_order_id,
        signatureHash: getMerchantDetails?.signature_hash
          ? getMerchantDetails?.signature_hash
          : payload?.signature_hash,
        signature_hash: getMerchantDetails?.signature_hash
          ? getMerchantDetails?.signature_hash
          : payload?.signature_hash,
        payment_link: this.state.paymentLinkRef,
      };
    }

    let response;
    if (fromSavedcards) {
      response = await helpers.startPaymentWithSavedCard(
        savedCard,
        payload,

        JWTToken,
        clientKey,
      );
    } else {
      response = await Checkout.startPaymentWithNewCard(
        savedCard,
        payload,
        JWTToken,
        clientKey,
      );
    }

    this.setState({showLoader: false});

    if (response?.val.status === 200 || response?.val.status === 201) {
      this.setState({orderDetails: response?.val.data});
    } else {
      this.setState({orderDetails: response?.val});
    }
    // AsyncStorage.setItem('USER_DATA', JSON.stringify(response.data));

    this.setState({userData: response?.data});
  };

  selectedData = async (
    data,
    enableButton,
    creditCard,
    atmCardClicked,
    JWTToken,
    clientKey,
  ) => {
    this.setState({selectedItem: data});
    if (enableButton !== undefined) {
      this.setState({enablePayNow: enableButton});
    }
    if (data?.fromNewCard) {
      this.confirmCardPayment(
        {
          card_number: data.cardNumber,
          card_holder_name: data.name || 'NGUYEN VAN A',
          cvv: data.cvv,
          expiry_month: data.expirationMonth,
          expiry_year: data.expirationYear,
          saved_card: data?.saveForLater,
        },
        false,
        creditCard,
        JWTToken,
        clientKey,
      );
    } else if (data?.fromATmCard || data?.fromCreditCard) {
      var payload = this.getData();
      var newPayload = {...payload};

      newPayload.paymentChannel = data?.payment_channel_key;
      newPayload.paymentMethod = data?.payment_method_key;

      var response = await this.checkout.current.startPaymentWithWallets(
        newPayload,
      );
      this.setState({showLoader: false});

      // this.afterCheckout(response);
      this.setState({selectedItem: data});
    } else {
      this.setState({selectedItem: data});
    }
  };

  creditCardDetails = (
    cardData,
    creditCardClicked,
    atmCardClicked,
    JWTToken,
    clientKey,
  ) => {
    setTimeout(() => {
      this.setState({showLoader: true});
    }, 300);

    this.selectedData(
      {...cardData, fromNewCard: true},
      undefined,
      creditCardClicked,
      atmCardClicked,
      JWTToken,
      clientKey,
    );
  };
  atmCardDetails = (cardData, JWTToken, clientKey) => {
    this.selectedData(
      {...cardData, fromNewCard: true},
      undefined,
      JWTToken,
      clientKey,
    );
  };
  tokenisationCreditCardDetails = (data, enable) => {
    this.setState({
      enablePayNow: enable,
      selectedItem: data,
      fromATMCard: false,
      fromCreditCard: true,
      fromNewCard: false,
    });
  };
  atmCardClicked = (data, enable) => {
    // helpers
    //   .getSignatureHashAndMerchntId(
    //     this.state.paymentLinkRef,
    //     CheckoutInstance.state.env
    //   )
    //   .then((data) => {
    //     let payload = {
    //       ...this.props.route.params.payload,
    //       merchantOrderId: data?.merchant_order_id,
    //       signatureHash: data?.signature_hash,
    //     };
    //     console.log("NewPayload", JSON.stringify(payload, null, 4));
    //     this.setState({ payload: payload });
    //   });

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
    let themeColor = this.state.themeColor;
    let layout = this.props.route.params.layout;

    return (
      <View
        style={{
          width: width,
        }}>
        <PaymentMethods
          paymentLinkRef={this.state.paymentLinkRef}
          themeColor={themeColor}
          payload={payload}
          headerTitle={'Choose a payment option'}
          fontSize={
            this.props.route.params.customOptions
              ? this.props.route.params.customOptions?.nameFontSize
              : this.state.fontSize || 12
          }
          fontWeight={
            this.props.route.params.customOptions
              ? this.props.route.params.customOptions?.fontWeight
              : this.state.fontWeight || '800'
          }
          headerFontSize={
            this.props.route.params.customOptions?.headerFontSize || 15
          }
          headerFontWeight={
            this.props.route.params.customOptions?.headerFontWeight || '500'
          }
          selectedData={this.selectedData}
          customHandle={false}
          selectedProducts={selectedProducts}
          deliveryAmount={deliveryAmount}
          newCardData={this.creditCardDetails}
          creditCardClicked={this.tokenisationCreditCardDetails}
          atmCardClicked={this.atmCardClicked}
          onClose={this.onCloseTransactionViewPressed}
          removeBorder={true}
          fromCheckout={true}
          walletStyles={{
            themeColor: themeColor,
            borderRadius:
              this.props.route.params.customOptions?.nameFontSize ||
              this.state.borderRadius,
            nameFontSize:
              this.props.route.params.customOptions?.nameFontSize ||
              this.state.fontSize,
            nameFontWeight:
              this.props.route.params.customOptions?.nameFontWeight ||
              this.state.fontWeight,
            buttonBorderRadius: this.props.route.params.customOptions
              ? this.props.route.params.customOptions.buttonBorderRadius
              : layout === 1 || layout === 3
              ? 25
              : 10,
          }}
          cardStyles={{
            themeColor: themeColor,
            borderRadius:
              this.props.route.params.customOptions?.nameFontSize ||
              this.state.borderRadius,
            nameFontSize:
              this.props.route.params.customOptions?.nameFontSize ||
              this.state.fontSize,
            nameFontWeight:
              this.props.route.params.customOptions?.nameFontWeight ||
              this.state.fontWeight,
            buttonBorderRadius: this.props.route.params.customOptions
              ? this.props.route.params.customOptions.buttonBorderRadius
              : layout === 1 || layout === 3
              ? 25
              : 10,
          }}
          transactionStyles={{
            themeColor: themeColor,
            borderRadius:
              this.props.route.params.customOptions?.nameFontSize ||
              this.state.borderRadius,
            nameFontSize:
              this.props.route.params.customOptions?.nameFontSize ||
              this.state.fontSize,
            nameFontWeight:
              this.props.route.params.customOptions?.nameFontWeight ||
              this.state.fontWeight,
            buttonBorderRadius: this.props.route.params.customOptions
              ? this.props.route.params.customOptions.buttonBorderRadius
              : layout === 1 || layout === 3
              ? 25
              : 10,
          }}
        />
      </View>
    );
  };

  getSavedCardsNow = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 7,
        }}
        onPress={() => {
          this.setState({showMobileInputFlow: true});
        }}>
        <Image
          source={require('../../assets/card.png')}
          style={{
            alignSelf: 'center',
            width: 40,
            height: 40,
            resizeMode: 'contain',
            marginTop: 0,
          }}
        />
        <Text
          style={{
            marginHorizontal: 5,
            fontSize: 16,
            color: this.props.route.params.themeColor || '#FC6B2D',
          }}>
          {'Get saved Cards flow'}
        </Text>
        <Image
          source={require('../../assets/orangeRightIndicator.png')}
          style={{
            alignSelf: 'center',
            width: 15,
            height: 15,
            resizeMode: 'contain',
            marginTop: 0,
          }}
        />
      </TouchableOpacity>
    );
  };

  poweredBy = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 7,
          backgroundColor: WHITE_COLOR,
          marginTop: 10,
          marginBottom: 20,
        }}>
        <Text style={{fontSize: 12}}>{strings.poweredBy + ''}</Text>
        <Image
          source={require('../../assets/chaiport.png')}
          style={{
            alignSelf: 'center',
            width: 15,
            height: 15,
            resizeMode: 'contain',
            marginTop: 0,
            marginRight: 5,
          }}
        />
        <Text style={{fontSize: 12}}>{'PortOne'}</Text>
      </View>
    );
  };

  hideOrderDetailsAlert = () => {
    this.setState({orderDetails: undefined});
  };

  getPayload = () => {
    let newPayload = this.getData();

    let selectedItem = this.state.selectedItem;

    let totalAmount = sumBy(values(this.state.selectedProducts), 'price');

    newPayload.paymentChannel = selectedItem?.payment_channel_key;
    newPayload.paymentMethod =
      selectedItem?.payment_channel_key === 'VNPAY'
        ? 'VNPAY_ALL'
        : selectedItem?.payment_method_key;

    return newPayload;
  };

  totalAmountView = ({image, totalAmount}) => {
    const layout = this.props.route.params.layout;
    let formattedNumber = formatNumber(totalAmount + deliveryAmount);

    return (
      <View
        style={{
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          marginHorizontal: 15,
        }}>
        <TouchableOpacity style={{flexDirection: 'row', flex: 0.5}}>
          <Text>Total </Text>
          <Image
            source={require('../../assets/grayUpArrow.png')}
            style={{
              alignSelf: 'center',
              width: 8,
              height: 8,
              resizeMode: 'contain',
              marginTop: 0,
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            flex: 0.5,
            justifyContent: 'flex-end',
          }}>
          <Text style={{color: '#333333', fontSize: 20}}>
            {formattedNumber + ' '}
          </Text>
          <Text style={{color: '#DDDDDD', fontSize: 20}}>
            {CheckoutInstance.state.currency}
          </Text>
        </View>
      </View>
    );
  };

  savedCardsData = data => {
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

  languageButton = ({text, onPress, showUnderLine = false}) => {
    return (
      <>
        <TouchableOpacity onPress={onPress} style={{padding: 10}}>
          <Text style={{fontSize: 16, alignSelf: 'center'}}>{text}</Text>
        </TouchableOpacity>
        {showUnderLine ? (
          <View
            style={{
              backgroundColor: this.state.themeColor,
              height: 0.5,
              width: 100,
            }}
          />
        ) : null}
      </>
    );
  };
  render() {
    let totalAmount = sumBy(values(this.state.selectedProducts), 'price');

    let image = !this.state.shouldShowOrderDetails
      ? require('../../assets/expand.png')
      : require('../../assets/colapse.png');

    let orderDetails = this.state.orderDetails;

    return (
      <>
        {
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <RBSheet
              customStyles={{
                container: {
                  height: Platform.OS === 'ios' ? '100%' : '100%',
                  backgroundColor: this.state.themeColor,
                },
                draggableIcon: {
                  backgroundColor: 'transparent',
                },
              }}
              closeOnDragDown={true}
              closeOnPressMask={false}
              animationType={'slide'}
              onClose={this.props.route.params.onClose}
              ref={ref => {
                this.RBSheet = ref;
              }}
              openDuration={250}>
              <View
                pointerEvents={
                  this.state.showLanguageSelection ? 'none' : 'auto'
                }
                style={{
                  backgroundColor: WHITE_COLOR,
                  flex: 1,
                  marginTop: Platform.OS === 'android' ? -25 : 0,
                  opacity: this.state.showLanguageSelection ? 0.8 : 1,
                }}>
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: this.state.themeColor,
                    }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        width: 45,
                        height: 45,
                        alignSelf: 'center',
                        marginLeft: 15,
                      }}
                      onPress={this.props.navigation.goBack}>
                      <View>
                        <Image
                          source={require('../../assets/backLeft.png')}
                          style={{width: 10, height: 12}}
                        />
                      </View>
                      {/* <View>
                        <Cancel
                          fill={
                            !isTooDark(this.state.themeColor)
                              ? "white"
                              : "white"
                          }
                          width={12}
                          height={12}
                        />
                      </View> */}
                    </TouchableOpacity>

                    <View
                      style={{
                        height: 50,
                        backgroundColor: this.state.themeColor,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1,
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          flexDirection: 'row',
                          alignContent: 'center',
                          marginLeft: 45,
                        }}>
                        <Image
                          source={require('../../assets/checkoutHeader.png')}
                          style={{width: 28, height: 30, alignSelf: 'center'}}
                        />
                        <Text
                          style={{
                            padding: 5,
                            color: !isTooDark(this.state.themeColor)
                              ? 'black'
                              : 'white',
                            fontWeight: 'bold',
                            marginLeft: 10,
                            fontSize: 16,
                            alignSelf: 'center',
                          }}>
                          {strings.checkout}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginHorizontal: 15,
                        }}
                        onPress={() => {
                          LayoutAnimation.configureNext(
                            LayoutAnimation.Presets.easeInEaseOut,
                          );
                          this.setState({
                            showLanguageSelection:
                              !this.state.showLanguageSelection,
                          });
                        }}>
                        <Text
                          style={{
                            fontSize:
                              this.props.route.params.headerFontSize || 16,
                            fontWeight:
                              this.props.route.params.headerFontWeight || '500',
                            color: !isTooDark(this.state.themeColor)
                              ? 'black'
                              : 'white',
                            marginRight: 10,
                          }}>
                          {!this.state.showLanguageSelection
                            ? CheckoutInstance.state?.languageCode?.name
                            : 'Thai(TH)'}
                        </Text>

                        <View style={{marginRight: 5}}>
                          <Image
                            source={require('../../assets/Indicator.png')}
                            style={{width: 8, height: 15}}
                          />
                          {/* {this.state.showLanguageSelection ? (
                            <UpArrow
                              fill={
                                !isTooDark(this.state.themeColor)
                                  ? "white"
                                  : "white"
                              }
                              width={10}
                              height={6}
                            />
                          ) : (
                            <DownArrow
                              fill={
                                !isTooDark(this.state.themeColor)
                                  ? "white"
                                  : "white"
                              }
                              width={10}
                              height={6}
                            />
                          )} */}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <>
                    <KeyboardAvoidingView
                      behavior="padding"
                      style={{flex: 1, marginBottom: 1}}
                      keyboardVerticalOffset={100}>
                      <ScrollView>
                        <TouchableOpacity activeOpacity={1}>
                          <this.PaymentOptionsView />
                        </TouchableOpacity>
                      </ScrollView>
                    </KeyboardAvoidingView>

                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor: '#EAEAEA',
                      }}>
                      <this.getSavedCardsNow />
                      <this.totalAmountView
                        image={image}
                        totalAmount={totalAmount}
                      />
                      <this.poweredBy />
                    </View>
                  </>
                  {orderDetails !== undefined ? (
                    <this.ResponseView orderDetails={orderDetails} />
                  ) : null}
                </>
              </View>
              {this.state.showMobileInputFlow ? (
                <MobileNumberFlow
                  onClose={() => {
                    this.setState({showMobileInputFlow: false});
                  }}
                  savedCardsData={this.savedCardsData}
                  shouldShowOTP={this.state.shouldShowOTP}
                  themeColor={this.props.route.params.themeColor}
                  headerTitle={
                    formatNumber(totalAmount) ||
                    this.props.route.params.walletStyles?.headerTitle ||
                    this.state.modalHeaderText
                  }
                />
              ) : null}
              {this.state.showLanguageSelection ? (
                <View
                  style={{
                    position: 'absolute',
                    right: 45,
                    top: 45,

                    backgroundColor: 'white',
                    shadowRadius: 1,
                    shadowOffset: {
                      height: 1,
                    },
                    elevation: 3,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}>
                  <TouchableOpacity
                    style={{alignItems: 'flex-start'}}
                    onPress={() =>
                      this.setState({showLanguageSelection: false})
                    }>
                    <Image
                      source={require('../../assets/cancel.png')}
                      style={{width: 8, height: 12}}
                    />
                  </TouchableOpacity>
                  <FlatList
                    contentContainerStyle={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    data={languageData}
                    renderItem={({item, index}) => {
                      return (
                        <this.languageButton
                          text={item.name}
                          onPress={() => {
                            CheckoutInstance.setState({
                              languageCode: item,
                            });
                            strings.setLanguage(item.code);
                            this.setState({showLanguageSelection: false});
                          }}
                          showUnderLine={
                            index + 1 === languageData.length ? false : true
                          }
                        />
                      );
                    }}
                    keyExtractor={(item, index) => `${index}`}
                  />
                </View>
              ) : null}
              {this.state.showLoader ? (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator color={'red'} size={'large'} />
                </View>
              ) : null}
            </RBSheet>
          </View>
        }
      </>
    );
  }
}

export default CheckoutUI;
