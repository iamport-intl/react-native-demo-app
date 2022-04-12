import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  APP_THEME_COLOR,
  BOLD,
  BLACK,
  TRANSPARENT,
  LIGHTGRAY,
  descriptionText,
  currency,
} from '../../constants';
import Card from '../../elements/Card';

const {width, height} = Dimensions.get('window');
const gutter = 15;

class ScheduledProductCell extends React.Component {
  render() {
    let removeInstock = this.props.removeInStock;
    let removeBorder = this.props.removeBorder;

    let formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'VND',
    }).format(this.props.product.price);

    const styles = style(this.props);

    return (
      <View
        style={[
          styles.containerView,
          removeBorder
            ? {
                paddingVertical: 0,
                marginvertical: 0,
                paddingRight: 0,
                paddingLeft: 0,
              }
            : {
                borderColor: this.props.borderColor,
                borderWidth: this.props.borderWidth || 0.5,
                paddingRight: 15,
                paddingLeft: 15,
                paddingVertical: 5,
              },
        ]}>
        <>
          <Card>
            <Image
              source={{uri: this.props.product.img}}
              style={styles.image}
            />
          </Card>
          <View
            style={{
              alignSelf: 'center',
              marginLeft: -40,
            }}>
            <Text style={styles.name}>{this.props.product.name}</Text>
            <Text style={styles.description}>
              {this.props.product.description}
            </Text>
          </View>
        </>
        <View style={[styles.priceView, {justifyContent: 'flex-start'}]}>
          <Text style={[styles.price]}>{formattedNumber}</Text>
          {this.props.showCancel ? (
            <TouchableOpacity
              style={styles.inStock}
              onPress={() => {
                this.props.removeItem(this.props.product);
              }}>
              <Image
                source={require('../../../assets/cancel.png')}
                style={{width: 12, height: 12, marginLeft: 10}}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const style = props =>
  StyleSheet.create({
    containerView: {
      marginVertical: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
      borderRadius: props.borderRadius || 5,
    },
    name: {
      color: props.nameColor || BLACK,
      fontSize: props?.nameFontSize || 12,
      fontWeight: props?.nameFontWeight || '400',
      marginBottom: 3,
    },
    price: {
      fontWeight: props?.amountFontWeight,
      color: props?.amountColor,
      fontSize: props?.amountFontSize,
    },

    priceView: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    },
    inStock: {
      fontWeight: props?.inStockFontWeight || '500',
      color: props?.inStockColor || APP_THEME_COLOR,
      fontSize: props?.inStockSize || 11,
      textAlign: 'center',
    },
    description: {
      fontSize: props?.descriptionFontSize,
      fontWeight: props?.descriptionFontWeight,
      color: props?.descriptionColor,
      marginBottom: 5,
    },
    product: {
      padding: 10,
      marginLeft: 5,
      marginRight: 5,
      justifyContent: 'center',
      width: (width - gutter * 3) / 2,
      marginBottom: gutter,
      alignSelf: 'flex-start',
    },
    productName: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    image: {
      alignSelf: 'center',
      width: 60,
      height: 60,
      resizeMode: 'stretch',
      marginTop: 0,
    },
  });

export default ScheduledProductCell;
