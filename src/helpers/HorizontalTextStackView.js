import React, {Component} from 'react';
import {View, Text} from 'react-native';

class HorizontalTextStackView extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
          flexWrap: 'wrap',
        }}>
        <Text
          style={{
            fontWeight: this.props.item.fontWeight,
            fontSize: this.props.item.fontSize,
            color: this.props.item.color,
            marginRight: 5,
          }}>
          {this.props.item.name}
        </Text>
        <Text
          style={{
            fontWeight: this.props.item.rightFontWeight,
            fontSize: this.props.item.fontSize,
            color: this.props.item.color,

            textAlign: this.props.item.textAlign || 'right',
          }}
          numberOfLines={2}>
          {this.props.item.value}
        </Text>
      </View>
    );
  }
}

export default HorizontalTextStackView;
