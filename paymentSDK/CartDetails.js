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
import ScheduledProductCell from '../src/screens/SelectedProductCell';
const {width} = Dimensions.get('screen');
import {WHITE_COLOR} from '../src/constants';
import DashedLine from './DashedLine';
class CartDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: true,
    };
  }

  render() {
    var style = stylesWithProps(this.props);

    let listCount = this.props.selectedProducts.length;
    let selectedItems = this.props.selectedProducts;
    let totalAmount = sumBy(this.props.selectedProducts, 'price');

    return (
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: WHITE_COLOR,
          }}>
          <View
            style={{
              paddingVertical: 15,
              flexDirection: 'row',

              justifyContent: 'space-between',
              backgroundColor: 'WHITE_COLOR',
              marginHorizontal: 15,
            }}>
            <Text
              style={{
                fontSize: this.props.headerFontSize || 16,
                fontWeight: this.props.headerFontWeight || '500',
                color: this.props.headerColor,
              }}>
              {this.props.headerText || 'My cart'} ({listCount}{' '}
              {listCount === 1 ? 'item' : 'items'})
            </Text>

            {this.props.showNetPayable ? (
              <Text
                style={{
                  fontSize: this.props.headerFontSize || 16,
                  fontWeight: this.props.headerFontWeight || '500',
                  color: this.props.headerColor,
                }}>
                {totalAmount}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.setState({showList: !this.state.showList});
                }}>
                <Image
                  source={
                    !this.state.showList
                      ? require('../assets/colapse.png')
                      : require('../assets/expand.png')
                  }
                  style={{
                    alignSelf: 'center',
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                    marginRight: 5,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View>
            <DashedLine color={this.props.dashedColor} />
          </View>
        </View>
        {this.state.showList ? (
          <View
            style={{
              backgroundColor: WHITE_COLOR,
              marginTop: 4,
            }}>
            <View style={{marginHorizontal: 15}}>
              {map(selectedItems, product => {
                return (
                  <ScheduledProductCell
                    product={product}
                    nameColor={this.props.nameColor}
                    nameFontSize={this.props.nameFontSize}
                    nameFontWeight={this.props.nameFontWeight}
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
                    showCancel={false}
                    removeBorder={this.props.removeBorder}
                  />
                );
              })}
            </View>
          </View>
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

    nextViewContainerStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.themeColor || 'red',
      paddingVertical: 15,
      borderRadius: props.borderRadius || 8,
      paddingHorizontal: 15,
      width: props.width,
      height: props.height,
    },
    containerStyle: {
      backgroundColor: 'white',
      margin: 4,
      borderRadius: 5,
      marginHorizontal: 15,
    },
  });

export default CartDetails;
