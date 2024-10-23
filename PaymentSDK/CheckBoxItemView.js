import React, { Component } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { APP_THEME_COLOR, TRANSPARENT } from "./constants";

class CheckBoxItemView extends Component {
  render() {
    let product = this.props.item.item;
    const style = styles(this.props, this.state);
    return (
      <TouchableOpacity
        style={style.containerView}
        onPress={() => {
          this.props.didSelected(this.props.item.item);
        }}
      >
        <View style={style.innerView}>
          {this.props.image ? (
            <Image source={this.props.image} style={style.logoImage} />
          ) : null}
          <View style={style.nameContainerView}>
            <Text style={style.displayNameText}>{product.display_name}</Text>
            {product.description ? (
              <Text style={style.descriptionText}>{product.description}</Text>
            ) : null}
          </View>
        </View>
        <View style={style.checkBoxInnerView}>
          <View style={style.tickView}>
            <Image
              source={require("../assets/tick.png")}
              style={style.tickImage}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = (props, state) =>
  StyleSheet.create({
    containerView: {
      flexDirection: "row",
      marginVertical: 8,
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: 15,
      alignContent: "center",
    },
    innerView: {
      marginLeft: 8,
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    tickImage: {
      alignSelf: "center",
      width: 15,
      height: 10,
      resizeMode: "contain",
    },

    nameContainerView: { flex: 1, marginLeft: -15 },
    displayNameText: {
      fontSize: props.nameFontSize || 15,
      fontWeight: props.nameFontWeight || "400",
      marginRight: 10,
    },
    logoImage: {
      alignSelf: "center",
      width: props.imageWidth || 35,
      height: props.imageHeight || 35,
      resizeMode: props.imageResizeMode,
      marginRight: 30,
    },
    descriptionText: { fontSize: 12, fontWeight: "200", marginTop: 3 },
    checkBoxInnerView: {
      borderRadius: props.checkBoxHeight / 2,
      height: props.checkBoxHeight,
      width: props.checkBoxHeight,
      borderWidth: 1,
      borderColor: props.themeColor,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 15,
      flexDirection: "row",
    },
    tickView: {
      borderRadius: props.checkBoxHeight / 2,
      height: props.checkBoxHeight,
      width: props.checkBoxHeight,
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: props.isSelected ? props.themeColor : "transparent",
    },
  });
export default CheckBoxItemView;
