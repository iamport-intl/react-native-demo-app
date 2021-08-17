import { sum, sumBy, values } from 'lodash';
import React from 'react';
import { Dimensions } from 'react-native';
import { View, ScrollView, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { APP_THEME_COLOR, BOLD, currency, DARKBLACK, descriptionText, HEDER_TITLES, LIGHTGRAY, ORDERTEXT, SORTANDFILTER, WHITE_COLOR } from '../../constants';
import Card from '../../elements/Card';
import CheckboxView from '../../helpers/CheckboxView';
import HorizontalTextStackView from '../../helpers/HorizontalTextStackView';
import ScheduledProductCell from '../../screens/SelectedProductCell';
import Checkout from '../../../paymentSDK';
const {width, height} = Dimensions.get('screen')

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE_COLOR
  }, 
  container: {
    flex: 1,
  },
  flatListView: { flex: 1, maxHeight: height/2,marginHorizontal: 15, marginVertical: 10, 
    shadowRadius: 1,
    shadowOffset: {
        height: 1,
      },
              
  borderColor: '#ddd',
  borderBottomWidth: 0.5,
  },
  cardContainer:{
    width:300,
    maxWidth:'80%',
    padding:30
  },
  name: {
    color: '#3D3D3D',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    marginVertical:10
},
price: {
  color: '#3D3D3D',
  fontSize: 15,
  fontWeight: 'bold',
  marginBottom: 10,
  alignSelf: 'center',
  padding:10
}, 
payNowContainerView: {
  marginHorizontal: 15, 
  width: width - 30, 
  backgroundColor: WHITE_COLOR, 
  marginBottom: 50, 
  justifyContent: 'space-between', 
  flexDirection: 'row',
  shadowRadius: 1,
    shadowOffset: {
        height: 1,
      },
              
  borderColor: '#ddd',
  borderTopWidth: 0.5,
  paddingTop: 20
},
payNowView: {
  height: 50,
  alignItems: 'center', 
  marginBottom: 10,
  borderRadius: 5, 
  paddingVertical: 15, 
  alignSelf: 'center', 
  backgroundColor: APP_THEME_COLOR
},
modalView: {
flex: 1
},

payNowTextView: {
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: WHITE_COLOR,
    flex: 1,
    fontWeight: BOLD,
    fontSize: 16,
  },
  headerView: {
    marginTop: 20, 
    paddingBottom: 20,   
    backgroundColor: WHITE_COLOR,
    shadowRadius: 1,
    shadowOffset: {
        height: 1,
      },
              
  borderColor: '#ddd',

  borderBottomWidth: 0.5,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  
  },
  featuredText: {textAlign: 'left',color: APP_THEME_COLOR, fontSize: 40, fontWeight: BOLD, marginTop: -20, marginHorizontal: 20,},
  paymentView: {marginHorizontal: 15, paddingVertical: 20,flex: 1, width : width -30,  shadowRadius: 1,
    shadowOffset: {
        height: 1,
      },
      borderColor: '#ddd',

  borderBottomWidth: 0.5,
  shadowColor: '#000000',
  },
  paymentText: { fontWeight: '700', fontSize: 22, color: HEDER_TITLES, marginBottom: 15,},

  
  stackView: {
    flexDirection:'row', marginVertical: 5, justifyContent: 'space-around'
  },
  leftStackText: {fontSize: 13, flex: 0.4},
  rightStackText: {fontWeight: 'bold', fontSize: 14, marginLeft: 5,flex: 0.6, textAlign: 'left'},
  successStyle: {alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginTop: 25},
  modalDismissText: {fontSize: 15, alignSelf: 'center',},
  containerView: {marginHorizontal: 20, marginTop:20, marginTop: 35},
});

class Checkout1 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
     selectedItem: {},
     callThePayment: false,
     data: {},
     url: "",
     orderDetails: undefined,
    }
  }

  static navigationOptions = ({navigation}) => {

    const { params } = navigation.state;
       return {
         title:  'Techup.co.in',
         headerStyle: {
             backgroundColor: '#0570E9',
         },
         headerTintColor: '#fff',
         headerTitleStyle: {
             fontWeight: 'bold',
         },
         
         headerRight:(
           <TouchableOpacity 
             style={{padding:5, marginHorizontal:10}} 
             onPress={()=>params.onPressMethod()}>   
             <Text style={{color:"#FFFFFF"}}>My Cart</Text>
           </TouchableOpacity>)      
       }
  };

  _onClickPaymentSelected = (item) => {
    this.setState({selectedItem: item});
    console.log("Item selected", this.state.selectedItem)
  }

  _afterCheckout = (transactionDetails) => {
    console.log('transction', transactionDetails)
    if(transactionDetails){
      if((typeof transactionDetails)=="object"){
          this.setState({ orderDetails: transactionDetails});
      }
      else if(transactionDetails == "Modal closed"){
        this.setState({ orderDetails: transactionDetails});
      }else{
        this.setState({ orderDetails: JSON.parse(transactionDetails)});
      }
  }
  }

  render(){
      var amount = this.props.route.params.price;
      if (!amount) {
        amount=1000000
      }
      let val = this.state.selectedItem.name
      let totalAmount = sumBy(values(this.props.route.params.selectedProducts), 'price')
      let deliveryAmount = 7.2
      let selectedChannel = val === 'Pay with ZOLO Pay' ? 'ZALOPAY' :  val === 'Pay with MOMO Pay' ?  'MOMOPAY' :  'VNPAY'
      let data = this.state.data
      const deepLinkURL = "chaipay://checkout";

      var payload = {
        "key": "lzrYFPfyMLROallZ",
        //navigation "navigation":navigation,
        "pmt_channel": this.state.channelData?.channel || 'ZALOPAY_WALLET',
        "pmt_method": this.state.channelData?.method || 'ZALOPAY',
        "merchant_order_id": "MERCHANT" + new Date().getTime(),
        "amount": totalAmount,
        "currency": "VND",
        "signature_hash":"123",
        "billing_details": {
          "billing_name": "Test mark",
          "billing_email": "markweins@gmail.com",
          "billing_phone": "9998878788",
          "billing_address": {
            "city": "VND",
            "country_code": "VN",
            "locale": "en",
            "line_1": "address",
            "line_2": "address_2",
            "postal_code": "400202",
            "state": "Mah"
          }
        },
        "shipping_details": {
          "shipping_name": "xyz",
          "shipping_email": "xyz@gmail.com",
          "shipping_phone": "1234567890",
          "shipping_address": {
            "city": "abc",
            "country_code": "VN",
            "locale": "en",
            "line_1": "address_1",
            "line_2": "address_2",
            "postal_code": "400202",
            "state": "Mah"
          }
        },
        "order_details": [
          {
            "id": "knb",
            "name": "kim nguyen bao",
            "price": 1000,
            "quantity": 1
          }
        ],
        "success_url": "chaipay://",
        "failure_url": "chaipay://",
      };

      let orderDetails = this.state.orderDetails;
      return (
        <View style={{backgroundColor: WHITE_COLOR, flex: 1}}>
          { orderDetails !== undefined ? 
          <View style={{flex: 1}}>
            <View style={{flex: 1}}> 
          {
          orderDetails?.status_reason === 'SUCCESS'
      ? 
      <>
      <Text style={styles.successStyle}>Yay! Your order has been successfully placed</Text>
      <View style={styles.containerView}> 
          <View style={styles.stackView}>
          <Text style={styles.leftStackText}>Merchant Order Ref: </Text>
          <Text style={styles.rightStackText}>{orderDetails.merchant_order_ref}</Text>
          </View>
          <View style={styles.stackView}>
          <Text style={styles.leftStackText}>Channel Order Ref: </Text>
          <Text style={styles.rightStackText}>{orderDetails.channel_order_ref}</Text>
          </View>
          <View style={styles.stackView}>
          <Text style={styles.leftStackText}>Status: </Text>
           <Text style={styles.rightStackText}>{orderDetails.status}</Text>
          </View>
      </View>
      </>
      : 
      orderDetails?.status_reason === 'INVALID_TRANSACTION_ERROR' ? 
        <>
            <Text style={styles.successStyle}>Transaction Failed</Text>
            <View style={styles.containerView}> 
            <View style={styles.stackView}>
            <Text style={styles.leftStackText}>Merchant Order Ref: </Text>
            <Text style={styles.rightStackText}>{orderDetails.merchant_order_ref}</Text>
            </View>
            <View style={styles.stackView}>
            <Text style={styles.leftStackText}>Channel Order Ref: </Text>
            <Text style={styles.rightStackText}>{orderDetails.channel_order_ref}</Text>
            </View>
            <View style={styles.stackView}>
            <Text style={styles.leftStackText}>Status: </Text>
            <Text style={styles.rightStackText}>{orderDetails.status}</Text>
            </View>
        </View>
        </>
         :
          orderDetails?.message ==="Modal closed" 
          ?
          <>
          <Text style={styles.successStyle}>Payment Not Done</Text>
          <View style={styles.containerView}> 
              <Text style={styles.modalDismissText}>Please try again</Text>
          </View>
          </>
        :
        < Text>{JSON.stringify(orderDetails)}</Text>
      }
              <TouchableOpacity style ={[styles.payNowView, {marginTop: height /2 - 100, width: width - 40}]} disabled ={false} onPress={() => {
                this.props.navigation.goBack()
                
                    }}>
                    <Text style={styles.payNowTextView}>Go back</Text>
                  </TouchableOpacity>
         </View>
        </View>    
      :
      <>

              <View style={styles.headerView}>
                <Text style={styles.featuredText}>Checkout </Text>
              </View>
              <ScrollView contentContainerStyle={styles.contentContainerStyle} style={styles.container}>
                <FlatList 
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.flatListView}
                data={values(this.props.route.params.selectedProducts)}
                renderItem={(product) => {
                  return <ScheduledProductCell product={product.item}/>
                }}
                keyExtractor={item => item.key}
                />

                <View style={styles.paymentView}>
                  <Text style={styles.paymentText}>
                    Payment
                  </Text>

                  <CheckboxView item={{name: 'Pay with ZOLO Pay'}} isSelected={val === 'Pay with ZOLO Pay'} didSelected={this._onClickPaymentSelected} />
                  <CheckboxView item={{name: 'Pay with VNPay'}} isSelected={val === 'Pay with VNPay'} didSelected={this._onClickPaymentSelected}/>
                  <CheckboxView item={{name: 'Pay with MOMO Pay'}} isSelected={val === 'Pay with MOMO Pay'} didSelected={this._onClickPaymentSelected}/>
                </View>


                <View style={{marginVertical: 25, width: width -30}}>
                   <Text style={styles.paymentText}>
                    Order details
                  </Text>
                <HorizontalTextStackView item={{name: 'Order', value: `${totalAmount} ${currency}`, fontSize: 13, fontWeight: '400', color: ORDERTEXT}}/>
                <HorizontalTextStackView item={{name: 'Delivery', value: `${deliveryAmount} ${currency}`,fontSize: 13, fontWeight: '400', color: ORDERTEXT}}/>
                <HorizontalTextStackView item={{name: 'Summary', value: `${totalAmount + deliveryAmount} ${currency}`, fontSize: 16, fontWeight: '500', color: ORDERTEXT}}/>
                </View>

              </ScrollView>
              <View style={styles.payNowContainerView}>
                <View style={{flex: 0.5, alignItems: 'center', }}>
                  <Text style={{color: descriptionText, fontSize: 14}}>
                      Grand Total: 
                  </Text>
                  <Text style={{color: DARKBLACK, fontSize: 16, fontWeight: '600'}}>
                      {`${totalAmount + deliveryAmount} ${currency}`}
                  </Text>
                </View>
              <TouchableOpacity style ={[styles.payNowView, {flex: 0.5}]} disabled ={false} onPress={() => {
                
                this.setState({callThePayment:false}, () => {this.setState({callThePayment: true})})
                this.setState({channelData: 
                      { price: this.props.route.params.price,
                        //navigation: this.props.navigation,
                        method: selectedChannel === 'ZALOPAY' ? 'ZALOPAY_WALLET' :  selectedChannel === 'MOMOPAY' ? 'MOMOPAY_WALLET' : 'VNPAY_ALL',
                        channel: selectedChannel === 'ZALOPAY' ? 'ZALOPAY' :  selectedChannel === 'MOMOPAY' ? 'MOMOPAY' : 'VNPAY',
                        orderId: "MERCHANT" + new Date().getTime(),
                        price: totalAmount
                      }})

                      let newPayload = {...payload};
                      newPayload["merchant_order_id"] = "MERCHANT" + new Date().getTime();
                      newPayload["pmt_channel"] = selectedChannel === 'ZALOPAY' ? 'ZALOPAY' :  selectedChannel === 'MOMOPAY' ? 'MOMOPAY' : 'VNPAY';
                      newPayload["pmt_method"] = selectedChannel === 'ZALOPAY' ? 'ZALOPAY_WALLET' :  selectedChannel === 'MOMOPAY' ? 'MOMOPAY_WALLET' : 'VNPAY_ALL';
                      newPayload["amount"] = totalAmount;
                      this.setState({data: newPayload})
                    }}>
                    <Text style={styles.payNowTextView}>Pay Now</Text>
                  </TouchableOpacity>
                  {this.state.callThePayment ?
                      
                      <Checkout 
                        chaipayKey={data["key"]}
                        merchantOrderId={data["merchant_order_id"]}
                        amount={data["amount"]}
                        currency={data["currency"]}
                        // fetchHashUrl={domain+"/getHash"}
                        secretKey="0e94b3232e1bf9ec0e378a58bc27067a86459fc8f94d19f146ea8249455bf242"
                        shippingAddress={data["shipping_details"]}
                        billingAddress={data["billing_details"]}
                        orderDetails={data["order_details"]}

                        paymentChannel={this.state.channelData.channel}
                        paymentMethod={this.state.channelData.method}
                        callbackFunction={this._afterCheckout}
                        failureUrl = {deepLinkURL}
                        successUrl = {deepLinkURL}
                        redirectUrl = {deepLinkURL}
                      />

                      :
                        null}
              </View>     
        </>
  }
        </View>
      );
  }
};

export default Checkout1;