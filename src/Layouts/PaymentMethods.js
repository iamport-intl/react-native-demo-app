import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import {first, filter, isEmpty, sumBy, values} from 'lodash';
import {hexToRgb, formatNumber} from '../helper';

import {
  APP_THEME_COLOR,
  BOLD,
  strings,
  TRANSPARENT,
  WHITE_COLOR,
  IMAGE_BACKGROUND_COLOR,
} from '../constants.js';
import DashedLine from '../subElements/DashedLine';
import Indicator from '../../assets/indicator.svg';
import Wallet from '../../assets/wallet.svg';
import Card from '../../assets/card.svg';

import {helpers} from '../helper';
import PayNowButton from '../PayNowButton';
import CreditCardForm from './CreditCardForm.js';
import WalletView from './WalletView.js';

//import TextField from "../helpers/TextField";
const {width, height} = Dimensions.get('screen');
class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {walletsList: [], showCreditCardUI: false};
  }

  componentDidMount() {
    helpers
      .fetchAvailablePaymentGateway()
      .then(data => {
        let filteredWalletList = filter(data?.data?.WALLET, item => {
          return item.is_enabled;
        });

        let filterCardList = filter(data?.data?.CARD, item => {
          return (
            item.is_default &&
            item.is_enabled &&
            item.sub_type.includes('INT_CREDIT_DEBIT_CARD')
          );
        });

        let filteredATMCardList = filter(data?.data?.CARD, item => {
          return (
            item.is_default &&
            item.is_enabled &&
            item.sub_type.includes('ATM_CARD')
          );
        });

        let filteredBankTransferList = filter(
          data?.data?.BANK_TRANSFER,
          item => {
            return (
              item.is_default &&
              item.is_enabled &&
              item.sub_type.includes('MOBILE_BANK')
            );
          },
        );

        let filteredBNPLList = filter(data?.data?.BNPL, item => {
          return item.is_enabled && item.sub_type.includes('BNPL');
        });

        let filteredCODLList = filter(data?.data?.COD, item => {
          return item.is_enabled && item.sub_type.includes('COD');
        });
        let filteredCryptoList = filter(data?.data?.CRYPTO, item => {
          return (
            item.is_default &&
            item.is_enabled &&
            item.sub_type.includes('CRYPTO')
          );
        });
        let filteredDirectBankTransferList = filter(
          data?.data?.DIRECT_BANK_TRANSFER,
          item => {
            return (
              item.is_enabled && item.sub_type.includes('DIRECT_BANK_TRANSFER')
            );
          },
        );
        let filteredInstallmentList = filter(data?.data?.INSTALLMENT, item => {
          if (item.payment_channel_key === 'GBPRIMEPAY') {
            return (
              item.is_default &&
              item.is_enabled &&
              item.is_merchant_sponsored &&
              item.sub_type.includes('INSTALLMENT')
            );
          } else {
            return (
              item.is_default &&
              item.is_enabled &&
              item.sub_type.includes('INSTALLMENT')
            );
          }
        });

        let filteredNetBankingList = filter(data?.data?.NET_BANKING, item => {
          return item.is_enabled && item.sub_type.includes('NET_BANKING');
        });

        let filteredQRCodeList = filter(data?.data?.QR_CODE, item => {
          return item.is_enabled && item.sub_type.includes('QR_CODE');
        });

        this.setState({
          totalListOfPayments: data?.data,
          all: data?.data?.ALL,
          walletsList: filteredWalletList,
          filteredCreditCards: filterCardList,
          filteredATMCardList: filteredATMCardList,
          filteredBankTransferList: filteredBankTransferList,
          filteredQRCodeList: filteredQRCodeList,
          filteredNetBankingList: filteredNetBankingList,
          filteredInstallmentList: filteredInstallmentList,
          filteredDirectBankTransferList: filteredDirectBankTransferList,
          filteredCODLList: filteredCODLList,
          filteredBNPLList: filteredBNPLList,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  paymentMethodTypes = {
    installments: 'Installments',
    COD: 'COD',
    BNPL: 'BNPL',
    wallets: 'Wallets',
    atmCard: 'ATMCard',
    creditCard: 'CreditCard',
    directBankTransfer: 'DirectBankTransfer',
    bankTransfer: 'BankTransfer',
    netBanking: 'NetBanking',
    QRCode: 'QRCode',
    crypto: 'Crypto',
  };

  headerView = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
        }}>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 6,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            marginHorizontal: 15,
          }}>
          <Text
            style={{
              fontSize: this.props.headerFontSize || 15,
              fontWeight: this.props.headerFontWeight || '400',
              color: this.props.headerColor,
            }}>
            {this.props.headerTitle}
          </Text>
        </View>
      </View>
    );
  };

  itemView = ({
    titleName,
    style,
    onPress,
    subElement,
    showIndicator = true,
    isSelected,
    creditCardView,
    showUnderline = true,
    itemIcon,
  }) => {
    const colapsableImage = require('../../assets/blackRightIndicator.png');
    const layout = this.props.layout;
    return (
      <>
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
          <View
            style={[
              style?.paymentHeaderView,
              {paddingVertical: 8},
              layout == 0
                ? {height: 55}
                : layout === 1
                ? {
                    borderWidth: 0.5,
                    borderColor: hexToRgb(this.props.themeColor, 0.5),
                    borderRadius: 27.5,
                    marginHorizontal: 12,
                    marginVertical: 8,
                    height: 55,
                  }
                : layout === 2
                ? {
                    backgroundColor: hexToRgb(this.props.themeColor, 0.05),
                    borderRadius: 15,
                    marginHorizontal: 12,
                    marginVertical: 8,
                    height: 55,
                  }
                : layout === 3
                ? {
                    backgroundColor: hexToRgb(this.props.themeColor, 0.05),
                    borderRadius: 27.5,
                    marginHorizontal: 12,
                    marginVertical: 8,
                    height: 55,
                  }
                : {
                    height: 55,
                    marginVertical: 5,
                    marginHorizontal: 15,
                    backgroundColor: '#F4F4F4',
                    borderRadius: 20,
                    shadowRadius: 1,
                    shadowColor: '#000000',
                    shadowOffset: {
                      height: 2,
                    },
                  },
              isSelected
                ? layout == 0
                  ? {
                      backgroundColor: hexToRgb(this.props.themeColor, 0.05),

                      marginHorizontal: 15,
                      borderRadius: 5,
                    }
                  : layout === 1
                  ? {
                      borderWidth: 0.5,
                      borderColor: hexToRgb(this.props.themeColor, 0.5),
                      backgroundColor: hexToRgb(this.props.themeColor, 0.05),
                      borderRadius: 27.5,
                      marginHorizontal: 12,
                      marginVertical: 8,
                      height: 55,
                    }
                  : layout === 2
                  ? {
                      borderColor: hexToRgb(this.props.themeColor, 0.5),
                      borderWidth: 0.5,
                      borderRadius: 15,
                      marginHorizontal: 12,
                      marginVertical: 8,
                      height: 55,
                    }
                  : layout === 3
                  ? {
                      borderColor: hexToRgb(this.props.themeColor, 0.5),
                      borderWidth: 0.5,
                      borderRadius: 27.5,
                      marginHorizontal: 12,
                      marginVertical: 8,
                      height: 55,
                    }
                  : {height: 55}
                : {height: 55},
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  marginLeft: 15,
                }}
              >
                <Image
                  source={require("../../assets/wallet.png")}
                  style={{ width: 20, height: 20 }}
                />
                {/* {itemIcon ? (
                  itemIcon()
                ) : (
                  <Wallet fill={this.props.themeColor} />
                )} */}
              {/* </View>  */}

              <Text
                style={[
                  style?.primaryHeadertext,
                  {
                    fontSize: this.props.fontSize || 13,
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontWeight: this.props.fontWeight || '900',
                    color: '#444444',
                  },
                ]}>
                {titleName}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {subElement ? subElement() : null}
              {showIndicator ? (
                <View
                  style={{
                    alignSelf: 'center',
                    width: 20,
                    height: 10,
                    resizeMode: 'contain',
                    marginTop: 0,
                    marginRight: 5,
                    marginLeft: 10,
                  }}>
                  <Image
                    source={require('../../assets/blackRightIndicator.png')}
                    style={{width: 8, height: 12}}
                  />
                  {/*                   
                  <Indicator
                    fill={this.props.themeColor}
                    width={20}
                    height={10}
                  /> */}
                </View>
              ) : null}
            </View>
          </View>

          {(layout === 0) & showUnderline ? (
            <View
              style={{
                height: 2,
                backgroundColor: '#70707014',
                flex: 1,
                marginHorizontal: 20,
              }}
            />
          ) : null}
        </TouchableOpacity>
      </>
    );
  };
  payNow = data => {
    setTimeout(() => {
      this.props.callbackFunction(data);
    }, 150);
  };

  newCardData = props => {
    this.props.newCardData(
      props,
      this.state.creditCardClicked,
      this.state.ATMCardClicked,
    );
    setTimeout(() => {
      this.setState({
        showCreditCardUI: false,
      });
    }, 300);
  };

  selectedData = data => {
    this.setState({
      selectedData: data,
      showWalletUI: false,
      walletCardClicked: true,
    });
    this.props.selectedData(data);
  };
  onClosePressed = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({showWalletUI: false, walletCardClicked: false});
  };

  onCloseCardPressed = () => {
    console.log('Closed');
    this.setState({
      showCreditCardUI: false,
      creditCardClicked: false,
      showATMCardUI: false,
      ATMCardClicked: false,
      showWalletUI: false,
    });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  getPayload = () => {
    let newPayload = {...this.props.payload};
    newPayload.merchantOrderId = 'MERCHANT' + new Date().getTime();
    newPayload.paymentChannel = 'PAYPAL';
    newPayload.paymentMethod = 'PAYPAL_ALL';

    return newPayload;
  };

  getTrueMoneyPayload = () => {
    let newPayload = {...this.props.payload};
    newPayload.merchantOrderId = 'MERCHANT' + new Date().getTime();
    newPayload.paymentChannel = 'TRUEMONEY';
    newPayload.paymentMethod = 'TRUEMONEY_ALL';

    return newPayload;
  };

  afterCheckout = transactionDetails => {
    console.log('transactionDetails', transactionDetails);
    if (transactionDetails) {
      this.setState({orderDetails: transactionDetails});
      this.props.callbackFunction(transactionDetails);
    }
  };

  setPaymentMethods = setPaymentMethods => {
    this.setState({
      ATMCardClicked: false,
      creditCardClicked: false,
      installmentsClicked: false,
      CODClicked: false,
      walletsClicked: false,
      directBankTransferClicked: false,
      bankTransferClicked: false,
      netBankingClicked: false,
      QRCodeClicked: false,
      BNPLClicked: false,
      cryptoClicked: false,
      showWalletUI: false,
    });
    switch (setPaymentMethods) {
      case 'Installments':
        this.setState({installmentsClicked: true});
        break;

      case 'COD':
        this.setState({CODClicked: true});
        break;

      case 'Wallets':
        this.setState(
          {
            modalList: this.state.walletsList,
            modalHeaderText: strings.wallets,
          },
          () => {
            this.setState({walletsClicked: true, showWalletUI: true});
          },
        );

        break;

      case 'ATMCard':
        this.setState({ATMCardClicked: true});
        break;

      case 'CreditCard':
        this.setState({creditCardClicked: true});
        break;

      case 'DirectBankTransfer':
        this.setState({directBankTransferClicked: true});
        break;
      case 'BankTransfer':
        this.setState({bankTransferClicked: true});
        break;
      case 'NetBanking':
        this.setState(
          {
            modalList: this.state.filteredNetBankingList,
            modalHeaderText: strings.netBanking,
          },
          () => {
            this.setState({netBankingClicked: true, showWalletUI: true});
          },
        );

        break;
      case 'QRCode':
        this.setState(
          {
            modalList: this.state.filteredQRCodeList,
            modalHeaderText: strings.QRCode,
          },
          () => {
            this.setState({
              QRCodeClicked: true,
              showWalletUI: true,
            });
          },
        );

        break;
      case 'BNPL':
        this.setState(
          {
            modalList: this.state.filteredBNPLList,
            modalHeaderText: strings.BNPL,
          },
          () => {
            this.setState({BNPLClicked: true, showWalletUI: true});
          },
        );

        break;
      case 'Crypto':
        this.setState({cryptoClicked: true});
        break;
      default:
        console.log('NothingClicked');
    }
  };

  getSubItem = paymentMethodType => {
    let firstItem;
    let secondItem;
    let numberOfRemainingItems = 0;

    let totalListLength;
    let list;

    switch (paymentMethodType) {
      case 'Wallets':
        list = this.state.walletsList;
        totalListLength = list?.length;

        break;

      case 'BNPL':
        list = this.state.filteredBNPLList;
        totalListLength = list?.length;

        break;

      case 'NetBanking':
        list = this.state.filteredNetBankingList;
        totalListLength = list?.length;

        break;

      case 'QRCode':
        list = this.state.filteredQRCodeList;
        totalListLength = list?.length;

        break;

      default:
        break;
    }

    if (totalListLength === 0) {
    } else if (totalListLength === 1) {
      firstItem = first(list)?.logo;
    } else if (totalListLength === 2) {
      firstItem = first(list)?.logo;
      secondItem = list[1]?.logo;
    } else {
      firstItem = first(list)?.logo;
      secondItem = list && list[1]?.logo;
      numberOfRemainingItems = totalListLength - 2;
    }

    return {firstItem, secondItem, numberOfRemainingItems};
  };

  render() {
    const showCardForm = first(
      this.state.filteredCreditCards,
    )?.tokenization_possible;

    const showBankTransferList = !isEmpty(this.state.filteredBankTransferList);
    const showQRCodeList = !isEmpty(this.state.filteredQRCodeList);
    const showNetBankingList = !isEmpty(this.state.filteredNetBankingList);
    const showInstallmentList = !isEmpty(this.state.filteredInstallmentList);
    const showDirectBankTransferList = !isEmpty(
      this.state.filteredDirectBankTransferList,
    );
    const showBNPLList = !isEmpty(this.state.filteredBNPLList);
    const showCryptoList = !isEmpty(this.state.filteredCryptoList);
    const showCODLList = !isEmpty(this.state.filteredCODLList);
    const showATMCardFlow = !isEmpty(this.state.filteredATMCardList);
    const showCreditCardFlow = !isEmpty(this.state.filteredCreditCards);
    const showWalletFlow = !isEmpty(this.state.walletsList);

    const style = stylesWithPropsAndStates(this.props, this.state);
    let payPalObject = filter(this.state.all, item => {
      return (
        item.payment_channel_key === 'PAYPAL' &&
        item.is_default &&
        item.is_enabled
      );
    });

    let trueMoneyObject = filter(this.state.all, item => {
      return item.payment_channel_key === 'TRUEMONEY' && item.is_enabled;
    });

    const showPayPalButton = payPalObject.length > 0;
    const showtrueMoneyButton = trueMoneyObject.length > 0;
    const {fromCheckout} = this.props;

    const BNPLLogos = this.getSubItem(this.paymentMethodTypes.BNPL);
    const QRCodeLogos = this.getSubItem(this.paymentMethodTypes.QRCode);
    const netBankingLogos = this.getSubItem(this.paymentMethodTypes.netBanking);
    const walletLogos = this.getSubItem(this.paymentMethodTypes.wallets);
    let totalAmount = sumBy(values(this.props.selectedProducts), 'price');
    return (
      <View
        style={[
          {
            borderRadius: 5,
            margin: fromCheckout ? 10 : 0,
            backgroundColor: 'white',
            padding: 3,
          },
          this.props.removeBorder
            ? {marginHorizontal: 0, borderWidth: 0}
            : {
                borderColor: 'lightgray',
                marginHorizontal: 15,
                borderWidth: 1,
              },
        ]}>
        <this.headerView />
        {showPayPalButton ? (
          <View>
            <PayNowButton
              themeColor={'#ffc439'}
              borderRadius={this.state.borderRadius}
              height={50}
              width={'100%'}
              payload={this.getPayload()}
              env={this.props.env}
              currency={this.props.currency}
              afterCheckout={this.afterCheckout}
              redirectUrl={this.props.redirectUrl}
              secretKey={this.props.secretKey}
              portOneKey={this.props.portOneKey}
              environment={this.props.environment}
              SubElement={() => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: '#253B80',
                        fontWeight: '800',
                        fontSize: 18,
                        fontStyle: 'italic',
                        textAlign: 'center',
                        width: 32,
                      }}>
                      Pay
                    </Text>
                    <Text
                      style={{
                        color: '#2997DB',
                        fontWeight: '800',
                        fontSize: 18,
                        marginLeft: -2,
                        fontStyle: 'italic',
                        textAlign: 'center',
                        width: 28,
                      }}>
                      Pal
                    </Text>
                  </View>
                );
              }}
            />
            <View
              style={{
                height: 2,
                backgroundColor: '#70707014',
                marginHorizontal: 20,
              }}
            />
          </View>
        ) : null}
        {showtrueMoneyButton ? (
          <View
            style={{
              borderRadius: 5,
              backgroundColor: 'lightgray',
              padding: 1,
              marginHorizontal: 10,
            }}>
            <View
              style={{
                borderRadius: 5,
                backgroundColor: 'white',
              }}>
              <PayNowButton
                themeColor={'white'}
                borderRadius={this.state.borderRadius}
                height={45}
                width={'100%'}
                payload={this.getTrueMoneyPayload()}
                env={this.props.env}
                currency={this.props.currency}
                afterCheckout={this.afterCheckout}
                redirectUrl={this.props.redirectUrl}
                secretKey={this.props.secretKey}
                portOneKey={this.props.portOneKey}
                environment={this.props.environment}
                SubElement={() => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          color: 'red',
                          fontWeight: '800',
                          fontSize: 18,
                          fontStyle: 'italic',
                          textAlign: 'center',
                          width: 38,
                        }}>
                        true
                      </Text>
                      <Text
                        style={{
                          color: '#E1AD01',
                          fontWeight: '800',
                          fontSize: 18,
                          marginLeft: -2,
                          fontStyle: 'italic',
                          textAlign: 'center',
                          width: 62,
                        }}>
                        money
                      </Text>
                    </View>
                  );
                }}
              />
              <View
                style={{
                  height: 2,
                  backgroundColor: '#70707014',
                  marginHorizontal: 20,
                }}
              />
            </View>
          </View>
        ) : null}
        {showWalletFlow ? (
          <this.itemView
            titleName={strings.wallets}
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              this.setPaymentMethods(this.paymentMethodTypes.wallets);
              // this.setState({
              //   walletCardClicked: !this.state.walletCardClicked,
              //   ATMCardClicked: false,
              //   creditCardClicked: false,
              //   showWalletUI: true,
              // });
            }}
            itemIcon={() => {
              return (
                <>
                  {/* <Wallet fill={this.props.themeColor} /> */}
                  <Image
                    source={require('../../assets/wallet.png')}
                    style={{width: 10, height: 6}}
                  />
                </>
              );
            }}
            subElement={() => {
              return (
                <>
                  <View style={{flexDirection: 'row', marginRight: 0}}>
                    {this.state.walletCardClicked &&
                    this.state.selectedData !== undefined ? (
                      <Image
                        source={{uri: this.state.selectedData.logo}}
                        style={{
                          alignSelf: 'center',
                          width: 30,
                          height: 30,
                          resizeMode: 'contain',
                          marginHorizontal: 3,
                          marginTop: 0,
                        }}
                      />
                    ) : this.state.walletsList.length > 0 ? (
                      <>
                        <Image
                          source={{uri: walletLogos.secondItem}}
                          style={{
                            alignSelf: 'center',
                            width:
                              this.state.walletsList?.length === 1 ? 30 : 35,
                            height:
                              this.state.walletsList?.length === 1 ? 30 : 35,
                            resizeMode: 'contain',
                            marginHorizontal: 3,
                            marginTop: 0,
                          }}
                        />
                        <Image
                          source={{uri: walletLogos.firstItem}}
                          style={{
                            alignSelf: 'center',
                            width: 30,
                            height: 30,
                            resizeMode: 'contain',
                            marginTop: 0,
                            marginHorizontal: 8,
                          }}
                        />
                      </>
                    ) : null}
                    {walletLogos.numberOfRemainingItems > 0 ? (
                      <Text
                        style={{
                          color: 'lightgray',
                          alignSelf: 'center',
                          textAlign: 'center',
                          fontSize: 10,
                        }}
                        adjustsFontSizeToFit>{`+${walletLogos.numberOfRemainingItems} more`}</Text>
                    ) : null}
                  </View>
                </>
              );
            }}
            isSelected={this.state.walletCardClicked}
            showUnderline={true}
          />
        ) : null}

        {showCreditCardFlow ? (
          <this.itemView
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );

              const showCardForm = first(
                this.state.filteredCreditCards,
              )?.tokenization_possible;

              if (!showCardForm) {
                let selectedItem = first(this.state.filteredCreditCards);
                this.setPaymentMethods(this.paymentMethodTypes.creditCard);
                if (this.state.creditCardClicked) {
                  this.props.creditCardClicked(selectedItem, true);
                } else {
                  this.props.creditCardClicked({}, false);
                }
                // this.setState(
                //   {
                //     creditCardClicked: !this.state.creditCardClicked,
                //     ATMCardClicked: false,
                //     walletCardClicked: false,
                //   },
                //   () => {
                //     if (this.state.creditCardClicked) {
                //       this.props.creditCardClicked(selectedItem, true);
                //     } else {
                //       this.props.creditCardClicked({}, false);
                //     }
                //   }
                // );
              } else {
                this.setPaymentMethods(this.paymentMethodTypes.creditCard);
                this.setState({
                  // creditCardClicked: !this.state.creditCardClicked,
                  // ATMCardClicked: false,
                  // walletCardClicked: false,
                  selectedItem: {},
                  showCreditCardUI: true,
                });
              }
            }}
            titleName={strings.creditOrDebitCard}
            isSelected={this.state.creditCardClicked}
            subElement={() => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../assets/mastercard.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginHorizontal: 3,
                    }}
                  />
                  <Image
                    source={require('../../assets/visa.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginHorizontal: 3,
                    }}
                  />
                  <Image
                    source={require('../../assets/jcb.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginHorizontal: 5,
                    }}
                  />
                </View>
              );
            }}
            itemIcon={() => {
              return (
                <>
                  <Image
                    source={require('../../assets/card.png')}
                    style={{width: 10, height: 6}}
                  />

                  {/* <Card fill={this.props.themeColor} height={13} width={26} /> */}
                </>
              );
            }}
            showUnderline={true}
          />
        ) : null}

        {showATMCardFlow ? (
          <this.itemView
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );

              this.setPaymentMethods(this.paymentMethodTypes.atmCard);
              let selectedItem = first(this.state.filteredATMCardList);
              let showCardForm = selectedItem.tokenization_possible;
              if (!showCardForm) {
                this.props.atmCardClicked(
                  selectedItem,
                  this.state.ATMCardClicked,
                );
              } else {
                this.setState({
                  selectedItem: selectedItem,
                  showATMCardUI: true,
                });
              }
            }}
            titleName={strings.ATM_card}
            showIndicator={false}
            isSelected={this.state.ATMCardClicked}
            showUnderline={true}
            itemIcon={() => {
              return (
                <>
                  {/* <Wallet fill={this.props.themeColor} /> */}
                  <Image
                    source={require('../../assets/wallet.png')}
                    style={{width: 10, height: 6}}
                  />
                </>
              );
            }}
          />
        ) : null}

        {showBNPLList ? (
          <this.itemView
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );

              this.setPaymentMethods(this.paymentMethodTypes.BNPL);
              let selectedItem = first(this.state.filteredBNPLList);
              let showCardForm = selectedItem.tokenization_possible;
              this.props.creditCardClicked(selectedItem, true);
            }}
            titleName={strings.BNPL}
            showIndicator={true}
            isSelected={this.state.BNPLClicked}
            subElement={() => {
              return (
                <>
                  <View style={{flexDirection: 'row', marginRight: 0}}>
                    {this.state.BNPLClicked &&
                    this.state.selectedData !== undefined ? (
                      <Image
                        source={{uri: this.state.selectedData.logo}}
                        style={{
                          alignSelf: 'center',
                          width: 30,
                          height: 30,
                          resizeMode: 'contain',
                          marginHorizontal: 3,
                          marginTop: 0,
                        }}
                      />
                    ) : this.state.filteredBNPLList.length > 0 ? (
                      <>
                        <Image
                          source={{uri: BNPLLogos.secondItem}}
                          style={{
                            alignSelf: 'center',
                            width:
                              this.state.filteredBNPLList?.length === 1
                                ? 30
                                : 35,
                            height:
                              this.state.filteredBNPLList?.length === 1
                                ? 30
                                : 35,
                            resizeMode: 'contain',
                            marginHorizontal: 3,
                            marginTop: 0,
                          }}
                        />
                        <Image
                          source={{uri: BNPLLogos.firstItem}}
                          style={{
                            alignSelf: 'center',
                            width: 30,
                            height: 30,
                            resizeMode: 'contain',
                            marginTop: 0,
                            marginHorizontal: 8,
                          }}
                        />
                        {BNPLLogos.numberOfRemainingItems > 0 ? (
                          <Text
                            style={{
                              color: 'lightgray',
                              alignSelf: 'center',
                              textAlign: 'center',
                              fontSize: 10,
                            }}
                            adjustsFontSizeToFit>{`+${BNPLLogos.numberOfRemainingItems} more`}</Text>
                        ) : null}
                      </>
                    ) : null}
                  </View>
                </>
              );
            }}
            showUnderline={true}
            itemIcon={() => {
              return (
                <>
                  {/* <Wallet fill={this.props.themeColor} /> */}
                  <Image
                    source={require('../../assets/wallet.png')}
                    style={{width: 10, height: 6}}
                  />
                </>
              );
            }}
          />
        ) : null}
        {showBankTransferList ? (
          <this.itemView
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );

              this.setPaymentMethods(this.paymentMethodTypes.bankTransfer);
              const showCardForm = first(
                this.state.filteredCreditCards,
              )?.tokenization_possible;

              let selectedItem = first(this.state.filteredBankTransferList);
              this.props.creditCardClicked(selectedItem, true);
            }}
            titleName={strings.bankTransfer}
            isSelected={this.state.bankTransferClicked}
            itemIcon={() => {
              return (
                <>
                  <Image
                    source={require('../../assets/card.png')}
                    style={{width: 10, height: 6}}
                  />

                  {/* <Card fill={this.props.themeColor} height={13} width={26} /> */}
                </>
              );
            }}
            showUnderline={true}
          />
        ) : null}

        {showQRCodeList ? (
          <this.itemView
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );

              this.setPaymentMethods(this.paymentMethodTypes.QRCode);
              let selectedItem = first(this.state.filteredQRCodeList);
              let showCardForm = selectedItem.tokenization_possible;
              this.props.creditCardClicked(selectedItem, true);
            }}
            titleName={strings.QRcode}
            showIndicator={true}
            isSelected={this.state.QRCodeClicked}
            showUnderline={true}
            subElement={() => {
              return (
                <>
                  <View style={{flexDirection: 'row', marginRight: 0}}>
                    {this.state.QRCodeClicked &&
                    this.state.selectedData !== undefined ? (
                      <Image
                        source={{uri: this.state.selectedData.logo}}
                        style={{
                          alignSelf: 'center',
                          width: 30,
                          height: 30,
                          resizeMode: 'contain',
                          marginHorizontal: 3,
                          marginTop: 0,
                        }}
                      />
                    ) : this.state.filteredBNPLList.length > 0 ? (
                      <>
                        <Image
                          source={{uri: QRCodeLogos?.secondItem}}
                          style={{
                            alignSelf: 'center',
                            width:
                              this.state.filteredQRCodeList?.length === 1
                                ? 30
                                : 35,
                            height:
                              this.state.filteredQRCodeList?.length === 1
                                ? 30
                                : 35,
                            resizeMode: 'contain',
                            marginHorizontal: 3,
                            marginTop: 0,
                          }}
                        />
                        <Image
                          source={{uri: QRCodeLogos?.firstItem}}
                          style={{
                            alignSelf: 'center',
                            width: 30,
                            height: 30,
                            resizeMode: 'contain',
                            marginTop: 0,
                            marginHorizontal: 8,
                          }}
                        />
                        {QRCodeLogos.numberOfRemainingItems > 0 ? (
                          <Text
                            style={{
                              color: 'lightgray',
                              alignSelf: 'center',
                              textAlign: 'center',
                              fontSize: 10,
                            }}
                            adjustsFontSizeToFit>{`+${QRCodeLogos.numberOfRemainingItems} more`}</Text>
                        ) : null}
                      </>
                    ) : null}
                  </View>
                </>
              );
            }}
            itemIcon={() => {
              return (
                <>
                  {/* <Wallet fill={this.props.themeColor} /> */}
                  <Image
                    source={require('../../assets/wallet.png')}
                    style={{width: 10, height: 6}}
                  />
                </>
              );
            }}
          />
        ) : null}

        {showNetBankingList ? (
          <this.itemView
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );

              let selectedItem = first(this.state.filteredNetBankingList);
              this.setPaymentMethods(this.paymentMethodTypes.netBanking);
              this.props.creditCardClicked(selectedItem, true);
            }}
            titleName={strings.netBanking}
            isSelected={this.state.netBankingClicked}
            subElement={() => {
              return (
                <>
                  <View style={{flexDirection: 'row', marginRight: 0}}>
                    {this.state.netBankingClicked &&
                    this.state.selectedData !== undefined ? (
                      <Image
                        source={{uri: this.state.selectedData.logo}}
                        style={{
                          alignSelf: 'center',
                          width: 30,
                          height: 30,
                          resizeMode: 'contain',
                          marginHorizontal: 3,
                          marginTop: 0,
                        }}
                      />
                    ) : this.state.filteredNetBankingList.length > 0 ? (
                      <>
                        <Image
                          source={{uri: netBankingLogos?.secondItem}}
                          style={{
                            alignSelf: 'center',
                            width:
                              this.state.filteredNetBankingList?.length === 1
                                ? 30
                                : 35,
                            height:
                              this.state.filteredNetBankingList?.length === 1
                                ? 30
                                : 35,
                            resizeMode: 'contain',
                            marginHorizontal: 3,
                            marginTop: 0,
                          }}
                        />
                        <Image
                          source={{uri: netBankingLogos?.firstItem}}
                          style={{
                            alignSelf: 'center',
                            width: 30,
                            height: 30,
                            resizeMode: 'contain',
                            marginTop: 0,
                            marginHorizontal: 8,
                          }}
                        />
                        {netBankingLogos.numberOfRemainingItems > 0 ? (
                          <Text
                            style={{
                              color: 'lightgray',
                              alignSelf: 'center',
                              textAlign: 'center',
                              fontSize: 10,
                            }}
                            adjustsFontSizeToFit>{`+${netBankingLogos.numberOfRemainingItems} more`}</Text>
                        ) : null}
                      </>
                    ) : null}
                  </View>
                </>
              );
            }}
            itemIcon={() => {
              return (
                <>
                  <Image
                    source={require('../../assets/card.png')}
                    style={{width: 10, height: 6}}
                  />

                  {/* <Card fill={this.props.themeColor} height={13} width={26} /> */}
                </>
              );
            }}
            showUnderline={true}
            showIndicator={true}
          />
        ) : null}

        {showInstallmentList ? (
          <this.itemView
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );

              this.setPaymentMethods(this.paymentMethodTypes.installments);
              let selectedItem = first(this.state.filteredATMCardList);
              let showCardForm = selectedItem.tokenization_possible;
            }}
            titleName={'Installment'}
            showIndicator={false}
            isSelected={this.state.ATMCardClicked}
            showUnderline={true}
            itemIcon={() => {
              return (
                <>
                  {/* <Wallet fill={this.props.themeColor} /> */}
                  <Image
                    source={require('../../assets/wallet.png')}
                    style={{width: 10, height: 6}}
                  />
                </>
              );
            }}
          />
        ) : null}

        {showDirectBankTransferList ? (
          <this.itemView
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );

              this.setPaymentMethods(
                this.paymentMethodTypes.directBankTransfer,
              );
              let selectedItem = first(this.state.filteredCreditCards);

              if (this.state.creditCardClicked) {
                this.props.creditCardClicked(selectedItem, true);
              } else {
                this.props.creditCardClicked({}, false);
              }
            }}
            titleName={'Direct Bank Transfer'}
            isSelected={this.state.directBankTransferClicked}
            subElement={() => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../assets/mastercard.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginHorizontal: 3,
                    }}
                  />
                  <Image
                    source={require('../../assets/visa.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginHorizontal: 3,
                    }}
                  />
                  <Image
                    source={require('../../assets/jcb.png')}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 0,
                      marginHorizontal: 5,
                    }}
                  />
                </View>
              );
            }}
            itemIcon={() => {
              return (
                <>
                  <Image
                    source={require('../../assets/card.png')}
                    style={{width: 10, height: 6}}
                  />

                  {/* <Card fill={this.props.themeColor} height={13} width={26} /> */}
                </>
              );
            }}
            showUnderline={true}
          />
        ) : null}

        {showCryptoList ? (
          <this.itemView
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );

              this.setPaymentMethods(this.paymentMethodTypes.crypto);
              let selectedItem = first(this.state.filteredCryptoList);
              let showCardForm = selectedItem.tokenization_possible;
              this.props.creditCardClicked(selectedItem, true);
            }}
            titleName={strings.crypto}
            showIndicator={false}
            isSelected={this.state.cryptoClicked}
            showUnderline={true}
            itemIcon={() => {
              return (
                <>
                  {/* <Wallet fill={this.props.themeColor} /> */}
                  <Image
                    source={require('../../assets/wallet.png')}
                    style={{width: 10, height: 6}}
                  />
                </>
              );
            }}
          />
        ) : null}

        {showCODLList ? (
          <this.itemView
            titleName={'COD'}
            style={style}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              this.setPaymentMethods(this.paymentMethodTypes.COD);
            }}
            itemIcon={() => {
              return (
                <>
                  {/* <Wallet fill={this.props.themeColor} /> */}
                  <Image
                    source={require('../../assets/wallet.png')}
                    style={{width: 10, height: 6}}
                  />
                </>
              );
            }}
            isSelected={this.state.CODClicked}
            showUnderline={showCODLList}
          />
        ) : null}

        {this.state.showWalletUI ? (
          <WalletView
            paymentLinkRef={this.props.paymentLinkRef}
            selectedProducts={this.props.selectedProducts}
            payload={this.props.payload}
            data={this.state.modalList}
            showSheet={true}
            payNow={this.payNow}
            onClose={this.onClosePressed}
            themeColor={
              this.props.walletStyles?.themeColor ||
              this.props.themeColor ||
              'black'
            }
            nameFontSize={this.props.walletStyles?.nameFontSize}
            nameFontWeight={this.props.walletStyles?.nameFontWeight}
            payNowButtonCornerRadius={
              this.props.walletStyles?.buttonBorderRadius
            }
            imageWidth={this.props.walletStyles?.imageWidth} //35
            imageHeight={this.props.walletStyles?.imageHeight} //35
            imageResizeMode={'contain'}
            checkBoxHeight={this.props.walletStyles?.checkBoxHeight} //25
            containerHeight={this.props.walletStyles?.containerHeight} //"70%"
            headerTitle={
              formatNumber(totalAmount) ||
              this.props.walletStyles?.headerTitle ||
              this.state.modalHeaderText
            }
            headerTitleFont={this.props.walletStyles?.headerTitleFont || 20}
            headerTitleWeight={
              this.props.walletStyles?.headerTitleFontWeight || '300'
            }
            headerImage={this.props.walletStyles?.headerImage}
            headerImageWidth={this.props.walletStyles?.headerImageWidth || 30}
            headerImageHeight={this.props.walletStyles?.headerImageHeight || 30}
            headerImageResizeMode={'contain'}
            searchPlaceHolder={
              this.props.walletStyles?.searchPlaceHolder ||
              '🔍 Search by Channels'
            }
            shouldShowSearch={this.props.walletStyles?.shouldShowSearch || true}
            customHandle={this.props.customHandle}
            selectedData={this.selectedData}
            deliveryAmount={this.props.deliveryAmount}
          />
        ) : null}

        {showCardForm &&
        (this.state.showCreditCardUI || this.state.showATMCardUI) ? (
          <CreditCardForm
            showSheet={true}
            containerHeight={'55%'}
            onClose={this.onCloseCardPressed}
            showSaveForLater={true}
            themeColor={this.props.themeColor || 'black'}
            newCardData={this.newCardData}
            headerTitle={formatNumber(totalAmount)}
            payNowButtonText={
              this.props.cardStyles?.payNowButtonText || strings.payNow
            }
            payNowButtonCornerRadius={this.props.cardStyles?.buttonBorderRadius}
          />
        ) : null}
      </View>
    );
  }
}

const stylesWithPropsAndStates = (props, state) =>
  StyleSheet.create({
    roundedTextInput: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'red',
    },
    OTPContainerStyle: {
      marginHorizontal: 18,
    },

    primaryHeadertext: {
      fontSize: 16,
      fontWeight: '500',
      color: 'black',
      marginHorizontal: 15,
    },
    paymentHeaderView: {
      justifyContent: 'space-between',
      flexDirection: 'row',

      backgroundColor: 'white',
    },
    onClickATMCard: state.ATMCardClicked
      ? {
          borderRadius: 5,
          borderColor: props.themeColor,
          borderWidth: 0.5,
        }
      : {},
  });

export default PaymentMethods;
