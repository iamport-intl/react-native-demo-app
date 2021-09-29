import React from 'react';
import {TouchableOpacity, Image, View, Text} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import HomeScreen from './screens/Home';
import ShopScreen from './screens/Shop';
import PaymentScreen from './screens/Payment';
import CheckoutScreen from './screens/Checkout';
import {APP_THEME_COLOR, BOLD, WHITE_COLOR} from './constants';
import {LogBox} from 'react-native';
LogBox.ignoreAllLogs();

// const Tab = createMaterialBottomTabNavigator();

// const HomeTabs = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         unmountOnBlur: true,
//       }}>
//       <Tab.Screen
//         name="Home"
//         component={ShopScreen}
//         options={{
//           tabBarLabel: 'Home',
//           tabBarIcon: ({color, size}) => <Image />,
//         }}
//       />
//       <Tab.Screen
//         name="Search  "
//         component={HomeScreen}
//         options={{
//           tabBarLabel: 'Search',
//           tabBarIcon: ({color, size}) => <Image />,
//         }}
//       />
//       <Tab.Screen
//         name="Products"
//         component={ShopScreen}
//         options={{
//           tabBarLabel: 'Products',
//           tabBarIcon: ({color, size}) => <Image />,
//         }}
//       />
//       <Tab.Screen
//         name="More"
//         component={HomeScreen}
//         options={{
//           tabBarLabel: 'More',
//           tabBarIcon: ({color, size}) => <Image />,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

const RootStack = createStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: WHITE_COLOR, //'#f7287b',
  },
};

function HomeScreen1() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

const App = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <RootStack.Navigator screenOptions={{headerLargeTitle: true}}>
        <RootStack.Screen
          name="Home"
          component={HomeScreen1}
          options={({route, navigation}) => ({
            title: '',
            headerStyle: {
              backgroundColor: WHITE_COLOR,
              shadowRadius: 0,
              shadowOffset: {
                height: 0,
              },
              elevation: 0,
            },
            headerTintColor: APP_THEME_COLOR,
            headerLargeTitle: true,

            headerTitleStyle: {
              fontWeight: BOLD,
              alignSelf: 'flex-end',
              flex: 1,
              marginTop: 10,
            },
          })}
        />
        <RootStack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={({route, navigation}) => ({
            title: '',
            headerStyle: {
              backgroundColor: WHITE_COLOR,
              shadowRadius: 0,
              shadowOffset: {
                height: 0,
              },
            },
            headerLeft: () => (
              <>
                <TouchableOpacity
                  style={{marginLeft: 5, alignItems: 'center'}}
                  activeOpacity={0.5}
                  onPress={() => navigation.goBack()}>
                  <Image
                    source={require('../assets/leftArrow.png')}
                    style={{
                      alignSelf: 'center',
                      width: 25,
                      height: 25,
                      resizeMode: 'stretch',
                      marginTop: 0,
                      marginLeft: 10,
                    }}
                  />
                </TouchableOpacity>
              </>
            ),
          })}
        />
        <RootStack.Screen
          name="Payment"
          component={PaymentScreen}
          options={({route, navigation}) => ({
            title: '',
            headerStyle: {
              backgroundColor: WHITE_COLOR,
              shadowRadius: 0,
              shadowOffset: {
                height: 0,
              },
            },
            headerLeft: () => (
              <>
                <TouchableOpacity
                  style={{marginLeft: 5, alignItems: 'center'}}
                  activeOpacity={0.5}
                  onPress={() => navigation.goBack()}>
                  <Image
                    source={require('../assets/leftArrow.png')}
                    style={{
                      alignSelf: 'center',
                      width: 25,
                      height: 25,
                      resizeMode: 'stretch',
                      marginTop: 0,
                      marginLeft: 10,
                    }}
                  />
                </TouchableOpacity>
              </>
            ),
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
