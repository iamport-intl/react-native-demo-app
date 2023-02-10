/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {TouchableOpacity, Image, View, StatusBar, Platform} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import HomeScreen from './src/screens/Home';
import ShopScreen from './src/screens/Shop';
import PaymentScreen from './src/screens/Payment';
import LanguageScreen from './src/screens/LanguageScreen';
import CountryScreen from './src/screens/CountryScreen';
import ChangeToCustomStyles from './src/screens/ChangeToCustomStyles';

import Profile from './src/screens/Profile';
import More from './src/screens/More';
import CheckoutScreen from './src/screens/Checkout';
import CheckoutUIScreen from './src/screens/CheckoutUI';
import CheckoutUI2Screen from './src/screens/CheckoutUI2';
import {
  APP_THEME_COLOR,
  BOLD,
  IMAGE_BACKGROUND_COLOR,
  strings,
  WHITE_COLOR,
} from './src/constants';
import {LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {localizeString} from './src/helpers/LocalizeString';

LogBox.ignoreAllLogs();
console.reportErrorsAsExceptions = false;

const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {
  AsyncStorage.getItem('selectedLanguage').then(data => {
    if (data) {
      let parsedData = JSON.parse(data);
      //strings.setLanguage(parsedData.code);
    }
  });

  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
      }}>
      <Tab.Screen
        name="Home"
        component={ShopScreen}
        options={() => {
          return {
            tabBarLabel: strings.home,
            tabBarIcon: ({color, size}) => (
              <Image
                style={{width: 15, height: 15, resizeMode: 'contain'}}
                source={require('./assets/home.png')}
              />
            ),
          };
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: strings.profile,
          tabBarIcon: ({color, size}) => (
            <Image
              style={{width: 15, height: 15, resizeMode: 'contain'}}
              source={require('./assets/user.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{
          tabBarLabel: strings.action_settings,
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
          name="Home Tabs"
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
              backgroundColor: 'white',
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
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      navigation?.pop();
                    } else {
                      navigation?.goBack();
                    }
                  }}>
                  <Image
                    source={require('./assets/close.png')}
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
          name="Checkout UI"
          component={CheckoutUIScreen}
          options={({route, navigation}) => ({
            title: 'Chaiport Checkout',
            headerStyle: {
              backgroundColor: 'transparent',
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
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      navigation?.pop();
                    } else {
                      navigation?.goBack();
                    }
                  }}>
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
          name="Checkout UI 2"
          component={CheckoutUIScreen}
          options={({route, navigation}) => ({
            title: 'Chaiport Checkout',
            headerStyle: {
              backgroundColor: 'transparent',
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
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      navigation?.pop();
                    } else {
                      navigation?.goBack();
                    }
                  }}>
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
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      navigation?.pop();
                    } else {
                      navigation?.goBack();
                    }
                  }}>
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
          name="LanguageScreen"
          component={LanguageScreen}
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
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      navigation?.pop();
                    } else {
                      navigation?.goBack();
                    }
                  }}>
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
          name="CountryScreen"
          component={CountryScreen}
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
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      navigation?.pop();
                    } else {
                      navigation?.goBack();
                    }
                  }}>
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
          name="ChangeToCustomStyles"
          component={ChangeToCustomStyles}
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
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      navigation?.pop();
                    } else {
                      navigation?.goBack();
                    }
                  }}>
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
