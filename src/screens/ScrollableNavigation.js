// import {
//   Container,
//   NavigationBar,
//   HeaderTitle,
//   Border,
//   StatusBar,
//   AppleStyle,
//   constants,
//   useAnimatedValue,
//   useHasReachedTransitionPoint,
//   useMeasurements,
//   Transitioner,
//   Appearer,
// } from 'react-native-scrollable-navigation-bar';

// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Button,
//   ScrollView,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   Modal,
//   SafeAreaView,
//   Platform,
// } from 'react-native';

// export function Example(props) {
//   function Placeholder(props) {
//     return <View style={{height: 200, margin: 50, backgroundColor: 'grey'}} />;
//   }

//   function NavigationBarComponent(props) {
//     return (
//       <NavigationBar
//         title={'Hello World'}
//         titleStyle={{color: 'black'}}
//         backgroundColor={'#f5f5f5'}
//         {...props}
//       />
//     );
//   }

//   function HeaderNavigationBarComponent(props) {
//     return <NavigationBar backgroundColor={'#f5f5f5'} {...props} />;
//   }

//   function HeaderForegroundComponent(props) {
//     return (
//       <HeaderTitle
//         title={'Hello World'}
//         titleStyle={{color: 'black'}}
//         {...props}
//       />
//     );
//   }

//   function HeaderBackgroundComponent(props) {
//     return <View style={{height: 300, backgroundColor: '#f5f5f5'}} />;
//   }

//   function BorderComponent(props) {
//     return <Border backgroundColor={'lightgrey'} height={1} />;
//   }

//   function HeaderBorderComponent(props) {
//     return <Border backgroundColor={'lightgrey'} height={1} />;
//   }

//   return (
//     <View style={{height: 500, width: 300, margin: 'auto'}}>
//       <Container
//         headerHeight={300}
//         HeaderForegroundComponent={HeaderForegroundComponent}
//         HeaderBackgroundComponent={HeaderBackgroundComponent}
//         HeaderNavigationBarComponent={HeaderNavigationBarComponent}
//         NavigationBarComponent={NavigationBarComponent}
//         contentContainerStyle={{backgroundColor: 'white'}}
//         borderHeight={1}
//         BorderComponent={BorderComponent}
//         HeaderBorderComponent={HeaderBorderComponent}>
//         <Placeholder />
//         <Placeholder />
//         <Placeholder />
//         <Placeholder />
//       </Container>
//     </View>
//   );
// }

// import React, {Component} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   TouchableOpacity,
// } from 'react-native';
// import {Checkout} from '@iamport-intl/chaipay-sdk';

// const {width} = Dimensions.get('screen');
// class PayNowButton extends Component {
//   constructor(props) {
//     super(props);
//     this.checkout = React.createRef();
//   }

//   afterCheckout = data => {
//     console.log(data);
//     this.props.afterCheckout(data);
//   };

//   NextView = () => {
//     let style = stylesWithProps(this.props);
//     return (
//       <TouchableOpacity
//         style={style.nextViewContainerStyle}
//         onPress={async () => {
//           this.checkout.current.startPaymentWithWallets(this.props.payload);
//         }}>
//         <Text style={style.btnText}>{this.props.text || 'Pay Now'}</Text>
//       </TouchableOpacity>
//     );
//   };

//   render() {
//     var style = stylesWithProps(this.props);
//     return (
//       <View>
//         <View style={style.containerStyle}>
//           <this.NextView />
//         </View>
//         {/* <Checkout
//           ref={this.checkout}
//           env={this.props.env}
//           currency={this.props.currency}
//           callbackFunction={this.afterCheckout}
//           redirectUrl={this.props.redirectUrl}
//           secretKey={this.props.secretKey}
//           chaipayKey={this.props.chaipayKey}
//           environment={this.props.environment}
//         /> */}
//       </View>
//     );
//   }
// }

// const stylesWithProps = props =>
//   StyleSheet.create({
//     btnText: {
//       textAlign: 'center',
//       color: props.textColor,
//       fontSize: props.textFontSize || 14,
//       fontWeight: props.textFontWeight,
//     },

//     nextViewContainerStyle: {
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: props.themeColor || 'red',
//       paddingVertical: 15,
//       borderRadius: props.borderRadius || 8,
//       paddingHorizontal: 15,
//       width: props.width,
//       height: props.height,
//     },
//     containerStyle: {
//       backgroundColor: 'white',
//       margin: 4,
//       borderRadius: 5,
//       marginHorizontal: 15,
//     },
//   });

// export default ScrollableNavigation;
