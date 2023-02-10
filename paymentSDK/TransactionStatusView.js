import React, {Component} from 'react';
import {FlatList, Modal} from 'react-native';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {sumBy, values, map} from 'lodash';
import {
  ORDERTEXT,
  IMAGE_BACKGROUND_COLOR,
  WHITE_COLOR,
} from '../paymentSDK/constants';
import CartDetails from './CartDetails';
import RBSheet from 'react-native-raw-bottom-sheet';
import PayNowButton from './PayNowButton';
const {width, height} = Dimensions.get('screen');
import {strings} from './constants';
import LinearGradient from 'react-native-linear-gradient';

class TransactionStatusView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.data,
    };
    this.checkout = React.createRef();
    this.paymentLinkWebView = React.createRef();
  }

  componentDidMount() {
    if (this.props.showSheet) {
      this.RBSheet.open();
    }
  }

  ResponseView = ({orderDetails}) => {
    let totalAmount = sumBy(values(this.props.selectedProducts), 'price');
    let deliveryAmount = this.props.deliveryAmount;
    let selectedProducts = this.props.selectedProducts;

    let failedCase =
      orderDetails?.status_reason === 'INVALID_TRANSACTION_ERROR' ||
      orderDetails?.is_success === false ||
      orderDetails?.status === 'Failed';

    let successCase =
      orderDetails?.status_reason === 'SUCCESS' ||
      orderDetails?.is_success === true ||
      orderDetails?.status === 'Success';
    let image = successCase
      ? require('../assets/successCase.png')
      : require('../assets/failCase.png');
    return (
      <View
        style={{
          margin: 20,
          backgroundColor: this.props.backgroundColor || WHITE_COLOR,
          borderRadius: 10,
          paddingBottom: 25,
          marginTop: 8,
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              flex: 1,
              fontWeight: '500',
            }}>
            {strings.paymentConfirmation}
          </Text>

          <TouchableOpacity
            style={{
              justifyContent: 'center',
              width: 30,
              height: 30,
              alignSelf: 'center',
            }}
            onPress={() => {
              this.RBSheet?.close();
              this.props.onClose();
            }}>
            <Image
              source={require('../assets/cancel.png')}
              style={{
                alignSelf: 'center',
                width: 12,
                height: 12,

                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{flex: 1}}>
            <>
              <Image
                style={{
                  marginTop: 10,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  resizeMode: 'contain',
                  width: 105,
                  height: 105,
                }}
                source={image}
              />
              <View
                style={{
                  marginTop: 0,
                  marginHorizontal: 10,
                  paddingBottom: 15,
                }}>
                <Text style={styles.successStyle}>
                  {successCase
                    ? strings.payment_successful
                    : strings.payment_failed}
                </Text>
                {orderDetails?.message || orderDetails?.status_reason ? (
                  <Text
                    style={[
                      styles.successStyle,
                      {fontWeight: '400', fontSize: 14},
                    ]}>
                    {`${
                      orderDetails?.message ||
                      orderDetails?.status_channel_reason
                    }`}
                  </Text>
                ) : null}
              </View>
            </>
            <CartDetails
              themeColor={successCase ? '#006400' : '#FF0000'}
              selectedProducts={this.props.selectedProducts || []}
              nameFontSize={this.props?.cartDetailStyles?.nameFontSize}
              nameFontWeight={this.props?.cartDetailStyles?.nameFontWeight}
              descriptionColor={this.props?.cartDetailStyles?.descriptionColor}
              descriptionSize={this.props?.cartDetailStyles?.descriptionSize}
              descriptionFontWeight={
                this.props?.cartDetailStyles?.descriptionFontWeight
              }
              amountFontSize={this.props?.cartDetailStyles?.amountFontSize}
              amountFontWeight={this.props?.cartDetailStyles?.amountFontWeight}
              amountColor={this.props?.cartDetailStyles?.amountColor}
              borderColor={this.props?.cartDetailStyles?.borderColor}
              borderRadius={this.props?.cartDetailStyles?.borderRadius}
              borderWidth={this.props?.cartDetailStyles?.borderWidth}
              removeBorder={this.props?.cartDetailStyles?.removeBorder}
              headerText={strings.netPayable}
              headerFont={this.props?.cartDetailStyles?.headerFont}
              headerColor={
                this.props?.cartDetailStyles?.headerColor || successCase
                  ? 'green'
                  : 'red'
              }
              headerFontWeight={this.props?.cartDetailStyles?.headerFontWeight}
              removeItem={this.removeItem}
              showNetPayable={true}
              deliveryAmount={this.props.deliveryAmount}
              backgroundColor={this.props.backgroundColor}
            />
          </View>
        </ScrollView>
        {false ? (
          <View style={{marginBottom: 20, marginTop: 5, flex: 1}}>
            <PayNowButton
              disabled={false}
              themeColor={this.state.color}
              textFontSize={16}
              textFontWeight={'800'}
              textColor={'white'}
              borderRadius={this.state.borderRadius}
              height={50}
              width={width - 60}
              text={'Retry Now'}
              payload={this.props.payload}
            />
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
        <RBSheet
          customStyles={{
            container: {
              height: this.props.containerHeight || '80%',
              backgroundColor: this.props.backgroundColor || 'white',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}
          closeOnDragDown={false}
          closeOnPressMask={false}
          animationType={'slide'}
          onClose={this.props.onClose}
          ref={ref => {
            this.RBSheet = ref;
          }}
          openDuration={250}>
          <LinearGradient
            start={{x: 0.0, y: 0.15}}
            end={{x: 0.0, y: 1.0}}
            locations={[0, 0.15, 0.6]}
            colors={[
              'rgba(146, 227, 222, 0.3)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)',
            ]}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={require('../assets/SuccessCircle.png')}
                style={{
                  alignSelf: 'center',
                  width: 80,
                  height: 80,
                  resizeMode: 'contain',
                  marginTop: 160,
                }}
              />
              <View style={{height: 50, width: 50}}>
                <Image
                  source={require('../assets/whiteTick.png')}
                  style={{
                    alignSelf: 'center',
                    width: 31,
                    height: 25,
                    resizeMode: 'contain',
                    marginTop: -53,
                  }}
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: 20,
                  marginHorizontal: 100,
                }}>
                Order placed Successfully
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: 50,
                borderRadius: 15,
                marginTop: 150,
                marginBottom: 20,
                height: 50,
                backgroundColor: 'black',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  marginHorizontal: 50,
                  borderRadius: 15,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </RBSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  successStyle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 6,
    textAlign: 'center',
  },
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    height: '100%',
  },
  searchBar: {
    margin: 10,
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 20,
    marginHorizontal: 25,
  },
});

export default TransactionStatusView;
