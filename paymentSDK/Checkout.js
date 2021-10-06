import React from 'react';
import {
  View,
  Dimensions,
  Linking,
  Modal,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import axios from 'axios';
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
import {includes, last} from 'lodash';
import {env} from 'process';

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
      originList: ['momo://', 'zalopay://'],
      env: 'prod',
      data: {},
      webUrl: '',
    };
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

  _createHash = (data, secretKey) => {
    let message = '';
    message =
      'amount=' +
      encodeURIComponent(data.amount) +
      '&currency=' +
      encodeURIComponent(data.currency) +
      '&failure_url=' +
      encodeURIComponent(data.failure_url) +
      '&merchant_order_id=' +
      encodeURIComponent(data.merchant_order_id) +
      '&pmt_channel=' +
      encodeURIComponent(data.pmt_channel) +
      '&pmt_method=' +
      encodeURIComponent(data.pmt_method) +
      '&success_url=' +
      encodeURIComponent(data.success_url);

    let hash = HmacSHA256(message, secretKey);
    let signatureHash = Base64.stringify(hash);
    return signatureHash;
  };

  createHash = (
    key,
    amount,
    currency,
    failureUrl,
    merchantOrderId,
    successUrl,
  ) => {
    let mainParams =
      'amount=' +
      encodeURIComponent(amount) +
      '&client_key=' +
      encodeURIComponent(key) +
      '&currency=' +
      encodeURIComponent(currency) +
      '&failure_url=' +
      encodeURIComponent(failureUrl) +
      '&merchant_order_id=' +
      encodeURIComponent(merchantOrderId) +
      '&success_url=' +
      encodeURIComponent(successUrl);

    console.log(mainParams);
    // const secretKey =
    //   '0e94b3232e1bf9ec0e378a58bc27067a86459fc8f94d19f146ea8249455bf242';
    const secretKey =
      'a3b8281f6f2d3101baf41b8fde56ae7f2558c28133c1e4d477f606537e328440';

    let hash = HmacSHA256(mainParams, secretKey);
    let signatureHash = Base64.stringify(hash);

    return signatureHash;
  };
  _fetchHash = async props => {
    this.setPageLoading(true);
    let secretHash = '';
    const {
      paymentChannel,
      paymentMethod,
      failureUrl,
      successUrl,
      chaipayKey,
      amount,
      currency,
      fetchHashUrl,
      merchantOrderId,
      secretKey,
      callbackFunction,
    } = props;
    let data = {
      key: chaipayKey,
      pmt_channel: paymentChannel,
      pmt_method: paymentMethod,
      merchant_order_id: merchantOrderId,
      amount: amount,
      currency: currency,
      success_url: successUrl,
      failure_url: failureUrl,
    };
    if (!fetchHashUrl && !secretKey) {
      return secretHash;
    } else if (fetchHashUrl == undefined) {
      secretHash = this._createHash(data, secretKey);
    } else {
      let url = fetchHashUrl;
      let body = data;

      let requestConfig = {
        timeout: 30000,
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      };
      try {
        let response = await axios.post(url, body, requestConfig);
        secretHash = response.data.hash;
      } catch (err) {
        callbackFunction({
          status: 'failure',
          message: err,
        });
      }
    }
    this.setPageLoading(false);
    return secretHash;
  };

  getOTP = async mobileNumber => {
    // var number = this.props["billingAddress"]?.billing_phone;
    let config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return await this._callPostMethod(
      initiateURL[this.getEnv()] + 'verification/generateOTP/' + mobileNumber,
      {},
      config,
    );
  };

  fetchSavedCards = async (number, otp) => {
    var url =
      initiateURL[this.getEnv()] + 'user/' + number + '/savedCard?otp=' + otp;

    return await this._callGetMethod(url);
  };

  fetchAvailablePaymentGateway = async () => {
    let url =
      fetchMerchantsURL[this.getEnv()] +
      'merchants/SglffyyZgojEdXWL/paymethodsbyKey';

    let val = await this._callGetMethod(url);
    return val;
  };

  _callGetMethod = async url => {
    return new Promise((resolve, reject) => {
      console.warn(`url : ${url}`);
      axios
        .get(url)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          resolve(error);
        });
    });
  };
  _callPostMethod = async (url, bodyPart, config) => {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify(bodyPart);
      let requestConfig = config;
      console.warn(
        `url : ${url}====body: ${body}===== requestConfig : ${JSON.stringify(
          requestConfig,
        )}`,
      );
      axios
        .post(url, body, requestConfig)
        .then(response => {
          console.warn('Response : ' + JSON.stringify(response, null, 4));
          resolve(response);
        })
        .catch(error => {
          console.warn('ERROR: ' + JSON.stringify(error, null, 4));
          resolve(error);
        });
    });
  };

  getToken = async cardDetails => {
    let url =
      'https://pci.channex.io/api/v1/cards?api_key=0591dde04c764d8b976b05ef109ecf1a';

    let body = {
      card: {
        card_number: cardDetails.card_number,
        cardholder_name: cardDetails.card_holder_name,
        service_code: cardDetails.cvv,
        expiration_month: cardDetails.expiry_month,
        expiration_year: cardDetails.expiry_year,
      },
    };
    console.log('Token Response', body);

    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let response = await this._callPostMethod(url, body, requestConfig);
    console.log('Token Response', response);
    return response;
  };

  startPaymentWithNewCard = async (savedTokenRes, data) => {
    return await this.startPayment(false, savedTokenRes, data);
  };

  startPaymentWithSavedCard = async (savedTokenRes, data) => {
    return await this.startPayment(true, savedTokenRes, data);
  };

  startPayment = async (isSavedCards, savedTokenRes, data) => {
    var token = '';
    var partial_card_number = '';
    var expiry_year = '';
    var expiry_month = '';
    var cardType = '';

    let {body, missingParams} = await this._prepareRequestBody(data);

    if (isSavedCards) {
      token = savedTokenRes.token;
      partial_card_number = savedTokenRes.partial_card_number;
      expiry_month = savedTokenRes.expiry_month;
      expiry_year = savedTokenRes.expiry_year;
      cardType = savedTokenRes.type;
    } else {
      var tokenRes = await this.getToken(savedTokenRes);
      var attributes = tokenRes.data?.data?.attributes;
      token = attributes?.card_token;
      partial_card_number = attributes?.card_number;
      expiry_month = attributes?.expiration_month;
      expiry_year = attributes?.expiration_year;
      cardType = attributes?.card_type;
    }

    data = {
      ...body,
      token_params: {
        token: token,
        partial_card_number: partial_card_number,
        expiry_month: expiry_month,
        expiry_year: expiry_year,
        type: cardType,
      },
    };

    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let val = await this._callPostMethod(
      initiateURL[this.getEnv()] + 'initiatePayment',
      data,
      requestConfig,
    );
    return {val: val, data: data};
  };

  _prepareRequestBody = async props => {
    let body = {};
    props = {...props};
    console.log('testing', props);
    props.signatureHash = await this._fetchHash({...props});
    console.warn('Signature hash value : ', props.signatureHash);
    let missingParams = requiredParams.filter(item => {
      let output = false;
      if (item.includes('/')) {
        let keyMissing = item
          .split('/')
          .filter(
            key => Object.keys(props).includes(key) == false || !props[key],
          );
        output = keyMissing.length == item.split('/').length;
      } else {
        output = Object.keys(props).includes(item) == false || !props[item];
      }
      return output;
    });

    if (missingParams.length == 0) {
      requiredParams.forEach(param => {
        body[bodyParams[param]] = props[param];
      });
      body[bodyParams.signatureHash] = props.signatureHash;
    }
    return {body, missingParams};
  };

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
    let {body, missingParams} = await this._prepareRequestBody(data);
    let {callbackFunction} = this.props;
    let env = this.getEnv();
    if (missingParams.length === 0) {
      const {chaipayKey} = data;
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

            if (data.redirect_url) {
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

  _handleInvalidUrl = event => {
    const {redirectUrl} = this.props;
    const {originList} = this.state;
    let url = event.url;
    let externalUrlFor = originList.filter(origin => url.startsWith(origin));
    let openUrlInternally =
      url.startsWith(redirectUrl) === false && externalUrlFor.length === 0;
    console.log('openUrl', url, 'RedirectUrl', redirectUrl);
    if (!openUrlInternally) {
      Linking.openURL(url).catch(error => {
        this._handleError(error);
      });
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

  getEnv = () => {
    return this.props.env || 'prod';
  };

  _afterResponseFromGateway = (payChannel = '', queryString = '') => {
    var {paymentChannel, chaipayKey} = this.state.data;
    paymentChannel = payChannel;
    console.log('paymentChannel', paymentChannel, 'chaipayKey', chaipayKey);
    let url =
      initiateURL[this.getEnv()] +
      'handleShopperRedirect/' +
      paymentChannel +
      '?chaiMobileSDK=true&' +
      queryString;
    console.warn('URL after payment Gateway : ', url);
    let requestConfig = {
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${chaipayKey}`,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(url, requestConfig)
        .then(response => {
          console.warn('Response after callback : ' + JSON.stringify(response));
          resolve(response.data);
        })
        .catch(error => {
          if (error.response) {
            reject(error.response.data);
          } else {
            reject({
              message: 'Something went wrong, please contact administrator',
              is_success: false,
            });
          }
        });
    });
  };

  startPaymentwithWallets = data => {
    this.setState({data: data});
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
    let url = 'https://dev-api.chaipay.io/api/paymentLink';
    // TODO: Change
    //let url = initiateURL[this.state.env] + 'paymentLink';

    let config = {...data};

    config.signature_hash = this.createHash(
      config.chaipay_key,
      config.amount,
      config.currency,
      config.failure_url,
      config.merchant_order_id,
      config.success_url,
    );

    console.log('Signature', config.signature_hash);

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

    let response = await this._callPostMethod(url, body, requestConfig);

    if (response.status === 200 || response.status === 201) {
      this.setState({
        showPaymentModal: true,
        webUrl: response.data.payment_link,
      });
    }
  };

  componentDidMount() {
    const {redirectUrl, callbackFunction} = this.props;
    Linking.removeAllListeners('url');
    Linking.addEventListener('url', async event => {
      this.setPageLoading(true);
      try {
        let url = event?.url ?? 'none';
        console.warn('Hey there I am called ', redirectUrl, '\nURL::::', url);
        if (url !== 'none' && url.startsWith(redirectUrl)) {
          this._onClose();

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
              callbackFunction(params);
            } else {
              let dataToBeSaved = await this._afterResponseFromGateway(
                paymentChannel,
                dataFromLink,
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

  componentWillUnmount() {
    Linking.removeAllListeners('url');
  }

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
                originWhitelist={[...originList, 'http://', 'https://']}
                onShouldStartLoadWithRequest={this._handleInvalidUrl}
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
                renderLoading={() => (
                  <ActivityIndicator color={'#6464e7'} size={'large'} />
                )}
                javaScriptEnabled={true}
                source={{uri: paymentURL}}
              />
            ) : null}
            {webUrl ? (
              <WebView
                injectedJavaScriptBeforeContentLoaded={`
    window.onerror = function(message, sourcefile, lineno, colno, error) {
      alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
      console.log("Message: ", message,  " - Source: ",sourcefile ," Line: " , lineno , ":" + colno)
      return true;
    };
    true;
  `}
                onShouldStartLoadWithRequest={this._handleInvalidUrl}
                originWhitelist={[...originList, 'http://', 'https://']}
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
                javaScriptEnabled={true}
                source={{uri: webUrl}}
              />
            ) : null}
            {this.state.pageLoading ? (
              <View style={indicatorView}>
                <ActivityIndicator color={'#6464e7'} size={'large'} />
              </View>
            ) : null}
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
