import React, {Component} from 'react';
import {FlatList, Modal} from 'react-native';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import CheckBoxItemView from './CheckBoxItemView';
import TransactionStatusView from './TransactionStatusView';
import {CheckoutInstance, Checkout, helpers} from '@iamport-intl/portone-sdk';

import {EventRegister} from 'react-native-event-listeners';
import {strings} from '../constants';

class WalletView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.data,
      selectedItem: {},
      search: '',
      changeTextFieldVordercolor: false,
    };

    this.paymentLinkWebView = React.createRef();
  }

  getRequiredData = async () => {
    try {
      const value = CheckoutInstance.state;

      if (value !== null) {
        // We have data!!
        return JSON.parse(value);
      }
    } catch (error) {
      // Error retrieving data
      return '';
    }
  };

  componentDidMount() {
    this.getRequiredData().then(data => {
      this.setState({initializedProps: data});
    });

    this.RBSheet.open();

    this.closeModalListner = EventRegister.addEventListener(
      'showiOSWebModal',
      async data => {
        this.RBSheet?.close();
      },
    );
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.closeModalListner);
  }

  onClickPaymentSelected = item => {
    this.setState({selectedItem: item});
  };

  filterList(list) {
    let x = this.props.data.filter(
      listItem =>
        listItem.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
        listItem.name.toLowerCase().includes(this.state.search.toLowerCase()),
    );

    return x;
  }

  onFocus = () => {
    this.setState({changeTextFieldVordercolor: true});
  };

  onBlur = () => {
    this.setState({changeTextFieldVordercolor: false});
  };

  afterCheckout = transactionDetails => {
    if (transactionDetails) {
      this.setState({orderDetails: transactionDetails});
    }
  };

  render() {
    let image = this.props.headerImage
      ? {uri: this.props.headerImage}
      : require('../../assets/walletIcon.png');
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <RBSheet
          customStyles={{
            container: {
              height: this.props.containerHeight || '70%',
              backgroundColor: 'white',
              borderRadius: 15,
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
          <View style={{flex: 1}}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  justifyContent: 'space-between',
                  marginTop: -10,
                  marginHorizontal: 25,
                  marginRight: 25,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                  }}>
                  {!this.props.hideHeaderImage ? (
                    <Image
                      source={image}
                      style={{
                        alignSelf: 'center',
                        width: this.props.headerImageWidth || 30,
                        height: this.props.headerImageHeight || 30,
                        resizeMode: this.props.headerImageResizeMode,
                      }}
                    />
                  ) : null}
                  <Text
                    style={{
                      marginLeft: this.props.hideHeaderImage ? 30 : 10,
                      fontSize: this.props.headerTitleFont || 15,
                      fontWeight: this.props.headerTitleWeight || '400',
                      color: '#2D2D2D',
                      alignSelf: 'center',
                    }}>
                    {this.props.headerTitle || strings.wallets}
                  </Text>
                </View>
                <>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      width: 30,
                      height: 30,
                      alignSelf: 'center',
                    }}
                    onPress={this.props.onClose}>
                    <Image
                      source={require('../../assets/cancel.png')}
                      style={{
                        alignSelf: 'center',
                        width: 12,
                        height: 12,

                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                </>
              </View>
              {this.props.shouldShowSearch ? (
                <TextInput
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  onChangeText={search => this.setState({search})}
                  style={[
                    styles.searchBar,
                    this.state.changeTextFieldVordercolor
                      ? {borderColor: this.props.themeColor}
                      : {borderColor: 'lightgray'},
                  ]}
                  placeholder={
                    this.props.searchPlaceHolder ||
                    `🔍 ${strings.searchByWallets}`
                  }
                />
              ) : (
                <View
                  style={{
                    height: 2,
                    backgroundColor: '#70707014',

                    marginHorizontal: 20,
                    marginVertical: 10,
                  }}
                />
              )}
            </View>
            <FlatList
              data={this.filterList(this.props.data)}
              renderItem={product => {
                return (
                  <CheckBoxItemView
                    checkBoxHeight={this.props.checkBoxHeight || 18}
                    themeColor={this.props.themeColor || 'black'}
                    nameFontSize={this.props.nameFontSize || 15}
                    nameFontWeight={this.props.nameFontWeight || '400'}
                    imageWidth={this.props.imageWidth || 30}
                    imageHeight={this.props.imageHeight || 30}
                    item={product}
                    image={{uri: product.item.logo}}
                    imageResizeMode={this.props.imageResizeMode}
                    isSelected={
                      product.item.name === this.state.selectedItem.name
                    }
                    didSelected={this.onClickPaymentSelected}
                  />
                );
              }}
              keyExtractor={(item, index) => `${index}`}
            />
            <TouchableOpacity
              style={{
                backgroundColor:
                  this.props.payNowButtonColor ||
                  this.props.themeColor ||
                  'black',
                height: this.props.payNowButtonHeight || 50,
                marginVertical: 20,
                marginHorizontal: 20,
                justifyContent: 'center',
                borderRadius: this.props.payNowButtonCornerRadius || 10,
              }}
              onPress={async () => {
                if (this.props.customHandle) {
                  this.props.selectedData(this.state.selectedItem);
                } else {
                  let newPayload = {...this.props.payload};
                  let selectedItem = this.state.selectedItem;

                  newPayload.paymentChannel = selectedItem?.payment_channel_key;
                  newPayload.paymentMethod = selectedItem?.payment_method_key;

                  let payload = {...newPayload};
                  if (this.props.paymentLinkRef !== undefined) {
                    let getMerchantDetails =
                      await helpers.getSignatureHashAndMerchntId(
                        this.props.paymentLinkRef,
                        CheckoutInstance.state.env,
                      );
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
                        payment_link: this.props.paymentLinkRef,
                      };
                    }
                  }
                  var response = Checkout.startPaymentWithWallets(payload);
                  this.setState({showLoader: false});
                  // this.afterCheckout(response);
                }
              }}>
              <View>
                <Text
                  style={{
                    paddingHorizontal: 20,
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  {this.props.payNowButtonText || strings.payNow}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>
        {this.state.orderDetails !== undefined ? (
          <TransactionStatusView
            orderDetails={this.state.orderDetails}
            showSheet={true}
            selectedProducts={this.props.selectedProducts}
            deliveryAmount={this.props.deliveryAmount}
            cartDetailStyles={this.props.cartDetailStyles}
            onClose={this.props.onClose}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    height: '100%',
  },
  searchBar: {
    margin: 10,
    marginTop: 15,
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 20,
    marginHorizontal: 25,
  },
});

export default WalletView;
