import React, { Component } from 'react';
import { View, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

class ChaiPayView extends Component {
  /*LoadingIndicatorView() {
    return (
      <ActivityIndicator
        color='#0a1142'
        size='large'
        style={{
          flex: 1,
          justifyContent: 'center'
        }}
      />
    )
  } 
  */
  render() {
    //console.log(this.props)
    //console.log(this.props.route.params)
    return (//Linking.openURL(this.props.route.params.url)
      <WebView
            ref="webview"
            source={{uri:this.props.route.params.url}}
            javaScriptEnabled = {true}
            domStorageEnabled = {true}
            startInLoadingState={false}
            originWhitelist={['momo://*','zalopay://*']}
            /*{...this.props}
            originWhitelist={['http://*', 'https://*', 'file://*','momo://*','zalopay://*','*']}
            targetWhitelist={true}
            bounces={false}
            allowFileAccess={true}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            geolocationEnabled={true}
            saveFormDataDisabled={true}
            allowFileAccessFromFileURLS={true}
            allowUniversalAccessFromFileURLs={true}
            setSupportMultipleWindows={true}
            source={{ uri: this.props.route.params.url }}
            style={{ marginTop: 20 }}
            renderLoading={this.LoadingIndicatorView}
            startInLoadingState={true}
            setSupportMultipleWindows={true}*/
            />
            );
  }
}

export default ChaiPayView