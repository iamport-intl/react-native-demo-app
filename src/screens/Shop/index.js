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
  SafeAreaView,
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
  SUCCESS_COLOR,
  CHAIPAY_KEY,
  SECRET_KEY,
  JWTToken,
  ORDERTEXT,
  IMAGE_BACKGROUND_COLOR,
  strings,
  ENVIRONMENT,
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

import {
  Checkout,
  helpers,
  WalletView,
  CreditCardForm,
  SavedCardsView,
} from '@iamport-intl/chaipay-sdk';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HorizontalTextStackView from '../../helpers/HorizontalTextStackView';
import ScheduledProductCell from '../SelectedProductCell';

const {width, height} = Dimensions.get('screen');

const products = [
  {
    key: 1,
    name: 'Bella Toes',
    description: 'Premium quality',
    price: 10000,
    img: 'https://demo.chaipay.io/images/bella-toes.jpg',
  },
  {
    key: 2,
    name: 'Chikku Loafers',
    description: 'Special design',
    price: 190000,
    img: 'https://demo.chaipay.io/images/chikku-loafers.jpg',
  },
  {
    key: 3,
    name: '(SRV) Sneakers',
    description: 'White sneakers',
    price: 185600,
    img: 'https://demo.chaipay.io/images/banner2.jpg',
  },
  {
    key: 4,
    name: 'Shuberry Heels',
    description: 'Comfortable heels',
    price: 321000,
    img: 'https://demo.chaipay.io/images/ab.jpg',
  },
  {
    key: 5,
    name: 'Red Bellies',
    description: 'Premium quality',
    price: 256000,
    img: 'https://demo.chaipay.io/images/red-bellies.jpg',
  },
  {
    key: 6,
    name: 'Catwalk Flats',
    description: 'Premium quality',
    price: 191500,
    img: 'https://demo.chaipay.io/images/catwalk-flats.jpg',
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
    };
    this.checkout = React.createRef();
  }

  componentDidMount() {
    AsyncStorage.setItem('formattedMobileNumber', '+918341469169');
    AsyncStorage.setItem('mobileNumber', '8341469169');
    SplashScreen.hide();
    this.getAvailablePaymentChannels().then(data => {
      this.setState({walletPaymentChannels: data});
    });

    console.log('WAletData', this.state.walletPaymentChannels);
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

  getDefaultConfig = () => {
    var totalAmount = 0;
    let orderDetails = [];
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
    // Todo: Have to modify the structure for selectedproducts
    //chaipayKey: 'lzrYFPfyMLROallZ',
    let payload = {
      chaipayKey: CHAIPAY_KEY,
      merchantDetails: {
        name: 'Chaipay',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
        back_url: 'https://demo.chaipay.io/checkout.html',
        promo_code: 'Downy350',
        promo_discount: 0,
        shipping_charges: 0.0,
      },
      merchantOrderId: 'MERCHANT' + new Date().getTime(),
      signatureHash: 'flDFcPNx4pASRWonw52s0Sec3ee1PJQrdTklDrZGjq0=',
      amount: totalAmount,
      currency: 'VND',
      countryCode: 'VN',
      billingAddress: {
        billing_name: 'Test React native',
        billing_email: 'markweins@gmail.com',
        billing_phone: '+848959893980',
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
      shippingAddress: {
        shipping_name: 'xyz',
        shipping_email: 'xyz@gmail.com',
        shipping_phone: '+848959893980',
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
      orderDetails: orderDetails,
      successUrl: 'https://test-checkout.chaipay.io/success.html',
      failureUrl: 'https://test-checkout.chaipay.io/failure.html',
      mobileRedirectUrl: 'chaipay://checkout',
      expiryHours: 2,
      source: 'api',
      description: 'test RN',
      showShippingDetails: true,
      showBackButton: false,
      defaultGuestCheckout: false,
      isCheckoutEmbed: false,
    };

    return payload;
  };

  onClose = () => {
    this.setState({showUIPopUp: false});
  };

  afterCheckout = transactionDetails => {
    if (transactionDetails) {
      // if (typeof transactionDetails === 'object') {
      //   this.setState({orderDetails: transactionDetails});
      // } else if (transactionDetails === 'Modal closed') {
      //   this.setState({orderDetails: transactionDetails});
      // } else {
      //   this.setState({orderDetails: JSON.parse(transactionDetails)});
      // }
    }
  };

  hideOrderDetailsAlert = () => {
    this.setState({orderDetails: undefined});
  };

  formatNumber = number => {
    let formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'VND',
    }).format(number);
    return formattedNumber;
  };

  getAvailablePaymentChannels = async () => {
    let x = await helpers.fetchAvailablePaymentGateway();

    return x.data.WALLET;
  };
  ResponseView = ({orderDetails}) => {
    let totalAmount = sumBy(values(this.state.selectedProducts), 'price');
    let selectedItems = values(this.state.selectedProducts);
    let deliveryAmount = 0;
    return (
      <View
        style={{
          margin: 20,
          backgroundColor: IMAGE_BACKGROUND_COLOR,
          borderRadius: 10,
          paddingBottom: 5,
          marginTop: 4,
        }}>
        <View>
          {orderDetails?.status_reason === 'SUCCESS' ||
          orderDetails?.is_success === true ||
          orderDetails?.status === 'Success' ? (
            <>
              <Image
                style={{
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                source={require('../../../assets/Success.png')}
              />
              <View
                style={{
                  marginTop: 0,
                  marginHorizontal: 10,
                  paddingBottom: 15,
                }}>
                <Text style={styles.successStyle}>
                  Your order is placed successfully!
                </Text>
              </View>
            </>
          ) : orderDetails?.status_reason === 'INVALID_TRANSACTION_ERROR' ||
            orderDetails?.is_success === false ||
            orderDetails?.status === 'Failed' ? (
            <>
              <Image
                style={{
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                source={require('../../../assets/failure.png')}
              />
              <View
                style={{
                  marginTop: 0,
                  marginHorizontal: 10,
                  paddingBottom: 15,
                }}>
                <Text style={styles.successStyle}>Transaction Failed</Text>
              </View>
            </>
          ) : orderDetails?.message === 'Modal closed' ? (
            <>
              <Image
                style={{
                  marginTop: 15,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                source={require('../../../assets/failure.png')}
              />
              <Text
                style={[styles.successStyle, {marginTop: 5, marginBottom: 15}]}>
                Transaction Failed
              </Text>
            </>
          ) : (
            <Text>{JSON.stringify(orderDetails, null, 4)}</Text>
          )}
        </View>
        <View
          style={{
            width: width - 60,
            alignItems: 'center',
            backgroundColor: IMAGE_BACKGROUND_COLOR,
            borderRadius: 10,
          }}>
          <View
            style={{
              marginVertical: 0,
              width: width - 70,
              marginLeft: 20,
              marginBottom: 9,
              paddingHorizontal: 30,
              backgroundColor: WHITE_COLOR,
              paddingTop: 10,
              shadowColor: '#000000',
              shadowOffset: {
                width: 1,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 0.2,
              elevation: 4,
              borderRadius: 10,
              paddingBottom: 8,
            }}>
            <Text style={[styles.paymentText, {fontSize: 18}]}>
              {strings.price_details}
            </Text>
            <HorizontalTextStackView
              item={{
                name: `${strings.merchant_order_ref}:`,
                value: orderDetails.merchant_order_ref,
                fontSize: 13,
                fontWeight: '400',
                rightFontWeight: '500',
                color: ORDERTEXT,
                textAlign: 'right',
              }}
            />
            <HorizontalTextStackView
              item={{
                name: `${strings.channel_order_ref}`,
                value:
                  orderDetails.channel_order_ref ||
                  'PAY-FylBOXjbTMmH52CCNI4OFw',
                fontSize: 13,
                fontWeight: '400',
                rightFontWeight: '500',
                color: ORDERTEXT,
                textAlign: 'left',
              }}
            />
            <HorizontalTextStackView
              item={{
                name: `${strings.order}`,
                value: `${this.formatNumber(totalAmount)}`,
                fontSize: 13,
                fontWeight: '400',
                rightFontWeight: '500',
                color: ORDERTEXT,
                textAlign: 'right',
              }}
            />
            <HorizontalTextStackView
              item={{
                name: `${strings.delivery}`,
                value: `${this.formatNumber(deliveryAmount)}`,
                fontSize: 13,
                fontWeight: '400',
                color: ORDERTEXT,
                rightFontWeight: '500',
                textAlign: 'right',
              }}
            />
            <HorizontalTextStackView
              item={{
                name:
                  orderDetails?.message === 'Modal closed'
                    ? `${strings.amount_toPaid}`
                    : `${strings.amount_paid}`,
                value: `${this.formatNumber(totalAmount + deliveryAmount)}`,
                fontSize: 16,
                fontWeight: '500',
                color: ORDERTEXT,
                rightFontWeight: '500',
                textAlign: 'right',
              }}
            />
          </View>
        </View>
        <>
          <View
            style={{
              width: width - 40,
              alignItems: 'center',
              backgroundColor: IMAGE_BACKGROUND_COLOR,
            }}>
            <View
              style={{
                borderRadius: 10,
                marginTop: 5,
                backgroundColor: WHITE_COLOR,
                width: width - 70,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 1,
                  height: 3,
                },
                shadowRadius: 5,
                shadowOpacity: 0.2,
                elevation: 4,
              }}>
              {map(selectedItems, product => {
                return (
                  <ScheduledProductCell
                    product={product}
                    removeInStock={true}
                    removeBorder={true}
                    key={product.name}
                  />
                );
              })}
            </View>
            <View
              style={{
                backgroundColor: WHITE_COLOR,
                width: width - 70,
                borderRadius: 10,
                marginTop: 15,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 1,
                  height: 3,
                },
                shadowRadius: 5,
                shadowOpacity: 0.2,
                elevation: 4,

                marginBottom: 10,
              }}>
              <Text
                style={[
                  styles.paymentText,
                  {
                    fontSize: 18,
                    marginTop: 15,
                    marginBottom: 5,
                    marginLeft: 15,
                  },
                ]}>
                {strings.shipping_address}:
              </Text>
              <Text style={{marginLeft: 15, marginBottom: 15}}>
                {'MIG I A7'} {'\n'}
                {'Sujatha Nagar, Pendurthy'}
                {'\n'}
                {'Visakhanpatnam'}
                {'\n'}
                {'Andhra pradesh, 530051'}
                {'\n'}
                {'INDIA'}
              </Text>
            </View>
          </View>
        </>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        {!isEmpty(this.state.orderDetails) ? (
          <>
            <ScrollView>
              <this.ResponseView orderDetails={this.state.orderDetails} />
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.payNowView,
                {
                  marginTop: 10,
                  marginBottom: 15,
                  width: width - 60,
                  backgroundColor:
                    this.state.orderDetails?.status_reason === 'SUCCESS' ||
                    this.state.orderDetails?.status === 'Success' ||
                    this.state.orderDetails.is_success === true
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
                  this.state.orderDetails?.status_reason === 'SUCCESS' ||
                  this.state.orderDetails.is_success === true
                ) {
                  this.setState({orderDetails: undefined});
                } else {
                  this.setState({orderDetails: undefined});
                }
              }}>
              <Text style={styles.payNowTextView}>Go Back</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
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
                return (
                  <Product
                    key={product.key}
                    data={{
                      ...product,
                      didSelected: didSelectedItem,
                    }}
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
                      <Text style={styles.featuredText}>
                        {strings.app_name}
                      </Text>
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
                showAuthenticationFlow={true}
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
                  this.setState({showUIPopUp: true});
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
                    let config = this.getDefaultConfig();

                    let data = {...config, environment: ENVIRONMENT};
                    let jwtToken = JWTToken;
                    this.checkout.current.openCheckoutUI(data, jwtToken);

                    this.onClose();
                  }}
                  onConfirmPressed={() => {
                    this.props.navigation.navigate('Checkout', {
                      selectedProducts: this.state.selectedProducts,
                      themeColor: 'green',
                      navigation: this.props.navigation,
                    });
                    this.onClose();
                  }}
                />
              ) : null}
            </View>
            <Checkout
              ref={this.checkout}
              env={'dev'}
              currency={'VND'}
              callbackFunction={this.afterCheckout}
              redirectUrl={'chaipay://checkout'}
              secretKey={SECRET_KEY}
              chaipayKey={CHAIPAY_KEY}
              environment={ENVIRONMENT}
            />
          </>
        )}
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
