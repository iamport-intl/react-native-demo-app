/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Image, View, StatusBar, Platform} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import ShopScreen from './src/screens/Shop';

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
        tabBarScrollEnabled: true,
        tabBarIndicator: () => null,
        tabBarStyle: {
          backgroundColor: '#000',
        },
        tabBarItemStyle: {
          width: 'auto',
          alignItems: 'flex-start',
        },
        tabBarLabelStyle: {
          fontSize: 30,
          color: '#fff',
          textTransform: 'capitalize',
        },
        height: 50,
      }}>
      <Tab.Screen
        name="Home"
        component={ShopScreen}
        screenOptions={{
          backgroundColor: 'red',
          tabBarScrollEnabled: true,
          tabBarIndicatorStyle: {
            backgroundColor: 'blue',
            height: 8,
          },
        }}
        sceneContainerStyle={{backgroundColor: 'green'}}
        options={() => {
          return {
            tabBarScrollEnabled: true,
            tabBarIndicatorStyle: {
              backgroundColor: 'blue',
              height: 8,
            },
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
