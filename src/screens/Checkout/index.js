import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Card from '../../elements/Card';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer:{
    width:300,
    maxWidth:'80%',
    padding:30
  },
  name: {
    color: '#3D3D3D',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    marginVertical:10
},
price: {
  color: '#3D3D3D',
  fontSize: 15,
  fontWeight: 'bold',
  marginBottom: 10,
  alignSelf: 'center',
  padding:10
}
});

class Checkout extends React.Component {
  render(){
      console.log(this.props)
      var amount = this.props.route.params.price;
      if (!amount) {
        amount=1000000
      }
      return (
        <View style={styles.container}>
          <Card style={styles.cardContainer}>

          <Text style={styles.name}>Checkout</Text>
          <Text style={styles.price}>Amount: {this.props.route.params.price}</Text>
          <Button
            type="clear"
            title='Pay with ZaloPay'
            color='#3D3D3D'
            onPress={() => this.props.navigation.navigate('Payment',{
                price: this.props.route.params.price,
                //navigation: this.props.navigation,
                method:'ZALOPAY_WALLET',
                channel:'ZALOPAY'
              })}
             />
             <Text> {'\n'} </Text>
             <Button
            type="clear"
            title='Pay with VNPay'
            color='#3D3D3D'
            onPress={() => this.props.navigation.navigate('Payment',{
                price: this.props.route.params.price,
                //navigation: this.props.navigation,
                method:'VNPAY_ALL',
                channel:'VNPAY'
              })}
             />
             <Text> {'\n'} </Text>
             <Button
            type="clear"
            title='Pay with MomoPay'
            color='#3D3D3D'
            onPress={() => this.props.navigation.navigate('Payment',{
                price: this.props.route.params.price,
                //navigation:this.props.navigation,
                method:'MOMOPAY_WALLET',
                channel:'MOMOPAY'
              })}
             />
          </Card>

        </View>
        
      );
  }
};

export default Checkout;