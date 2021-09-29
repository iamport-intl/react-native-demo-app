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
        }}>
        <Text
          style={{
            fontWeight: this.props.item.fontWeight,
            fontSize: this.props.item.fontSize,
            color: this.props.item.color,
          }}>
          {this.props.item.name}
        </Text>
        <Text
          style={{
            fontWeight: this.props.item.fontWeight,
            fontSize: this.props.item.fontSize,
            color: this.props.item.color,
          }}>
          {this.props.item.value}
        </Text>
      </View>
    );
  }
}

export default HorizontalTextStackView;
