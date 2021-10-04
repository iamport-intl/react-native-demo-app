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
} from 'react-native';
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
} from '../../constants';
import Product from '../Product';
import {first, isEmpty, last, map, omit, sumBy, values} from 'lodash';
import Checkout from '../../../paymentSDK';
import AwesomeAlert from 'react-native-awesome-alerts';
import ThemedListItem from 'react-native-elements/dist/list/ListItem';

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
    price: 1000,
    img: 'https://demo.chaipay.io/images/chikku-loafers.jpg',
  },
  {
    key: 3,
    name: '(SRV) Sneakers',
    description: 'White sneakers',
    price: 1000,
    img: 'https://demo.chaipay.io/images/banner2.jpg',
  },
  {
    key: 4,
    name: 'Shuberry Heels',
    description: 'Comfortable heels',
    price: 3000,
    img: 'https://demo.chaipay.io/images/ab.jpg',
  },
  {
    key: 5,
    name: 'Red Bellies',
    description: 'Premium quality',
    price: 2500,
    img: 'https://demo.chaipay.io/images/red-bellies.jpg',
  },
  {
    key: 6,
    name: 'Catwalk Flats',
    description: 'Premium quality',
    price: 1500,
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
    };
    this.checkout = React.createRef();
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

  generateJWTToken = () => {
    var payload = {
      iss: 'CHAIPAY',
      sub: 'lzrYFPfyMLROallZ',
      iat: new Date().getTime(),
      exp: new Date().getTime() + 1000 * 1000,
    };

    var secretKey =
      '0e94b3232e1bf9ec0e378a58bc27067a86459fc8f94d19f146ea8249455bf242';
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
    let payload1 = {
      chaipayKey: 'SglffyyZgojEdXWL',
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
        billing_phone: '9998878788',
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
        shipping_phone: '1234567890',
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
      successUrl: 'chaipay://checkout',
      failureUrl: 'chaipay://checkout',
      mobileRedirectUrl: 'chaipay://checkout',
      expiryHours: 2,
      source: 'api',
      description: 'test RN',
      showShippingDetails: true,
      showBackButton: false,
      defaultGuestCheckout: false,
      isCheckoutEmbed: false,
    };

    return payload1;
  };

  onClose = () => {
    this.setState({showUIPopUp: false});
  };

  afterCheckout = transactionDetails => {
    console.log('HYYYY', transactionDetails);
    if (transactionDetails) {
      if (typeof transactionDetails === 'object') {
        this.setState({orderDetails: transactionDetails});
      } else if (transactionDetails === 'Modal closed') {
        this.setState({orderDetails: transactionDetails});
      } else {
        this.setState({orderDetails: JSON.parse(transactionDetails)});
      }
    }
  };

  hideOrderDetailsAlert = () => {
    this.setState({orderDetails: {}});
  };
  ResponseView = orderDetails => {
    let totalAmount = sumBy(
      values(this.props.route.params?.selectedProducts),
      'price',
    );
    const deliveryAmount = 8500;

    return (
      <View>
        <View>
          {orderDetails?.status_reason === 'SUCCESS' ||
          orderDetails.is_success === 'true' ? (
            <>
              <Image
                style={{alignSelf: 'center', justifyContent: 'center'}}
                source={require('../../../assets/Success.png')}
              />
              <View
                style={{
                  marginTop: 15,
                  marginHorizontal: 20,
                  paddingBottom: 15,
                  shadowColor: '#000000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 2,
                  shadowOpacity: 0.3,
                  backgroundColor: WHITE_COLOR,
                  borderRadius: 5,
                }}>
                <Text style={styles.successStyle}>
                  Yay! Your order has been successfully placed
                </Text>
                <View style={styles.containerView}>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>
                      Merchant Order Ref:{' '}
                    </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.merchant_order_ref}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>
                      Channel Order Ref:{' '}
                    </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.channel_order_ref}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>Amount Paid: </Text>
                    <Text style={styles.rightStackText}>
                      {`${currency} ${totalAmount + deliveryAmount}`}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>Status: </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.status || 'SUCCESS'}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : orderDetails?.status_reason === 'INVALID_TRANSACTION_ERROR' ||
            orderDetails.is_success === 'false' ||
            orderDetails.status === 'Failed' ? (
            <>
              <Image
                style={{alignSelf: 'center', justifyContent: 'center'}}
                source={require('../../../assets/failure.png')}
              />
              <View
                style={{
                  marginTop: 15,
                  marginHorizontal: 20,
                  paddingBottom: 15,
                  shadowColor: '#000000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 2,
                  shadowOpacity: 0.3,
                  backgroundColor: WHITE_COLOR,
                  borderRadius: 5,
                }}>
                <Text style={styles.successStyle}>Transaction Failed</Text>
                <View style={styles.containerView}>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>
                      Merchant Order Ref:{' '}
                    </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.merchant_order_ref}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>
                      Channel Order Ref:{' '}
                    </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.channel_order_ref}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>Amount: </Text>
                    <Text style={styles.rightStackText}>
                      {`${currency} ${totalAmount + deliveryAmount}`}
                    </Text>
                  </View>
                  <View style={styles.stackView}>
                    <Text style={styles.leftStackText}>Status: </Text>
                    <Text style={styles.rightStackText}>
                      {orderDetails.status || 'FAILED'}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : orderDetails?.message === 'Modal closed' ? (
            <>
              <Image
                style={{alignSelf: 'center', justifyContent: 'center'}}
                source={require('../../../assets/failure.png')}
              />
              <Text style={styles.successStyle}>Payment Not Done</Text>
              <View style={styles.containerView}>
                <Text style={styles.modalDismissText}>Please try again</Text>
              </View>
            </>
          ) : (
            <Text>{JSON.stringify(orderDetails, null, 4)}</Text>
          )}
          {/* <TouchableOpacity
            style={[
              styles.payNowView,
              {
                marginBottom: 50,
                backgroundColor:
                  orderDetails?.status_reason === 'SUCCESS' ||
                  orderDetails.is_success === 'true'
                    ? SUCCESS_COLOR
                    : APP_THEME_COLOR,
              },
            ]}
            disabled={false}
            onPress={() => {
              this.setState({orderDetails: undefined});
            }}>
            <Text style={styles.payNowTextView}>Go Back</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <FlatList
          style={{
            flex: 1,
            paddingHorizontal: 10,
            paddingTop: 0,
            paddingVertical: 15,
            backgroundColor: WHITE_COLOR,
          }}
          data={products}
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
                <View style={styles.headerView}>
                  <Text style={styles.featuredText}>Featured</Text>
                  <View style={styles.headerButtonView}>
                    <Text
                      style={
                        styles.numberOfItemsText
                      }>{`${products.length} items listed`}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 0.5,
                      }}>
                      <TouchableOpacity
                        style={{
                          marginHorizontal: 15,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            color: BLACK,
                            fontSize: 12,
                          }}>
                          Sort
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          marginHorizontal: 15,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            color: BLACK,
                            fontSize: 12,
                          }}>
                          {' '}
                          filter
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
            <Text style={styles.buyNowTextView}>Buy Now</Text>
          </TouchableOpacity>
          {!isEmpty(this.state.orderDetails) ? (
            <AwesomeAlert
              show={this.state.orderDetails}
              showProgress={false}
              customView={this.ResponseView(this.state.orderDetails)}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={false}
              showConfirmButton={true}
              confirmText={
                this.state.orderDetails.is_success
                  ? 'Continue Shopping'
                  : this.state.orderDetails.message === 'Modal closed'
                  ? 'Dismiss'
                  : 'Continue Shopping'
              }
              onDismiss={() => this.setState({orderDetails: {}})}
              confirmButtonColor={
                this.state.orderDetails?.message === 'Modal closed'
                  ? APP_THEME_COLOR
                  : this.state.orderDetails.is_success ||
                    this.state.orderDetails.status !== 'Failed'
                  ? SUCCESS_COLOR
                  : APP_THEME_COLOR
              }
              confirmButtonTextStyle={{paddingHorizontal: 15}}
              onConfirmPressed={() => {
                this.hideOrderDetailsAlert();
              }}
            />
          ) : null}
          {this.state.showUIPopUp ? (
            <AwesomeAlert
              show={this.state.showUIPopUp}
              showProgress={false}
              title=""
              message="Please choose one of the below option to proceed further"
              messageStyle={{textAlign: 'center'}}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={true}
              cancelButtonTextStyle={{fontSize: 10}}
              confirmButtonTextStyle={{fontSize: 10}}
              cancelText="Chaipay Checkout UI"
              confirmText="Custom Checkout UI"
              cancelButtonColor={APP_THEME_COLOR}
              confirmButtonColor={APP_THEME_COLOR}
              onCancelPressed={() => {
                let config = this.getDefaultConfig();
                let jwtToken =
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDSEFJUEFZIiwic3ViIjoibHpyWUZQZnlNTFJPYWxsWiIsImlhdCI6MTYzMjM5MDkyMCwiZXhwIjoyNzMyMzkwOTIwfQ.IRgiM-zjAdJEVDuPSNfxmDszZQi_csE1q7xjVRvPvoc';

                this.checkout.current.openWebUrl(config, jwtToken);
                this.onClose();
              }}
              onConfirmPressed={() => {
                console.log('esha:', this.state.selectedProducts);
                this.props.navigation.navigate('Checkout', {
                  price: '2345',
                  selectedProducts: this.state.selectedProducts,
                });
                this.onClose();
              }}
            />
          ) : null}
          <Checkout
            ref={this.checkout}
            env={'dev'}
            callbackFunction={this.afterCheckout}
            redirectUrl={'chaipay://'}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    fontWeight: BOLD,
    fontSize: 16,
  },

  headerContainerView: {
    marginTop: 0,
    backgroundColor: WHITE_COLOR,
  },
  headerView: {
    marginTop: 0,
    marginHorizontal: 20,
    backgroundColor: WHITE_COLOR,
  },
  featuredText: {
    textAlign: 'left',
    color: APP_THEME_COLOR,
    fontSize: 40,
    fontWeight: BOLD,
  },
  headerButtonView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  numberOfItemsText: {
    flex: 0.5,
    color: descriptionText,
    paddingBottom: 10,
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
    marginTop: 25,
    textAlign: 'center',
  },
});

export default Shop;
