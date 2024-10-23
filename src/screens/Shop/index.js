import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import {
  APP_THEME_COLOR,
  DARKGRAY,
  BOLD,
  LIGHTGRAY,
  WHITE_COLOR,
  BLACK,
  descriptionText,
  TRANSPARENT,
  currency,
  CURRENCY,
  SUCCESS_COLOR,
  CHAIPAY_KEY,
  SECRET_KEY,
  JWTToken,
  ORDERTEXT,
  IMAGE_BACKGROUND_COLOR,
  strings,
  ENVIRONMENT,
  toBase64,
  fromBase64,
  SUBMERCHANTKEY,
} from '../../constants';
import Product from '../Product';
import {
  filter,
  first,
  isEmpty,
  last,
  map,
  omit,
  orderBy,
  sumBy,
  values,
} from 'lodash';
import {HmacSHA256} from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import {
  Checkout,
  helpers,
  WalletView,
  CreditCardForm,
  SavedCardsView,
  TransactionStatusView,
  CartDetails,
  CheckoutInstance,
  CheckoutUI,
  BasicCheckoutUI,
} from '@iamport-intl/portone-sdk';
import AwesomeAlert from 'react-native-awesome-alerts';
import HorizontalTextStackView from '../../helpers/HorizontalTextStackView';
import ScheduledProductCell from '../SelectedProductCell';
import {EventRegister} from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const CUSTOMERUUID = 'ac8aabfc-ae74-4358-9403-a5d9d0c172eb';
const {width, height} = Dimensions.get('screen');

const products = [
  {
    key: 1,
    name: 'Bella Toes',
    description: 'Premium quality',
    quantity: 1,
    price: 10000,
    img: 'https://demo.portone.cloud/images/bella-toes.jpg',
  },
  {
    key: 2,
    name: 'Chikku Loafers',
    description: 'Special design',
    quantity: 1,
    price: 190000,
    img: 'https://demo.portone.cloud/images/chikku-loafers.jpg',
  },
  {
    key: 3,
    name: '(SRV) Sneakers',
    description: 'White sneakers',
    price: 185600,
    quantity: 1,
    img: 'https://demo.portone.cloud/images/banner2.jpg',
  },
  {
    key: 4,
    name: 'Shuberry Heels',
    description: 'Comfortable heels',
    price: 321000,
    quantity: 1,
    img: 'https://demo.portone.cloud/images/ab.jpg',
  },
  {
    key: 5,
    name: 'Red Bellies',
    description: 'Premium quality',
    price: 256000,
    quantity: 1,
    img: 'https://demo.portone.cloud/images/red-bellies.jpg',
  },
  {
    key: 6,
    name: 'Catwalk Flats',
    description: 'Premium quality',
    price: 191500,
    quantity: 1,
    img: 'https://demo.portone.cloud/images/catwalk-flats.jpg',
  },
];

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProducts: {},
      allProducts: products,
      showUIPopUp: false,
      orderDetails: {},
      ascendingSort: true,
      walletPaymentChannels: [],
      hideWalletUI: true,
      selectedLanguage: {
        name: 'Vietnamese',
        code: 'en-EN',
        languageCode: 'vn',
        currency: 'THB',
      },
    };
  }

  componentDidMount() {
    SplashScreen.hide();

    AsyncStorage.getItem('selectedLanguage').then(value => {
      let lang = JSON.parse(value);

      if (lang) {
        strings.setLanguage(lang.code);
        this.setState({selectedLanguage: lang});
      }
    });
    AsyncStorage.getItem('fontWeight').then(value => {
      this.setState({fontWeight: value});
    });
    AsyncStorage.getItem('fontSize').then(data => {
      let value = JSON.parse(data);

      this.setState({fontSize: value});
    });

    AsyncStorage.getItem('color').then(value => {
      this.setState({color: value});
    });

    AsyncStorage.getItem('borderRadius').then(data => {
      let value = JSON.parse(data);
      this.setState({borderRadius: value});
    });
    AsyncStorage.getItem('layout').then(data => {
      let value = JSON.parse(data);
      this.setState({layout: value});
    });

    this.colorListener = EventRegister.addEventListener('color', async data => {
      console.log('Data', data);
      this.setState({color: data?.value});
    });
    this.currencyListener = EventRegister.addEventListener(
      'ChangeCurrencies',
      async data => {
        console.log('Data', data);
        if (data) {
          CheckoutInstance.setState({
            languageCode: data,
            currency: data?.currency,
          });
        }

        this.setState({selectedLanguage: data}, () =>
          strings.setLanguage(data.code),
        );
      },
    );
    this.languageListener = EventRegister.addEventListener(
      'ChangeLanguage',
      async data => {
        console.log('Data', data);

        strings.setLanguage(data);
      },
    );

    this.borderRadiusListener = EventRegister.addEventListener(
      'borderRadius',
      async data => {
        console.log('Data', data);
        this.setState({borderRadius: data?.value});
      },
    );

    this.fontSizeListener = EventRegister.addEventListener(
      'fontSize',
      async data => {
        console.log('Data', data);
        this.setState({fontSize: data?.value});
      },
    );

    this.fontWeightListener = EventRegister.addEventListener(
      'fontWeight',
      async data => {
        console.log('Data', data);
        this.setState({fontWeight: data?.value});
      },
    );

    this.layoutListener = EventRegister.addEventListener(
      'layout',
      async data => {
        console.log('Data', data?.value);
        this.setState({layout: data?.value});
      },
    );
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.colorListener);
    EventRegister.removeEventListener(this.borderRadiusListener);
    EventRegister.removeEventListener(this.fontSizeListener);
    EventRegister.removeEventListener(this.fontWeightListener);
    EventRegister.removeEventListener(this.layoutListener);
    EventRegister.removeEventListener(this.currencyListener);
    EventRegister.removeEventListener(this.languageListener);
  }

  _didSelectedProducts = selectedProduct => {
    if (isEmpty(this.state.selectedProducts)) {
      this.setState({
        selectedProducts: {
          [selectedProduct.item.key]: selectedProduct.item,
        },
      });
    } else {
      if (!isEmpty(this.state.selectedProducts[selectedProduct.item.key])) {
        this.setState({
          selectedProducts: omit(
            this.state.selectedProducts,
            selectedProduct.item.key,
          ),
        });
      } else {
        this.setState({
          selectedProducts: {
            ...this.state.selectedProducts,
            [selectedProduct.item.key]: selectedProduct.item,
          },
        });
      }
    }
  };

  payNow = data => {
    this.setState({hideWalletUI: true});
    console.log(data);
  };

  onClosePressed = () => {
    console.log('Closed');

    this.setState({hideWalletUI: true});
  };

  onCreditCardClose = () => {
    this.setState({showCreditCardUI: false});
  };

  saveForLater = data => {
    console.log('Data', data);
  };
  newCardData = data => {
    console.log('DATA', data);
  };

  getTotalAmount = orderDetails => {
    let totalAmount = 0;
    map(values(this.state.selectedProducts), item => {
      totalAmount = totalAmount + item.price;
      orderDetails.push({
        id: `${item.key}`,
        price: item.price,
        name: item.name,
        quantity: 2,
        image: item.img,
      });
    });
  };
  generateJWTToken = () => {
    var payload = {
      iss: 'CHAIPAY',
      sub: 'lzrYFPfyMLROallZ',
      iat: new Date().getTime(),
      exp: new Date().getTime() + 1000 * 1000,
    };

    var secretKey =
      '2601efeb4409f7027da9cbe856c9b6b8b25f0de2908bc5322b1b352d0b7eb2f5';
    var secretKey1 =
      'a3b8281f6f2d3101baf41b8fde56ae7f2558c28133c1e4d477f606537e328440';
  };

  createHash = (
    key,
    amount,
    currency,
    failureUrl,
    merchantOrderId,
    successUrl,
    secretKey,
  ) => {
    let mainParams =
      'amount=' +
      encodeURIComponent(amount) +
      '&client_key=' +
      encodeURIComponent(key) +
      '&currency=' +
      encodeURIComponent(currency) +
      '&failure_url=' +
      encodeURIComponent(failureUrl) +
      '&merchant_order_id=' +
      encodeURIComponent(merchantOrderId) +
      '&success_url=' +
      encodeURIComponent(successUrl);

    let hash = HmacSHA256(mainParams, secretKey);
    let signatureHash = Base64.stringify(hash);

    return signatureHash;
  };

  getWebDefaultConfig = () => {
    var totalAmount = 0;
    let orderDetails = [];
    let merchantOrderId = 'MERCHANT' + new Date().getTime();
    let failureURL = 'https://dev-checkout.chaiport.io/failure.html';
    let successURL = 'https://dev-checkout.chaiport.io/success.html';

    map(values(this.state.selectedProducts), item => {
      let x = item.price * item.quantity;
      totalAmount = totalAmount + x;
      orderDetails.push({
        id: `${item.key}`,
        price: item.price,
        name: item.name,
        quantity: 2,
        image: item.img,
      });
    });

    //chaipayKey: 'lzrYFPfyMLROallZ',
    let payload = {
      portOneKey: CHAIPAY_KEY,
      chaipayKey: CHAIPAY_KEY,
      key: CHAIPAY_KEY,
      merchantDetails: {
        name: 'Chaipay',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
        back_url: 'https://demo.chaipay.io/checkout.html',
        promo_code: 'Downy350',
        promo_discount: 0,
        shipping_charges: 0.0,
      },
      merchantOrderId: merchantOrderId,
      signatureHash: this.createHash(
        CHAIPAY_KEY,
        totalAmount,
        this.state.selectedLanguage?.currency || CURRENCY,
        failureURL,
        merchantOrderId,
        successURL,
        SECRET_KEY,
      ),
      amount: totalAmount,
      currency: this.state.selectedLanguage?.currency || CURRENCY,
      countryCode: 'VN',
      billingDetails: {
        billing_name: 'Test React native',
        billing_email: 'markweins@gmail.com',
        // billing_phone: '+848959893980',
        billing_phone: '+660956425564',
        // billing_phone: '+840830443596',
        billing_address: {
          city: 'THB',
          country_code: 'VN',
          locale: 'en',
          line_1: 'address',
          line_2: 'address_2',
          postal_code: '400202',
          state: 'Mah',
        },
      },
      shippingDetails: {
        shipping_name: 'xyz',
        shipping_email: 'xyz@gmail.com',
        // shipping_phone: '+840830443596',
        shipping_phone: '+66 900002001',
        // shipping_phone: '+848959893980',
        shipping_address: {
          city: 'testing abc',
          country_code: 'VN',
          locale: 'en',
          line_1: 'Testing address_1',
          line_2: 'Testing address_2',
          postal_code: '400202',
          state: 'Mah',
        },
      },
      environment: ENVIRONMENT,
      orderDetails: orderDetails,
      successUrl: successURL,
      failureUrl: failureURL,
      mobileRedirectUrl: 'portone://checkout',
      redirectUrl: 'portone://checkout',
      expiryHours: 2,
      source: 'mobile',
      description: 'test RN',
      showShippingDetails: true,
      showBackButton: false,
      defaultGuestCheckout: false,
      isCheckoutEmbed: false,
    };

    return payload;
  };

  getDefaultConfig = () => {
    var totalAmount = 0;
    let orderDetails = [];
    let merchantOrderId = 'MERCHANT' + new Date().getTime();
    let failureURL = 'https://dev-checkout.chaiport.io/failure.html';
    let successURL = 'https://dev-checkout.chaiport.io/success.html';
    const promoDiscount = 100;
    const shipping = 400;

    map(values(this.state.selectedProducts), item => {
      totalAmount = totalAmount + item.price;
      orderDetails.push({
        id: `${item.key}`,
        price: item.price,
        name: item.name,
        quantity: 1,
        image: item.img,
      });
    });

    totalAmount = totalAmount + shipping - promoDiscount;
    // Todo: Have to modify the structure for selectedproducts
    //chaipayKey: 'lzrYFPfyMLROallZ',
    let payload = {
      portOneKey: CHAIPAY_KEY,
      chaipayKey: CHAIPAY_KEY,
      key: CHAIPAY_KEY,

      billingDetails: {
        billing_name: 'Test React native',
        billing_email: 'markweins@gmail.com',
        billing_phone: '+660956425564',
        // billing_phone: '+66900002001',
        // billing_phone: '+840830443596',
        // billing_phone: '+848959893980',
        billing_address: {
          city: 'VND',
          country_code: 'VN',
          locale: 'en',
          line_1: 'address',
          line_2: 'address_2',
          postal_code: '400202',
          state: 'Mah',
        },
      },
      shippingDetails: {
        shipping_name: 'xyz-Testing',
        shipping_email: 'xyz@gmail.com',
        shipping_phone: '+910830443596',
        shipping_address: {
          city: 'testing city',
          country_code: 'VN',
          locale: 'en',
          line_1: 'Testing line 1',
          line_2: 'Testing line 2',
          postal_code: '400202',
          state: 'Mah',
        },
      },
      merchantDetails: {
        name: 'Chaipay Cart',
        logo: 'https://demo.portone.cloud/images/chikku-loafers.jpg',
        back_url: 'https://demo.chaipay.io/checkout.html',
        promo_code: 'Downy350',
        promo_discount: promoDiscount,
        shipping_charges: shipping,
      },

      paymentChannel: 'OMISE',
      paymentMethod: 'OMISE_CREDIT_CARD',
      merchantOrderId: merchantOrderId,
      signatureHash: this.createHash(
        CHAIPAY_KEY,
        totalAmount,
        this.state.selectedLanguage?.currency || CURRENCY,
        failureURL,
        merchantOrderId,
        successURL,
        SECRET_KEY,
      ),
      amount: totalAmount,
      currency: this.state.selectedLanguage?.currency || CURRENCY,
      countryCode: 'VN',

      environment: ENVIRONMENT,
      orderDetails: orderDetails,
      successUrl: successURL,
      failureUrl: failureURL,

      redirectUrl: 'portone://checkout',
      expiryHours: 2,
      source: 'mobile',
      description: 'test RN',
    };

    return payload;
  };
  onClose = () => {
    this.setState({showUIPopUp: false});
  };

  afterCheckout = transactionDetails => {
    console.log('Transaction Details 499', transactionDetails);
    if (this.state.showV4Checkout === true) {
      this.setState({showV4Checkout: false}, () => {
        setTimeout(() => {
          if (typeof transactionDetails === 'object') {
            this.setState({orderDetails: transactionDetails});
          } else if (transactionDetails === 'Modal closed') {
            this.setState({orderDetails: transactionDetails});
          } else {
            this.setState({orderDetails: JSON.parse(transactionDetails)});
          }
        }, 900);
      });
    } else {
      if (transactionDetails) {
        setTimeout(() => {
          if (typeof transactionDetails === 'object') {
            this.setState({orderDetails: transactionDetails});
          } else if (transactionDetails === 'Modal closed') {
            this.setState({orderDetails: transactionDetails});
          } else {
            this.setState({orderDetails: JSON.parse(transactionDetails)});
          }
        }, 900);
      }
    }
  };

  hideOrderDetailsAlert = () => {
    this.setState({orderDetails: undefined});
  };

  formatNumber = number => {
    let formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: CURRENCY,
    })
      .format(number)
      .replace('THB', '฿');
    return formattedNumber;
  };

  getAvailablePaymentChannels = async () => {
    let x = await helpers.fetchAvailablePaymentGateway(CHAIPAY_KEY, CURRENCY);

    return x.data.WALLET;
  };
  ResponseView = ({orderDetails}) => {
    let totalAmount = sumBy(values(this.state.selectedProducts), 'price');
    let selectedItems = values(this.state.selectedProducts);
    let deliveryAmount = 0;
    console.log('order details enetere', orderDetails);
    return (
      <TransactionStatusView
        selectedProducts={selectedItems}
        deliveryAmount={deliveryAmount}
        orderDetails={orderDetails}
        showSheet={true}
        themeColor={this.props.themeColor}
        payload={this.getDefaultConfig()}
        onClose={() => this.hideOrderDetailsAlert()}
      />
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <>
          {!isEmpty(this.state.orderDetails) ? (
            <>
              <this.ResponseView orderDetails={this.state.orderDetails} />
            </>
          ) : null}
          <FlatList
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingTop: 0,
              paddingVertical: 15,
              backgroundColor: WHITE_COLOR,
            }}
            data={this.state.allProducts}
            numColumns={2}
            keyExtractor={item => item.key}
            renderItem={product => {
              let didSelectedItem = !isEmpty(
                this.state.selectedProducts[product.item.key],
              );
              let currencyCode = this.state.selectedLanguage?.currency;
              let languageObj = this.state.selectedLanguage;

              return (
                <Product
                  key={product.key}
                  data={{
                    ...product,
                    didSelected: didSelectedItem,
                  }}
                  currency={currencyCode}
                  languageCode={languageObj?.code}
                  navigation={this.props.navigation}
                  onSelectProduct={this._didSelectedProducts}
                />
              );
            }}
            ListHeaderComponent={() => {
              return (
                <View style={styles.headerContainerView}>
                  <View
                    style={[
                      styles.headerView,
                      Platform.OS === 'ios' ? {margiTop: 5} : {marginTop: 30},
                    ]}>
                    <Text style={styles.featuredText}>{strings.app_name}</Text>
                    <View style={styles.headerButtonView}>
                      <Text
                        style={
                          styles.numberOfItemsText
                        }>{`${products.length} ${strings.items_listed}`}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 5,
                            marginRight: 5,
                          }}
                          onPress={() => {
                            console.log('Sort CLICKED');
                            this.setState({showCreditCardUI: false}, () => {
                              this.setState({showCreditCardUI: true});
                            });

                            // this.setState({
                            //   ascendingSort: this.state.ascendingSort
                            //     ? false
                            //     : true,
                            // });
                            // let orderType = this.state.ascendingSort
                            //   ? 'asc'
                            //   : 'desc';
                            // let filterProducts = orderBy(
                            //   this.state.allProducts,
                            //   'price',
                            //   orderType,
                            // );
                            // this.setState({allProducts: filterProducts});
                          }}>
                          <Image
                            style={{
                              alignSelf: 'center',
                              justifyContent: 'center',
                              width: 12,
                              height: 12,
                              alignContent: 'center',
                            }}
                            source={
                              this.state.ascendingSort
                                ? require('../../../assets/ascendingSort.png')
                                : require('../../../assets/descendingSort.png')
                            }
                          />
                          <Text
                            style={{
                              color: BLACK,
                              fontSize: 12,
                              marginLeft: 5,
                            }}>
                            {strings.sort}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
            stickyHeaderIndices={[0]}
            ListFooterComponent={() => {
              return <View style={styles.footerView} />;
            }}
          />
          {this.state.showCreditCardUI ? (
            <SavedCardsView
              showSheet={true}
              data={[
                {name: '5757 5757 5757 5757', description: '14 / 22'},
                {name: '5000 0000 0000 0018', description: '25 / 25 '},
                {name: '4000 0000 0000 0002', description: '12 / 22'},
              ]}
              showAuthenticationFlow={false}
              payNow={this.payNow}
              checkBoxColor={'#E7E9F1'}
              checkBoxSelectionColor={'green'}
              themeColor={'green'}
              nameFontSize={15}
              nameFontWeight={'600'}
              subNameFontSize={12}
              subNameFontWeight={'300'}
              imageWidth={35}
              imageHeight={35}
              imageResizeMode={'contain'}
              checkBoxHeight={25}
              containerHorizontalPadding={15}
              containerVerticalPadding={15}
              headerTitle={'Saved Cards'}
              headerTitleFont={20}
              headerTitleWeight={'500'}
              headerImageWidth={50}
              headerImageHeight={50}
              headerImageResizeMode={'contain'}
              selectedItem={item => {
                console.log(item);
              }}
            />
          ) : null}
          <View style={styles.buyNowContainerView}>
            <TouchableOpacity
              style={[
                styles.buyNowView,
                isEmpty(this.state.selectedProducts)
                  ? {
                      backgroundColor: descriptionText,
                    }
                  : {
                      backgroundColor: APP_THEME_COLOR,
                    },
              ]}
              disabled={isEmpty(this.state.selectedProducts)}
              onPress={() => {
                let config = this.getDefaultConfig();
                Checkout.openWebCheckoutUI(
                  {
                    ...config,
                  },
                  JWTToken,
                  null,
                  null,
                  val => {
                    console.log('Callback function called', val);
                  },
                );

                // this.setState({showUIPopUp: true});
                // this.setState({showCardUI: true});
                // let payload = this.getDefaultConfig();
                // payload.paymentChannel = 'PAYLETTER';
                // payload.paymentMethod = 'PAYLETTER_CREDIT_CARD';

                // payload.userUUID = CUSTOMERUUID;
                // payload.autoRefund = true;
                // Checkout.startPaymentWithNewCard(
                //   null,
                //   payload,
                //   JWTToken,
                //   payload?.portOneKey,
                //   CUSTOMERUUID,
                // );
              }}>
              <Text style={styles.buyNowTextView} adjustsFontSizeToFit>
                {strings.buy_now}
              </Text>
            </TouchableOpacity>
            {this.state.showUIPopUp ? (
              <AwesomeAlert
                show={this.state.showUIPopUp}
                showProgress={false}
                title=""
                message={strings.alert_option}
                messageStyle={{textAlign: 'center'}}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelButtonTextStyle={{fontSize: 10}}
                confirmButtonTextStyle={{fontSize: 10}}
                cancelText={strings.web_checkout}
                confirmText={strings.custom_checkout}
                cancelButtonColor={APP_THEME_COLOR}
                confirmButtonColor={APP_THEME_COLOR}
                onCancelPressed={() => {
                  let config = this.getWebDefaultConfig();

                  let data = {...config, environment: ENVIRONMENT};
                  let jwtToken = JWTToken;
                  Checkout.openWebCheckoutUI(data, jwtToken);

                  this.onClose();
                  // this.setState({showUIPopUp: false}, () => {
                  //   Checkout.openWebCheckoutUI(data, jwtToken);

                  //   this.onClose();
                  // });
                }}
                onConfirmPressed={() => {
                  // v3
                  // this.props.navigation.navigate('Checkout', {
                  //   selectedProducts: this.state.selectedProducts,
                  //   themeColor: 'red',
                  //   navigation: this.props.navigation,
                  // });
                  // this.onClose();

                  // v2

                  // this.props.navigation.navigate('Checkout UI 2', {
                  //   selectedProducts: this.state.selectedProducts,
                  //   themeColor: '#FFFFFF',
                  //   navigation: this.props.navigation,
                  //   payload: this.getDefaultConfig(),
                  //   JWTToken: JWTToken,
                  //   callbackFunction: this.afterCheckout,
                  // });
                  // this.onClose();

                  // this.seState(
                  //   {showUIPopUp: false, showV4Checkout: true},
                  //   () => {
                  //     console.log(
                  //       'SHOW v4 elements',
                  //       this.state.showV4Checkout,
                  //     );
                  //   },
                  // );

                  let payload = this.getDefaultConfig();
                  payload.paymentChannel = 'PAYLETTER';
                  payload.paymentMethod = 'PAYLETTER_CREDIT_CARD';

                  payload.userUUID = CUSTOMERUUID;
                  payload.autoRefund = true;
                  Checkout.startPaymentWithNewCard(
                    null,
                    payload,
                    JWTToken,
                    payload?.portOneKey,
                    CUSTOMERUUID,
                  );
                }}
              />
            ) : null}
          </View>
          {/* {this.state.selectedLanguage !== undefined &&
          this.state.showV4Checkout ? (
            <CreditCardForm
              handleSDK={true}
              containerHeight={'85%'}
              onClose={() => {
                this.setState({showV4Checkout: false});
              }}
              showSaveForLater={true}
              newCardData={this.newCardData}
              headerTitle={12000}
              payNowButtonText={
                this.props.cardStyles?.payNowButtonText || strings.payNow
              }
              payNowButtonCornerRadius={
                this.props.cardStyles?.buttonBorderRadius
              }
              payload={{
                ...this.getDefaultConfig(),
                paymentChannel: 'APPOTAPAY',
                paymentMethod: 'APPOTAPAY_ATM_CARD',
              }}
              jwtToken={this.props.jwtToken}
            />
          ) : null} */}
          {this.state.selectedLanguage !== undefined &&
          this.state.showV4Checkout ? (
            <>
              <BasicCheckoutUI
                showShippingAddressView={true}
                showSavedCardsView={false}
                selectedProducts={this.state.selectedProducts}
                layout={4}
                payload={this.getDefaultConfig()}
                JWTToken={JWTToken}
                customOptions={{
                  borderRadius: this.state.borderRadius,
                  nameFontSize: this.state.fontSize,
                  nameFontWeight: this.state.fontWeight,
                  headerFontWeight: '800',
                  headerFontSize: 16,
                  buttonBorderRadius: this.state.borderRadius,
                }}
                themeColor={'#FC6B2D' || APP_THEME_COLOR} // #727C3B #FC0053 #FC6B2D #00FF00 #0000FF #006400 #FF0000 #FFC0CB #FFB6C1 #FF1493
                onClose={() => {
                  this.setState({showV4Checkout: false});

                  // alert('On Close called');
                }}
                callbackFunction={this.afterCheckout}
              />
            </>
          ) : null}
          {this.state.showCardUI ? (
            <>
              <CreditCardForm
                onClose={() => {
                  console.log('on close');
                  this.setState({showCardUI: false});
                }}
                customerUUID={'de23e31b-a7b0-49e8-8f58-7e74bde7ba9a'}
                subMerchantKey={SUBMERCHANTKEY}
                containerHeight={'85%'}
                JWTToken={JWTToken}
                handleSDK={true}
                payload={this.getDefaultConfig()}
                themeColor={'black'}
                showSaveForLater={true}
                newCardData={data => {
                  console.log('data new card', data);
                  // this.setState({showCardUI: false});
                }}
              />
            </>
          ) : null}
        </>
        {this.state.selectedLanguage !== undefined ? (
          <Checkout
            callbackFunction={this.afterCheckout}
            redirectUrl={'portone://checkout'}
            environment={'sandbox'}
            env={'dev'}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  payNowView: {
    height: 50,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    paddingVertical: 15,
    alignSelf: 'center',
    backgroundColor: APP_THEME_COLOR,
  },
  payNowTextView: {
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: WHITE_COLOR,
    fontWeight: BOLD,
    fontSize: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  col: {
    flex: 1,
  },
  buttonStackView: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center',
  },
  buttonView: {
    backgroundColor: APP_THEME_COLOR,
    borderRadius: 5,
    height: 50,
    flex: 1,
    alignItems: 'center',
  },
  buttonLabelText: {
    flex: 1,
    alignContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowContainerView: {
    width: width,
    backgroundColor: WHITE_COLOR,
    height: 70,
    justifyContent: 'flex-end',
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  buyNowView: {
    height: 50,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    paddingVertical: 15,
    width: width - 40,
    alignSelf: 'center',
    backgroundColor: APP_THEME_COLOR,
  },
  buyNowTextView: {
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: WHITE_COLOR,
    fontSize: 16,
    flex: 1,
  },

  headerContainerView: {
    marginTop: 0,
    backgroundColor: WHITE_COLOR,
    marginBottom: 5,
  },
  headerView: {
    marginHorizontal: 10,
    backgroundColor: WHITE_COLOR,
  },
  featuredText: {
    textAlign: 'left',
    color: APP_THEME_COLOR,
    fontSize: 30,
    fontWeight: BOLD,
  },
  headerButtonView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  numberOfItemsText: {
    flex: 0.5,
    color: descriptionText,
  },
  footerView: {
    height: 15,
    backgroundColor: TRANSPARENT,
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
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Shop;
