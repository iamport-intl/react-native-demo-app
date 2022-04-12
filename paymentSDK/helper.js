import {
  bodyParams,
  fetchMerchantsURL,
  initiateURL,
  requiredParams,
} from './constants';
import {HmacSHA256} from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getENV = async () => {
  try {
    const value = await AsyncStorage.getItem('DATA');
    if (value !== null) {
      return JSON.parse(value)?.env;
    }
  } catch (error) {
    // Error retrieving data
    return 'dev';
  }
};

const getChaipayKey = async () => {
  try {
    const value = await AsyncStorage.getItem('DATA');

    if (value !== null) {
      // We have data!!
      return JSON.parse(value)?.chaipayKey;
    }
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const axiosMethods = {
  _callGetMethod: async (url, requestConfig) => {
    return new Promise((resolve, reject) => {
      console.warn(`url : ${url}`);
      axios
        .get(url, requestConfig)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.log('error', error);
          if (error.response) {
            console.log(error.response.data);
            resolve(error.response.data);
          } else {
            resolve(error);
          }
        });
    });
  },

  _callPostMethod: async (url, bodyPart, config) => {
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
          if (error.response) {
            console.log(error.response.data);
            resolve(error.response.data);
          } else {
            resolve(error);
          }
        });
    });
  },
};
const hashes = {
  _createHash: (data, secretKey) => {
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
  },
};

const _prepareRequestBody = async props => {
  let body = {};
  props = {...props};
  props.signatureHash = await helpers._fetchHash({...props});
  console.warn('Signature hash value : ', props.signatureHash);
  let missingParams = requiredParams.filter(item => {
    let output = false;
    if (item.includes('/')) {
      let keyMissing = item
        .split('/')
        .filter(
          key => Object.keys(props).includes(key) === false || !props[key],
        );
      output = keyMissing.length === item.split('/').length;
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

const getToken = async cardDetails => {
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

  let response = await axiosMethods._callPostMethod(url, body, requestConfig);
  console.log('Token Response', response);
  return response;
};

const helpers = {
  fetchSavedCards: async (number, otp, token) => {
    var chaipayKey = await getChaipayKey();
    var env = await getENV();

    var url =
      initiateURL[env] +
      'user/' +
      number +
      '/savedCard' +
      `${token ? '' : `?otp=${otp}`}`;

    let requestConfig = {
      headers:
        token !== undefined
          ? {
              Authorization: `Bearer ${token}`,
              'X-Chaipay-Client-Key': chaipayKey,
            }
          : {'X-Chaipay-Client-Key': chaipayKey},
    };
    console.log('headers', requestConfig);
    return await axiosMethods._callGetMethod(url, requestConfig);
  },

  createHash: (
    key,
    amount,
    currency,
    failureUrl,
    merchantOrderId,
    successUrl,
    secretKey,
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

    let hash = HmacSHA256(mainParams, secretKey);
    let signatureHash = Base64.stringify(hash);

    return signatureHash;
  },

  _fetchHash: async props => {
    //this.setPageLoading(true);
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
      secretHash = hashes._createHash(data, secretKey);
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
    // this.setPageLoading(false);
    return secretHash;
  },

  _afterResponseFromGateway: async (
    payChannel = '',
    queryString = '',
    paymentChannel,
  ) => {
    // var {paymentChannel} = this.state.data;
    var chaipayKey = await getChaipayKey();
    var env = await getENV();
    paymentChannel = payChannel;
    console.log('env', env);

    console.log('initiateURL', initiateURL[env]);

    let url =
      initiateURL[env] +
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
  },

  fetchAvailablePaymentGateway: async () => {
    var chaipayKey = await getChaipayKey();

    var env = await getENV();
    let currency = 'SGD';
    let url =
      fetchMerchantsURL[env] +
      `merchants/${chaipayKey}/paymethodsbyKey` +
      `currency=${currency};
}`;

    console.log('URL', url);
    let val = await axiosMethods._callGetMethod(url);
    return val;
  },

  getOTP: async mobileNumber => {
    // var number = this.props["billingAddress"]?.billing_phone;
    let env = await getENV();
    let config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return await axiosMethods._callPostMethod(
      initiateURL[env] + 'verification/generateOTP/' + mobileNumber,
      {},
      config,
    );
  },

  startPayment: async (isSavedCards, savedTokenRes, data) => {
    var token = '';
    var partial_card_number = '';
    var expiry_year = '';
    var expiry_month = '';
    var cardType = '';

    let env = await getENV();
    let {body, missingParams} = await _prepareRequestBody(data);

    if (isSavedCards) {
      token = savedTokenRes.token;
      partial_card_number = savedTokenRes.partial_card_number;
      expiry_month = savedTokenRes.expiry_month;
      expiry_year = savedTokenRes.expiry_year;
      cardType = savedTokenRes.type;
    } else {
      var tokenRes = await getToken(savedTokenRes);
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

    let val = await axiosMethods._callPostMethod(
      initiateURL[env] + 'initiatePayment',
      data,
      requestConfig,
    );

    console.log('VALUE', val);
    return {val: val, data: data};
  },
};

export {helpers, axiosMethods, _prepareRequestBody};
