import { sum, sumBy, values } from 'lodash';
import React from 'react';
import { Dimensions } from 'react-native';
import { View, ScrollView, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { APP_THEME_COLOR, BOLD, HEDER_TITLES, LIGHTGRAY, ORDERTEXT, WHITE_COLOR } from '../../constants';
import Card from '../../elements/Card';
import CheckboxView from '../../helpers/CheckboxView';
import HorizontalTextStackView from '../../helpers/HorizontalTextStackView';
import ScheduledProductCell from '../../screens/SelectedProductCell';

const {width, height} = Dimensions.get('screen')

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE_COLOR
  }, 
  container: {
    flex: 1,
  },
  flatListView: { flex: 1, maxHeight: height/2,marginHorizontal: 15, marginVertical: 10, 
    shadowRadius: 1,
    shadowOffset: {
        height: 1,
      },
              
  borderColor: '#ddd',

  borderBottomWidth: 0.5,
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
}, 
payNowContainerView: {width: width, backgroundColor: WHITE_COLOR, marginBottom: 50},
payNowView: {
  height: 50,
  alignItems: 'center', 
  marginBottom: 10,borderRadius: 5, 
  paddingVertical: 15, 
  width: width - 40, 
  alignSelf: 'center', 
  backgroundColor: APP_THEME_COLOR
},
payNowTextView: {
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: WHITE_COLOR,
    flex: 1,
    fontWeight: BOLD,
    fontSize: 16,
  },
  headerView: {
    marginTop: 20, 
    paddingBottom: 20,   
    backgroundColor: WHITE_COLOR,
    shadowRadius: 1,
    shadowOffset: {
        height: 1,
      },
              
  borderColor: '#ddd',

  borderBottomWidth: 0.5,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  
  },
  featuredText: {textAlign: 'left',color: APP_THEME_COLOR, fontSize: 40, fontWeight: BOLD, marginTop: -20, marginHorizontal: 20,},
  paymentView: {marginHorizontal: 15, paddingVertical: 20,flex: 1, width : width -30,  shadowRadius: 1,
    shadowOffset: {
        height: 1,
      },
      borderColor: '#ddd',

  borderBottomWidth: 0.5,
  shadowColor: '#000000',
  },
  paymentText: { fontWeight: '700', fontSize: 22, color: HEDER_TITLES, marginBottom: 15,},

});

class Checkout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
     selectedItem: {},
    }
  }

  static navigationOptions = ({navigation}) => {

    const { params } = navigation.state;
       return {
         title:  'Techup.co.in',
         headerStyle: {
             backgroundColor: '#0570E9',
         },
         headerTintColor: '#fff',
         headerTitleStyle: {
             fontWeight: 'bold',
         },
         
         headerRight:(
           <TouchableOpacity 
             style={{padding:5, marginHorizontal:10}} 
             onPress={()=>params.onPressMethod()}>   
             <Text style={{color:"#FFFFFF"}}>My Cart</Text>
           </TouchableOpacity>)      
       }
  };

  _onClickPaymentSelected = (item) => {
    this.setState({selectedItem: item});
    console.log("Item selected", this.state.selectedItem)
  }

  render(){
      var amount = this.props.route.params.price;
      if (!amount) {
        amount=1000000
      }
      let val = this.state.selectedItem.name
      let totalAmount = sumBy(values(this.props.route.params.selectedProducts), 'price')
      let deliveryAmount = 7.2
      let selectedChannel = val === 'Pay with ZOLO Pay' ? 'ZALOPAY' :  val === 'Pay with MOMO Pay' ?  'MOMOPAY' :  'VNPAY'
      return (
        <View style={{backgroundColor: WHITE_COLOR, flex: 1}}>
          <View style={styles.headerView}>
            <Text style={styles.featuredText}>Checkout </Text>
          </View>
        <ScrollView contentContainerStyle={styles.contentContainerStyle} style={styles.container}>
          <FlatList 
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.flatListView}
          data={values(this.props.route.params.selectedProducts)}
          renderItem={(product) => {
            return <ScheduledProductCell product={product.item}/>
          }}
          keyExtractor={item => item.key}
          />

          <View style={styles.paymentView}>
            <Text style={styles.paymentText}>
              Payment
            </Text>

            <CheckboxView item={{name: 'Pay with ZOLO Pay'}} isSelected={val === 'Pay with ZOLO Pay'} didSelected={this._onClickPaymentSelected} />
            <CheckboxView item={{name: 'Pay with VNPay'}} isSelected={val === 'Pay with VNPAY'} didSelected={this._onClickPaymentSelected}/>
            <CheckboxView item={{name: 'Pay with MOMO Pay'}} isSelected={val === 'Pay with MOMO Pay'} didSelected={this._onClickPaymentSelected}/>
          </View>


          <View style={{marginVertical: 25, width: width -30}}>
          <HorizontalTextStackView item={{name: 'Order', value: `${totalAmount}$`, fontSize: 13, fontWeight: '400', color: ORDERTEXT}}/>
          <HorizontalTextStackView item={{name: 'Delivery', value: `${deliveryAmount}$`,fontSize: 13, fontWeight: '400', color: ORDERTEXT}}/>
          <HorizontalTextStackView item={{name: 'Summary', value: `${totalAmount + deliveryAmount}$`, fontSize: 16, fontWeight: '500', color: ORDERTEXT}}/>
          </View>

        </ScrollView>
        <View style={styles.payNowContainerView}>
        <TouchableOpacity style ={styles.payNowView} disabled ={false} onPress={() => this.props.navigation.navigate('Payment',{
                price: this.props.route.params.price,
                //navigation: this.props.navigation,
                method: selectedChannel === 'ZALOPAY' ? 'ZALOPAY_WALLET' :  selectedChannel === 'MOMOPAY' ? 'MOMOPAY_WALLET' : 'VNPAY_ALL',
                channel: selectedChannel === 'ZALOPAY' ? 'ZALOPAY' :  selectedChannel === 'MOMOPAY' ? 'MOMOPAY' : 'VNPAY',
                orderId: "MERCHANT" + new Date().getTime(),
                price: totalAmount
              })}>
              <Text style={styles.payNowTextView}>Pay Now</Text>
             </TouchableOpacity>
        </View>     
        </View>
      );
  }
};

export default Checkout;