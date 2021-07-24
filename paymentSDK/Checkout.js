import React from 'react';
import { View, Linking, Modal, ActivityIndicator, StyleSheet, SafeAreaView, Text, Button } from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import axios from 'axios';
import { bodyParams, requiredParams, initiateURL, api } from './constants';

class Checkout extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            initiatingPayment: false,
            paymentURL: "",
            loadPaymentPage: false,
            showPaymentModal:false,
            pageLoading:false,
            messageFromWebView:"",
        }
    }

    setPageLoading = (val) => {
        this.setState({
            pageLoading:val
        })
    }

    _prepareRequestBody = () => {
        let body = {}
        let props = {...this.props};
        let missingParams = requiredParams.filter((item)=>(Object.keys(props).includes(item)==false));
        if(missingParams.length==0){
            requiredParams.forEach((param)=>{
                body[bodyParams[param]] = props[param];
            });
        }
        return { body, missingParams };
    }

    initiatePayment =  () => {
        let { body, missingParams } = this._prepareRequestBody();
        let { testing } = this.props;
        console.log("body:",body);
        if(missingParams.length==0){
            const { chaipayKey } = this.props;
            return(
                new Promise((resolve, reject) => {
                    let url = initiateURL[testing?"test":"prod"]+api["initiatePayment"];
                    body = JSON.stringify(body);
                    let requestConfig = {
                        timeout:30000, 
                        headers:{
                            "Authorization":`Bearer ${chaipayKey}`,
                            "Accept":"*/*",
                            "Content-Type":"application/json"
                        }
                    }
                    console.warn(`url : ${url}====body: ${body}===== requestConfig : ${JSON.stringify(requestConfig)}`);
                    axios.post(url, body, requestConfig)
                    .then((response)=>{
                        console.warn("Response : "+JSON.stringify(response))
                        let data = response.data;
                        
                        if(data["redirect_url"]){
                            this.setState({
                                paymentURL:data["redirect_url"],
                                showPaymentModal:true
                            },()=>{
                                resolve(true)
                            });
                        }
                    }).catch((error)=>{
                        console.log("Error : ", error);
                        if(error.response){
                            reject(error.response.data);
                        }else{
                            reject({"message":"Something went wrong, please contact administrator", "is_success":false});
                        }
                    });
                })
            )
        }else{
            let errorMessage = missingParams.join(", ")+" are required.";
            alert(errorMessage);
            return;
        }
    }

    _handleInvalidUrl = ( event ) =>{
        const { redirectUrl } = this.props;
        let url = event.url;
        if(url.startsWith(redirectUrl)==false){
            return true;
        }else{
            Linking.openURL(url);
            return false;
        }
    }

    _handleError = (error) => {
        const {nativeEvent} = error;
        console.warn("Error from webview ", JSON.stringify(nativeEvent));
        const { callbackFunction } = this.props;
        this.setState(
        {
            pageLoading: false,
            showPaymentModal:false
        },
        () => {
            callbackFunction(nativeEvent);
        }
        );
    }

    _onMessage = (event) => {
        if(event.persist){
            console.warn("event persist exists:");
            event.persist();
            event.preventDefault();
        }
        const { callbackFunction } = this.props;
        console.warn("ON message called s: "+JSON.stringify(event))
        this.setState(
        {
            pageLoading: false,
            messageFromWebView: event.nativeEvent.data,
            showPaymentModal:false
        },
            () => callbackFunction(this.state.messageFromWebView)
        );
    }

    _onClose = () =>{
        const { callbackFunction } = this.props;
        this.setState({
            initiatingPayment: false,
            paymentURL: "",
            loadPaymentPage: false,
            showPaymentModal:false,
            pageLoading:false,
            messageFromWebView:"",
        },()=>{
            callbackFunction({"is_success":false,"message":"Modal closed"})
        });
    }

    _afterResponseFromGateway = (orderRef="", queryString="") =>{
        const { paymentChannel } = this.props;
        let url = "https://dev-api.chaipay.io/api/handleShopperRedirect/"+paymentChannel+"?chaiMobileSDK=true&"+queryString;
        console.warn("URL after payment Gateway : ",url);
        let chaipayKey = "lzrYFPfyMLROallZ";
        let requestConfig = {
            timeout:30000, 
            headers:{
                "Authorization":`Bearer ${chaipayKey}`,
                "Accept":"*/*",
                "Content-Type":"application/json"
            }
        }
        return(new Promise((resolve, reject)=>{
            axios.get(url, requestConfig)
            .then((response)=>{
                console.warn("Response after callback : "+JSON.stringify(response))
                resolve(response.data);
            }).catch((error)=>{
                // console.warn("Error from handleShopperRedirect : ", error )
                if(error.response){
                    reject(error.response.data);
                }else{
                    reject({"message":"Something went wrong, please contact administrator", "is_success":false});
                }
            })
        }))
    }
    componentDidMount() {
        const { redirectUrl, callbackFunction } = this.props;
        Linking.removeAllListeners('url');

        Linking.addEventListener('url', async (event)=>{
            this.setPageLoading(true);
            try{
                let url = event?.url??"none";
                console.warn("Hey there I am called ", redirectUrl, url)
                if(url!="none" && url.startsWith(redirectUrl)){
                    this._onClose();
                    let dataFromLink = url.split("?")[1]
                    let dataToBeSaved = await this._afterResponseFromGateway("", dataFromLink);
                    console.warn("Response after callback : ",dataToBeSaved)
                    callbackFunction(dataToBeSaved)
                }
            }catch(error){
                console.warn("Error occurred ", error)
                callbackFunction(error);
            }
            this.setPageLoading(false);
        });
        return(()=>{
          Linking.removeEventListener('url')
        })
      }

    render(){
        const { showPaymentModal, paymentURL } = this.state;
        let { checkoutButtonTitle, checkoutButtonColor } = this.props;
        const { webviewContainer,checkoutWebView, indicatorView } = styles;
        checkoutButtonTitle = checkoutButtonTitle || "Checkout";
        checkoutButtonColor = checkoutButtonColor || "green"
        return (
            <View>
                <Button 
                    title={checkoutButtonTitle}
                    color={checkoutButtonColor}
                    onPress={()=>{
                        try{
                            this.setPageLoading(true);
                            this.initiatePayment()
                            .then((response)=>{
                                console.warn("Response from api :"+JSON.stringify(response));
                                this.setPageLoading(false);
                            }).catch((error)=>{
                                console.warn("Error response from api :"+JSON.stringify(error));
                                this.setPageLoading(false);
                            })
                        }catch(error){
                            console.warn("Error from checkout ", error);
                        }
                    }}
                />

                <Modal 
                    presentationStyle="fullScreen"
                    animationType="fade"
                    statusBarTranslucent={false}
                    onRequestClose={this._onClose}
                    visible={showPaymentModal}
                >

                    <SafeAreaView style={webviewContainer}>
                    <Text
                        onPress={this._onClose}
                    >
                        Close
                    </Text>
                    {paymentURL?
                        <WebView
                            onShouldStartLoadWithRequest={this._handleInvalidUrl}
                            onLoadStart={()=>{
                                this.setState({
                                    pageLoading:true
                                })
                            }}
                            onLoadEnd={()=>{
                                this.setState({
                                    pageLoading:false
                                })
                            }}
                            scalesPageToFit
                            cacheEnabled={false}

                            onError={this._handleError}
                            onHttpError={this._handleError}
                            onMessage={this._onMessage}

                            startInLoadingState={false}
                            style={checkoutWebView}
                            renderLoading={() => <ActivityIndicator color={"#6464e7"} size={"large"} />}
                            javaScriptEnabled={true}
                            source={{uri:paymentURL}}
                        />
                    :null}
                    {this.state.pageLoading ? (
                        <View style={indicatorView}>
                            <ActivityIndicator color={"#6464e7"} size={"large"} />
                        </View>
                    ) : null}
                    </SafeAreaView>
                </Modal>
            </View>
        )
    }
}

Checkout.propTypes = {
    paymentChannel: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    merchantOrderId: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    successUrl: PropTypes.string.isRequired,
    failureUrl: PropTypes.string.isRequired,
    redirectUrl: PropTypes.string.isRequired,
    callbackUrl: PropTypes.string.isRequired,
    signatureHash: PropTypes.string.isRequired,
    chaipayKey: PropTypes.string.isRequired,
    callbackFunction: PropTypes.func.isRequired,
    testing: PropTypes.bool.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    billingAddress: PropTypes.object.isRequired,
    orderDetails: PropTypes.array.isRequired,
    checkoutButtonColor:PropTypes.string,
    checkoutButtonTitle:PropTypes.string
}

Checkout.defaultProp = {
    paymentChannel: "",
    paymentMethod: "",
    merchantOrderId: "",
    amount: 0,
    currency: "",
    failureUrl: "",
    redirectUrl: "",
    successUrl: "",
    signatureHash: "",
    chaipayKey: "",
    checkoutButtonColor:"green",
    checkoutButtonTitle:"Checkout"
}

const styles = StyleSheet.create({
    indicatorView: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    webviewContainer:{
        flex:1
    },
    checkoutWebView: {
        flex: 1,
        marginTop: 16,
    }
})

export default Checkout
