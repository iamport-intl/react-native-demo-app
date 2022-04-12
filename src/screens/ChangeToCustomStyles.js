import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Platform,
} from 'react-native';
import {
  APP_THEME_COLOR,
  BOLD,
  currency,
  DARKBLACK,
  descriptionText,
  WHITE_COLOR,
  TRANSPARENT,
  IMAGE_BACKGROUND_COLOR,
  strings,
} from '../constants.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {findIndex, Int} from 'lodash';

import SwitchSelector from 'react-native-switch-selector';

const {width, height} = Dimensions.get('window');
const gutter = 15;

let fontSizeOptions = [
  {
    label: 'Small',
    value: 12,
  },
  {
    label: 'Medium',
    value: 14,
  },
  {
    label: 'Large',
    value: 16,
  },
];

let fontWeightOptions = [
  {
    label: 'Light',
    value: '300',
  },
  {
    label: 'Regular',
    value: '400',
  },
  {
    label: 'Bold',
    value: '600',
  },
];

let colorOptions = [
  {
    label: 'Red',
    value: 'red',
  },
  {
    label: 'Black',
    value: 'black',
  },
  {
    label: 'Green',
    value: 'green',
  },
];

let buttonCornerRadius = [
  {
    label: '5',
    value: 5,
  },
  {
    label: '15',
    value: 15,
  },
  {
    label: '25',
    value: 25,
  },
];

const themeColor = 'darkgray';

class ChangeToCustomStyles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'en',
    };
  }

  getNumber = initialVal => {
    if (initialVal === 2) {
      return 2;
    } else if (initialVal === 0) {
      return 0;
    } else {
      return 1;
    }
  };

  componentDidMount() {
    AsyncStorage.getItem('fontWeight').then(value => {
      this.setState({fontWeight: value});

      if (value !== undefined) {
        let val = fontWeightOptions.findIndex(obj => obj.value === value);
        console.log('val', val);
        val = val < 0 ? 0 : val;
        this.setState({fontWeightIndex: val});
      } else {
        this.setState({fontWeightIndex: 0});
      }
    });
    AsyncStorage.getItem('fontSize').then(data => {
      let value = JSON.parse(data);

      this.setState({fontSize: value});

      console.log('Value', value);
      if (value !== undefined) {
        let val = findIndex(fontSizeOptions, item => {
          return item.value === value;
        });

        val = val < 0 ? 0 : val;
        console.log('fontSizeIndex', val);
        this.setState({fontSizeIndex: val});
      } else {
        this.setState({fontSizeIndex: 0});
      }
    });

    AsyncStorage.getItem('color').then(value => {
      this.setState({color: value});

      if (value !== undefined) {
        let val = findIndex(colorOptions, item => {
          return item.value === value;
        });
        console.log('val 204', val);
        val = val < 0 ? 0 : val;
        this.setState({colorIndex: val});
      } else {
        this.setState({colorIndex: 0});
      }
    });

    AsyncStorage.getItem('borderRadius').then(data => {
      let value = JSON.parse(data);
      this.setState({borderRadius: value});

      if (value !== undefined) {
        let val = findIndex(buttonCornerRadius, item => {
          return item.value === value;
        });
        console.log(val);

        val = val < 0 ? 0 : val;
        this.setState({borderRadiusIndex: val});
      } else {
        this.setState({borderRadiusIndex: 0});
      }
    });
  }

  initialColor = () => {
    this;
    return 0;
  };

  SwitcherView = ({headerText, onPress, options, initialValue}) => {
    return (
      <>
        {initialValue === undefined ? null : (
          <View style={{marginVertical: 10}}>
            <Text style={{margin: 10}}>{headerText}</Text>
            <SwitchSelector
              bold
              initial={initialValue}
              onPress={value => onPress(value)}
              textColor={themeColor}
              selectedColor={'white'}
              buttonColor={themeColor}
              borderColor={themeColor}
              hasPadding
              options={options}
            />
          </View>
        )}
      </>
    );
  };

  onPressFontSize = value => {
    console.log('onPressFontSize', value);
    AsyncStorage.setItem('fontSize', JSON.stringify(value));
  };

  onPressFontWeight = value => {
    console.log('OnPressFontWeight', value);
    AsyncStorage.setItem('fontWeight', value);
  };

  onPressColor = value => {
    console.log('onPressColor', value);
    AsyncStorage.setItem('color', value);
  };

  onPressBorderRadius = value => {
    console.log('onPressBorderRadius', value);
    AsyncStorage.setItem('borderRadius', JSON.stringify(value));
  };

  render() {
    return (
      <View style={{backgroundColor: IMAGE_BACKGROUND_COLOR, flex: 1}}>
        <View style={{backgroundColor: WHITE_COLOR}}>
          <Text
            style={[
              styles.featuredText,
              Platform.OS === 'ios' ? {marginTop: 5} : {marginTop: 30},
            ]}>
            Change To Custom Styles
          </Text>
        </View>
        <View style={{marginHorizontal: 15}}>
          <this.SwitcherView
            headerText={'Font Size'}
            options={fontSizeOptions}
            onPress={this.onPressFontSize}
            initialValue={this.state.fontSizeIndex}
          />

          <this.SwitcherView
            headerText={'Font Weight'}
            options={fontWeightOptions}
            onPress={this.onPressFontWeight}
            initialValue={this.state.fontWeightIndex}
          />
          <this.SwitcherView
            headerText={'Color'}
            options={colorOptions}
            onPress={this.onPressColor}
            initialValue={this.state.colorIndex}
          />

          <this.SwitcherView
            headerText={'Border Radius'}
            options={buttonCornerRadius}
            onPress={this.onPressBorderRadius}
            initialValue={this.state.borderRadiusIndex}
          />
        </View>
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
    color: DARKBLACK,
    fontSize: 14,
    fontWeight: BOLD,
    flex: 1,
    flexWrap: 'wrap',
    paddingVertical: 6,
    paddingBottom: 0,
    textAlign: 'center',
  },

  price: {
    fontWeight: BOLD,
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
    color: APP_THEME_COLOR,
    fontSize: 14,
    textAlign: 'center',
  },

  description: {
    fontSize: 12,
    fontWeight: '600',
    color: descriptionText,
    paddingBottom: 2,
    textAlign: 'center',
  },
  product: {
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center',
    width: (width - gutter * 3) / 2,
    marginBottom: gutter,
    backgroundColor: WHITE_COLOR,
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    alignSelf: 'flex-start',
    borderRadius: 8,
    elevation: 6,
  },
  productName: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    backgroundColor: TRANSPARENT,
  },
  featuredText: {
    textAlign: 'left',
    color: APP_THEME_COLOR,
    fontSize: 30,
    fontWeight: BOLD,
    marginLeft: 15,
    backgroundColor: WHITE_COLOR,
    paddingBottom: 5,
  },
});

export default ChangeToCustomStyles;
