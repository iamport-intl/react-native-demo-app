import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ChaiPay from 'chaipay';
import ChaiPayScreen from 'chaipay/ChaiPayScreen';
//const client = require('chaipay')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Payment = ({ route }) => {
  const { price, method, channel } = route.params;
  const [url, setUrl] = useState("");

  var data = {
    "key": "lzrYFPfyMLROallZ",
    //navigation "navigation":navigation,
    "pmt_channel": channel,
    "pmt_method": method,
    "merchant_order_id": "MERCHANT" + new Date().getTime(),
    "amount": price,
    "currency": "VND",
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

  useEffect(() => {
    const chaipay = new ChaiPay({
      secretKey: '86GV9W7wZRFhfSdgAicoDH',
      privatKey: 'privat',
      env: 'SANDBOX', // 'SANDBOX'  // optional
      debugMode: true, // optional
    });
    chaipay.paymentService.payment(data,
      function (error) { // onFailure hook
        // Handle payment initiation failure
        console.error(error);
      }, function (response) { // onBeforeRedirect hook
        console.log('logging response');
        console.log(response.data.redirect_url);
        const redirectUrl = response.data.redirect_url;
        console.log("logging url", redirectUrl);
        setUrl(redirectUrl);
      })
  }, [price,method,channel]);


  return (
    <ChaiPayScreen paymentChannel={channel} url={url} amount={price} />
  );
};

export default Payment;