import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import {
  APP_THEME_COLOR,
  BOLD,
  WHITE_COLOR,
  CURRENCY,
  CHAIPAY_KEY,
  SECRET_KEY,
  ENVIRONMENT,
  JWTToken,
} from '../../constants';

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
import {Checkout, TransactionStatusView} from '@iamport-intl/portone-sdk';

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetails: {},
      ascendingSort: true,
      selectedLanguage: {
        name: 'Vietnamese',
        code: 'en-EN',
        languageCode: 'vn',
        currency: 'THB',
      },
    };
    this.products = [
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
        price: 90000,
        img: 'https://demo.portone.cloud/images/chikku-loafers.jpg',
      },
    ];
    this.productsObject = this.products.reduce((accumulator, product) => {
      accumulator[product.key] = product; // Use product.key as the object key
      return accumulator;
    }, {});
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  componentWillUnmount() {}

  getTotalAmount = orderDetails => {
    let totalAmount = 0;
    map(values(this.productsObject), item => {
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

  getDefaultConfig = () => {
    var totalAmount = 0;
    let orderDetails = [];
    let merchantOrderId = 'MERCHANT' + new Date().getTime();
    let failureURL = 'https://dev-checkout.chaiport.io/failure.html';
    let successURL = 'https://dev-checkout.chaiport.io/success.html';
    const promoDiscount = 100;
    const shipping = 400;

    map(values(this.productsObject), item => {
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

    let payload = {
      portOneKey: CHAIPAY_KEY,
      chaipayKey: CHAIPAY_KEY,
      key: CHAIPAY_KEY,

      billingDetails: {
        billing_name: 'Test React native',
        billing_email: 'markweins@gmail.com',
        billing_phone: '+660956425564',
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
      token_params: {
        expiry_month: '09',
        expiry_year: '2029',
        partial_card_number: '424242******4242',
        save_card: false,
        token: 'token_2nqdLPslJbKhS8SjW4sZu5FY5xy',
        type: 'visa',
      },
    };

    return payload;
  };
  onClose = () => {
    this.setState({showUIPopUp: false});
  };

  afterCheckout = transactionDetails => {
    console.log('Transaction Details 499', transactionDetails);
    this.setState({orderDetails: transactionDetails});
  };

  ResponseView = ({orderDetails}) => {
    let totalAmount = sumBy(values(this.productsObject), 'price');
    let selectedItems = values(this.productsObject);
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
        onClose={() => {
          this.setState({orderDetails: {}});
        }}
      />
    );
  };

  render() {
    return (
      <View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 80,
          }}>
          <TouchableOpacity
            style={[
              {
                width: 120,
                height: 50,
                marginHorizontal: 15,
                backgroundColor: 'red',
                borderRadius: 5,
              },
            ]}
            disabled={isEmpty(this.productsObject)}
            onPress={() => {
              let config = this.getDefaultConfig();
              // ** Embed Flow**
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

              // ** Connect Flow**
              // 1. Non tokenisation Flow
              // config.paymentChannel = 'OMISE';
              // config.paymentMethod = 'OMISE_CREDIT_CARD';

              // Checkout.startPaymentWithoutTokenization(config);
            }}>
            <Text
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 18,
                color: 'white',
              }}
              adjustsFontSizeToFit>
              {'Make payment'}
            </Text>
          </TouchableOpacity>
        </View>
        {isEmpty(this.state.orderDetails) ? null : (
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              borderColor: 'lightgray',
              borderRadius: 5,
              borderWidth: 1,
              height: 220,
            }}>
            <Text style={{marginTop: 50, fontSize: 14}}>
              {' '}
              {`${this.state.orderDetails?.status_reason}`}{' '}
            </Text>
            <Text style={{marginTop: 30, fontSize: 18, flexWrap: 'wrap'}}>
              {' '}
              {`${this.state.orderDetails?.message}`}{' '}
            </Text>
          </View>
        )}
        <Checkout
          callbackFunction={this.afterCheckout}
          redirectUrl={'portone://checkout'}
          environment={'sandbox'}
          env={'dev'}
        />
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
});

export default Shop;
