import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {map, values, sumBy} from 'lodash';
import ScheduledProductCell from './subElements/ProductItemCell';
const {width} = Dimensions.get('screen');
import {WHITE_COLOR} from './constants';
import DashedLine from './subElements/DashedLine';
import CartSummary from './CartSummary';
import UpArrow from '../assets/upArrow.svg';
import DownArrow from '../assets/downArrow.svg';
import {hexToRgb, formatNumber} from './helper';
class CartDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: true,
    };
  }

  render() {
    var style = stylesWithProps(this.props);

    let layout = this.props.layout || 0;
    let listCount = this.props.selectedProducts.length;
    let selectedItems = this.props.selectedProducts;
    let totalAmount = sumBy(this.props.selectedProducts, 'price');
    let deliveryAmount = 0;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            layout === 0 ? hexToRgb(this.props.themeColor, 0.05) : 'white',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}>
        <View
          style={{
            backgroundColor: !this.state.showList
              ? 'transparent'
              : 'transparent',
          }}>
          <View
            style={{
              paddingVertical: 15,
              flexDirection: 'row',

              justifyContent: 'space-between',
              backgroundColor: 'transparent',
              marginHorizontal: 15,
            }}>
            <Text
              style={{
                fontSize: this.props.headerFontSize || 16,
                fontWeight: this.props.headerFontWeight || '500',
                color: this.props.headerColor,
              }}>
              {this.props.headerText || 'My cart'}
              {this.props.showNetPayable
                ? ''
                : `(${listCount} ${listCount === 1 ? ' item' : ' items'})`}
            </Text>

            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                this.setState({showList: !this.state.showList});
              }}>
              {this.props.showNetPayable ? (
                <Text
                  style={{
                    fontSize: this.props.headerFontSize || 16,
                    fontWeight: this.props.headerFontWeight || '500',
                    color: this.props.headerColor || this.props.themeColor,
                    marginRight: 10,
                  }}>
                  {formatNumber(totalAmount)}
                </Text>
              ) : null}

              <View style={{marginRight: 5}}>
                {!this.state.showList ? (
                  <UpArrow fill={this.props.themeColor} width={10} height={6} />
                ) : (
                  <DownArrow
                    fill={this.props.themeColor}
                    width={10}
                    height={6}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.showList ? (
          <>
            <View>
              <DashedLine
                color={this.props.dashedColor}
                backgroundColor={'transparent'}
              />
            </View>
            <View
              style={{
                backgroundColor: 'transparent',
              }}>
              <Text
                style={{marginHorizontal: 15, color: '#757575', marginTop: 5}}>
                {this.props.orderSummaryText || 'Order Summary'}
              </Text>
              <View style={{marginHorizontal: 15}}>
                {map(selectedItems, (product, index) => {
                  return (
                    <ScheduledProductCell
                      key={product.key}
                      product={product}
                      nameColor={this.props.themeColor}
                      themeColor={this.props.themeColor}
                      descriptionColor={this.props.nameColor}
                      descriptionSize={this.props.descriptionSize}
                      descriptionFontWeight={this.props.descriptionFontWeight}
                      amountFontSize={this.props.amountFontSize}
                      amountFontWeight={this.props.amountFontWeight}
                      amountColor={this.props.amountColor}
                      borderColor={this.props.borderColor}
                      borderRadius={this.props.borderRadius}
                      borderWidth={this.props.borderWidth}
                      removeItem={this.props.removeItem}
                      showCancel={this.props.showCancel}
                      removeBorder={this.props.removeBorder}
                      layout={this.props.layout || 1}
                    />
                  );
                })}
              </View>
              {this.props.showNetPayable ? (
                <>
                  <View style={{marginTop: 5}}>
                    <DashedLine
                      color={this.props.dashedColor}
                      backgroundColor={'transparent'}
                    />
                  </View>
                  <View style={{marginRight: 15}}>
                    <CartSummary
                      hideHeaderView={true}
                      removeBorder={true}
                      deliveryAmount={deliveryAmount}
                      totalAmount={totalAmount}
                      amountTitle={'Taxes'}
                      amountFont={12}
                      amountColor={'#010101'}
                      amountFontWeight={'300'}
                      deliveryTitle={'Delivery'}
                      deliveryFont={12}
                      deliveryColor={'#010101'}
                      deliveryFontWeight={'300'}
                      summaryTitle={'Summary'}
                      summaryFont={14}
                      summaryColor={
                        layout === 0
                          ? '#010101'
                          : layout === 1
                          ? this.props.themeColor
                          : '#010101'
                      }
                      summaryFontWeight={'500'}
                      backgroundColor={'transparent'}
                    />
                  </View>
                </>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    );
  }
}

const stylesWithProps = props =>
  StyleSheet.create({
    btnText: {
      textAlign: 'center',
      color: props.textColor,
      fontSize: props.textFontSize || 14,
      fontWeight: props.textFontWeight,
    },
  });

export default CartDetails;
