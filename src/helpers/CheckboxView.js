import omit from "lodash.omit";
import React, { Component } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { APP_THEME_COLOR, TRANSPARENT } from "../constants";

class CheckboxView extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginVertical: 15,
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onPress={() =>
          this.props.didSelected(
            omit(this.props.item, ["name", "description"]),
            this.props.fromSavedCards
          )
        }
      >
        <View
          style={{
            marginLeft: 10,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderRadius: 11,
              height: 22,
              width: 22,
              borderWidth: 1,
              borderColor: APP_THEME_COLOR,
              padding: 2,
              marginHorizontal: 15,
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
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {this.props.item.name}
            </Text>
            {this.props.item.description ? (
              <Text style={{ fontSize: 10, fontWeight: "200", marginTop: 3 }}>
                {this.props.item.description}
              </Text>
            ) : null}
          </View>
        </View>
        <Image
          source={this.props.image}
          style={{
            alignSelf: "center",
            width: this.props.styles?.width || 35,
            height: this.props.styles?.height || 35,
            resizeMode: "contain",
            marginRight: 30,
          }}
        />
      </TouchableOpacity>
    );
  }
}

export default CheckboxView;
