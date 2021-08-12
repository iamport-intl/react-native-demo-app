# react-native-demo-app

## Enable deep linking in ANDROID:

To create a link to your app content, add an intent filter that contains these elements and attribute values in your AndroidManifest.xml:
Include the BROWSABLE category. It is required in order for the intent filter to be accessible from a web browser. Without it, clicking a link in a browser cannot resolve to your app.

Also include the DEFAULT category. This allows your app to respond to implicit intents. Without this, the activity can be started only if the intent specifies your app component name.



```Java
<category android:name="android.intent.category.DEFAULT" />
<category android:name="android.intent.category.BROWSABLE" />
```


To accept the URIs that begin with “chaipay://checkout“

```Java
<data android:scheme="chaipay"
      android:host="checkout" />
<data android:scheme="zalopay"
      android:host="pay" />
<data android:scheme="momo"
      android:host="pay" />
```
 
##  Enable deep linking in iOS:

To add the url schemes to the app.

  1 Go to ProjectSettings -> info

  2 Add inside the URL types

    a. In the URL schemes, give the name to accept the URIs that begin with, under UEL Schemes (eg: “momo://, zalopay://“)

 

  3. Should include the application url schemes in info.plist under LSApplicationQueriesSchemes

     LSApplicationQueriesSchemes - Specifies the URL schemes you want the app to be able to use with the canOpenURL: method of the UIApplication class.

## To use the library:

1. Add the library to the project.

2. Add the dependency in package.json
  `"chaipay-sdk": "file:paymentSDK",`

3. Import the library as below: 
  `import Checkout from 'chaipay-sdk';`

4. Initialise the checkout instance as below:

```javascript
   <Checkout 
        chaipayKey={data["key"]}
        signature_hash={'123456'}
        merchantOrderId={data["merchant_order_id"]}
        amount={data["amount"]}
        currency={data["currency"]}
        orderDetails={data["order_details"]}
        paymentChannel={channel}
        paymentMethod={method}
        callbackFunction={_afterCheckout}
        redirectUrl = {"chaipay://checkout"}
  />
  ```

  
|Parameter|  Description|
|----------|--------------|
|chaipayKey|  chaipay unique key provided to merchants |
|signature_hash|  Signature calculated using this link|
|merchantOrderId |   Merchant order Id|
|amount| Product amount|
| currency | Merchant currency used for transaction|
 |orderDetails|   Order Details includes quantity,id,name,price are mandatory|
|paymentChannel|Name of the payment channel|
|paymentMethod|Payment Method to be used.
|redirectUrl|redirect url to get response from gateway (eg: momo://pay, chaipay://checkout,.)|
|callbackFunction|returns the message, can be used when required.|


5.   callBackFunction - returns the success and failure callback, can be used when required.

Examples: 
## Success callback : 

```javascript
{
  "chaipay_order_ref": "1wa0choxhAy2QtE9ix8aNt8T3Mf",
  "channel_order_ref": "0",
  "merchant_order_ref": "MERCHANT1628681469666",
  "status": "Success",
  "status_code": "2000",
  "status_reason": "SUCCESS"
}
```
## Failure Callback:

```javascript
{
  "chaipay_order_ref": "1wa0choxhAy2QtE9ix8aNt8T3Mf",
  "channel_order_ref": "0",
  "merchant_order_ref": "MERCHANT1628681469666",
  "status": "Initiated",
  "status_code": "4000",
  "status_reason": "INVALID_TRANSACTION_ERROR"
}
```


## Payload example to initialise the payment :


```javascript
var payload = {
    "key": "lzrYFPfyMLROallZ",
    "pmt_channel": ZALOPAY,
    "pmt_method": ZALOPAY_WALLET,
    "merchant_order_id": 'MERCHANT1628666326578',
    "amount": 4499999,
    "currency": "VND",
    "signature_hash":"123",
    "order_details": [
      {
        "id": "knb",
        "name": "kim nguyen bao",
        "price": 4499999,
        "quantity": 1
      }
    ],
  };
  ```
 
Steps for Signature Hash Generation using this [link](https://www.docs.chaipay.io/getting_started/signatures/payment_request.html)
