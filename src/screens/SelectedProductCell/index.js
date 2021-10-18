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
} from '../../constants';
import Card from '../../elements/Card';

const {width, height} = Dimensions.get('window');
const gutter = 15;

class ScheduledProductCell extends React.Component {
  render() {
    let removeInstock = this.props.removeInStock;
    let removeBorder = this.props.removeBorder;

    return (
      <View
        style={[
          styles.containerView,
          removeBorder
            ? {paddingVertical: 0, marginverticl: 0}
            : {borderColor: descriptionText, borderWidth: 0.5},
        ]}>
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.name} h2>
            {this.props.product.name}
          </Text>

          {removeInstock ? (
            <View style={styles.priceView}>
              <Text style={styles.description} h2>
                {this.props.product.description}
              </Text>
              <Text style={[styles.price, {marginLeft: 5, marginTop: -3}]} h4>
                ${this.props.product.price}
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.description} h2>
                {this.props.product.description}
              </Text>
              <View style={styles.priceView}>
                <Text style={styles.price} h4>
                  ${this.props.product.price}
                </Text>
                <Text style={styles.inStock}>{' In stock'}</Text>
              </View>
            </>
          )}
        </View>

        <Card>
          <Image source={{uri: this.props.product.img}} style={styles.image} />
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    paddingLeft: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  name: {
    color: BLACK,
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 3,
  },
  price: {
    fontWeight: BOLD,
    color: BLACK,
    fontSize: 12,
  },

  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  inStock: {
    fontWeight: '500',
    color: APP_THEME_COLOR,
    fontSize: 11,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    fontWeight: '700',
    color: LIGHTGRAY,
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
