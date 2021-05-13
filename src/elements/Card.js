import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

const Card = props => {

return (
    <View style={{...styles.card,...props.style}}>
        {props.children}
    </View>
);

}

const styles = StyleSheet.create({
    card: {
        shadowColor:'black',
        shadowRadius:6,
        shadowOpacity:1,
        shadowOffset:{width:2,height:8},
        elevation:5,
        padding:20,
        backgroundColor:'white',
        marginVertical:5,
        borderRadius:15
    }
})

export default Card