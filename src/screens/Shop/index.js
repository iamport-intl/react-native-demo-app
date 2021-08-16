import React from 'react';
import { View, Text, StyleSheet, Button,ScrollView, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { APP_THEME_COLOR, DARKGRAY, BOLD, LIGHTGRAY, WHITE_COLOR, BLACK } from '../../constants';
import Product from '../Product';
import {isEmpty, omit} from 'lodash'
const {width, height} = Dimensions.get('screen')
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const products = [
  {
    key:1,
    name: 'Bella Toes',
    description: 'Premium quality',
    price: 25,
    img: 'https://demo.chaipay.io/images/bella-toes.jpg'
  },
  {
    key:2,
    name: 'Chikku Loafers',
    description: 'Special design',
    price: 15,
    img: 'https://demo.chaipay.io/images/chikku-loafers.jpg'
  },
  {
    key:3,
    name: '(SRV) Sneakers',
    description: 'White sneakers',
    price: 18,
    img: 'https://demo.chaipay.io/images/banner2.jpg'
  },
  {
    key:4,
    name: 'Shuberry Heels',
    description: 'Comfortable heels',
    price: 30,
    img: 'https://demo.chaipay.io/images/ab.jpg'
  },
  {
    key:5,
    name: 'Red Bellies',
    description: 'Premium quality',
    price: 25,
    img: 'https://demo.chaipay.io/images/red-bellies.jpg'
  },
  {
    key:6,
    name: 'Catwalk Flats',
    description: 'Premium quality',
    price: 15,
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
     constructor(props) {
       super(props)
       this.state = {
        selectedProducts: {},
        allProducts: products
       }
     }

     _didSelectedProducts = (selectedProduct) => {

      if(isEmpty(this.state.selectedProducts)) {
        this.setState({selectedProducts : {[selectedProduct.item.key] : selectedProduct.item}})
      } else {
        if(!isEmpty(this.state.selectedProducts[selectedProduct.item.key])){
          this.setState({selectedProducts : omit(this.state.selectedProducts, selectedProduct.item.key)})
        } else {
          this.setState({selectedProducts : {...this.state.selectedProducts, [selectedProduct.item.key] : selectedProduct.item}})
        }
      }
     }

    render() {
      const productList = products.map(product => <Product key={product.key} data={product} navigation={this.props.navigation} />)
      return (
          <View style ={{flex: 1}}>
          <FlatList 
                    style={{flex:1,
                     paddingHorizontal: 10,paddingVertical: 15, backgroundColor: WHITE_COLOR}}
                    data={products}
                    numColumns={2}
                    keyExtractor={item => item.key}
                    renderItem={
                      (product) => {
                    
                        let didSelectedItem = !isEmpty(this.state.selectedProducts[product.item.key]);
                        return <Product key={product.key} data={{...product, didSelected: didSelectedItem}} navigation={this.props.navigation} onSelectProduct={this._didSelectedProducts}/>
                      }
                    }
                    ListHeaderComponent={() => {
                      return <View style={styles.headerContainerView}>
                               <View style={styles.headerView}>
                               <Text style={styles.featuredText}>Featured</Text>
                               <View style={styles.headerButtonView}>
                                 <Text style={styles.numberOfItemsText}>{`${products.length} items listed`}</Text>
                                 <View style={{flexDirection: 'row'}}>
                                 <TouchableOpacity style={{marginHorizontal: 15, flexDirection: 'row'}}>
                                 <MaterialCommunityIcons name="sort" color={BLACK} size={14} />
                                   <Text style={{color: BLACK, fontSize: 12}}> Sort</Text>
                                 </TouchableOpacity>
                                 <TouchableOpacity style={{marginHorizontal: 15, flexDirection: 'row'}}>
                                  <MaterialCommunityIcons name="filter" color={BLACK} size={14} />
                                   <Text style={{color: BLACK, fontSize: 12}}> filter</Text>
                                 </TouchableOpacity>
                                 </View>
                               </View>
                               </View>
                             </View>
                    }}
                    stickyHeaderIndices={[0]}
                    />

                <View style={styles.buyNowContainerView}>
                  <TouchableOpacity style = {styles.buyNowView} disabled ={isEmpty(this.state.selectedProducts)} onPress={() => {
                    this.props.navigation.navigate('Checkout', {
                      price: '2345',
                      selectedProducts: this.state.selectedProducts
                    })
                  }}>
                          <Text style={styles.buyNowTextView}>Buy Now</Text>
                  </TouchableOpacity>
            </View>     
          </View>
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
  buyNowContainerView: {width: width, backgroundColor: WHITE_COLOR},
  buyNowView: {height: 50,alignItems: 'center', marginBottom: 10,borderRadius: 5, paddingVertical: 15, width: width - 40, alignSelf: 'center', backgroundColor: APP_THEME_COLOR, },
  buyNowTextView: {
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: WHITE_COLOR,
    flex: 1,
    fontWeight: BOLD,
    fontSize: 16,
  },
  headerContainerView: {
    marginTop: -20,
    backgroundColor: WHITE_COLOR
  },
  headerView: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: WHITE_COLOR
  },
  featuredText: {textAlign: 'left',color: APP_THEME_COLOR, fontSize: 40, fontWeight: BOLD, marginTop: -20},
  headerButtonView: {flexDirection: 'row', flex: 1, justifyContent: 'space-between'},
 numberOfItemsText: {flex: 0.5, color: LIGHTGRAY}
});

export default Shop;