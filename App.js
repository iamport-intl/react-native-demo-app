/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// import React from 'react';
// import {View, Text} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import HomeScreen from './src/screens/Shop';

// function HomeScreen1() {
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

// const Stack = createStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={HomeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;

import React from 'react';
import {TouchableOpacity, Image, View, StatusBar, Platform} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import HomeScreen from './src/screens/Home';
import ShopScreen from './src/screens/Shop';
import PaymentScreen from './src/screens/Payment';
import CheckoutScreen from './src/screens/Checkout';
import {APP_THEME_COLOR, BOLD, WHITE_COLOR} from './src/constants';
import {LogBox} from 'react-native';
import {platform} from 'os';
LogBox.ignoreAllLogs();
console.reportErrorsAsExceptions = false;

const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
      }}>
      <Tab.Screen
        name="Home"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Image
              style={{width: 15, height: 15, resizeMode: 'contain'}}
              source={require('./assets/home.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search  "
        component={HomeScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color, size}) => (
            <Image
              style={{width: 15, height: 15, resizeMode: 'contain'}}
              source={require('./assets/search.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({color, size}) => (
            <Image
              style={{width: 15, height: 15, resizeMode: 'contain'}}
              source={require('./assets/products.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={HomeScreen}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({color, size}) => (
            <Image
              style={{width: 15, height: 15, resizeMode: 'contain'}}
              source={require('./assets/more.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RootStack = createStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: WHITE_COLOR, //'#f7287b',
  },
};
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const App = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      {Platform.OS === 'android' ? (
        <View
          style={[
            {
              height: STATUSBAR_HEIGHT,
              backgroundColor: APP_THEME_COLOR,
            },
          ]}>
          <StatusBar translucent={false} barStyle="light-content" />
        </View>
      ) : null}

      <RootStack.Navigator screenOptions={{headerLargeTitle: true}}>
        <RootStack.Screen
          name="Home"
          component={HomeTabs}
          options={({route, navigation}) => ({
            title: '',
            headerShown: Platform.OS === 'android' ? false : true,
            headerStyle: {
              backgroundColor: WHITE_COLOR,
              shadowRadius: 0,
              shadowOffset: {
                height: 0,
              },
              elevation: 3,
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
                    source={require('./assets/leftArrow.png')}
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
                    source={require('./assets/leftArrow.png')}
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
