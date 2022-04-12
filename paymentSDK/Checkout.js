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
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

import {
  bodyParams,
  requiredParams,
  initiateURL,
  api,
  fetchMerchantsURL,
  webRequiredParams,
  webBodyParams,
} from './constants';
import {HmacSHA256} from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import {isEmpty, last} from 'lodash';
import SmsListener from 'react-native-android-sms-listener';
import {helpers, _prepareRequestBody, axiosMethods} from './helper';

var SendIntentAndroid = require('react-native-send-intent');

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initiatingPayment: false,
      paymentURL: '',
      loadPaymentPage: false,
      showPaymentModal: false,
      pageLoading: true,
      messageFromWebView: '',
      secretHash: '',
      originList: ['momo://', 'zalopay://', 'intent://', 'toppay://'],
      env: props.env,
      data: {},
      webUrl: '',
      webViewRef: null,
    };

    this.paymentLinkWebView = React.createRef();
  }
  webview = null;

  injectWebViewData = numb => {
    console.log('OTP recieces', numb);

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
      console.log('1');
      if (await InAppBrowser.isAvailable()) {
        console.log('2');
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
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
        alert(JSON.stringify(result));
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error.message);
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

  startPaymentWithNewCard = async (savedTokenRes, data) => {
    console.log('ENTERED !$#');
    return await helpers.startPayment(false, savedTokenRes, data);
  };

  startPaymentWithSavedCard = async (savedTokenRes, data) => {
    return await helpers.startPayment(true, savedTokenRes, data);
  };

  // startPayment = async (isSavedCards, savedTokenRes, data) => {
  //   var token = '';
  //   var partial_card_number = '';
  //   var expiry_year = '';
  //   var expiry_month = '';
  //   var cardType = '';

  //   let {body, missingParams} = await _prepareRequestBody(data);

  //   if (isSavedCards) {
  //     token = savedTokenRes.token;
  //     partial_card_number = savedTokenRes.partial_card_number;
  //     expiry_month = savedTokenRes.expiry_month;
  //     expiry_year = savedTokenRes.expiry_year;
  //     cardType = savedTokenRes.type;
  //   } else {
  //     var tokenRes = await this.getToken(savedTokenRes);
  //     var attributes = tokenRes.data?.data?.attributes;
  //     token = attributes?.card_token;
  //     partial_card_number = attributes?.card_number;
  //     expiry_month = attributes?.expiration_month;
  //     expiry_year = attributes?.expiration_year;
  //     cardType = attributes?.card_type;
  //   }

  //   data = {
  //     ...body,
  //     token_params: {
  //       token: token,
  //       partial_card_number: partial_card_number,
  //       expiry_month: expiry_month,
  //       expiry_year: expiry_year,
  //       type: cardType,
  //     },
  //   };

  //   let requestConfig = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };

  //   let val = await axiosMethods._callPostMethod(
  //     initiateURL[this.getEnv()] + 'initiatePayment',
  //     data,
  //     requestConfig,
  //   );
  //   return {val: val, data: data};
  // };

  prepareWebRequestBody = async props => {
    let body = {};
    props = {...props};

    console.warn('Signature hash value :', props.signatureHash);

    webRequiredParams.forEach(param => {
      body[webBodyParams[param]] = props[param];
    });
    body[webBodyParams.signatureHash] = props.signatureHash;
    return {body};
  };

  initiatePayment = async data => {
    let {body, missingParams} = await _prepareRequestBody(data);
    let {callbackFunction} = this.props;
    let env = this.getEnv();
    if (missingParams.length === 0) {
      const {chaipayKey} = this.props;

      return new Promise((resolve, reject) => {
        let url = initiateURL[env] + api.initiatePayment;
        body = JSON.stringify(body);
        let requestConfig = {
          timeout: 30000,
          headers: {
            Authorization: `Bearer ${chaipayKey}`,
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
        };
        console.warn(
          `url : ${url}====body: ${body}===== requestConfig : ${JSON.stringify(
            requestConfig,
          )}`,
        );
        axios
          .post(url, body, requestConfig)
          .then(response => {
            console.warn('Response : ' + JSON.stringify(response));
            let data = response.data;
            let pmt_channel =
              JSON.parse(body).payment_channel_key ||
              JSON.parse(body).pmt_channel;

            if (data.redirect_url) {
              if (pmt_channel === 'PAYPAL') {
                console.log('ENTERED APYAP:');
                this.openLink(data.redirect_url);
              } else {
                this.setState(
                  {
                    paymentURL: data.redirect_url,
                    showPaymentModal: true,
                    initiatingPayment: false,
                  },
                  () => {
                    resolve(true);
                  },
                );
              }
            }
          })
          .catch(error => {
            this.setState(
              {
                initiatingPayment: false,
              },
              () => {
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
      callbackFunction({
        status: 'failure',
        message: errorMessage,
      });
      return;
    }
  };

  // _handleInvalidUrl = event => {
  //   const {redirectUrl} = this.props;
  //   const {originList} = this.state;
  //   let url = event.url;
  //   let externalUrlFor = originList.filter(origin => url.startsWith(origin));
  //   let openUrlInternally =
  //     url.startsWith(redirectUrl) === false && externalUrlFor.length === 0;
  //   console.log('openUrl', url, 'RedirectUrl', redirectUrl);
  //   if (!openUrlInternally) {
  //     Linking.openURL(url).catch(error => {
  //       this._handleError(error);
  //     });
  //   }
  //   return openUrlInternally;
  // };

  _handleInvalidUrl = event => {
    const {redirectUrl} = this.props;
    const {originList} = this.state;
    let url = event.url;
    // let externalUrlFor = originList.filter(origin => {
    //   let splitOrigin = origin.split('*')[0];
    //   console.log('splitOrigin', splitOrigin);

    //   return url.startsWith(splitOrigin);
    // });
    let externalUrlFor = originList.filter(origin => url.startsWith(origin));

    let openUrlInternally =
      url.startsWith(redirectUrl) === false && externalUrlFor.length === 0;

    if (!openUrlInternally) {
      if (url.startsWith('http') || url.startsWith('https')) {
        this.setState({paymentURL: url});
      } else {
        //url.startsWith('intent://') && Platform.OS === 'android';

        if (false) {
          console.log('490');

          SendIntentAndroid.openChromeIntent(url);
        } else {
          console.log('590');

          this.setState({paymentURL: ''});

          Linking.openURL(url).catch(error => {
            this._handleError(error);
          });
        }
      }
    }
    return openUrlInternally;
  };

  _handleError = error => {
    const {nativeEvent} = error;
    const {callbackFunction} = this.props;
    this.setState(
      {
        pageLoading: false,
        showPaymentModal: false,
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
      console.warn('event persist exists:');
      event.persist();
      event.preventDefault();
    }
    const {callbackFunction} = this.props;
    console.warn('ON message called s: ' + JSON.stringify(event));
    this.setState(
      {
        pageLoading: false,
        messageFromWebView: event.nativeEvent.data,
        showPaymentModal: false,
      },
      () => callbackFunction(this.state.messageFromWebView),
    );
  };

  _onClose = () => {
    const {callbackFunction} = this.props;
    console.log('Fishy');
    this.setState(
      {
        initiatingPayment: false,
        paymentURL: '',
        loadPaymentPage: false,
        showPaymentModal: false,
        pageLoading: false,
        messageFromWebView: '',
      },
      () => {
        callbackFunction({is_success: false, message: 'Modal closed'});
      },
    );
  };

  close = () => {
    this.setState(
      {
        initiatingPayment: false,
        paymentURL: '',
        loadPaymentPage: false,
        showPaymentModal: false,
        pageLoading: false,
        messageFromWebView: '',
      },
      () => {},
    );
  };

  getEnv = () => {
    return this.props.env || 'prod';
  };

  startPaymentwithWallets = data => {
    this.setState({data: data});
    let {callbackFunction} = this.props;
    try {
      this.setState(
        {
          initiatingPayment: true,
        },
        () => {
          this.initiatePayment(data)
            .then(response => {
              console.warn('Response from api :' + JSON.stringify(response));
            })
            .catch(error => {
              callbackFunction(error);
              this.close();
              console.warn('Error response from api :' + JSON.stringify(error));
            });
        },
      );
    } catch (error) {
      console.warn('Error from checkout ', error);
    }
  };

  openCheckoutUI = async (data, jwtToken = '') => {
    this.setState({data: data});
    let {body} = await this.prepareWebRequestBody(data);

    this.checkoutUI(body, jwtToken);
  };

  checkoutUI = async (data, JWTToken) => {
    let url = initiateURL[this.getEnv()] + 'paymentLink';
    // TODO: Change
    //let url = initiateURL[this.state.env] + 'paymentLink';

    let config = {...data};

    config.signature_hash = helpers.createHash(
      config.chaipay_key,
      config.amount,
      config.currency,
      config.failure_url,
      config.merchant_order_id,
      config.success_url,
      this.props.secretKey,
    );

    var body = config;
    let requestConfig = {
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${JWTToken}`,
        Accept: '*/*',
        'X-Chaipay-Client-Key': data.chaipay_key,
        'Content-Type': 'application/json',
      },
    };

    let response = await axiosMethods._callPostMethod(url, body, requestConfig);

    console.log('::::::::::,', this.webview);

    //TODO:
    if (response.status === 200 || response.status === 201) {
      this.setState({
        showPaymentModal: true,
        webUrl: response.data.payment_link,
      });
    } else {
    }
  };

  componentDidMount() {
    const {redirectUrl, callbackFunction} = this.props;
    AsyncStorage.setItem('DATA', JSON.stringify(this.props));

    Linking.removeAllListeners('url');
    Linking.addEventListener('url', async event => {
      //this.setPageLoading(true);
      try {
        let url = event?.url ?? 'none';
        console.warn('Hey there I am called ', redirectUrl, '\nURL::::', url);
        if (url !== 'none' && url.startsWith(redirectUrl)) {
          this.close();

          let firstPart = url.split('?')[0];
          let paymentChannel = last(firstPart.split('/'));

          console.log('URL ka first aprt', firstPart, paymentChannel);

          let dataFromLink = url.split('?')[1];

          if (dataFromLink) {
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
              params = {},
              match;
            while ((match = regex.exec(url))) {
              params[match[1]] = match[2];
            }

            let token = params.tokenization_possible;

            if (token) {
              console.log('Token');
              console.log(params);

              callbackFunction(params);
            } else {
              let dataToBeSaved = await helpers._afterResponseFromGateway(
                paymentChannel !== 'checkout'
                  ? paymentChannel
                  : this.state.data.paymentChannel,
                dataFromLink,
                this.state.data.paymentChannel,
                this.props.chaipayKey,
              );
              console.warn('Response after callback : ', dataToBeSaved);
              callbackFunction(dataToBeSaved);
            }
          }
        }
      } catch (error) {
        console.warn('Error occurred ', error);
        callbackFunction(error);
      }
      this.setPageLoading(false);
    });
    return () => {
      Linking.removeEventListener('url');
    };
  }

  // componentWillUnmount() {
  //   Linking.removeAllListeners('url');
  // }

  render() {
    const {
      showPaymentModal,
      paymentURL,
      initiatingPayment,
      originList,
      webUrl,
    } = this.state;
    let {
      checkoutButtonTitle,
      checkoutButtonColor,
      checkoutButton,
      closeButton,
    } = this.props;
    const {
      webviewContainer,
      checkoutWebView,
      indicatorView,
      checkOutViewStyle,
      checkoutButtonTitleStyle,
    } = styles;
    checkoutButtonTitle = initiatingPayment
      ? 'Please wait...'
      : checkoutButtonTitle || 'Checkout';
    checkoutButtonColor = checkoutButtonColor || 'green';

    return (
      <View>
        <Modal
          presentationStyle="fullScreen"
          animationType="fade"
          statusBarTranslucent={false}
          onRequestClose={this._onClose}
          visible={showPaymentModal}>
          <SafeAreaView style={webviewContainer}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{marginLeft: 5}}
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
                onShouldStartLoadWithRequest={this._handleInvalidUrl}
                onNavigationStateChange={this._handleInvalidUrl}
                onLoadStart={() => {
                  this.setState({
                    pageLoading: true,
                  });
                }}
                onLoadEnd={() => {
                  this.setState({
                    pageLoading: false,
                  });
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
                source={{uri: paymentURL}}
              />
            ) : null}
            {webUrl || this.state.otpReceived ? (
              <WebView
                ref={ref => {
                  this.setWebState(ref);
                }}
                useWebkit={true}
                onShouldStartLoadWithRequest={this._handleInvalidUrl}
                originWhitelist={[...originList, 'http://', 'https://']}
                onLoadStart={() => {
                  this.requestReadSmsPermission();
                  this.setState({
                    pageLoading: true,
                  });
                }}
                onLoadEnd={() => {
                  this.setState({
                    pageLoading: false,
                  });
                }}
                javaScriptEnabledAndroid={true}
                onNavigationStateChange={this.navigationChanged}
                injectedJavaScript={this.injectWebViewData(
                  this.state.receivedOTP,
                )}
                injectJavaScript={this.injectWebViewData(
                  this.state.receivedOTP,
                )}
                injectedJavaScriptForMainFrameOnly={false}
                onMessage={event => {
                  alert(event);
                  console.log('event: ', event);
                }}
                scalesPageToFit
                cacheEnabled={true}
                javaScriptEnabled={true}
                source={{uri: webUrl}}
              />
            ) : null}
            {/* {this.state.pageLoading ? (
              <View style={indicatorView}>
                <ActivityIndicator color={'#6464e7'} size={'large'} />
              </View>
            ) : null} */}
          </SafeAreaView>
        </Modal>
      </View>
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
  shippingAddress: PropTypes.object,
  billingAddress: PropTypes.object,
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
let width = Dimensions.get('screen').width;
let height = Dimensions.get('screen').height;
const styles = StyleSheet.create({
  indicatorView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webviewContainer: {
    flex: 1,
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

export default Checkout;
