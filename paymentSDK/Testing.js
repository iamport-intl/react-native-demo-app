import React, {Component} from 'react';
import {FlatList, Modal} from 'react-native';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Checkout from './Checkout';

class Testing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.data,
      selectedItem: {},
      search: '',
      changeTextFieldVordercolor: false,
    };
    this.checkout = React.createRef();
    this.paymentLinkWebView = React.createRef();
  }

  afterCheckout = transactionDetails => {
    if (transactionDetails) {
      console.log('TransactionDetails');
      this.setState({orderDetails: transactionDetails});
    }
  };

  render() {
    console.log(this.props.headerImage);

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: this.props.payNowButtonColor,
            height: this.props.payNowButtonHeight || 50,
            marginVertical: 20,
            marginHorizontal: 20,
            justifyContent: 'center',
            borderRadius: this.props.payNowButtonCornerRadius || 10,
          }}
          onPress={() => {
            let newPayload = {
              ...this.props.payload,
              environment: 'live',
            };
            console.log('Custom Hnadke', this.props.payload);

            var response =
              this.checkout.current.startPaymentWithWallets(newPayload);
            this.setState({showLoader: false});

            this.props.afterCheckout(response);
          }}>
          <View style={{backgroundColor: 'red'}}>
            <Text
              style={{
                paddingHorizontal: 20,
                textAlign: 'center',
                color: 'white',
              }}>
              Pay Now
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    height: '100%',
  },
  searchBar: {
    margin: 10,
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 20,
    marginHorizontal: 25,
  },
});

export default Testing;
