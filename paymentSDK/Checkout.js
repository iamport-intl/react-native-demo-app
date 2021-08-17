import React from 'react';
import { View, Dimensions, Linking, Modal, ActivityIndicator, StyleSheet, SafeAreaView, Text, Button, TouchableOpacity ,Image} from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import axios from 'axios';
import { bodyParams, requiredParams, initiateURL, api } from './constants';

import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

class Checkout extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            initiatingPayment: false,
            paymentURL: "",
            loadPaymentPage: false,
            showPaymentModal:false,
            pageLoading:true,
            messageFromWebView:"",
            secretHash: "",
            originList: ["momo://", "zalopay://"]
        }
    }

    setPageLoading = (val, callback=undefined) => {
        this.setState({
            pageLoading:val
        },()=>{
            if(callback){
                callback()
            }
        });
    }

    _createHash = (data, secretKey)=>{
          let message = "";
          message = "amount="+encodeURIComponent(data["amount"])+"&currency="+encodeURIComponent(data["currency"])+"&failure_url="+encodeURIComponent(data["failure_url"])+"&merchant_order_id="+encodeURIComponent(data["merchant_order_id"])+"&pmt_channel="+encodeURIComponent(data["pmt_channel"])+"&pmt_method="+encodeURIComponent(data["pmt_method"])+"&success_url="+encodeURIComponent(data["success_url"])
        
          let hash = hmacSHA256(message, secretKey);
          let signatureHash = Base64.stringify(hash);
          return signatureHash
    }

    _fetchHash = async ( props ) => {
        
        this.setPageLoading(true);
        let secretHash = "";
        const { paymentChannel, paymentMethod, failureUrl, successUrl, chaipayKey, amount, currency, 
            fetchHashUrl, merchantOrderId, secretKey, callbackFunction} = props;
        let data = {
            "key": chaipayKey,
            "pmt_channel": paymentChannel,
            "pmt_method": paymentMethod,
            "merchant_order_id": merchantOrderId,
            "amount": amount,
            "currency": currency,
            "success_url": successUrl,
            "failure_url": failureUrl,
        };
        if(!Boolean(fetchHashUrl) && !Boolean(secretKey)){
            return secretHash;
        }
        else if(fetchHashUrl==undefined){
            secretHash = this._createHash(data, secretKey);
        }else{
            let url = fetchHashUrl;
            let body = data;
            
            let requestConfig = {
                timeout:30000, 
                headers:{
                    "Accept":"*/*",
                    "Content-Type":"application/json"
                }
            }
            try{
                let response = await axios.post(url, body, requestConfig)
                secretHash = response.data["hash"];
            }catch(err){
                callbackFunction({
                    "status": "failure",
                    "message": err
                })
            }
        }
        this.setPageLoading(false);
        return secretHash;
    }

    _prepareRequestBody = async () => {
        let body = {}
        let props = {...this.props};
        props["signatureHash"] = await this._fetchHash({...this.props});
        console.warn("Signature hash value : ", props["signatureHash"])
        let missingParams = requiredParams.filter((item)=>{
            let output = false;
            if(item.includes("/")){
                let keyMissing = item.split("/").filter((key)=>((Object.keys(props).includes(key)==false) || !(Boolean(props[key]))))
                output = (keyMissing.length==(item.split("/").length));
            }else{
                output = ((Object.keys(props).includes(item)==false) || !(Boolean(props[item])))
            }
            return output;
        });

        if(missingParams.length==0){
            requiredParams.forEach((param)=>{
                body[bodyParams[param]] = props[param];
            });
            body[bodyParams["signatureHash"]] = props["signatureHash"]
        }
        return { body, missingParams };
    }


    initiatePayment = async() => {
        let { body, missingParams } = await this._prepareRequestBody();
        let { callbackFunction, env } = this.props;
        env = env || "dev";

        if(missingParams.length==0){
            const { chaipayKey } = this.props;
            return(
                new Promise((resolve, reject) => {
                    let url = initiateURL[env]+api["initiatePayment"];
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
                                showPaymentModal:true,
                                initiatingPayment:false
                            },()=>{
                                resolve(true)
                            });
                        }
                    }).catch((error)=>{
                        this.setState({
                            initiatingPayment:false
                        },()=>{
                            if(error.response){
                                reject(error.response.data);
                            }else{
                                reject({"message":"Something went wrong, please contact administrator", "is_success":false});
                            }
                        });
                    });
                })
            )
        }else{
            let errorMessage = missingParams.join(", ")+" are required.";
            // alert(errorMessage);
            callbackFunction({
                "status": "failure",
                "message": errorMessage
            })
            return;
        }
    }

    _handleInvalidUrl = ( event ) =>{
        const { redirectUrl } = this.props;
        const { originList } = this.state;
        let url = event.url;
        let externalUrlFor = originList.filter((origin)=>url.startsWith(origin));
        let openUrlInternally = ((url.startsWith(redirectUrl)==false) && (externalUrlFor.length==0))
        console.log('openUrl', url)
        if(!openUrlInternally){
            Linking.openURL(url).
            catch(
                (error)=>{
                    this._handleError(error)
                }
            );
        }
        return openUrlInternally;
    }

    _handleError = (error) => {
        const { nativeEvent } = error;
        const { callbackFunction } = this.props;
        this.setState(
        {
            pageLoading: false,
            showPaymentModal:false
        },
        () => {
            if(nativeEvent){
                callbackFunction(nativeEvent);
            }else{
                callbackFunction({"status":"failed", "message":error});
            }
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
                if(error.response){
                    reject(error.response.data);
                }else{
                    reject({"message":"Something went wrong, please contact administrator", "is_success":false});
                }
            })
        }))
    }

    initateThePayment = () => {
        try{
            this.setState({
                initiatingPayment:true
            },()=>{
                this.initiatePayment()
                .then((response)=>{
                    console.warn("Response from api :"+JSON.stringify(response));
                }).catch((error)=>{
                    console.warn("Error response from api :"+JSON.stringify(error));
                })
            })
        }catch(error){
            console.warn("Error from checkout ", error);
        }
    
    }
    componentDidMount() {
        const { redirectUrl, callbackFunction } = this.props;
        Linking.removeAllListeners('url');
            this.initateThePayment()
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

    componentWillUnmount(){
        Linking.removeAllListeners('url');
    }

    render(){
        const { showPaymentModal, paymentURL, initiatingPayment, originList } = this.state;
        let { checkoutButtonTitle, checkoutButtonColor, checkoutButton, closeButton} = this.props;
        const { webviewContainer,checkoutWebView, indicatorView, checkOutViewStyle, checkoutButtonTitleStyle } = styles;
        checkoutButtonTitle = initiatingPayment?"Please wait...":(checkoutButtonTitle || "Checkout");
        checkoutButtonColor = checkoutButtonColor || "green"
        
        return (
            <View>
            {/* {       
                checkoutButton?
                checkoutButton:
                <TouchableOpacity style={checkOutViewStyle} onPress={()=>{
                    try{
                        this.setState({
                            initiatingPayment:true
                        },()=>{
                            this.initiatePayment()
                            .then((response)=>{
                                console.warn("Response from api :"+JSON.stringify(response));
                            }).catch((error)=>{
                                console.warn("Error response from api :"+JSON.stringify(error));
                            })
                        })
                    }catch(error){
                        console.warn("Error from checkout ", error);
                    }
                }}>
                <Text style={checkoutButtonTitleStyle}>CHECKOUT</Text>
                </TouchableOpacity>
            } */}
                <Modal 
                    presentationStyle="fullScreen"
                    animationType="fade"
                    statusBarTranslucent={false}
                    onRequestClose={this._onClose}
                    visible={showPaymentModal}
                >

                    <SafeAreaView style={webviewContainer}>
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity 
                        style={{marginLeft: 5,}} 
                        activeOpacity={0.5} 
                        onPress={this._onClose}
                    >
                        <Image
                        source={require('../assets/close.png')}
                        style={{width: 30, height: 30, resizeMode: 'stretch', marginLeft: 10, marginTop: 0}}
                        />
                    </TouchableOpacity>
                    <Text style={{ alignSelf: 'center',fontWeight: 'bold', fontSize: 18,marginLeft: (width/2 - 90)}}>CHECKOUT</Text>
                    </View>
                    {paymentURL?
                        <WebView
                            originWhitelist={[...originList, "http://", "https://"]}
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
                    {/* <View
                        style={closeButtonContainer}
                    >
                        {
                            closeButton?
                            closeButton:
                            <Text style={closeTextStyle}
                                onPress={this._onClose}
                            >
                                Close
                            </Text>
                        }
                    </View> */}
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
    callbackUrl: PropTypes.string,
    signatureHash: PropTypes.string,
    chaipayKey: PropTypes.string.isRequired,
    callbackFunction: PropTypes.func.isRequired,
    env: PropTypes.string,
    shippingAddress: PropTypes.object.isRequired,
    billingAddress: PropTypes.object.isRequired,
    orderDetails: PropTypes.array.isRequired,
    checkoutButtonColor: PropTypes.string,
    checkoutButtonTitle: PropTypes.string,
    fetchHashUrl: PropTypes.string,
    secretKey: PropTypes.string
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
let width = Dimensions.get('screen').width;
let height = Dimensions.get('screen').height;
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
    },
    closeButtonContainer: {
        backgroundColor: '#3D3D3D',
        borderRadius: 5,
        marginHorizontal: 20,
        alignContent: 'center',
        justifyContent: 'center', 
        height: 40,
        alignSelf: 'center',
        marginBottom: 60,
        width: width - 30,
        marginTop: 20,
    },
    closeTextStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16, textAlign: 'center'
    },
    checkOutViewStyle: {
        backgroundColor: '#3D3D3D',
        borderRadius: 5,
        marginHorizontal: 20,
        alignContent: 'center',
        justifyContent: 'center', 
        height: 40,
        alignSelf: 'center',
        width: width - 30,
        marginTop: (height/2 - 20 - 88)
    },
    checkoutButtonTitleStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

export default Checkout
