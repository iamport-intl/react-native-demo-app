import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  APP_THEME_COLOR,
  BOLD,
  BLACK,
  TRANSPARENT,
  LIGHTGRAY,
  descriptionText,
  currency,
} from "../constants.js";
import Card from "./Card";
import Cancel from "../../assets/cancel.svg";

import { hexToRgb, formatNumber } from "../helper";
const { width, height } = Dimensions.get("window");
const gutter = 15;

class ProductItemCell extends React.Component {
  render() {
    let removeInstock = this.props.removeInStock;
    let removeBorder = this.props.removeBorder;

    let formattedNumber = formatNumber(this.props.product.price);

    const styles = style(this.props);
    const uri = this.props.product.img || this.props.product.image;
    return (
      <View
        key={this.props.product.key}
        style={[
          styles.containerView,
          removeBorder
            ? {
                paddingVertical: 0,
                marginVertical: 0,
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
        ]}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Card style={{ height: 60, width: 60 }}>
            <Image source={{ uri: uri }} style={styles.image} />
          </Card>
          <View
            style={{
              alignSelf: "center",
              marginLeft: 10,
              alignItems: "center",
              flexWrap: "wrap",
              flexDirection: "column",
              flex: 3,
            }}
          >
            <Text style={styles.name}>{this.props.product.name}</Text>
            {this.props.product.description ? (
              <Text style={styles.description}>
                {this.props.product.description}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.priceView}>
          <Text style={[styles.price]}>{formattedNumber}</Text>
          {this.props.showCancel ? (
            <TouchableOpacity
              style={styles.inStock}
              onPress={() => {
                this.props.removeItem(this.props.product);
              }}
            >
              <View style={{ padding: 4, marginHorizontal: 5 }}>
                {/* <Cancel fill={this.props.themeColor} /> */}
                <Image
                  source={require("../../assets/cancel.png")}
                  style={{ width: 10, height: 6 }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{ marginRight: 25 }} />
          )}
        </View>
      </View>
    );
  }
}

const style = (props) =>
  StyleSheet.create({
    containerView: {
      marginVertical: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: props.borderRadius || 5,
      flex: 1,
    },
    name: {
      color: props.nameColor || BLACK,
      fontSize: props?.nameFontSize || 14,
      fontWeight: props?.nameFontWeight || "500",
      marginBottom: 3,

      alignSelf: "flex-start",
    },
    price: {
      fontWeight: props?.amountFontWeight,
      color: props?.amountColor,
      fontSize: props?.amountFontSize,
    },

    priceView: {
      justifyContent: "center",
    },
    inStock: {
      fontWeight: props?.inStockFontWeight || "500",
      color: props?.inStockColor || APP_THEME_COLOR,
      fontSize: props?.inStockSize || 11,
      textAlign: "center",
    },
    description: {
      fontSize: props?.descriptionFontSize,
      fontWeight:
        props?.descriptionFontWeight !== NaN
          ? props?.descriptionFontWeight
          : "400",
      color: props?.descriptionColor,
      marginBottom: 5,
      alignSelf: "flex-start",
    },
    product: {
      padding: 10,
      marginLeft: 5,
      marginRight: 5,
      justifyContent: "center",
      width: (width - gutter * 3) / 2,
      marginBottom: gutter,
      alignSelf: "flex-start",
    },
    productName: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    image: {
      alignSelf: "center",
      width: 60,
      height: 60,
      resizeMode: "stretch",
      marginTop: 0,
    },
  });

export default ProductItemCell;
