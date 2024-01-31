import React, {Component} from 'react';
import {FlatList, Modal} from 'react-native';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';

import LinearGradient from 'react-native-linear-gradient';

class TransactionStatusView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.data,
    };
    this.checkout = React.createRef();
    this.paymentLinkWebView = React.createRef();
  }

  componentDidMount() {
    if (this.props.showSheet) {
      this.RBSheet.open();
    }
  }

  render() {
    let orderDetails = this.props.orderDetails;
    let successCase =
      orderDetails.is_success === 'true' ||
      orderDetails.status_code === '2000' ||
      orderDetails.status_reason === 'SUCCESS';
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
        <RBSheet
          customStyles={{
            container: {
              height: this.props.containerHeight || '80%',
              backgroundColor: this.props.backgroundColor || 'white',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}
          closeOnDragDown={false}
          closeOnPressMask={false}
          animationType={'slide'}
          onClose={this.props.onClose}
          ref={ref => {
            this.RBSheet = ref;
          }}
          openDuration={250}>
          <LinearGradient
            colors={
              successCase
                ? [
                    'rgba(146, 227, 222, 0.3)',
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                  ]
                : [
                    'rgba(252, 107, 45, 0.3)',
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                  ]
            }>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 160,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: successCase ? '#92e3de' : '#fc6b2d',
                }}>
                <View
                  style={{
                    height: 50,
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      successCase
                        ? require('../../assets/whiteTick.png')
                        : require('../../assets/cancel.png')
                    }
                    style={{
                      alignSelf: 'center',
                      width: 31,
                      height: 25,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </View>
              {!successCase ? (
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '900',
                    fontSize: 22,
                    marginHorizontal: 80,
                    marginTop: 10,
                  }}>
                  Payment Failed
                </Text>
              ) : null}
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: 20,
                  marginHorizontal: 80,
                  marginTop: 10,
                }}>
                {successCase
                  ? 'Order placed Successfully '
                  : `${orderDetails.message || orderDetails.status_reason}`}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginHorizontal: 50,
                borderRadius: 15,
                marginTop: 150,
                marginBottom: 20,
                height: 50,
                backgroundColor: 'black',
                alignItems: 'center',
              }}
              onPress={() => {
                this.RBSheet?.close();
                this.props.onClose();
              }}>
              <View
                style={{
                  marginHorizontal: 50,
                  borderRadius: 15,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Ok
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </RBSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  successStyle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 6,
    textAlign: 'center',
  },
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    height: '100%',
  },
});

export default TransactionStatusView;
