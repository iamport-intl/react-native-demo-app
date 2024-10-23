import {
  bodyParams,
  baseURL,
  initiateURL,
  requiredParams,
  webRequiredParams,
  webBodyParams,
  fetchTokenizationURL,
} from './constants';
import {HmacSHA256} from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import axios from 'axios';
import CheckoutInstance from './CheckoutInstance';

import {Platform} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import pkg from '../package.json';
import {isEmpty, omit} from 'lodash';
import RSA from 'react-native-rsa-native';

const getRequiredData = () => {
  let value = CheckoutInstance.state;
  return CheckoutInstance.state;
};

const getEnvironmentType = data => {
  return data?.environment || 'live';
};

const getPortOneKey = data => {
  return data?.portOneKey;
};

const getENV = data => {
  return data?.env ?? 'prod';
};

const isNetworkError = err => {
  return err?.code === 'ERR_NETWORK' || err?.message === 'Network Error';
};

const axiosMethods = {
  _callGetMethod: async (url, axiosConfig) => {
    let requestConfig = {
      headers: {
        ...axiosConfig?.headers,
        'device-details': JSON.stringify({
          os: 'ios',
          tech: 'reactNative_iOS',
          version: '2.8.5',
          platform: 'react-native',
        }),
      },
    };

    return new Promise((resolve, reject) => {
      console.log(`getURL : ${url} \n requestConfig:`, requestConfig);

      axios
        .get(url, requestConfig)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.log('error', error);
          if (isNetworkError(error)) {
            reject({message: 'No Interent Connection', status: 403});
          } else {
            if (error?.response) {
              reject(error?.response?.data || error?.response);
            } else {
              reject(error);
            }
          }
        });
    });
  },

  _callDeleteMethod: async (url, axiosConfig, bodyPart) => {
    let requestConfig = {
      headers: {
        'device-details': {
          os: Platform.OS,
          tech:
            Platform.OS === 'ios' ? 'reactNative_iOS' : 'reactNative_android',
          version: pkg.version,
          platform: 'react-native',
        },
      },
      ...axiosConfig,
    };
    return new Promise((resolve, reject) => {
      console.log(`getURL : ${url} \n requestConfig:`, requestConfig);

      axios
        .delete(url, requestConfig, bodyPart)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.log('error', error);
          if (isNetworkError(error)) {
            reject({message: 'No Interent Connection', status: 403});
          } else {
            if (error?.response) {
              reject(error?.response?.data);
            } else {
              reject(error);
            }
          }
        });
    });
  },

  _callPostMethod: async (url, config, bodyPart, showLogs = true) => {
    return new Promise((resolve, reject) => {
      let body = JSON.stringify(bodyPart);
      let requestConfig = {
        headers: {
          ...config.headers,
          'device-details': JSON.stringify({
            os: Platform.OS,
            tech:
              Platform.OS === 'ios' ? 'reactNative_iOS' : 'reactNative_android',
            version: pkg.version,
            platform: 'react-native',
          }),
        },
      };
      console.log(`POST URL: ${url}====body: ${body}===== `);
      axios
        .post(url, body, requestConfig)
        .then(response => {
          if (!showLogs) {
            console.log('Response : ' + JSON.stringify(response, null, 4));
          }
          resolve(response);
        })
        .catch(error => {
          if (!showLogs) {
            console.log('ERROR: ' + JSON.stringify(error, null, 4));
          }
          if (isNetworkError(error)) {
            resolve({message: 'No Interent Connection', status: 403});
          } else {
            if (error.response) {
              if (!showLogs) {
                console.log('error.response', error.response?.data);
              }
              resolve(
                error?.response?.data?.errors?.first || error?.response?.data,
              );
            } else {
              resolve(error);
            }
          }
        });
    });
  },
};

const isTooDark = hexcolor => {
  var r = parseInt(hexcolor.substr(1, 2), 16);
  var g = parseInt(hexcolor.substr(3, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  // Return new color if to dark, else return the original
  return yiq < 40;
};

const hexToRgb = (hexVal: string, alpha: number) => {
  var hex = hexVal || '#FF0000';
  hex = hex.replace('#', '');
  var r = parseInt(
    hex.length === 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2),
    16,
  );
  var g = parseInt(
    hex.length === 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4),
    16,
  );
  var b = parseInt(
    hex.length === 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6),
    16,
  );
  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
};

const formatNumber = (number, currency) => {
  if (typeof currency !== 'string') {
    return `${number}`;
  } else {
    let formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    })
      .format(number)
      .replace('THB', '฿')
      .replace('IDR', 'Rp')
      .replace('SGD', 'S$');
    return formattedNumber;
  }
};

const _prepareRequestBody = props => {
  let body = {...props};
  props = {source: 'mobile', ...props};

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
  const jsonParams = {};
  if (missingParams.length == 0) {
    Object.keys(body).forEach(param => {
      const jsonKey = bodyParams[param];
      if (jsonKey) {
        jsonParams[jsonKey] = body[param];
      }
    });
  }
  body = {...jsonParams};
  return {body, missingParams};
};

const prepareWebRequestBody = props => {
  let body = {...props};

  props = {
    source: 'mobile',
    mobileRedirectUrl: props?.redirectUrl,
    countryCode: props?.countryCode ?? props?.currency,
    ...props,
  };

  let missingParams = webRequiredParams.filter(item => {
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

  const jsonParams = {};

  if (missingParams.length == 0) {
    Object.keys(body).forEach(readableKey => {
      const jsonKey = webBodyParams[readableKey];
      if (jsonKey) {
        jsonParams[jsonKey] = body[readableKey];
      }
    });
  } else {
    console.log('missingParams', missingParams);
  }
  body = jsonParams;
  return {body, missingParams};
};

// prepareWebRequestBody = (props) => {
//   let body = {
//     ...props,
//     source: "mobile",
//     mobileRedirectUrl: props?.redirectUrl,
//   };

//   let missingParams = webRequiredParams.filter((item) => {
//     let output = false;
//     if (item.includes("/")) {
//       let keyMissing = item
//         .split("/")
//         .filter(
//           (key) => Object.keys(body).includes(key) === false || !props[key]
//         );
//       output = keyMissing.length === item.split("/").length;
//     } else {
//       output = Object.keys(body).includes(item) == false || !props[item];
//     }

//     return output;
//   });

//   const jsonParams = {};

//   if (missingParams.length == 0) {
//     Object.keys(body).forEach((readableKey) => {
//       const jsonKey = webBodyParams[readableKey];
//       if (jsonKey) {
//         jsonParams[jsonKey] = body[readableKey];
//       }
//     });
//   }
//   body = jsonParams;
//   return { body, missingParams };
// };
const getToken = async (cardDetails, JWTToken, clientKey) => {
  let token = await helpers.fetchTokenizationPublicKey(JWTToken, clientKey);

  var data = getRequiredData();

  let env = getENV(data);

  let environment = getEnvironmentType(data);

  if (token.data?.status_code === '2000') {
    //Get the public key
    let publicKey = `${token?.data?.content?.public_key}`;

    let encryptedCardNumber = cardDetails.card_number;
    let encryptedCvv = cardDetails.cvv;
    if (!isEmpty(publicKey) && !isEmpty(encryptedCardNumber)) {
      try {
        let encryptedCardNum = await RSA.encrypt(
          cardDetails.card_number,
          publicKey,
        );
        encryptedCardNumber = encryptedCardNum;
      } catch (error) {
        // An error occurred during encryption
        console.error('Encryption failed with card number:', error);
      }
      try {
        let encryptedCVV = await RSA.encrypt(cardDetails.cvv, publicKey);
        encryptedCvv = encryptedCVV;
      } catch (error) {
        // An error occurred during encryption
        console.error('Encryption failed with cvv:', error);
      }

      let url = fetchTokenizationURL[env];

      let body = {
        card_number: encryptedCardNumber,
        cardholder_name: cardDetails.card_holder_name,
        service_code: encryptedCvv,
        expiration_month: cardDetails.expiry_month,
        expiration_year: cardDetails.expiry_year,
        save_card: cardDetails.save_for_later,
        environment: environment || 'live',
      };

      let requestConfig = {
        headers: {
          'Content-Type': 'application/json',
          'X-Chaipay-Client-Key': clientKey,
          Authorization: `Bearer ${JWTToken}`,
        },
      };

      let response = await axiosMethods._callPostMethod(
        url,
        requestConfig,
        body,
      );
      return response;
    } else {
      return {
        data: {
          message: `RSA Encryption failed with the empty card number`,
        },
      };
    }
  }
};

const getPaymentStatus = () => {
  var data = getRequiredData();
  var env = getENV(data);
  return baseURL[env] + `api/capturePayment`;
};

const capturePaymentUrl = orderRef => {
  var data = getRequiredData();
  var env = getENV(data);
  return baseURL[env] + `api/transaction/${orderRef}/capture`;
};

const addCustomerUrl = clientKey => {
  var data = getRequiredData();
  var env = getENV(data);
  return baseURL[env] + `api/merchant/${clientKey}/customer`;
};

const addCustomerCardUrl = (customerId, clientKey) => {
  var data = getRequiredData();
  var env = getENV(data);
  return baseURL[env] + `api/customer/${clientKey}/${customerId}/add-card`;
};

const fetchCustomerCardsUrl = (customerId, clientKey) => {
  var data = getRequiredData();
  var env = getENV(data);
  return baseURL[env] + `api/customer/${clientKey}/${customerId}/list-cards`;
};

const deleteCustomerCardUrl = (customerId, clientKey) => {
  var data = getRequiredData();
  var env = getENV(data);
  return baseURL[env] + `api/customer/${clientKey}/${customerId}/delete-card`;
};

const initTokenizationReqURL = () => {
  var data = getRequiredData();
  var env = getENV(data);
  return baseURL[env] + `api/tokenization/createToken`;
};

const fetchRoutesUrl = routeId => {
  var data = getRequiredData();
  var env = getENV(data);

  let url =
    baseURL[env] +
    `api/txn-router/${routeId}/routes?environment=${getEnvironmentType(data)}`;
  return url;
};

const captureTransactionURL = orderRef => {
  var data = getRequiredData();
  var env = getENV(data);

  let url = baseURL[env] + `api/transaction/${orderRef}/capture`;
  return url;
};

const helpers = {
  getTransactionStatus: async data => {
    let url = getPaymentStatus();

    var body = {...data};
    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let response = await axiosMethods._callPostMethod(url, requestConfig, body);
    return response?.data ?? response;
  },

  generatePaymentLink: async (
    data,
    JWTToken,
    env,
    subMerchantKey,
    showLogs,
  ) => {
    let url = initiateURL[env] + 'paymentLink';

    let config = {
      ...data,
    };

    var body = config;
    let requestConfig = {
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
      showLogs,
    );
    return response?.data?.payment_link_ref;
  },

  getSignatureHashAndMerchntId: async (paymentRef, env) => {
    if (paymentRef === undefined) {
      return;
    }

    let url = initiateURL[env] + 'paymentLink/' + paymentRef;

    let response = await axiosMethods._callGetMethod(url);
    return response?.data?.content;
  },

  fetchTokenizationCardDetails: async (data, JWTToken, clientKey) => {
    return await getToken(data, JWTToken, clientKey);
  },
  fetchSavedCards: async (number, otp, clientKey, token) => {
    var data = getRequiredData();

    var env = getENV(data);

    var url =
      initiateURL[env] +
      'user/' +
      number +
      '/savedCard' +
      `${token ? '?' : `?otp=${otp}&`}environment=${getEnvironmentType(data)}`;

    let requestConfig = {
      headers:
        token !== undefined
          ? {
              Authorization: `Bearer ${token}`,
              'X-Chaipay-Client-Key': clientKey,
            }
          : {'X-Chaipay-Client-Key': clientKey},
    };
    return await axiosMethods._callGetMethod(url, requestConfig);
  },

  _afterResponseFromGateway: async (
    payChannel = '',
    queryString = '',
    clientKey,
  ) => {
    // var {paymentChannel} = this.state.data;
    var data = getRequiredData();

    var env = getENV(data);

    let paymentChannel = payChannel;
    let url =
      initiateURL[env] +
      'handleShopperRedirect/' +
      paymentChannel +
      '?chaiMobileSDK=true&' +
      queryString +
      `&environment=${getEnvironmentType(data)}`;
    console.log('URL after payment Gateway : ', url);
    let requestConfig = {
      headers: {
        Authorization: `Bearer ${clientKey}`,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(url, requestConfig)
        .then(response => {
          resolve(response?.data);
        })
        .catch(error => {
          if (error?.response) {
            reject(error?.response?.data);
          } else {
            reject({
              message: 'Something went wrong, please contact administrator',
              is_success: false,
            });
          }
        });
    });
  },

  fetchBankList: async (channelKey, bodyParams) => {
    var data = getRequiredData();

    var env = getENV(data);
    let url = initiateURL[env] + `bank-list/${channelKey}`;
    var body = bodyParams;
    let requestConfig = {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    try {
      let val = await axiosMethods._callPostMethod(url, requestConfig, body);
      return val?.data?.content;
    } catch (error) {
      return error;
    }
  },

  fetchDBTDetails: async portoneKey => {
    var data = getRequiredData();

    var env = getENV(data);
    let url =
      initiateURL[env] +
      `merchant/${portoneKey}dbt-bank-details?environment=${getEnvironmentType(
        data,
      )}`;
    var body = bodyParams;
    let requestConfig = {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    try {
      let val = await axiosMethods._callGetMethod(url, requestConfig);
      return val?.data?.content;
    } catch (error) {
      return error;
    }
  },

  fetchAvailablePaymentGateway: async (clientKey, currency, subMerchantKey) => {
    var data = getRequiredData();
    var env = getENV(data);
    let requestConfig = {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        ...(!isEmpty(subMerchantKey) && {
          'X-Chaipay-SubMerchant-Key': subMerchantKey,
        }),
      },
    };
    let url =
      baseURL[env] +
      `merchants/${clientKey}/paymethodsbyKey` +
      `?${
        currency ? `currency=${currency}&` : ''
      }environment=${getEnvironmentType(data)}`;

    try {
      let val = await axiosMethods._callGetMethod(url, requestConfig);

      return val;
    } catch (error) {
      return error;
    }
  },

  getOTP: async mobileNumber => {
    let data = getRequiredData();
    let env = getENV(data);
    let config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return await axiosMethods._callPostMethod(
      initiateURL[env] + 'verification/generateOTP/' + mobileNumber,
      config,
    );
  },

  startPayment: async (
    isSavedCards,
    savedTokenRes,
    data,
    JWTToken,
    clientKey,
    customerUUID,
    subMerchantKey,
  ) => {
    var token = '';
    var partial_card_number = '';
    var expiry_year = '';
    var expiry_month = '';
    var cardType = '';
    var savedCard = '';

    let requiredData = getRequiredData();
    let env = getENV(requiredData);
    let environment = getEnvironmentType(requiredData);
    let {body, missingParams} = await _prepareRequestBody({
      ...data,
      environment: environment,
    });
    if (missingParams.length !== 0) {
      return {
        val: {status: 500, 'missing params': `${missingParams}: missing`},
        data: data,
      };
    }
    if (isSavedCards) {
      token = savedTokenRes.token;
      partial_card_number =
        savedTokenRes.partial_card_number || savedTokenRes.card_number;
      expiry_month = savedTokenRes.expiry_month;
      expiry_year = savedTokenRes.expiry_year;
      cardType = savedTokenRes.type;
      savedCard = savedTokenRes.saved_card;
    } else {
      let tokenRes = await helpers.fetchTokenizationCardDetails(
        savedTokenRes,
        JWTToken,
        clientKey,
      );
      var attributes = tokenRes?.data?.content;
      token = attributes?.card_token;
      partial_card_number = attributes?.card_number;
      expiry_month = attributes?.expiration_month;
      expiry_year = attributes?.expiration_year;
      cardType = attributes?.card_type;
      savedCard = savedTokenRes.saved_card;
    }
    let cardDetails = {
      token: token,
      partial_card_number: partial_card_number,
      expiry_month: expiry_month,
      expiry_year: expiry_year,
      type: cardType,
      saved_card: savedCard,
    };

    if (!isEmpty(customerUUID) && savedTokenRes?.saved_card) {
      let val = await helpers.addCustomerCard(
        customerUUID,
        data.portOneKey,
        JWTToken,
        cardDetails,
        subMerchantKey,
      );
    }
    data = {
      ...body,
      token_params: cardDetails,
    };

    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...(!isEmpty(subMerchantKey) && {
          'X-Chaipay-SubMerchant-Key': subMerchantKey,
        }),
      },
    };
    try {
      let val = await axiosMethods._callPostMethod(
        initiateURL[env] + 'initiatePayment',
        requestConfig,
        data,
      );

      if (isEmpty(val?.data?.redirect_url)) {
        return {val: val, data: data};
      } else {
        EventRegister.emit('showWebView', val?.data);
        return {data: data};
      }
    } catch (error) {
      return {val: {...error}, data: data};
    }
  },

  saveCardDetails: async (
    savedTokenRes,
    JWTToken,
    clientKey,
    customerUUID,
    subMerchantKey,
  ) => {
    var token = '';
    var partial_card_number = '';
    var expiry_year = '';
    var expiry_month = '';
    var cardType = '';
    var savedCard = '';

    let requiredData = getRequiredData();
    let env = getENV(requiredData);
    let environment = getEnvironmentType(requiredData);

    let tokenRes = await helpers.fetchTokenizationCardDetails(
      savedTokenRes,
      JWTToken,
      clientKey,
    );
    var attributes = tokenRes?.data?.content;
    let cardDetails = {
      token: attributes?.card_token,
      partial_card_number: attributes?.card_number,
      expiry_month: attributes?.expiration_month,
      expiry_year: attributes?.expiration_year,
      type: attributes?.card_type,
      saved_card: savedTokenRes.saved_card,
    };

    if (!isEmpty(customerUUID)) {
      let val = await helpers.addCustomerCard(
        customerUUID,
        clientKey,
        JWTToken,
        cardDetails,
        subMerchantKey,
      );
      if (isEmpty(val?.data)) {
        return {data: val};
      } else {
        return val;
      }
    } else {
      return {
        data: {
          message:
            'User UUID is missing. Could not add card record for customer!',
          status_code: '4000',
          status_reason: 'INVALID_REQUEST',
        },
      };
    }
  },

  fetchTokenizationPublicKey: async (JWTToken, clientKey) => {
    var data = getRequiredData();
    var env = getENV(data);
    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Chaipay-Client-Key': clientKey,
        Authorization: `Bearer ${JWTToken}`,
      },
    };
    let url = baseURL[env] + `api/tokenization/public-key`;

    try {
      let val = await axiosMethods._callGetMethod(url, requestConfig);

      return val;
    } catch (error) {
      return error;
    }
  },

  fetchRoutes: async (clientKey, JWTToken) => {
    let url = fetchRoutesUrl(clientKey);
    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Chaipay-Client-Key': clientKey,
        Authorization: `Bearer ${JWTToken}`,
      },
    };

    try {
      let val = await axiosMethods._callGetMethod(url, requestConfig);

      return val;
    } catch (error) {
      return error;
    }
  },

  fetchCustomerCards: async (
    customerId,
    clientKey,
    JWTToken,
    subMerchantKey,
  ) => {
    let url = fetchCustomerCardsUrl(customerId, clientKey);
    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Chaipay-Client-Key': clientKey,
        Authorization: `Bearer ${JWTToken}`,
        ...(!isEmpty(subMerchantKey) && {
          'X-Chaipay-SubMerchant-Key': subMerchantKey,
        }),
      },
    };

    try {
      let val = await axiosMethods._callGetMethod(url, requestConfig);

      return val?.data;
    } catch (error) {
      return error;
    }
  },

  deleteCardForCustomerId: async (
    customerId,
    clientKey,
    JWTToken,
    cardData,
    subMerchantKey,
  ) => {
    let url = deleteCustomerCardUrl(customerId, clientKey);
    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Chaipay-Client-Key': clientKey,
        Authorization: `Bearer ${JWTToken}`,
        ...(!isEmpty(subMerchantKey) && {
          'X-Chaipay-SubMerchant-Key': subMerchantKey,
        }),
      },
    };
    let bodyPart = {
      ...cardData,
    };
    try {
      let val = await axiosMethods._callDeleteMethod(
        url,
        requestConfig,
        bodyPart,
      );

      return val;
    } catch (error) {
      return error;
    }
  },

  addCardForCustomerId: async (
    customerId,
    clientKey,
    JWTToken,
    cardData,
    subMerchantKey,
  ) => {
    let token = getToken(cardData, JWTToken, clientKey);
    if (token.status_reason === 'SUCCESS') {
      let updateCardDetails = cardData;
      updateCardDetails.cardNumber = token.content.cardNumber;
      updateCardDetails.expiryMonth = token.content.expirationMonth;
      updateCardDetails.expiryYear = token.content.expirationYear;
      updateCardDetails.type = token.content.cardType;
      updateCardDetails.token = token.content.cardToken;

      try {
        let val = await helpers.addCustomerCard(
          customerId,
          clientKey,
          JWTToken,
          updateCardDetails,
          subMerchantKey,
        );

        return val;
      } catch (error) {
        return error;
      }
    }
  },

  addCustomerCard: async (
    customerId,
    clientKey,
    JWTToken,
    cardData,
    subMerchantKey,
  ) => {
    let url = addCustomerCardUrl(customerId, clientKey);
    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Chaipay-Client-Key': clientKey,
        Authorization: `Bearer ${JWTToken}`,
        ...(!isEmpty(subMerchantKey) && {
          'X-Chaipay-SubMerchant-Key': subMerchantKey,
        }),
      },
    };
    let bodyPart = {
      ...cardData,
    };
    try {
      let val = await axiosMethods._callPostMethod(
        url,
        requestConfig,
        bodyPart,
      );
      return val;
    } catch (error) {
      return error;
    }
  },

  getCustomerData: async (customerID, clientKey, JWTToken) => {
    let url = `${addCustomerUrl(clientKey)}/${customerID}`;
    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Chaipay-Client-Key': clientKey,
        Authorization: `Bearer ${JWTToken}`,
      },
    };
    try {
      let val = await axiosMethods._callGetMethod(url, requestConfig);

      return val;
    } catch (error) {
      return error;
    }
  },

  addCustomer: async (customerData, clientKey, JWTToken, subMerchantKey) => {
    let url = addCustomerUrl(clientKey);
    let bodyPart = {
      ...customerData,
    };
    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Chaipay-Client-Key': clientKey,
        Authorization: `Bearer ${JWTToken}`,
        ...(!isEmpty(subMerchantKey) && {
          'X-Chaipay-SubMerchant-Key': subMerchantKey,
        }),
      },
    };

    try {
      let val = await axiosMethods._callPostMethod(
        url,
        requestConfig,
        bodyPart,
      );

      return val;
    } catch (error) {
      return error;
    }
  },

  captureTransactionAPI: async (transactionOrderRef, clientKey, JWTToken) => {
    let url = captureTransactionURL(transactionOrderRef);

    let requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Chaipay-Client-Key': clientKey,
        Authorization: `Bearer ${JWTToken}`,
      },
    };

    try {
      let val = await axiosMethods._callPostMethod(url, requestConfig);

      return val;
    } catch (error) {
      return error;
    }
  },

  fetchMerchantDetails: async (clientKey, JWTToken, subMerchantKey) => {
    var data = getRequiredData();
    var env = getENV(data);

    let url = baseURL[env] + `api/merchant/basic-info/${clientKey}`;

    let requestConfig = {
      headers: {
        Authorization: `Bearer ${JWTToken}`,
        'Content-Type': 'application/json',
        'X-Chaipay-Client-Key': clientKey,
        ...(!isEmpty(subMerchantKey) && {
          'X-Chaipay-SubMerchant-Key': subMerchantKey,
        }),
      },
    };
    try {
      let val = await axiosMethods._callGetMethod(url, requestConfig);
      return val?.data ?? val;
    } catch (error) {
      return error;
    }
  },
};

export {
  helpers,
  axiosMethods,
  _prepareRequestBody,
  prepareWebRequestBody,
  hexToRgb,
  formatNumber,
  isTooDark,
};
