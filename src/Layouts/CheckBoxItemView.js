import React, { Component } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { APP_THEME_COLOR, TRANSPARENT } from "../constants";

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
        <View style={style.checkBoxInnerView}>
          <View style={style.tickView}>
            <View
              style={{
                borderRadius: 4,
                height: 8,
                width: 8,
                justifyContent: "center",
                alignContent: "center",
                backgroundColor: "white",
                marginLeft: 5,
              }}
            ></View>
          </View>
        </View>
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
      fontSize: 14,
      fontWeight: "500",
      marginRight: 10,
      color: props.isSelected ? "#111111" : "#B8B8B8",
    },
    logoImage: {
      alignSelf: "center",
      width: 20,
      height: 20,
      resizeMode: props.imageResizeMode,
      marginRight: 20,
      marginLeft: 10,
    },
    descriptionText: { fontSize: 12, fontWeight: "200", marginTop: 3 },
    checkBoxInnerView: {
      borderRadius: props.checkBoxHeight / 2,
      height: props.checkBoxHeight || 30,
      width: props.checkBoxHeight || 30,
      borderWidth: 1,
      borderColor: "#F4F4F4",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 0,
      flexDirection: "row",
      marginLeft: 15,
    },
    tickView: {
      borderRadius: props.checkBoxHeight / 2,
      height: props.checkBoxHeight,
      width: props.checkBoxHeight,
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: props.isSelected ? "#FC6B2D" : "#f4f4f4",
    },
  });
export default CheckBoxItemView;
