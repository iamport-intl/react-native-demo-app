import React, { Component } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { APP_THEME_COLOR, TRANSPARENT } from "../constants";

class CheckboxView extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginHorizontal: 50,
          marginVertical: 15,
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onPress={() =>
          this.props.didSelected(this.props.item, this.props.fromSavedCards)
        }
      >
        <>
          <View
            style={{
              borderRadius: 11,
              height: 22,
              width: 22,
              borderWidth: 1,
              borderColor: APP_THEME_COLOR,
              padding: 2,
            }}
          >
            <View
              style={{
                borderRadius: 8,
                height: 16,
                width: 16,

                backgroundColor: this.props.isSelected
                  ? APP_THEME_COLOR
                  : TRANSPARENT,
              }}
            />
          </View>
          <View>
            <Text style={{ marginLeft: -50, fontSize: 15, fontWeight: "400" }}>
              {this.props.item.name}
            </Text>
            {this.props.item.description ? (
              <Text
                style={{ marginLeft: -50, fontSize: 15, fontWeight: "400" }}
              >
                {this.props.item.description}
              </Text>
            ) : null}
          </View>
        </>
        <Image
          source={this.props.image}
          style={{
            alignSelf: "center",
            width: 35,
            height: 35,
            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>
    );
  }
}

export default CheckboxView;
