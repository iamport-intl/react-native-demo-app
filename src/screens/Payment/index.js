import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
// import ChaiPay from 'chaipay';
// import ChaiPayScreen from 'chaipay/ChaiPayScreen';
import Checkout from 'chaipay-sdk';
//const client = require('chaipay')
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

// TODO
  // 1. Add env variable which can have 3 values "dev","staging","prod" using this we should use the respective domain for API requests
  // "https://dev-api.chaipay.io" for dev
  // "https://staging-api.chaipay.io" for staging
  // "https://api.chaipay.io" for prod
  // default domain to be used is prod if env variable is not provided
  // 2. Add an option for the merchant to provide - text, color and style for the checkout button
  // 3. Add an option for the merchant to provide - text, color and style for the Close button in webview


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerView: {marginHorizontal: 20, marginTop:20, marginTop: 35},
  stackView: {
    flexDirection:'row', marginVertical: 5, justifyContent: 'space-around'
  },
  leftStackText: {fontSize: 13, flex: 0.4},
  rightStackText: {fontWeight: 'bold', fontSize: 14, marginLeft: 5,flex: 0.6, textAlign: 'left'},
  successStyle: {alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginTop: 25},
  modalDismissText: {fontSize: 15, alignSelf: 'center',}

});

const deepLinkURL = "chaipay://checkout";

const Payment = ({ route }) => {
  const { price, method, channel, orderId } = route.params;
  console.log('route params : ',route.params);
  const [url, setUrl] = useState("");
  
  var payload = {
    "key": "lzrYFPfyMLROallZ",
    //navigation "navigation":navigation,
    "pmt_channel": channel,
    "pmt_method": method,
    "merchant_order_id": orderId,
    "amount": price,
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


const [ pageLoading, setPageLoading ] = useState(false);
    const [ orderDetails, setOrderDetails ] = useState(undefined);
    const [ domain, setDomain ] = useState("http://192.168.0.108:3000")
    const [ data, setData ] = useState(payload);

    const {containerView, stackView, leftStackText, rightStackText, successStyle, modalDismissText} = styles
    useFocusEffect(
      React.useCallback(()=>{
        let newPayload = {...payload};
        newPayload["merchant_order_id"] = orderId;
        newPayload["pmt_channel"] = channel;
        newPayload["pmt_method"] = method;
        newPayload["amount"] = price;
        setData(newPayload)
        setOrderDetails(undefined);
      },[orderId])
    );

    const _afterCheckout = ( transactionDetails ) => {
        // console.warn("Error without persist ",nativeEvent);
        if(transactionDetails){
            if((typeof transactionDetails)=="object"){
                setOrderDetails(transactionDetails);
            }
            else if(transactionDetails == "Modal closed"){
                setOrderDetails(transactionDetails);
            }else{
                setOrderDetails(JSON.parse(transactionDetails))
            }
        }
    }
  return (
    <ScrollView
      contentContainerStyle={{flex:1, marginBottom:100}}
    >
      {orderDetails?.status_reason === 'SUCCESS' 
      ? 
      <>
      <Text style>Yay! Payment Success</Text>
      <View style={containerView}> 
          <View style={stackView}>
          <Text style={leftStackText}>Merchant Order Ref: </Text>
          <Text style={rightStackText}>{orderDetails.merchant_order_ref}</Text>
          </View>
          <View style={stackView}>
          <Text style={leftStackText}>Channel Order Ref: </Text>
          <Text style={rightStackText}>{orderDetails.channel_order_ref}</Text>
          </View>
          <View style={stackView}>
          <Text style={leftStackText}>Status: </Text>
          <Text style={rightStackText}>{orderDetails.status}</Text>
          </View>
      </View>
      </>
      : 
      orderDetails?.message ==="Modal closed" 
      ?
      <>
      <Text style={successStyle}>Payment Not Done</Text>
      <View style={containerView}> 
      <Text style={modalDismissText}>Please try again</Text>
      </View>
      </>
      :
      <Text>{JSON.stringify(orderDetails)}</Text>}
      
      {/* <Button onPress={_fetchHash}
        title="Fetch Hash"
      /> */}
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

        paymentChannel={channel}
        paymentMethod={method}
        callbackFunction={_afterCheckout}
        failureUrl = {deepLinkURL}
        successUrl = {deepLinkURL}
        redirectUrl = {deepLinkURL}
      />
    </ScrollView>
    // <ChaiPayScreen paymentChannel={channel} url={url} amount={price} />
  );
};

export default Payment;