import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import { NavigationContainer, DrawerActions, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LandingScreen from './screens/Landing';
import HomeScreen from './screens/Home';
import ProductScreen from './screens/Product';
import ShopScreen from './screens/Shop';
import PaymentScreen from './screens/Payment';
//import ChaiPayView from './screens/ChaiPayView';
import CheckoutScreen from './screens/Checkout';
// import ChaiPayScreen from 'chaipay/ChaiPayScreen';

const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={{
        unmountOnBlur:true
      }}
      >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={20} />
          ),
        }}
        />
      <Tab.Screen 
      name="Products" 
      component={ShopScreen} 
      options={{
        tabBarLabel: 'Products',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="database" color={color} size={20} />
        ),
      }}
      />
    </Tab.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeTabs} />
      <Drawer.Screen name="Products" component={ShopScreen} />
      <Drawer.Screen name="Checkout" component={CheckoutScreen} />
      <Drawer.Screen name="Payment" component={PaymentScreen} />

    </Drawer.Navigator>
  );
};

const RootStack = createStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3D3D3D',//'#f7287b',
  },
};

const App = () => {

  return (
    <NavigationContainer theme={MyTheme}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={HomeDrawer}
          options={({ route, navigation }) => ({
            title: 'ChaiPay Demo App',
            headerStyle: {
              backgroundColor: '#3D3D3D'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              alignSelf: 'center',
              paddingRight: 40
            },
            headerLeft: () => (
              <Button
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
                title="Menu"
                color="#FF2A2A"

              />
            ),
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;