import React, { Component } from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import { APP_THEME_COLOR, TRANSPARENT } from '../constants';

class CheckboxView extends Component {


    render(){
        return(
            <TouchableOpacity style={{flexDirection: 'row', marginHorizontal: 50,  marginVertical: 15}}  onPress ={() => this.props.didSelected(this.props.item)}>
                <View style={{borderRadius: 5, height: 20, width: 20, borderWidth: 1, borderColor: APP_THEME_COLOR, backgroundColor: this.props.isSelected? APP_THEME_COLOR : TRANSPARENT}}></View>
                <Text style={{marginLeft: 20, fontSize: 15, fontWeight: '400'}}>{this.props.item.name}</Text>
            </TouchableOpacity>
        )

        }
    
}

export default CheckboxView