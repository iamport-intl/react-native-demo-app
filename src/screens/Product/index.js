import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import {
  APP_THEME_COLOR,
  BOLD,
  currency,
  DARKBLACK,
  descriptionText,
  WHITE_COLOR,
  TRANSPARENT,
} from "../../constants";
import Card from "../../elements/Card";

const { width, height } = Dimensions.get("window");
const gutter = 15;

class Product extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[
          styles.product,
          this.props.data.didSelected
            ? { borderColor: APP_THEME_COLOR, borderRadius: 5, borderWidth: 1 }
            : { borderColor: TRANSPARENT },
        ]}
        onPress={() => this.props.onSelectProduct(this.props.data)}
      >
        <Image
          source={{ uri: this.props.data.item.img }}
          style={styles.image}
        />
        <View style={{ backgroundColor: TRANSPARENT }}>
          <View style={styles.productName}>
            <Text style={styles.name} h2>
              {this.props.data.item.name}
            </Text>
            <Text style={styles.description} h2>
              {this.props.data.item.description}
            </Text>

            <Text style={styles.price} h4>
              {currency}
              {this.props.data.item.price}
            </Text>
          </View>
          {/* <Button
                        type="clear"
                        title='Buy now'
                        color="#3D3D3D"
                        onPress={() => {
                            this.props.navigation.navigate('Checkout', {
                            price: this.props.data.price,
                            //navigation:this.props.navigation
                        })}}
                    /> */}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: DARKBLACK,
    fontSize: 14,
    fontWeight: BOLD,
    flex: 1,
    flexWrap: "wrap",
    paddingVertical: 6,
    paddingBottom: 0,
    textAlign: "center",
  },

  price: {
    fontWeight: BOLD,
    flex: 1,
    flexWrap: "wrap",
    marginLeft: 5,
    color: APP_THEME_COLOR,
    fontSize: 14,
    textAlign: "center",
  },

  description: {
    fontSize: 12,
    fontWeight: "600",
    color: descriptionText,
    paddingBottom: 2,
    textAlign: "center",
  },
  product: {
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: "center",
    width: (width - gutter * 3) / 2,
    marginBottom: gutter,
    backgroundColor: WHITE_COLOR,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    alignSelf: "flex-start",
    borderRadius: 8,
  },
  productName: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
    backgroundColor: TRANSPARENT,
  },
});

export default Product;
