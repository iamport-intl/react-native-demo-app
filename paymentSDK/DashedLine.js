import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

class DashedLine extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var styles = style(this.props);
    return (
      <View style={styles.dashedContainerView}>
        <View style={styles.dashedView} />
      </View>
    );
  }
}

const style = props =>
  StyleSheet.create({
    dashedContainerView: {
      height: 1,
      marginHorizontal: 15,
      marginVertical: props.marginVertical || 0,
      borderRadius: 1,
      borderWidth: 1,
      borderColor: props.color || '#D5D5D5',
      borderStyle: 'dashed',
      zIndex: 0,
    },

    dashedView: {
      position: 'absolute',

      width: '100%',
      height: 5,
      backgroundColor: 'white',
      zIndex: 1,
    },
  });

export default DashedLine;
