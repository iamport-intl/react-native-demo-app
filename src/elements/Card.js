import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { IMAGE_BACKGROUND_COLOR } from '../constants';

const Card = props => {

return (
    <View style={{...styles.card,...props.style}}>
        {props.children}
    </View>
);

}

const styles = StyleSheet.create({
    card: {
        elevation:5,
        padding:5,
        alignItems: 'center',
        backgroundColor: IMAGE_BACKGROUND_COLOR,
        marginVertical:5,
        borderRadius:15
    }
})

export default Card