import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button , Dimensions, TouchableOpacity} from 'react-native';
import { Image } from 'react-native-elements';
import { APP_THEME_COLOR, BOLD, imageBackgroundColor, TRANSPARENT } from '../../constants';
import Card from '../../elements/Card'

const { width, height } = Dimensions.get('window');
const gutter = 15;

class Product extends React.Component {

    
    render() {
        return (
            <TouchableOpacity style={[styles.product, this.props.data.didSelected ? {borderColor: APP_THEME_COLOR, borderRadius: 5, borderWidth: 1} : {borderColor: TRANSPARENT}]} onPress={() => this.props.onSelectProduct(this.props.data)}>
                {/* <Card>
                    <Image
                        //source={{ uri: this.props.data.item.img}}
                        
                        source={require('../../../assets/leftArrow.png')}
                        style={styles.image}
                    />
                </Card> */}
                <Image
                        source={{ uri: this.props.data.item.img}}
                        style={styles.image}
                    />
                <View style={{backgroundColor: TRANSPARENT}}>
                <View style={styles.productName}>
                        <Text style={styles.name} h2>
                            {this.props.data.item.name}
                        </Text>
                        <Text style={styles.price} h4>
                            ${this.props.data.item.price}
                        </Text>
                    </View>
                    <Text style={styles.description} h2>
                    {this.props.data.item.description}
                        </Text>
                    {/* <Button
                        type="clear"
                        title='Buy now'
                        color="#3D3D3D"
                        onPress={() => {
                            this.props.navigation.navigate('Checkout', {
                            price: this.props.data.price,
                            //navigation:this.props.navigation
                        })}}
                    /> */}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        color: '#3D3D3D',
        fontSize: 17,
        fontWeight: BOLD,
        marginBottom: 5,

    },

    price: {
        fontWeight: BOLD,
        marginBottom: 10
    },
    description: {
        fontSize: 12,
        fontWeight: '700',
        color: 'lightgray'
    },
    product: {
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',
        width: (width - gutter * 3)/2,
        marginBottom: gutter,
        alignSelf: 'flex-start',
        
    },
    productName: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image:{
  
        height:180,
        alignItems:'center',
        justifyContent: 'center',
        resizeMode: 'contain',
        backgroundColor: TRANSPARENT
    }
});

export default Product;