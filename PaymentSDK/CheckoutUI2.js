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
import React, {Component} from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  LayoutAnimation,
  Platform,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Locale from './constants';
import UpArrow from '../assets/upArrow.svg';
import DownArrow from '../assets/downArrow.svg';
import {hexToRgb, formatNumber} from './helper';
import {ModalView} from 'react-native-ios-modal';
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
import Cancel from '../assets/cancel.svg';
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
} from './constants.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkout from './Checkout.js';
import CheckoutInstance from './CheckoutInstance';
import {helpers} from './helper';
import PayNowButton from './PayNowButton';
import PaymentMethods from './PaymentMethods.js';
import MobileAuthenticationView from './MobileAuthenticationView.js';
import CartDetails from './CartDetails.js';
import TransactionStatusView from './TransactionStatusView.js';
import CartSummary from './CartSummary.js';
import DashedLine from './subElements/DashedLine';
import {isTooDark} from './helper';
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

class CheckoutUI2 extends Component {
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
      showShippingAddress: true,
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
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.dismissListener);
    EventRegister.removeEventListener(this.successListener);
    EventRegister.removeEventListener(this.failedListener);
  }

  setSelectedProducts = () => {
    let selectedProducts = values(this.props.selectedProducts);

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
    console.warn('text', text);
    this.setState({OTP: text});
  };

  onCloseTransactionViewPressed = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.setState({orderDetails: undefined});

    this.props?.onClose();
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
        themeColor={this.props.themeColor}
        payload={this.getPayload()}
        extraSpacing={true}
      />
    );
  };

  formatNumber = number => {
    let formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: CheckoutInstance.state.currency,
    }).format(number);
    return formattedNumber;
  };
  removeItem = data => {
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
          nameFontWeight={`${Number(this.state.fontWeight) - 100}`}
          descriptionSize={this.state.fontWeight - 3}
          descriptionFontWeight={`${Number(this.state.fontWeight) - 200}`}
          amountFontSize={this.state.fontSize}
          amountFontWeight={this.state.fontWeight}
          borderRadius={this.state.borderRadius}
          borderWidth={1}
          headerText={strings.netPayable}
          orderSummaryText={strings.order_details}
          headerTextColor={this.props.themeColor}
          headerFont={25}
          headerFontWeight={'500'}
          removeItem={this.removeItem}
          removeBorder={true}
          borderColor={this.state.color}
          showNetPayable={true}
          showCancel={false}
          themeColor={this.props.themeColor}
          layout={this.props.layout || 0}
        />
      </>
    );
  };

  ShippingView = () => {
    let selectedProducts = this.state.selectedProducts;
    let listCount = selectedProducts?.length;
    let layout = this.props.layout || 0;

    return (
      <View>
        {layout !== 0 ? <DashedLine backgroundColor={'transparent'} /> : null}
        <View
          style={{
            backgroundColor: WHITE_COLOR,
            marginTop: layout === 0 ? 8 : 0,
          }}>
          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'space-between',
              backgroundColor: WHITE_COLOR,
              paddingVertical: layout === 0 ? 10 : 8,
              marginHorizontal: 15,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: this.props.headerFontSize || 16,
                fontWeight: this.props.headerFontWeight || '500',
                color: this.props.headerColor,
                alignContent: 'center',

                justifyContent: 'center',
              }}>
              {this.props.headerText || 'Shipping Address'}
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 30,
                height: 30,
              }}
              onPress={() => {
                this.setState({
                  showShippingAddress: !this.state.showShippingAddress,
                });
              }}>
              {!this.state.showShippingAddress ? (
                <UpArrow fill={this.props.themeColor} width={10} height={6} />
              ) : (
                <DownArrow fill={this.props.themeColor} width={10} height={6} />
              )}
            </TouchableOpacity>
          </View>
          {this.state.showShippingAddress ? (
            <>
              <View
                style={{
                  backgroundColor: hexToRgb(this.props.themeColor, 0.05),
                  marginHorizontal: layout === 0 ? 15 : 0,
                  borderRadius: 5,
                  marginBottom: layout === 0 ? 10 : 0,
                }}>
                <Text
                  style={{
                    marginLeft: 15,
                    marginTop: 15,
                    fontWeight: '800',
                    fontSize: 14,
                  }}>
                  {'Siri Neelapu'}
                </Text>
                <View
                  style={{
                    marginLeft: 15,
                    height: 2,
                    width: 35,
                    backgroundColor: this.props.themeColor,
                    marginVertical: 7,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      marginBottom: 15,
                      flex: 0.5,
                      fontWeight: '500',
                      fontSize: 13,
                    }}>
                    {this.props.shippingAddress ||
                      'MIG I A7, Sujatha Nagar, Pendurthy, Visakhanpatnam, Andhra pradesh, 530051, INDIA'}
                  </Text>
                  <View
                    style={{
                      flex: 0.5,
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Image
                      style={{
                        resizeMode: 'contain',
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}
                      source={require('../assets/shipping.png')}
                    />
                  </View>
                </View>
              </View>
            </>
          ) : layout !== 0 ? (
            <View style={{marginTop: 5}}>
              <DashedLine backgroundColor={'transparent'} />
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  x = () => {
    let selectedProducts = this.state.selectedProducts;
    let listCount = selectedProducts?.length;

    return (
      <>
        <CartDetails
          selectedProducts={selectedProducts || []}
          nameFontSize={this.state.fontSize - 1}
          nameColor={this.state.color}
          nameFontWeight={`${Number(this.state.fontWeight) - 100}`}
          descriptionSize={this.state.fontWeight - 3}
          descriptionFontWeight={`${Number(this.state.fontWeight) - 200}`}
          amountFontSize={this.state.fontSize}
          amountFontWeight={this.state.fontWeight}
          amountColor={this.state.color}
          borderRadius={this.state.borderRadius}
          borderWidth={1}
          headerText={'Net payable'}
          orderSummaryText={'Order Details'}
          headerTextColor={this.props.themeColor}
          headerFont={25}
          headerFontWeight={'500'}
          removeItem={this.removeItem}
          removeBorder={true}
          borderColor={this.state.color}
          showNetPayable={true}
          showCancel={true}
          themeColor={this.props.themeColor}
        />
      </>
    );
  };

  _onChange = form => {
    console.log('form', form);
  };

  saveCardDetails = data => {
    this.setState({newCardData: data});
  };

  getData = () => {
    let totalAmount = sumBy(this.state.selectedProducts, 'price');
    let selectedItem = first(values(this.state.selectedItem));
    return {
      source: 'mobile',
      environment: CheckoutInstance.state.environment,
      chaipayKey: CheckoutInstance.state.chaipayKey,
      secretKey: CheckoutInstance.state.secretKey,
      paymentChannel: selectedItem?.payment_channel_key,
      paymentMethod: selectedItem?.payment_method_key,
      merchantOrderId: 'MERCHANT' + new Date().getTime(),
      amount: totalAmount + deliveryAmount,
      currency: CheckoutInstance.state.currency,
      signature_hash: '123',
      billingAddress: {
        billing_name: 'Test mark',
        billing_email: 'markweins@gmail.com',
        billing_phone: this.state.formattedText || '84332234567',
        billing_address: {
          city: 'VN',
          country_code: 'VN',
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
        shipping_phone: '+84332234567',
        shipping_address: {
          city: 'abc',
          country_code: 'VN',
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
      successUrl: 'portone://checkout',
      failureUrl: 'portone://checkout',
      redirectUrl: 'portone://checkout',
      mobileRedirectUrl: 'chaiport://checkout',
    };
  };

  confirmCardPayment = async (savedCard, fromSavedcards = false) => {
    let data = this.getData();

    let cardType = first(this.state.paymentCardType);

    data.paymentChannel = cardType.payment_channel_key;
    data.paymentMethod = cardType.payment_method_key;
    data.merchantOrderId = 'MERCHANT' + new Date().getTime();

    let response;
    if (fromSavedcards) {
      response = await Checkout.startPaymentWithSavedCard(savedCard, data);
    } else {
      response = await Checkout.startPaymentWithNewCard(savedCard, data);
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

  selectedData = async (data, enableButton) => {
    this.setState({selectedItem: data});
    if (enableButton !== undefined) {
      this.setState({enablePayNow: enableButton});
    }
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

      // var response = await this.checkout.current.startPaymentWithWallets(
      //   newPayload,
      // );
      // this.setState({showLoader: false});

      // this.afterCheckout(response);
      this.setState({selectedItem: data});
    } else {
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
    let layout = this.props.layout;

    return (
      <View
        style={{
          width: width,
          marginTop: layout === 0 ? -25 : -20,
        }}>
        <PaymentMethods
          themeColor={themeColor}
          payload={payload}
          headerTitle={'Payment Methods'}
          fontSize={this.state.fontSize}
          fontWeight={this.state.fontWeight}
          headerFontSize={15}
          headerFontWeight={'500'}
          headerColor={'black'}
          selectedData={this.selectedData}
          customHandle={false}
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
            buttonBorderRadius: layout === 1 || layout === 3 ? 25 : 10,
          }}
          cardStyles={{
            themeColor: themeColor,
            borderRadius: this.state.borderRadius,
            nameFontSize: this.state.fontSize,
            nameFontWeight: this.state.fontWeight,
            buttonBorderRadius: layout === 1 || layout === 3 ? 25 : 10,
          }}
          transactionStyles={{
            themeColor: themeColor,
            borderRadius: this.state.borderRadius,
            nameFontSize: this.state.fontSize,
            nameFontWeight: this.state.fontWeight,
            buttonBorderRadius: layout === 1 || layout === 3 ? 25 : 10,
          }}
          layout={this.props.layout || 0}
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
          source={require('../assets/protected.png')}
          style={{
            alignSelf: 'center',
            width: 15,
            height: 15,
            resizeMode: 'contain',
            marginTop: 0,
          }}
        />
        <Text style={{fontSize: 12}}>{'Safe and Secure Payments'}</Text>
      </View>
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
        <Text style={{fontSize: 12}}>{'Powered by '}</Text>
        <Image
          source={require('../assets/chaiport.png')}
          style={{
            alignSelf: 'center',
            width: 15,
            height: 15,
            resizeMode: 'contain',
            marginTop: 0,
            marginRight: 5,
          }}
        />
        <Text style={{fontSize: 12}}>{'Chaiport'}</Text>
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

    return newPayload;
  };

  PayNowView = ({image, totalAmount}) => {
    const deepLinkURL = 'chaiport://checkout';
    const layout = this.props.layout;
    let formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: CheckoutInstance.state.currency,
    }).format(totalAmount + deliveryAmount);

    return (
      <View style={{width: width, backgroundColor: WHITE_COLOR, height: 50}}>
        <View style={styles.payNowContainerView}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              height: 50,
            }}
          />
          <PayNowButton
            disabled={!this.state.enablePayNow}
            themeColor={this.props.themeColor}
            textFontSize={16}
            textFontWeight={'800'}
            textColor={'white'}
            borderRadius={this.state.borderRadius}
            height={50}
            width={width - 60}
            text={'Pay Now'}
            borderRadius={layout === 1 || layout === 3 ? 25 : 10}
            payload={this.getPayload()}
          />
        </View>
      </View>
    );
  };

  SavedCardsView = showCardForm => {
    var formattedText = '+918341469169';
    var shouldShowOTP = this.state.shouldShowOTP;
    return (
      <>
        {showCardForm ? (
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: width,
                backgroundColor: WHITE_COLOR,
                marginTop: 5,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  paddingVertical: 15,

                  width: width - 30,
                  justifyContent: 'space-between',
                  backgroundColor: WHITE_COLOR,
                  marginHorizontal: 15,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={async () => {
                    // if (
                    //   (this.state.savedCardsData?.token &&
                    //     !this.state.showSavedCards) ||
                    //   this.state.shouldShowOTP
                    // ) {
                    //   console.log('entered');
                    //   let value = await helpers.fetchSavedCards(
                    //     formattedText,
                    //     this.state.OTP,
                    //     this.state.savedCardsData?.token,
                    //   );

                    //   if (
                    //     value?.status === 200 ||
                    //     value?.status === 201 ||
                    //     value?.status_code === '2000'
                    //   ) {
                    //     this.setState({savedCards: value.data.content});
                    //     this.setState({
                    //       mobileNumberVerificationDone: true,
                    //     });
                    //     this.setState({shouldShowOTP: false});
                    //   } else {
                    //     this.setState({
                    //       mobileNumberVerificationDone: true,
                    //     });

                    //     AsyncStorage.setItem(
                    //       'SavedCardsData',
                    //       JSON.stringify({}),
                    //     );
                    //     this.setState({savedCards: {}});

                    //     let val = await helpers.getOTP(formattedText);
                    //     if (val.status === 200 || val.status === 201) {
                    //       this.setState({shouldShowOTP: true});
                    //     }
                    //   }
                    // } else {
                    //   console.log('entered 123');

                    //   if (!this.state.showSavedCards) {
                    //     console.log('entered 12345');

                    //     AsyncStorage.setItem(
                    //       'SavedCardsData',
                    //       JSON.stringify({}),
                    //     );
                    //     this.setState({savedCards: {}});

                    //     let val = await helpers.getOTP(formattedText);
                    //     if (val.status === 200 || val.status === 201) {
                    //       this.setState({shouldShowOTP: true});
                    //     }
                    //   }
                    // }

                    this.setState({
                      showSavedCards: !this.state.showSavedCards,
                    });
                  }}>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    {strings.saved_payment_method}
                  </Text>

                  <View>
                    <Image
                      source={
                        !this.state.showSavedCards
                          ? require('../assets/colapse.png')
                          : require('../assets/expand.png')
                      }
                      style={{
                        alignSelf: 'center',
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                        marginRight: 5,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                {this.state.showSavedCards ? (
                  <>
                    <View>
                      {shouldShowOTP ? (
                        <>
                          <View style={{marginVertical: 15}}>
                            <MobileAuthenticationView
                              savedCardsData={data => console.log('data', data)}
                              ref={this.otpInput}
                              containerStyle={[
                                styles.OTPContainerStyle,
                                {marginHorizontal: 10, width: width - 40},
                              ]}
                              textInputStyle={[
                                styles.roundedTextInput,
                                {
                                  borderWidth: 1,
                                  height: (width - 40 - 10 * 5) / 7,
                                  width: (width - 40 - 10 * 5) / 7,
                                  borderBottomWidth: 1,
                                },
                              ]}
                              defaultValue={this.state.OTP}
                              textContentType="oneTimeCode"
                              offTintColor={descriptionText}
                              tintColor={APP_THEME_COLOR}
                              inputCount={6}
                              handleTextChange={text =>
                                this.handleTextChange(text)
                              }
                            />
                          </View>
                        </>
                      ) : null}
                      {/* <View
                        style={[styles.nextContainerView, {width: width - 30}]}>
                        {shouldShowOTP ? (
                          <TouchableOpacity
                            style={styles.nextButtonView}
                            onPress={async () => {
                              if (this.state.shouldShowOTP) {
                                let value = await helpers.fetchSavedCards(
                                  formattedText,
                                  this.state.OTP,
                                );

                                if (
                                  value?.status === 200 ||
                                  value?.status === 201 ||
                                  value?.status_code === '2000'
                                ) {
                                  AsyncStorage.setItem(
                                    'SavedCardsData',
                                    JSON.stringify(value.data),
                                  );
                                  this.setState({savedCardsData: value.data});
                                  this.setState({
                                    savedCards: value.data.content,
                                  });
                                  this.setState({shouldShowOTP: false});

                                  this.setState({
                                    mobileNumberVerificationDone: true,
                                  });
                                } else {
                                  if (
                                    value?.status_code === '4000' ||
                                    value?.status_code === '400'
                                  ) {
                                    AsyncStorage.setItem('SavedCardsData', {});
                                    this.setState({shouldShowOTP: false});
                                  }
                                }
                              } else {
                                if (this.state.shouldShowOTP) {
                                  AsyncStorage.setItem(
                                    'SavedCardsData',
                                    JSON.stringify({}),
                                  );
                                  this.setState({savedCards: {}});

                                  let val = await helpers.getOTP(formattedText);
                                  if (
                                    val.status === 200 ||
                                    val.status === 201
                                  ) {
                                    this.setState({shouldShowOTP: true});
                                  }
                                }
                              }
                            }}>
                            <Text style={styles.nextTextView}>
                              {shouldShowOTP ? strings.verify : strings.next}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View> */}
                    </View>
                  </>
                ) : null}

                {this.state.showSavedCards ? (
                  shouldShowOTP ? null : (
                    <View style={{marginHorizontal: 15}}>
                      {isEmpty(this.state.savedCards) ? (
                        <Text style={{padding: 15, textAlign: 'center'}}>
                          You don't have any saved cards yet
                        </Text>
                      ) : (
                        map(this.state.savedCards, product => {
                          return (
                            <View style={{marginLeft: -30}}>
                              <CheckboxView
                                fromSavedCards={true}
                                item={{
                                  name: `${product.partial_card_number}`,
                                  description: `${product.expiry_month} / ${product.expiry_year}`,
                                  ...product,
                                }}
                                image={{uri: product.logo}}
                                isSelected={
                                  cardvalue === product.partial_card_number
                                }
                                didSelected={this.onClickPaymentSelected}
                              />
                            </View>
                          );
                        })
                      )}
                    </View>
                  )
                ) : null}
              </View>
            </View>
          </View>
        ) : null}
      </>
    );
  };
  render() {
    let totalAmount = sumBy(values(this.state.selectedProducts), 'price');

    let image = !this.state.shouldShowOrderDetails
      ? require('../assets/expand.png')
      : require('../assets/colapse.png');

    let orderDetails = this.state.orderDetails;
    const showCardForm = first(
      this.state.paymentCardType,
    )?.tokenization_possible;

    return (
      <>
        {
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'yellow',
            }}>
            <RBSheet
              customStyles={{
                container: {
                  height: Platform.OS === 'ios' ? '100%' : '100%',
                  backgroundColor: this.props.themeColor,
                },
                draggableIcon: {
                  backgroundColor: 'transparent',
                },
              }}
              closeOnDragDown={true}
              closeOnPressMask={false}
              animationType={'slide'}
              onClose={this.props.onClose}
              ref={ref => {
                this.RBSheet = ref;
              }}
              openDuration={250}>
              <View
                style={{
                  backgroundColor: WHITE_COLOR,
                  flex: 1,
                  marginTop: Platform.OS === 'android' ? -25 : 0,
                }}>
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: this.props.themeColor,
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        width: 45,
                        height: 45,
                        alignSelf: 'center',
                        marginLeft: 15,
                      }}
                      onPress={this.props.onClose}>
                      <View>
                        <Cancel
                          fill={
                            !isTooDark(this.props.themeColor)
                              ? 'black'
                              : 'white'
                          }
                          width={12}
                          height={12}
                        />
                      </View>
                    </TouchableOpacity>

                    <View
                      style={{
                        height: 50,
                        backgroundColor: this.props.themeColor,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1,
                        marginLeft: -25,
                      }}>
                      <Text
                        style={{
                          padding: 5,
                          color: !isTooDark(this.props.themeColor)
                            ? 'black'
                            : 'white',
                          fontWeight: 'bold',
                          marginLeft: 10,
                          fontSize: 16,
                          alignSelf: 'center',
                        }}>
                        {strings.checkout}
                      </Text>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginHorizontal: 15,
                        }}
                        onPress={() => {
                          this.setState(
                            {
                              showLanguageSelection:
                                !this.state.showLanguageSelection,
                            },
                            () => {
                              strings.setLanguage(
                                this.state.showLanguageSelection ? 'en' : 'vn',
                              );
                            },
                          );
                        }}>
                        <Text
                          style={{
                            fontSize: this.props.headerFontSize || 16,
                            fontWeight: this.props.headerFontWeight || '500',
                            color: !isTooDark(this.props.themeColor)
                              ? 'black'
                              : 'white',
                            marginRight: 10,
                          }}>
                          {this.state.showLanguageSelection
                            ? 'English(EN)'
                            : 'VN'}
                        </Text>

                        <View style={{marginRight: 5}}>
                          {this.state.showLanguageSelection ? (
                            <UpArrow
                              fill={
                                !isTooDark(this.props.themeColor)
                                  ? 'black'
                                  : 'white'
                              }
                              width={10}
                              height={6}
                            />
                          ) : (
                            <DownArrow
                              fill={
                                !isTooDark(this.props.themeColor)
                                  ? 'black'
                                  : 'white'
                              }
                              width={10}
                              height={6}
                            />
                          )}
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
                        <View>
                          <this.ListOfItemsView />
                          <this.ShippingView />

                          <this.PaymentOptionsView />
                        </View>
                      </ScrollView>
                    </KeyboardAvoidingView>

                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor: 'lightgray',
                      }}>
                      {this.state.shouldShowOrderDetails ? (
                        <this.OrderDetailsView totalAmount={totalAmount} />
                      ) : null}
                      <this.SafeAndsecureView />
                      <this.PayNowView
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
            </RBSheet>
          </View>
        }
      </>
    );
  }
}

export default CheckoutUI2;
