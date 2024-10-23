import {
  View,
  Dimensions,
  Linking,
  Modal,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {WebView} from 'react-native-webview';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  bodyParams,
  requiredParams,
  initiateURL,
  api,
  baseURL,
  webRequiredParams,
  webBodyParams,
  strings,
} from './constants';
import {HmacSHA256} from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import {isEmpty, last, mapValues} from 'lodash';
import SmsListener from 'react-native-android-sms-listener';
import {
  helpers,
  _prepareRequestBody,
  axiosMethods,
  prepareWebRequestBody,
} from './helper';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import CheckoutInstance from './CheckoutInstance';
var SendIntentAndroid = require('react-native-send-intent');
import {EventRegister} from 'react-native-event-listeners';
import RBSheet from 'react-native-raw-bottom-sheet';
import pkg from '../package.json';
import UserAgent from 'react-native-user-agent';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  indicatorView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 70,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  checkoutWebView: {
    flex: 1,
    marginTop: 16,
  },
  closeButtonContainer: {
    backgroundColor: '#3D3D3D',
    borderRadius: 5,
    marginHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center',
    height: 40,
    alignSelf: 'center',
    marginBottom: 60,
    width: width - 30,
    marginTop: 20,
  },
  closeTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  checkOutViewStyle: {
    backgroundColor: '#3D3D3D',
    borderRadius: 5,
    marginHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center',
    height: 40,
    alignSelf: 'center',
    width: width - 30,
    marginTop: height / 2 - 20 - 88,
  },
  checkoutButtonTitleStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initiatingPayment: false,
      paymentURL: '',
      loadPaymentPage: false,
      pageLoading: true,
      messageFromWebView: '',
      secretHash: '',
      originList: ['momo://', 'zalopay://', 'intent://', 'toppay://'],
      data: {},
      webUrl: '',
      webViewRef: null,
      showRbSheet: false,
      transactionStatusResponse: null,
    };
    this.paymentLinkWebView = React.createRef();
  }
  webview = null;

  injectWebViewData = numb => {
    let injectedData = numb
      ? `
          document.getElementById('otp1').value = '${numb.substring(0, 1)}';
          document.getElementById('otp2').value = '${numb.substring(1, 2)}';
          document.getElementById('otp3').value = '${numb.substring(2, 3)}';
          document.getElementById('otp4').value = '${numb.substring(3, 4)}';
          document.getElementById('otp5').value = '${numb.substring(4, 5)}';
          document.getElementById('otp6').value = '${numb.substring(5, 6)}';
        `
      : `
      document.getElementById('Mobilephoneno').value = '8341469169';
    `;

    return injectedData.toString();
  };

  async openLink(url) {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: 'white',
          preferredControlTintColor: 'black',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: 'white',
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
          headers: {
            'my-custom-header': 'my custom header value',
          },
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log('Error', error.message);
    }
  }

  setWebState = ref => {
    if (ref !== null) {
      this.webview = ref;
      if (isEmpty(this.state.webViewRef)) {
        this.setState({webViewRef: ref});
      }
    }
  };

  async requestReadSmsPermission() {
    if (isEmpty(this.state.webViewRef)) {
      if (!isEmpty(this.webview)) {
        this.setState({webViewRef: this.webview});
      }
    }
    try {
      var granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'Auto Verification OTP',
          message: 'need access to read sms, to verify OTP',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: 'Receive SMS',
            message: 'Need access to receive sms, to verify OTP',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          SmsListener.addListener(message => {
            var numb = message.body.match(/\d/g);
            numb = numb.join('');

            this.setState({receivedOTP: numb});

            let x = this.injectWebViewData(numb);
            this.webview?.injectJavaScript(x);
          });
        } else {
        }
      } else {
        console.log('READ_SMS permissions denied');
      }
    } catch (err) {
      console.log('error', err);
      alert(err);
    }
  }

  setPageLoading = (val, callback = undefined) => {
    this.setState(
      {
        pageLoading: val,
      },
      () => {
        if (callback) {
          callback();
        }
      },
    );
  };

  static async addCardForCustomerId(
    customerId,
    clientKey,
    JWTToken,
    cardData,
    subMerchantKey,
  ) {
    return await helpers.addCardForCustomerId(
      customerId,
      clientKey,
      JWTToken,
      cardData,
      subMerchantKey,
    );
  }

  static async deleteCardForCustomerId(
    customerId,
    clientKey,
    JWTToken,
    cardData,
    subMerchantKey,
  ) {
    return await helpers.deleteCardForCustomerId(
      customerId,
      clientKey,
      JWTToken,
      cardData,
      subMerchantKey,
    );
  }

  static async fetchCustomerCards(
    customerId,
    clientKey,
    JWTToken,
    subMerchantKey,
  ) {
    return await helpers.fetchCustomerCards(
      customerId,
      clientKey,
      JWTToken,
      subMerchantKey,
    );
  }

  static async addCustomer(customerData, clientKey, JWTToken, subMerchantKey) {
    return await helpers.addCustomer(
      customerData,
      clientKey,
      JWTToken,
      subMerchantKey,
    );
  }

  static async getTransactionStatus(payload) {
    return await helpers.getTransactionStatus(payload);
  }

  static async getCustomerData(customerID, clientKey, JWTToken) {
    return await helpers.getCustomerData(customerID, clientKey, JWTToken);
  }

  static async fetchRoutes(clientKey, JWTToken) {
    return await helpers.fetchRoutes(clientKey, JWTToken);
  }

  static async captureTransactionAPI(transactionOrderRef, clientKey, JWTToken) {
    return await helpers.captureTransactionAPI(
      transactionOrderRef,
      clientKey,
      JWTToken,
    );
  }

  static async getAvailablePaymentMethods(
    portOneKey,
    currency,
    subMerchantKey,
  ) {
    console.log('portone', portOneKey);
    console.log('currency', currency);
    console.log('subMerchantKey', subMerchantKey);
    return helpers.fetchAvailablePaymentGateway(
      portOneKey,
      currency,
      subMerchantKey,
    );
  }

  // static async getAvailablePaymentMethods = (
  //   portOneKey,
  //   currency,
  //   subMerchantKey,
  //   callback
  // ) => {
  //   EventRegister.emit("getAvailablePaymentMethods", {
  //     portOneKey,
  //     currency,
  //     subMerchantKey,
  //     callback,
  //   });
  // };
  static startPaymentWithWallets = (data, subMerchantKey) => {
    EventRegister.emit('startPaymentWithWallets', {data, subMerchantKey});
  };

  static startPaymentWithoutTokenization = (data, subMerchantKey) => {
    EventRegister.emit('startPaymentWithoutTokenisation', {
      data,
      subMerchantKey,
    });
  };

  static startPaymentWithTokenization = (
    savedTokenRes,
    data,
    JWTToken,
    clientKey,
    subMerchantKey,
  ) => {
    EventRegister.emit('startPaymentWithTokenisation', {
      savedTokenRes,
      data,
      JWTToken,
      clientKey,
      subMerchantKey,
    });
  };

  static startPaymentWithNewCard = (
    savedTokenRes,
    data,
    JWTToken,
    clientKey,
    customerUUID,
    subMerchantKey,
  ) => {
    EventRegister.emit('startPaymentWithNewCard', {
      savedTokenRes,
      data,
      JWTToken,
      clientKey,
      customerUUID,
      subMerchantKey,
    });
  };

  static startPaymentWithSavedCard = (
    savedTokenRes,
    data,
    JWTToken,
    clientKey,
  ) => {
    EventRegister.emit('startPaymentWithSavedCard', {
      savedTokenRes,
      data,
      JWTToken,
      clientKey,
    });
  };

  static openWebCheckoutUI = async (
    data,
    jwtToken = '',
    subMerchantKey,
    customerUUID,
    callbackFunc,
  ) => {
    EventRegister.emit('openWebCheckout', {
      data,
      jwtToken,
      subMerchantKey,
      callback: val => {
        if (typeof callbackFunc === 'function') {
          callbackFunc(val);
        }
      },
    });
  };

  startNewCardPayment = async (
    savedTokenRes,
    data,
    JWTToken,
    clientKey,
    customerUUID,
    subMerchantKey,
  ) => {
    let response = await helpers.startPayment(
      false,
      savedTokenRes,
      data,
      JWTToken,
      clientKey,
      customerUUID,
      subMerchantKey,
    );

    if (response?.val) {
      if (
        response?.val?.status_code === '2000' ||
        response?.val?.status === 200
      ) {
        EventRegister.emit('Success', response?.val?.data);
      } else {
        EventRegister.emit('Failed', response?.val);
        this.props.callbackFunction(response?.val);
      }
    }

    //return await helpers.startPayment(false, savedTokenRes, data);
  };

  startSavedCardPayment = async (savedTokenRes, data, JWTToken, clientKey) => {
    return await helpers.startPayment(
      true,
      savedTokenRes,
      data,
      JWTToken,
      clientKey,
    );
    // if (response?.val) {
    //   if (
    //     response?.val?.status_code === '2000' ||
    //     response?.val?.status === 201
    //   ) {
    //     EventRegister.emit('Success', response?.val?.data);
    //   } else {
    //     EventRegister.emit('Failed', response?.val);
    //     this.props.callbackFunction(response?.val);
    //   }
    // }
  };

  initiatePayment = async (data, subMerchantKey, axiosConfig) => {
    let {body, missingParams} = await _prepareRequestBody(data);

    console.log('missingParams', missingParams);
    let env = this.getEnv();
    if (missingParams.length === 0) {
      const {portOneKey} = CheckoutInstance.state;

      return new Promise((resolve, reject) => {
        let url = initiateURL[env] + api.initiatePayment;
        body = JSON.stringify(body);
        let requestConfig = {
          timeout: 30000,
          headers: {
            Authorization: `Bearer ${portOneKey}`,
            Accept: '*/*',
            'Content-Type': 'application/json',
            ...(!isEmpty(subMerchantKey) && {
              'X-Chaipay-SubMerchant-Key': subMerchantKey,
            }),
            'device-details': JSON.stringify({
              os: Platform.OS,
              tech:
                Platform.OS === 'ios'
                  ? 'reactNative_iOS'
                  : 'reactNative_android',
              version: pkg.version,
              platform: 'react-native',
            }),
          },
        };
        console.log(
          `Init req : ${url}====body: ${body}===== requestConfig : ${JSON.stringify(
            requestConfig,
          )}`,
        );
        this.setState({initiatePaymentBody: body});
        axios
          .post(url, body, requestConfig)
          .then(async response => {
            // console.log(
            //   "Response :::::::::: " + JSON.stringify(response, null, 4)
            // );
            let data = response?.data;

            let pmt_channel =
              JSON.parse(body).payment_channel_key ||
              JSON.parse(body).pmt_channel;
            this.setState({initiatePaymentResposne: data});
            if (data.deep_link !== undefined && data.deep_link !== '') {
              this.setState(
                {
                  paymentURL: data.deep_link,
                },
                () => {
                  this.setState({
                    initiatingPayment: false,
                    pageLoading: false,
                  });
                  this.showModal(data.deep_link);
                  resolve(true);
                },
              );

              let payload = JSON.parse(this.state.initiatePaymentBody);
              let pmt_channel = payload?.pmt_channel;
              let body = {
                environment: payload?.environment,
                pmt_channel: pmt_channel,
                merchant_order_ref: payload?.merchant_order_id,
              };
              const expiryMinutes =
                parseInt(
                  this.state.initiatePaymentResposne?.expiry_in_minutes || '20',
                ) * 60000; // Convert minutes to milliseconds
              const expiryTime = new Date().getTime() + expiryMinutes;
              this.setState({expiryTime: expiryTime});
              setTimeout(async () => {
                this.setState({pageLoading: true});
                let resp = await this.getTransactionStatusBasedOnTimeLimit(
                  body,
                );
                console.log(resp);
              }, 6000);
            } else {
              if (data.redirect_url) {
                if (pmt_channel === 'PAYPAL') {
                  await this.openLink(data.redirect_url);
                  this.setState({pageLoading: false});
                } else {
                  this.setState(
                    {
                      paymentURL: data.redirect_url,
                      initiatingPayment: false,
                    },
                    () => {
                      this.showModal(data.redirect_url);
                      resolve(true);
                    },
                  );
                }
              }
            }
          })
          .catch(error => {
            this.setState(
              {
                initiatingPayment: false,
              },
              () => {
                this.setState({pageLoading: false});

                if (error.response) {
                  reject(error.response.data);
                } else {
                  reject({
                    message:
                      'Something went wrong, please contact administrator',
                    is_success: false,
                  });
                }
              },
            );
          });
      });
    } else {
      let errorMessage = missingParams.join(', ') + ' are required.';
      // alert(errorMessage);
      //callbackFunction({ status: "failure", message: errorMessage });
      console.log('error', errorMessage);
      EventRegister.emit('Failed', {
        status: 'failure',
        message: errorMessage,
      });
      return;
    }
  };

  checkValidUrl = url => {
    // Ensure the URL is a string and starts with http or https
    if (!url || typeof url !== 'string') {
      return false;
    }

    const validProtocol =
      url.startsWith('http://') || url.startsWith('https://');

    // Return true if the protocol is valid
    return validProtocol;
  };

  _handleInvalidUrl = event => {
    const {redirectUrl} = CheckoutInstance.state;
    let url = event.url;
    let navigationType = event.navigationType;

    // Check if the navigation type is 'click' and if the URL is valid
    if (navigationType === 'click' && this.checkValidUrl(url)) {
      console.log('Valid URL:', url);
    }

    // Determine if the URL should be opened internally or externally
    let openUrlInternally = !url.startsWith(redirectUrl);
    console.log('openUrlInternally:', openUrlInternally, 'for URL:', url);

    // Handle invalid URLs or failed connections
    if (event.title === 'Error loading page' || event.code === -1003) {
      console.error('Failed to load page:', event.description);

      // Attempt to open the URL in the default browser if WebView can't load it
      this._handleError({
        code: event.code,
        description: event.description,
        url: event.url,
      });

      // Fallback to opening the URL in the default browser
      Linking.openURL(event.url).catch(err => {
        console.error('Failed to open URL in browser:', err);
      });
    }

    // Handle URLs that should not be opened internally
    if (!openUrlInternally) {
      console.log('Opening URL externally:', url);

      if (url.startsWith('http') || url.startsWith('https')) {
        this.setState({paymentURL: url});
      } else {
        console.log('Opening URL in default browser:', url);
        Linking.openURL(url).catch(error => {
          this._handleError(error);
        });
      }
    }

    return openUrlInternally;
  };

  navigationChange = event => {
    this.setPageLoading(false);
    const {redirectUrl} = CheckoutInstance.state;
    const {originList} = this.state;
    let url = event.url;
    let navigationType = event.navigationType;

    if (navigationType === 'click' && this.checkValidUrl(url)) {
      console.log('navigationType', url);
    }
    // let externalUrlFor = originList.filter(origin => {   let splitOrigin =
    // origin.split('*')[0];   console.log('splitOrigin', splitOrigin);   return
    // url.startsWith(splitOrigin); });
    let externalUrlFor = originList.filter(origin => url.startsWith(origin));

    let openUrlInternally =
      url.startsWith(redirectUrl) === false && externalUrlFor.length === 0;
    console.log('navigationChange 702');
    return openUrlInternally;
  };

  _handleError = error => {
    console.log('error', error);
    const {nativeEvent} = error;
    //todo:
    const {callbackFunction} = this.props;

    this.setState(
      {
        pageLoading: false,
      },
      () => {
        if (nativeEvent) {
          callbackFunction(nativeEvent);
        } else {
          callbackFunction({status: 'failed', message: error});
        }
      },
    );
  };

  _onMessage = event => {
    if (event.persist) {
      event.persist();
      event.preventDefault();
    }
    const {callbackFunction} = this.props;
    console.log('ON message called s: ' + JSON.stringify(event));
    this.setState(
      {
        pageLoading: false,
        messageFromWebView: event.nativeEvent.data,
      },
      () => callbackFunction(this.state.messageFromWebView),
    );
  };

  _onClose = () => {
    const {callbackFunction} = this.props;

    this.setState(
      {
        initiatingPayment: false,
        paymentURL: '',
        loadPaymentPage: false,
        pageLoading: false,
        messageFromWebView: '',
        data: {},
        webUrl: '',
        webViewRef: null,
        showRbSheet: false,
        initiatePaymentBody: {},
        initiatePaymentResposne: {},
        expiryTime: 0,
      },
      () => {
        EventRegister.emit('Failed', {
          is_success: false,
          message: 'Modal closed',
        });
        if (!isEmpty(this.state.transactionStatusResponse)) {
          callbackFunction({
            transactionStatusResponse: this.state.transactionStatusResponse,
          });
        } else {
          callbackFunction({
            is_success: true,
            message: 'payment succesful',
          });
        }

        this.hideModal();
      },
    );
  };

  close = () => {
    this.setState(
      {
        initiatingPayment: false,
        paymentURL: '',
        loadPaymentPage: false,
        pageLoading: false,
        messageFromWebView: '',
        data: {},
        webUrl: '',
        webViewRef: null,
        showRbSheet: false,
      },
      () => {
        this.RBSheet?.close();
      },
    );
  };

  getEnv = () => {
    return CheckoutInstance.state.env || 'prod';
  };

  startPayWithWallets = async (data, subMerchantKey, axiosConfig) => {
    this.setState({data: data});
    let {callbackFunction} = this.props;
    try {
      this.setState(
        {
          initiatingPayment: true,
        },
        async () => {
          const value = CheckoutInstance.state;

          const payload = {...data, environment: data.environment || 'live'};

          await this.initiatePayment(data, subMerchantKey, axiosConfig)
            .then(response => {
              console.log(
                'Response from initiate payment :' + JSON.stringify(response),
              );
            })
            .catch(error => {
              callbackFunction(error);
              EventRegister.emit('Failed', error);

              this.close();
              console.log(
                'Error response from startPayments method :' +
                  JSON.stringify(error),
              );
            });
        },
      );
    } catch (error) {
      console.log('Error from checkout ', error);
    }
  };

  openWebCheckout = async (data, jwtToken = '', subMerchantKey) => {
    this.setState({data: data});
    let {body} = await prepareWebRequestBody(data);

    return this.checkoutUI(body, jwtToken, subMerchantKey);
  };

  checkoutUI = async (data, JWTToken, subMerchantKey) => {
    let url = initiateURL[this.getEnv()] + 'paymentLink';

    let config = {
      ...data,
    };

    var body = config;
    let requestConfig = {
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${JWTToken}`,
        Accept: '*/*',
        'X-Chaipay-Client-Key': data?.chaipay_key,
        'Content-Type': 'application/json',
        ...(!isEmpty(subMerchantKey) && {
          'X-Chaipay-SubMerchant-Key': subMerchantKey,
        }),
      },
    };

    let response = await axiosMethods._callPostMethod(
      url,
      requestConfig,
      body,
      true,
    );

    if (response.status === 200 || response.status === 201) {
      this.setState({
        webUrl: response.data.payment_link,
      });
      this.RBSheet?.open();
      return response?.data;
    } else {
      return response;
    }
  };

  showModal = paymentLink => {
    EventRegister.emit('showiOSWebModal', {dismiss: true, paymentLink});
    setTimeout(() => {
      this.RBSheet?.open();
    }, 1250);
  };

  hideModal = () => {
    this.RBSheet?.close();
  };

  getTransactionStatusBasedOnTimeLimit = async data => {
    const currentTime = Date.now();
    let timeLimit = this.state.expiryTime;
    // Check if the time limit has been reached
    if (currentTime < timeLimit) {
      // Make request to second API
      return helpers
        .getTransactionStatus(data)
        .then(response => {
          // Handle response from second API
          if (response?.redirect_url) {
            this.setState({
              transactionStatusResponse: null,
            });
            //Linking.openURL(response?.redirect_url);
            Linking.emit('url', {url: response?.redirect_url});
          } else {
            this.setState({
              transactionStatusResponse: {...response, data: {...data}},
            });
            // Schedule next API call after 15 seconds
            setTimeout(() => {
              this.getTransactionStatusBasedOnTimeLimit(data);
            }, 15000); // 15 seconds in milliseconds
          }
          return response;
        })
        .catch(error => {
          console.error('Error fetching second API:', error);
          return error;
        });
    } else {
      this._onClose();
    }
  };

  componentDidMount() {
    this.setState({pageLoading: true});

    CheckoutInstance.state = this.props;

    const {redirectUrl, portOneKey, environment} = CheckoutInstance.state;
    const {callbackFunction} = this.props;
    AsyncStorage.setItem('DATA', JSON.stringify(this.props));
    let env = this.getEnv();

    Linking.removeAllListeners('url');
    Linking.addEventListener('url', async event => {
      //this.setPageLoading(true);
      try {
        let url = event?.url ?? 'none';
        console.log('Hey there I am called ', redirectUrl, '\nURL::::', url);
        if (url !== 'none' && url.startsWith(redirectUrl)) {
          this.close();

          let firstPart = url.split('?')[0];
          let paymentChannel = last(firstPart.split('/'));

          let dataFromLink = url.split('?')[1];

          if (dataFromLink) {
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
              params = {},
              match;
            while ((match = regex.exec(url))) {
              params[match[1]] = match[2];
            }

            let chaiRedirect = params.chai_redirect;

            if (paymentChannel === 'PAYPAL') {
              if (params.cancel === true) {
                callbackFunction(params);
                EventRegister.emit('Success', params);
              } else {
                let url = initiateURL[env] + 'capturePayment';
                let body = {
                  key: portOneKey,
                  pmt_channel: 'PAYPAL',
                  pmt_method: 'PAYPAL_ALL',
                  merchant_order_ref: params.merchantOrderRef,
                  order_ref: params.token,
                  channel_order_ref: params.token,
                  environment: environment,
                };

                let requestConfig = {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                };

                let response = await axiosMethods._callPostMethod(
                  url,
                  body,
                  requestConfig,
                );
                console.log('RESPONSE', response.data);

                callbackFunction(response.data);
                EventRegister.emit('Success', response.data);
                InAppBrowser.close();
              }
            } else {
              if (chaiRedirect === 'false') {
                const decodedObject = mapValues(params, value =>
                  decodeURIComponent(value.replace(/\+/g, ' ')),
                );
                callbackFunction(decodedObject);
                EventRegister.emit('Success', params);
              } else {
                let dataToBeSaved = await helpers._afterResponseFromGateway(
                  paymentChannel,
                  dataFromLink,
                  portOneKey,
                );
                console.log('Response after callback : ', dataToBeSaved);
                callbackFunction(dataToBeSaved);

                EventRegister.emit('Success', dataToBeSaved);

                this.setState({paymentURL: ''}, () => {
                  //this.close();
                });
              }
            }
          }
        } else {
          callbackFunction({
            message: `Something wrong with url ${url} and redirectURl ${redirectUrl}`,
          });
          this.close();
        }
      } catch (error) {
        console.log('Error occurred ', error);
        callbackFunction(error);
        EventRegister.emit('Failed', error);
      }
      this.setPageLoading(false);
    });
    this.startPaymentWithWalletsListener = EventRegister.addEventListener(
      'startPaymentWithWallets',
      async data => {
        this.setState({showRbSheet: false});

        let y = await this.startPayWithWallets(data.data, data.subMerchantKey);
      },
    );

    this.startPaymentWithoutTokenisationListener =
      EventRegister.addEventListener(
        'startPaymentWithoutTokenisation',
        async data => {
          let y = await this.startPayWithWallets(
            data.data,
            data.subMerchantKey,
          );
          // this.setState({ showRbSheet: true }, () => {
          //   EventRegister.emit("Dismiss", { data: true });
          //   setTimeout(() => {
          //     this.RBSheet?.open();
          //   }, 1250);
          // });
        },
      );

    this.startPaymentWithTokenisationListener = EventRegister.addEventListener(
      'startPaymentWithTokenisation',
      async data => {
        let y = await this.startNewCardPayment(
          data.savedTokenRes,
          data.data,
          data.JWTToken,
          data.clientKey,
          data.customerUUID,
          data.subMerchantKey,
        );
      },
    );

    this.startPaymentWithNewCardListener = EventRegister.addEventListener(
      'startPaymentWithNewCard',
      async data => {
        let y = await this.startNewCardPayment(
          data.savedTokenRes,
          data.data,
          data.JWTToken,
          data.clientKey,
          data.customerUUID,
          data.subMerchantKey,
        );
      },
    );

    this.startPaymentWithSavedCardListener = EventRegister.addEventListener(
      'startPaymentWithSavedCard',
      async data => {
        this.setState({showRbSheet: false});

        let y = await this.startSavedCardPayment(
          data.savedTokenRes,
          data.data,
          data.JWTToken,
          data.clientKey,
        );
      },
    );

    this.openWebCheckoutListener = EventRegister.addEventListener(
      'openWebCheckout',
      async data => {
        this.setState({showRbSheet: false});
        let y = await this.openWebCheckout(
          data.data,
          data.jwtToken,
          data.subMerchantKey,
        );
        data.callback(y);
      },
    );
    this.openWebListener = EventRegister.addEventListener(
      'showWebView',

      async data => {
        this.setState({pageLoading: true});

        this.setState(
          {
            paymentURL: data.deep_link || data.redirect_url,
          },
          () => {
            this.setState({
              initiatingPayment: false,
              pageLoading: false,
            });
            this.showModal(data.deep_link || data.redirect_url);
            this.setState({pageLoading: false});
          },
        );
      },
    );

    // this.getAvailablePaymentMethodsListener = EventRegister.addEventListener(
    //   "getAvailablePaymentMethods",
    //   async (data) => {
    //     let y = await helpers.fetchAvailablePaymentGateway(
    //       data.portOneKey,
    //       data.currency,
    //       data.subMerchantKey
    //     );
    //     data.callback(y);
    //   }
    // );

    // this.getTransactionStatusListener = EventRegister.addEventListener(
    //   "getTransactionStatus",
    //   async (data) => {
    //     let y = await helpers.getTransactionStatus(data.payload);
    //     data.callback(y);
    //   }
    // );

    return () => {
      Linking.removeEventListener('url');
      // EventRegister.removeEventListener(this.listener);
      // EventRegister.removeEventListener(this.startPaymentWithNewCard);
      // EventRegister.removeEventListener(this.startPaymentWithSavedCard);

      EventRegister.removeEventListener(this.openWebCheckoutListener);
    };
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.startPaymentWithSavedCardListener);
    EventRegister.removeEventListener(this.startPaymentWithNewCardListener);
    EventRegister.removeEventListener(this.startPaymentWithWalletsListener);
    EventRegister.removeEventListener(this.startPaymentWithoutTokenisation);
    EventRegister.removeEventListener(
      this.startPaymentWithTokenisationListener,
    );
    //EventRegister.removeEventListener(this.getAvailablePaymentMethodsListener);
  }

  render() {
    const {paymentURL, initiatingPayment, originList, webUrl} = this.state;

    let {checkoutButtonTitle, checkoutButtonColor} = this.props;

    const {webviewContainer, checkoutWebView, indicatorView} = styles;

    checkoutButtonTitle = initiatingPayment
      ? 'Please wait...'
      : checkoutButtonTitle || 'Checkout';
    checkoutButtonColor = checkoutButtonColor || 'green';

    return (
      <RBSheet
        customStyles={{
          container: {
            height: Platform.OS === 'ios' ? '100%' : '100%',
            backgroundColor: 'white',
          },
          draggableIcon: {
            backgroundColor: 'transparent',
          },
        }}
        closeOnDragDown={false}
        closeOnPressMask={true}
        animationType={'slide'}
        ref={ref => {
          this.RBSheet = ref;
        }}
        openDuration={250}>
        <SafeAreaView style={webviewContainer}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                marginLeft: 5,
              }}
              activeOpacity={0.5}
              onPress={this._onClose}>
              <Image
                source={require('../assets/close.png')}
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: 'stretch',
                  marginLeft: 10,
                  marginTop: 0,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 18,
                marginLeft: width / 2 - 90,
              }}>
              CHECKOUT
            </Text>
          </View>
          {paymentURL ? (
            <WebView
              originWhitelist={[
                ...originList,
                'http://',
                'https://',
                'intent://',
              ]}
              allowsBackForwardNavigationGestures
              onShouldStartLoadWithRequest={this._handleInvalidUrl}
              onNavigationStateChange={async event => {
                this.navigationChange(event);
              }}
              onLoadStart={() => {
                this.setState({pageLoading: true});
              }}
              onLoadEnd={() => {
                this.setState({pageLoading: false});
              }}
              scalesPageToFit
              cacheEnabled={false}
              onError={this._handleError}
              onHttpError={this._handleError}
              onMessage={this._onMessage}
              startInLoadingState={false}
              style={checkoutWebView}
              renderLoading={() => () => {
                return this.state.pageLoading ? null : null;
              }}
              javaScriptEnabled={true}
              source={{
                uri: paymentURL,
              }}
              domStorageEnabled={true}
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
              allowingReadAccessToURL={true}
              mixedContentMode={'always'}
              onFileDownload={
                ({nativeEvent: {downloadUrl}}) =>
                  console.log('DOWNLOAD File', downloadUrl)
                //downloadDocument(downloadUrl);
              }
            />
          ) : null}
          {webUrl || this.state.otpReceived ? (
            <WebView
              ref={ref => {
                this.setWebState(ref);
              }}
              allowsBackForwardNavigationGestures
              useWebkit={true}
              onShouldStartLoadWithRequest={this._handleInvalidUrl}
              originWhitelist={[...originList, 'http://', 'https://']}
              onLoadStart={() => {
                //this.requestReadSmsPermission();
                this.setState({pageLoading: true});
              }}
              onLoadEnd={() => {
                this.setState({pageLoading: false});
              }}
              javaScriptEnabledAndroid={true}
              onNavigationStateChange={this.navigationChanged}
              injectedJavaScript={this.injectWebViewData(
                this.state.receivedOTP,
              )}
              injectJavaScript={this.injectWebViewData(this.state.receivedOTP)}
              injectedJavaScriptForMainFrameOnly={false}
              onMessage={event => {}}
              scalesPageToFit
              cacheEnabled={true}
              javaScriptEnabled={true}
              source={{
                uri: webUrl,
              }}
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
              allowingReadAccessToURL={true}
              mixedContentMode={'always'}
              onFileDownload={
                ({nativeEvent: {downloadUrl}}) =>
                  console.log('DOWNLOAD File', downloadUrl)
                //downloadDocument(downloadUrl);
              }
            />
          ) : null}
          {/* {this.state.pageLoading ? (
            <View style={indicatorView}>
              <ActivityIndicator color={'red'} size={'large'} />
            </View>
          ) : null} */}
        </SafeAreaView>
      </RBSheet>
    );
  }
}

Checkout.propTypes = {
  paymentChannel: PropTypes.string,
  paymentMethod: PropTypes.string,
  merchantOrderId: PropTypes.string,
  amount: PropTypes.number,
  currency: PropTypes.string,
  successUrl: PropTypes.string,
  failureUrl: PropTypes.string,
  redirectUrl: PropTypes.string.isRequired,
  callbackUrl: PropTypes.string,
  signatureHash: PropTypes.string,
  chaipayKey: PropTypes.string,
  callbackFunction: PropTypes.func.isRequired,
  env: PropTypes.string,
  shippingDetails: PropTypes.object,
  billingDetails: PropTypes.object,
  orderDetails: PropTypes.array,
  checkoutButtonColor: PropTypes.string,
  checkoutButtonTitle: PropTypes.string,
  fetchHashUrl: PropTypes.string,
  secretKey: PropTypes.string,
};

Checkout.defaultProp = {
  paymentChannel: '',
  paymentMethod: '',
  merchantOrderId: '',
  amount: 0,
  currency: '',
  failureUrl: '',
  redirectUrl: '',
  successUrl: '',
  signatureHash: '',
  chaipayKey: '',
  checkoutButtonColor: 'green',
  checkoutButtonTitle: 'Checkout',
  env: 'prod',
};

export default Checkout;
