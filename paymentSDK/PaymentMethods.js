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
import {first, filter, isEmpty} from 'lodash';

import {
  APP_THEME_COLOR,
  BOLD,
  strings,
  TRANSPARENT,
  WHITE_COLOR,
  IMAGE_BACKGROUND_COLOR,
  CHAIPAY_KEY,
  CURRENCY,
} from '../src/constants.js';

import {CreditCardForm} from '../src/Layouts/CreditCardForm';
import {WalletView} from '../src/Layouts/WalletView';
import {helpers} from '@iamport-intl/portone-sdk';
//import TextField from "../helpers/TextField";
const {width, height} = Dimensions.get('screen');
class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {walletsList: []};
  }

  componentDidMount() {
    helpers
      .fetchAvailablePaymentGateway(CHAIPAY_KEY, CURRENCY)
      .then(data => {
        this.setState({totalListOfPayments: data.data});
        let filteredWalletList = filter(data.data.WALLET, item => {
          return item.is_enabled;
        });

        this.setState({walletsList: filteredWalletList});
        let filterCardList = filter(data.data.CARD, item => {
          return (
            item.is_default &&
            item.is_enabled &&
            item.sub_type.includes('INT_CREDIT_CARD')
          );
        });
        this.setState({
          paymentCardType: filterCardList,
          cardList: data.data.CARD,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  headerView = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
        }}>
        <View
          style={{
            paddingTop: 15,
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
              color: this.props.themeColor,
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
  }) => {
    const colapsableImage = require('../assets/Indicator.png');
    return (
      <>
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
          <View
            style={[
              style?.paymentHeaderView,
              {paddingVertical: 8},
              isSelected
                ? {
                    borderWidth: 1,
                    borderColor: this.props.themeColor,
                    marginHorizontal: 15,
                    borderRadius: 5,
                  }
                : {},
            ]}>
            <View style={{flexDirection: 'row', paddingVertical: 12}}>
              <Image
                source={require('../assets/wallet.png')}
                style={{
                  alignSelf: 'center',
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',

                  marginLeft: 15,
                }}
              />

              <Text
                style={[
                  style?.primaryHeadertext,
                  {
                    fontSize: this.props.fontSize || 13,
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontWeight: this.props.fontWeight || '300',
                  },
                ]}>
                {titleName}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {subElement ? subElement() : null}
              {showIndicator ? (
                <Image
                  source={colapsableImage}
                  style={{
                    alignSelf: 'center',
                    width: 20,
                    height: 10,
                    resizeMode: 'contain',
                    marginTop: 0,
                    marginRight: 15,
                    marginLeft: 10,
                  }}
                />
              ) : null}
            </View>
          </View>

          {showUnderline ? (
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
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // this.setState({showWalletUI: false, walletCardClicked: false});
    // console.log(data);

    setTimeout(() => {
      this.props.callbackFunction(data);
    }, 150);
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
    console.log('Closed');
  };

  onCloseCardPressed = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.setState({showCreditCardUI: false, creditCardClicked: false});
    console.log('Closed');
  };

  render() {
    const showCardForm = first(
      this.state.paymentCardType,
    )?.tokenization_possible;

    const filteredCards = filter(this.state.cardList, item => {
      return item?.sub_type === 'ATM_CARD';
    });
    const showATMCardFlow = filteredCards.length > 0;
    const showCreditCardFlow = !isEmpty(this.state.paymentCardType);

    let firstItem =
      this.state.walletsList.length > 0
        ? first(this.state.walletsList).logo
        : null;
    let secondItem =
      this.state.walletsList.length > 1 ? this.state.walletsList[1].logo : null;
    const style = stylesWithPropsAndStates(this.props, this.state);

    return (
      <View
        style={{
          borderColor: 'lightgray',
          borderWidth: 1,
          borderRadius: 5,
          margin: 15,
          flex: 1,
          padding: 3,
          backgroundColor: 'white',
        }}>
        <this.headerView />
        <this.itemView
          titleName={'Wallets'}
          style={style}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );

            this.setState({
              walletCardClicked: !this.state.walletCardClicked,
              ATMCardClicked: false,
              creditCardClicked: false,
              showWalletUI: true,
            });
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
                        source={{uri: secondItem}}
                        style={{
                          alignSelf: 'center',
                          width: this.state.walletsList.length === 1 ? 30 : 20,
                          height: this.state.walletsList.length === 1 ? 30 : 20,
                          resizeMode: 'contain',
                          marginHorizontal: 3,
                          marginTop: 0,
                        }}
                      />
                      <Image
                        source={{uri: firstItem}}
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
                  {this.state.walletCardClicked &&
                  this.state.selectedData !== undefined ? null : this.state
                      .walletsList.length > 2 ? (
                    <Text
                      style={{
                        color: 'lightgray',
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontSize: 10,
                      }}
                      adjustsFontSizeToFit>{`+${
                      this.state.walletsList.length - 2
                    } more`}</Text>
                  ) : null}
                </View>
              </>
            );
          }}
          isSelected={this.state.walletCardClicked}
          showUnderline={showATMCardFlow || showCreditCardFlow}
        />
        <>
          {showCreditCardFlow ? (
            <this.itemView
              style={style}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );

                if (!showCardForm) {
                  let selectedItem = first(this.state.paymentCardType);
                  this.props.selectedData(selectedItem);
                }

                this.setState({
                  creditCardClicked: !this.state.creditCardClicked,
                  ATMCardClicked: false,
                  walletCardClicked: false,
                  selectedItem: {},
                  showCreditCardUI: true,
                });
              }}
              titleName={'Debit / Credit Card'}
              isSelected={this.state.creditCardClicked}
              subElement={() => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={require('../assets/mastercard.png')}
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
                      source={require('../assets/visa.png')}
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
                      source={require('../assets/jcb.png')}
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
              showCreditCard={() => {
                return <View>{showCardForm ? <CreditCardForm /> : null}</View>;
              }}
              showUnderline={showATMCardFlow}
            />
          ) : null}

          {showATMCardFlow ? (
            <this.itemView
              style={style}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                let selectedItem = first(filteredCards);

                this.setState({
                  selectedItem: selectedItem,
                  ATMCardClicked: !this.state.ATMCardClicked,
                  creditCardClicked: false,
                  walletCardClicked: false,

                  showATMCardUI: true,
                });
                this.props.selectedData(selectedItem);
              }}
              titleName={'ATM Card'}
              showIndicator={false}
              isSelected={this.state.ATMCardClicked}
              showUnderline={false}
            />
          ) : null}
        </>
        {this.state.showWalletUI ? (
          <WalletView
            selectedProducts={this.props.selectedProducts}
            payload={this.props.payload}
            data={this.state.walletsList}
            showSheet={true}
            payNow={this.payNow}
            onClose={this.onClosePressed}
            themeColor={this.props.walletStyles.themeColor}
            nameFontSize={this.props.walletStyles.nameFontSize}
            nameFontWeight={this.props.walletStyles.nameFontWeight}
            payNowButtonCornerRadius={
              this.props.walletStyles.buttonBorderRadius
            }
            imageWidth={this.props.walletStyles.imageWidth} //35
            imageHeight={this.props.walletStyles.imageHeight} //35
            imageResizeMode={'contain'}
            checkBoxHeight={this.props.walletStyles.checkBoxHeight} //25
            containerHeight={this.props.walletStyles.containerHeight} //"70%"
            headerTitle={this.props.walletStyles.headerTitle || 'Wallets'}
            headerTitleFont={this.props.walletStyles.headerTitleFont || 25}
            headerTitleWeight={
              this.props.walletStyles.headerTitleFontWeight || '300'
            }
            headerImage={this.props.walletStyles.headerImage}
            headerImageWidth={this.props.walletStyles.headerImageWidth || 30}
            headerImageHeight={this.props.walletStyles.headerImageHeight || 30}
            headerImageResizeMode={'contain'}
            searchPlaceHolder={
              this.props.walletStyles.searchPlaceHolder ||
              '🔍 Search by Channels'
            }
            shouldShowSearch={this.props.walletStyles.shouldShowSearch || true}
            customHandle={this.props.customHandle}
            selectedData={this.selectedData}
            env={this.props?.env}
            currency={this.props?.currency}
            redirectUrl={this.props?.redirectUrl || 'chaiport://checkout'}
            secretKey={this.props?.secretKey}
            chaipayKey={this.props?.chaipayKey}
            environment={this.props?.environment}
            deliveryAmount={this.props.deliveryAmount}
          />
        ) : null}

        {showCardForm &&
        (this.state.showCreditCardUI || this.state.showATMCardUI) ? (
          <CreditCardForm
            showSheet={true}
            containerHeight={'45%'}
            onClose={this.onCloseCardPressed}
            showSaveForLater={true}
            themeColor={'red'}
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
