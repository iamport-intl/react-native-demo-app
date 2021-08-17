import React from 'react';
import { View, Text, StyleSheet, Button,ScrollView } from 'react-native';
import Product from '../Product';

const BASE_URL = '/Users/jatinmitruka/Documents/Chai/React/create-app-3/myReactNativeProject/images';

const products = [
  {
    key:1,
    name: 'Bella Toes',
    price: 4499999,
    img: 'https://demo.chaipay.io/images/bella-toes.jpg'
  },
  {
    key:2,
    name: 'Chikku Loafers',
    price: 387999,
    img: 'https://demo.chaipay.io/images/chikku-loafers.jpg'
  },
  {
    key:3,
    name: '(SRV) Sneakers',
    price: 249999,
    img: 'https://demo.chaipay.io/images/banner2.jpg'
  },
  {
    key:4,
    name: 'Shuberry Heels',
    price: 1865999,
    img: 'https://demo.chaipay.io/images/ab.jpg'
  },
  {
    key:5,
    name: 'Red Bellies',
    price: 2459999,
    img: 'https://demo.chaipay.io/images/red-bellies.jpg'
  },
  {
    key:6,
    name: 'Catwalk Flats',
    price: 3867999,
    img: 'https://demo.chaipay.io/images/catwalk-flats.jpg'
  }
];

class Shop extends React.Component {
      /*componentDidMount() {
        Linking.addEventListener('url', this.handleOpenURL);
      }
      componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
      }
      handleOpenURL(event) {
        console.log(event.url);
        const route = e.url.replace(/.*?:\/\//g, '');
        console.log(route);
        // do something with the url, in our case navigate(route)
      }
      */
    render() {
      const productList = products.map(product => <Product key={product.key} data={product} navigation={this.props.navigation} />)
      return (
          <ScrollView>{productList}</ScrollView>
          
      );
    }
}

const styles = StyleSheet.create({
  row: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
  },
  col: {
      flex: 1,
  },
});

export default Shop;