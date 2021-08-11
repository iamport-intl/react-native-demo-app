import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Image } from 'react-native-elements';
import Card from '../../elements/Card'
class Product extends React.Component {
    render() {
        return (
            <View style={styles.product}>
                <Card>
                    <Image
                        source={{ uri: this.props.data.img }}
                        style={styles.image}
                    />
                    {console.log(this.props.data.img)}
                    <View style={styles.productName}>
                        <Text style={styles.name} h2>
                            {this.props.data.name}
                        </Text>
                        <Text style={styles.price} h4>
                            ₫ {this.props.data.price}
                        </Text>
                    </View>
                    <Button
                        type="clear"
                        title='Buy now'
                        color="#3D3D3D"
                        onPress={() => {
                            this.props.navigation.navigate('Checkout', {
                            price: this.props.data.price,
                            //navigation:this.props.navigation
                        })}}
                    />
                </Card>
            </View>
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
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10
    },
    price: {
        fontWeight: 'bold',
        marginBottom: 10
    },
    description: {
        fontSize: 10,
        color: '#3D3D3D'
    },
    product: {
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center'
    },
    productName: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image:{
  
        height:180,
        alignItems:'center',
        justifyContent: 'center'
    }
});

export default Product;