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
import {Dimensions} from 'react-native';

import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import {
  APP_THEME_COLOR,
  BOLD,
  BORDERCOLOR,
  currency,
  DARKBLACK,
  descriptionText,
  GRAYSHADE,
  HEADERBLACK,
  HEDER_TITLES,
  IMAGE_BACKGROUND_COLOR,
  ORDERTEXT,
  SUCCESS_COLOR,
  TRANSPARENT,
  WHITE_COLOR,
} from '../../constants';
import CheckboxView from '../../helpers/CheckboxView';
import HorizontalTextStackView from '../../helpers/HorizontalTextStackView';
import ScheduledProductCell from '../../screens/SelectedProductCell';
import Checkout from '../../../paymentSDK';
import OTPTextInput from 'react-native-otp-textinput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from 'react-native-phone-number-input';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import CreditCardForm from '../../helpers/CreditcardForm';

const {width, height} = Dimensions.get('screen');
const deliveryAmount = 500;
const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: IMAGE_BACKGROUND_COLOR,
    paddingBottom: 100,
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
    marginTop: 25,
    textAlign: 'center',
  },
  modalDismissText: {fontSize: 15, alignSelf: 'center'},
  containerView: {marginHorizontal: 20, marginTop: 35},
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

class Checkout1 extends React.Component {
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
    };
    this.phone = React.createRef();
    this.otpInput = React.createRef();
    this.checkout = React.createRef();
  }

  componentDidMount() {
    this.checkout.current
      .fetchAvailablePaymentGateway()
      .then(data => {
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
  }

  setFormattedNumber(formattedText) {
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
    this.setState({newCardData: {}});
    this.setState({callingfromSavedCards: fromSavedCards});
    this.setState({selectedItem: item});
    this.setState({selectedItem1: item});
  };

  afterCheckout = transactionDetails => {
    if (transactionDetails) {
      if (typeof transactionDetails === 'object') {
        this.setState({orderDetails: transactionDetails});
      } else if (transactionDetails == 'Modal closed') {
        this.setState({orderDetails: transactionDetails});
      } else {
        this.setState({orderDetails: JSON.parse(transactionDetails)});
      }
    }
  };

  handleTextChange = text => {
    console.warn(text);
    this.setState({OTP: text});
  };

  ResponseView = ({orderDetails}) => {
    let totalAmount = sumBy(
      values(this.props.route.params?.selectedProducts),
      'price',
    );

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: WHITE_COLOR}}>
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
            orderDetails.is_success === 'false' ? (
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
          <TouchableOpacity
            style={[
              styles.payNowView,
              {
                marginTop: 50,
                width: width - 40,
                backgroundColor:
                  orderDetails?.status_reason === 'SUCCESS' ||
                  orderDetails.is_success === 'true'
                    ? SUCCESS_COLOR
                    : APP_THEME_COLOR,
              },
            ]}
            disabled={false}
            onPress={() => {
              if (
                orderDetails?.status_reason === 'SUCCESS' ||
                orderDetails.is_success === 'true'
              ) {
                this.props.navigation.goBack();
              } else {
                this.setState({orderDetails: undefined});
              }
            }}>
            <Text style={styles.payNowTextView}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  MobileNumberView = ({shouldShowOTP}) => {
    return (
      <View>
        <Text
          style={{
            marginLeft: 20,
            paddingTop: 15,
            color: GRAYSHADE,
            fontSize: 16,
          }}>
          Enter{' '}
          {shouldShowOTP
            ? `the authentication code sent on you ${this.state.mobileNumber}`
            : 'Phone Number'}
        </Text>
        {shouldShowOTP ? (
          <View style={{marginVertical: 15}}>
            <OTPTextInput
              ref={this.otpInput}
              containerStyle={styles.OTPContainerStyle}
              textInputStyle={styles.roundedTextInput}
              offTintColor={descriptionText}
              tintColor={APP_THEME_COLOR}
              inputCount={6}
              handleTextChange={text => this.handleTextChange(text)}
            />
          </View>
        ) : (
          <View style={{marginHorizontal: -15}}>
            <PhoneInput
              containerStyle={{
                marginVertical: 15,
                alignSelf: 'center',
                width: width - 40,
                borderWidth: 1,
                borderColor: BORDERCOLOR,
                borderRadius: 3,
              }}
              autoFocus
              textContainerStyle={{
                height: 50,
                backgroundColor: WHITE_COLOR,
                marginLeft: -20,
              }}
              textInputStyle={{height: 60}}
              ref={this.phone}
              defaultValue={this.state.mobileNumber}
              defaultCode="IN"
              layout="second"
              onChangeText={text => {
                this.setNumber(text);
              }}
              onChangeFormattedText={text => {
                this.setFormattedNumber(text);
              }}
              withDarkTheme={false}
              withShadow={false}
            />
          </View>
        )}
        <View style={styles.nextContainerView}>
          <TouchableOpacity
            style={styles.nextButtonView}
            onPress={async () => {
              if (this.state.shouldShowOTP) {
                let val = await this.checkout.current.fetchSavedCards(
                  this.state.formattedText,
                  this.state.OTP,
                );
                if (val?.status === 200 || val?.status === 201) {
                  // AsyncStorage.setItem('SAVED_CARDS', JSON.stringify(val.data));
                  this.setState({savedCards: val.data.content});
                  this.setState({mobileNumberVerificationDone: true});
                }
              } else {
                let val = await this.checkout.current.getOTP(
                  this.state.formattedText,
                );
                if (val.status === 200 || val.status === 201) {
                  this.setState({shouldShowOTP: true});
                }
              }
            }}>
            <Text style={styles.nextTextView}>
              {shouldShowOTP ? 'Verify' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  OrderDetailsView = ({totalAmount}) => {
    return (
      <View
        style={{
          width: width,

          backgroundColor: WHITE_COLOR,
        }}>
        <View
          style={{
            marginVertical: 0,
            marginHorizontal: 15,
            width: width - 30,
            shadowRadius: 1,
            shadowOffset: {
              height: 1,
            },
            backgroundColor: WHITE_COLOR,
            paddingTop: 10,
          }}>
          <Text style={styles.paymentText}>Order details</Text>
          <HorizontalTextStackView
            item={{
              name: 'Order',
              value: `${totalAmount} ${currency}`,
              fontSize: 13,
              fontWeight: '400',
              color: ORDERTEXT,
            }}
          />
          <HorizontalTextStackView
            item={{
              name: 'Delivery',
              value: `${deliveryAmount} ${currency}`,
              fontSize: 13,
              fontWeight: '400',
              color: ORDERTEXT,
            }}
          />
          <HorizontalTextStackView
            item={{
              name: 'Summary',
              value: `${totalAmount + deliveryAmount} ${currency}`,
              fontSize: 16,
              fontWeight: '500',
              color: ORDERTEXT,
            }}
          />
        </View>
      </View>
    );
  };
  ListOfItemsView = () => {
    let listCount = values(this.props.route.params.selectedProducts).length;
    let selectedItems = values(this.props.route.params.selectedProducts);

    return (
      <>
        <View
          style={{
            width: width,
            backgroundColor: WHITE_COLOR,
            marginTop: 5,
          }}>
          <View
            style={{
              marginTop: 5,
              paddingVertical: 15,
              flexDirection: 'row',
              width: width - 40,
              justifyContent: 'space-between',
              backgroundColor: WHITE_COLOR,
              marginHorizontal: 15,
            }}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>
              My cart ({listCount} {listCount === 1 ? 'item' : 'items'})
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.setState({showList: !this.state.showList});
              }}>
              <Image
                source={
                  !this.state.showList
                    ? require('../../../assets/colapse.png')
                    : require('../../../assets/expand.png')
                }
                style={{
                  alignSelf: 'center',
                  width: 25,
                  height: 25,
                  resizeMode: 'contain',
                  marginRight: 5,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.showList ? (
          <View
            style={{
              width: width,
              backgroundColor: WHITE_COLOR,
              marginTop: -5,
            }}>
            <View style={{marginHorizontal: 15}}>
              {map(selectedItems, product => {
                return <ScheduledProductCell product={product} />;
              })}
            </View>
          </View>
        ) : null}
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
    let totalAmount = sumBy(
      values(this.props.route.params?.selectedProducts),
      'price',
    );
    let selectedItem = first(values(this.state.selectedItem));
    return {
      chaipayKey: 'xFgseojiprOhkgPa',
      paymentChannel: selectedItem?.payment_channel_key,
      paymentMethod: selectedItem?.payment_method_key,
      merchantOrderId: 'MERCHANT' + new Date().getTime(),
      amount: totalAmount + deliveryAmount,
      currency: 'VND',
      signature_hash: '123',
      billingAddress: {
        billing_name: 'Test mark',
        billing_email: 'markweins@gmail.com',
        billing_phone: this.state.formattedText || '9998878788',
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
      orderDetails: [
        {
          id: 'knb',
          name: 'kim nguyen bao',
          price: 1000,
          quantity: 1,
        },
      ],
      successUrl: 'chaipay://',
      failureUrl: 'chaipay://',
      redirectUrl: 'chaipay://checkout',
    };
  };

  confirmCardPayment = async (savedCard, fromSavedcards = false) => {
    let data = this.getData();

    let cardType = first(this.state.paymentCardType);

    data.paymentChannel = cardType.payment_channel_key;
    data.paymentMethod = cardType.payment_method_key;
    data.merchantOrderId = 'MERCHANT' + new Date().getTime();
    data.secretKey =
      '0e94b3232e1bf9ec0e378a58bc27067a86459fc8f94d19f146ea8249455bf242';

    console.log('SavedTokenResponse', savedCard);
    let response;
    if (fromSavedcards) {
      response = await this.checkout.current.startPaymentWithSavedCard(
        savedCard,
        data,
      );
    } else {
      response = await this.checkout.current.startPaymentWithNewCard(
        savedCard,
        data,
      );
    }

    if (response.val.status === 200 || response.val.status === 201) {
      this.setState({orderDetails: response.val.data});
    }
    // AsyncStorage.setItem('USER_DATA', JSON.stringify(response.data));
    this.setState({userData: response.data});
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

    const colapsableImage = !this.state.walletCollpse
      ? require('../../../assets/colapse.png')
      : require('../../../assets/expand.png');
    const creditCardImage = !this.state.creditCardClicked
      ? require('../../../assets/colapse.png')
      : require('../../../assets/expand.png');
    const otherPaymentImage = !this.state.otherPayments
      ? require('../../../assets/colapse.png')
      : require('../../../assets/expand.png');

    const hasNumber = this.state.mobileNumberVerificationDone;
    const shouldShowOTP = this.state.shouldShowOTP;

    const showCardForm = first(
      this.state.paymentCardType,
    )?.tokenization_possible;
    const filteredCards = filter(this.state.cardList, item => {
      return item?.sub_type === 'ATM_CARD';
    });
    const showATMCardFlow = filteredCards.length > 0;

    return (
      <View style={{width: width, marginTop: 5}}>
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
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Saved Payment Methods
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({showSavedCards: !this.state.showSavedCards});
                  }}>
                  <Image
                    source={
                      !this.state.showSavedCards
                        ? require('../../../assets/colapse.png')
                        : require('../../../assets/expand.png')
                    }
                    style={{
                      alignSelf: 'center',
                      width: 25,
                      height: 25,
                      resizeMode: 'contain',
                      marginRight: 5,
                    }}
                  />
                </TouchableOpacity>
              </View>
              {!hasNumber && this.state.showSavedCards ? (
                <>
                  <View>
                    <Text
                      style={{
                        paddingTop: 15,
                        color: GRAYSHADE,
                        fontSize: 16,
                        textAlign: shouldShowOTP ? 'center' : 'left',
                      }}>
                      Enter{' '}
                      {shouldShowOTP
                        ? `the authentication code sent on your ${this.state.mobileNumber}`
                        : 'Phone Number'}
                    </Text>
                    {shouldShowOTP ? (
                      <View style={{marginVertical: 15}}>
                        <OTPTextInput
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
                          offTintColor={descriptionText}
                          tintColor={APP_THEME_COLOR}
                          inputCount={6}
                          handleTextChange={text => this.handleTextChange(text)}
                        />
                      </View>
                    ) : (
                      <View style={{marginHorizontal: -15}}>
                        <PhoneInput
                          containerStyle={{
                            marginVertical: 15,
                            alignSelf: 'center',
                            width: width - 40,
                            borderWidth: 1,
                            borderColor: BORDERCOLOR,
                            borderRadius: 3,
                          }}
                          autoFocus
                          textContainerStyle={{
                            height: 50,
                            backgroundColor: WHITE_COLOR,
                            marginLeft: -20,
                          }}
                          textInputStyle={{height: 60}}
                          ref={this.phone}
                          defaultValue={this.state.mobileNumber}
                          defaultCode="IN"
                          layout="second"
                          onChangeText={text => {
                            this.setNumber(text);
                          }}
                          onChangeFormattedText={text => {
                            this.setFormattedNumber(text);
                          }}
                          withDarkTheme={false}
                          withShadow={false}
                        />
                      </View>
                    )}
                    <View
                      style={[styles.nextContainerView, {width: width - 30}]}>
                      <TouchableOpacity
                        style={styles.nextButtonView}
                        onPress={async () => {
                          if (this.state.shouldShowOTP) {
                            console.log('HYY there');
                            let value =
                              await this.checkout.current.fetchSavedCards(
                                this.state.formattedText,
                                this.state.OTP,
                              );
                            console.log('HYY there 123', value);

                            if (
                              value?.status === 200 ||
                              value?.status === 201 ||
                              value?.status_code === '2000'
                            ) {
                              // AsyncStorage.setItem('SAVED_CARDS', JSON.stringify(val.data));
                              this.setState({savedCards: value.data.content});
                              this.setState({
                                mobileNumberVerificationDone: true,
                              });
                            }
                          } else {
                            let val = await this.checkout.current.getOTP(
                              this.state.formattedText,
                            );
                            if (val.status === 200 || val.status === 201) {
                              this.setState({shouldShowOTP: true});
                            }
                          }
                        }}>
                        <Text style={styles.nextTextView}>
                          {shouldShowOTP ? 'Verify' : 'Next'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : null}

              {hasNumber && this.state.showSavedCards ? (
                <View style={{marginHorizontal: 15}}>
                  {isEmpty(this.state.savedCards) ? (
                    <Text style={{padding: 15, textAlign: 'center'}}>
                      You dont have any saved cards yet
                    </Text>
                  ) : (
                    map(this.state.savedCards, product => {
                      console.log('Product', product);
                      return (
                        <View>
                          <CheckboxView
                            fromSavedCards={true}
                            item={{
                              name: `${product.partial_card_number}`,
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
              ) : null}
            </View>
          </View>
        </View>

        <View>
          <Collapse isExpanded>
            <CollapseHeader>
              <View
                style={{
                  width: width,
                  backgroundColor: WHITE_COLOR,
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    paddingVertical: 15,
                    flexDirection: 'row',
                    width: width - 30,
                    justifyContent: 'space-between',
                    backgroundColor: WHITE_COLOR,
                    marginHorizontal: 15,
                  }}>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    Other Options
                  </Text>
                </View>
              </View>
            </CollapseHeader>
            <CollapseBody isExpanded>
              <Collapse>
                <CollapseHeader>
                  <View style={{marginTop: -10}}>
                    <View
                      style={[styles.paymentHeaderView, {marginHorizontal: 0}]}>
                      <View style={{flexDirection: 'row', paddingVertical: 12}}>
                        <Image
                          source={require('../../../assets/wallet.png')}
                          style={{
                            alignSelf: 'center',
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',

                            marginLeft: 15,
                          }}
                        />

                        <Text
                          style={[
                            styles.primaryHeadertext,
                            {
                              fontSize: 13,
                              textAlign: 'center',
                              alignSelf: 'center',
                            },
                          ]}>
                          WALLETS
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row', marginRight: 0}}>
                        <Image
                          source={require('../../../assets/momo.png')}
                          style={{
                            alignSelf: 'center',
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            marginHorizontal: 3,
                          }}
                        />
                        <Image
                          source={require('../../../assets/ZaloPay.png')}
                          style={{
                            alignSelf: 'center',
                            width: 30,
                            height: 30,
                            resizeMode: 'contain',
                            marginTop: 0,
                            marginHorizontal: 8,
                          }}
                        />
                        {this.state.walletsList.length > 2 ? (
                          <Text
                            style={{
                              color: descriptionText,
                              alignSelf: 'center',
                              textAlign: 'center',
                              fontSize: 10,
                            }}
                            adjustsFontSizeToFit>{`+${
                            this.state.walletsList.length - 2
                          } more`}</Text>
                        ) : null}
                        <Image
                          source={colapsableImage}
                          style={{
                            alignSelf: 'center',
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            marginTop: 0,
                            marginRight: 15,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <View
                    style={{
                      borderRadius: 10,
                      shadowColor: '#000000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowRadius: 2,
                      shadowOpacity: 0.2,
                      backgroundColor: WHITE_COLOR,
                      marginVertical: 10,
                      marginTop: 0,
                    }}>
                    <FlatList
                      data={this.state.walletsList}
                      style={{
                        marginHorizontal: 10,
                      }}
                      renderItem={product => {
                        return (
                          <CheckboxView
                            fromSavedCards={false}
                            item={{
                              name: `${product.item.payment_channel_key}`,
                              ...product.item,
                            }}
                            image={{uri: product.item.logo}}
                            isSelected={val === product.item.payment_method_key}
                            didSelected={this.onClickPaymentSelected}
                          />
                        );
                      }}
                      keyExtractor={(item, index) => `${index}`}
                    />
                  </View>
                </CollapseBody>
              </Collapse>
            </CollapseBody>
          </Collapse>
          <>
            <View style={{backgroundColor: WHITE_COLOR}}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.paymentHeaderView,
                  {marginHorizontal: 10},
                  this.state.creditCardClicked && !showCardForm
                    ? {
                        borderColor: APP_THEME_COLOR,
                        borderWidth: 0.5,
                      }
                    : {},
                ]}
                onPress={() =>
                  this.setState({
                    creditCardClicked: !this.state.creditCardClicked,
                    otherPayments: false,
                  })
                }>
                <View style={{flexDirection: 'row', paddingVertical: 12}}>
                  <Image
                    source={require('../../../assets/card.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginLeft: 15,
                    }}
                  />

                  <Text
                    style={[
                      styles.primaryHeadertext,
                      {fontSize: 13, alignSelf: 'center'},
                    ]}>
                    CREDIT CARD
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../../assets/mastercard.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginHorizontal: 3,
                    }}
                  />
                  <Image
                    source={require('../../../assets/visa.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginHorizontal: 3,
                    }}
                  />
                  <Image
                    source={require('../../../assets/jcb.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginHorizontal: 5,
                    }}
                  />
                  {showCardForm ? (
                    <Image
                      source={creditCardImage}
                      style={{
                        alignSelf: 'center',
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        marginTop: 0,
                        marginRight: 5,
                      }}
                    />
                  ) : (
                    <Image
                      style={{
                        alignSelf: 'center',
                        width: 5,
                        height: 20,
                        resizeMode: 'contain',
                        marginTop: 0,
                        marginRight: 15,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            {this.state.creditCardClicked && showCardForm ? (
              <View style={{width: width, backgroundColor: WHITE_COLOR}}>
                <View
                  style={{
                    borderRadius: 10,
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 2,
                    shadowOpacity: 0.2,
                    backgroundColor: WHITE_COLOR,
                    margin: 10,
                    marginHorizontal: 15,
                    marginTop: 0,
                  }}>
                  <CreditCardForm newCardData={this.saveCardDetails} />
                </View>
              </View>
            ) : null}
          </>
          <>
            {showATMCardFlow ? (
              <View style={{backgroundColor: WHITE_COLOR}}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[
                    styles.paymentHeaderView,
                    {marginHorizontal: 10},
                    this.state.otherPayments
                      ? {
                          borderColor: APP_THEME_COLOR,
                          borderWidth: 0.5,
                        }
                      : {},
                  ]}
                  onPress={() =>
                    this.setState({
                      otherPayments: !this.state.otherPayments,
                      creditCardClicked: false,
                    })
                  }>
                  <View style={{flexDirection: 'row', paddingVertical: 15}}>
                    <Image
                      source={require('../../../assets/wallet.png')}
                      style={{
                        alignSelf: 'center',
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        marginTop: 0,
                        marginLeft: 12,
                      }}
                    />

                    <Text
                      style={[
                        styles.primaryHeadertext,
                        {
                          fontSize: 13,
                          textAlign: 'center',
                          alignSelf: 'center',
                        },
                      ]}>
                      ATM CARD
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
            {this.state.otherPayments ? (
              <View
                style={{
                  borderRadius: 10,
                  shadowColor: '#000000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 2,
                  shadowOpacity: 0.2,
                  backgroundColor: WHITE_COLOR,
                  marginVertical: 10,
                }}>
                <FlatList
                  data={VNPAYData}
                  renderItem={product => {
                    return (
                      <CheckboxView
                        fromSavedCards={false}
                        item={{
                          name: `Pay with ${product.item.payment_channel_key}`,
                          ...product.item,
                        }}
                        image={{uri: product.item.logo}}
                        isSelected={val === product.item.payment_method_key}
                        didSelected={this.onClickPaymentSelected}
                      />
                    );
                  }}
                  keyExtractor={(item, index) => `${index}`}
                />
              </View>
            ) : null}
          </>
        </View>
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
          source={require('../../../assets/protected.png')}
          style={{
            alignSelf: 'center',
            width: 15,
            height: 15,
            resizeMode: 'contain',
            marginTop: 0,
          }}
        />
        <Text style={{fontSize: 12}}>Safe and Secure Payments</Text>
      </View>
    );
  };

  getDefaultConfig = () => {
    let payload = {
      chaipay_key: 'lzrYFPfyMLROallZ',
      merchant_details: {
        name: 'Downy',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
        back_url: 'https://demo.chaipay.io/checkout.html',
        promo_code: 'Downy350',
        promo_discount: 35000,
        shipping_charges: 0.0,
      },
      merchant_order_id: 'MERCHANT' + new Date().getTime(),
      signature_hash: 'flDFcPNx4pASRWonw52s0Sec3ee1PJQrdTklDrZGjq0=',
      amount: 365000,
      currency: 'VND',
      country_code: 'VN',
      billing_details: {
        billing_name: 'Test mark',
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
      shipping_details: {
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
      order_details: [
        {
          id: '1',
          price: 200000,
          name: 'Stubborn Attachments',
          quantity: 1,
          image: 'https://www.demo.chaipay.io/images/bella-toes.jpg',
        },
        {
          id: '2',
          price: 200000,
          name: 'Stubborn Attachments',
          quantity: 1,
          image: 'https://www.demo.chaipay.io/images/bella-toes.jpg',
        },
      ],
      success_url: 'chaipay://',
      failure_url: 'chaipay://',
      redirect_url: 'chaipay://',
      expiry_hours: 2,
      source: 'api',
      description: 'test desc',
      show_shipping_details: true,
      show_back_button: true,
      default_guest_checkout: false,
      is_checkout_embed: false,
    };
    return payload;
  };

  PayNowView = ({image, totalAmount}) => {
    const deepLinkURL = 'chaipay://checkout';

    var payload = this.getData();

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
                Grand Total:
              </Text>
              <Text
                style={{
                  color: DARKBLACK,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {`${totalAmount + deliveryAmount} ${currency}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.payNowView, {flex: 0.5}]}
            onPress={() => {
              if (
                isEmpty(this.state.newCardData) &&
                isEmpty(this.state.selectedItem)
              ) {
                alert('Please select any payment method to proceed further');
              } else if (!isEmpty(this.state.newCardData)) {
                let cardData = this.state.newCardData;

                this.confirmCardPayment({
                  card_number: cardData.cardNumber,
                  card_holder_name: cardData.name,
                  cvv: cardData.cvv,
                  expiry_month: cardData.expiration.slice(0, -5),
                  expiry_year: cardData.expiration.slice(3, 7),
                });
              } else if (this.state.callingfromSavedCards) {
                this.confirmCardPayment(
                  first(values(this.state.selectedItem)),
                  true,
                );
              } else {
                let newPayload = {...payload};
                let selectedItem = first(values(this.state.selectedItem));

                newPayload.merchantOrderId = 'MERCHANT' + new Date().getTime();
                newPayload.paymentChannel = selectedItem?.payment_channel_key;
                newPayload.paymentMethod =
                  selectedItem?.payment_channel_key === 'VNPAY'
                    ? 'VNPAY_ALL'
                    : selectedItem?.payment_method_key;

                newPayload.amount = totalAmount + deliveryAmount;
                // newPayload.secretKey =
                //   'a3b8281f6f2d3101baf41b8fde56ae7f2558c28133c1e4d477f606537e328440';
                newPayload.secretKey =
                  '6e83347729d702526a7bf0024aa3d6b2430fdbf8bde130f1bb98b4543f5a407c';

                var response =
                  this.checkout.current.startPaymentwithWallets(newPayload);
                this.afterCheckout(response);
              }
            }}>
            <Text style={styles.payNowTextView}>Pay Now</Text>
          </TouchableOpacity>
        </View>
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
      'price',
    );

    let image = !this.state.shouldShowOrderDetails
      ? require('../../../assets/expand.png')
      : require('../../../assets/colapse.png');

    let orderDetails = this.state.orderDetails;
    return (
      <View style={{backgroundColor: IMAGE_BACKGROUND_COLOR, flex: 1}}>
        {orderDetails !== undefined ? (
          <this.ResponseView orderDetails={orderDetails} />
        ) : (
          <>
            <View style={styles.headerView}>
              <Text style={styles.featuredText}>Checkout </Text>
            </View>
            <>
              <KeyboardAvoidingView
                behavior="height"
                style={{flex: 1, marginTop: 15}}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.contentContainerStyle}
                  style={styles.container}>
                  <this.ListOfItemsView />
                  <this.PaymentOptionsView />
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
          </>
        )}
        <Checkout
          ref={this.checkout}
          env={'staging'}
          callbackFunction={this.afterCheckout}
          redirectUrl={'chaipay://checkout'}
          secretKey={
            '6e83347729d702526a7bf0024aa3d6b2430fdbf8bde130f1bb98b4543f5a407c'
          }
          chaipayKey={'xFgseojiprOhkgPa'}
        />
      </View>
    );
  }
}

export default Checkout1;
