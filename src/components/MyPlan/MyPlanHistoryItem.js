import React, {Component} from 'react';
import { ListView, Text, Button, ScrollView, View, TouchableHighlight, 
         TouchableOpacity, Image, NativeModules, Platform, NativeEventEmitter  } from 'react-native';

import { connect } from 'react-redux';
import {CardSection, Card} from '../common';

import { Actions, ActionConst } from 'react-native-router-flux';
import { removeClassBookmark, selectClassActions } from '../../actions';
import Swipeout from 'react-native-swipeout';
import * as RNIap from 'react-native-iap';
import {convertSecToDateForReceipt} from '../../helpers/utils';

import colors from '../../styles/colors';

const { RNIapIos, RNIapModule } = NativeModules;

class MyPlanHistoryItem extends Component {
    constructor(props) {
        super(props);  
        this.onPress = this.buySubscribeItem.bind(this);
        
        this.state = {
            expiry: '',
            isExpired: false,
            error:null,
            receiptLength: 0,
            tempTest: '',
            expiryDate: '',
            autoRenew:'',
            autoRenewProdId: '',
            renewalHistory: null
          };
      }

    buySubscribeItem = async(productId) => {
        
        try{
            // Will return a purchase object with a receipt which can be used to validate on your server.
            const purchase = await RNIap.buySubscription(productId);

            // save the receipt if you need it, whether locally, or to your server.
            this.setState({ receipt: purchase.transactionReceipt }, () => Actions.Receipt({ receipt: purchase.transactionReceipt }));

        } catch(err) {
            // standardized err.code and err.message available
            console.warn(err.code, err.message);
            this.setState({error:err})
        }
    }
    
    getReceipt = async(purchase) => {

        const receipt = await RNIap.validateReceiptIos({
            //Get receipt for the latest purchase
             'receipt-data': purchase.transactionReceipt,
             'password': 'eda7e74a54964a228d017bbecb439972'
         }, true);

        //latest_receipt_info returns an array of objects each representing a renewal of the most 
        //recently purchased item. Kinda confusing terminology
        const renewalHistory = receipt.latest_receipt_info.sort((item1, item2) => item2.expires_date_ms - item1.expires_date_ms)
        //this.setState({'renewalHistory' : receipt })
        // let tempTest = '';
        // renewalHistory.forEach(item => {
        //     tempTest = `${tempTest} - ${item.expires_date_ms < Date.now()} - ${convertSecToDateForReceipt(item.expires_date_ms).toLocaleString()}`;
        // });

        //This returns the expiration date of the latest renewal of the latest purchase
        const expiration = renewalHistory[0].expires_date_ms
        //Boolean for whether it has expired. Can use in your app to enable/disable subscription
        console.log(expiration > Date.now())
        this.setState({
            expiry:renewalHistory[0].expires_date_ms, 
            expiryDate: renewalHistory[0].expiration_date,
            isExpired:renewalHistory[0].expires_date_ms < Date.now(), 
            receiptLength:renewalHistory.length,
            autoRenew:renewalHistory[0].auto_renew_status,
            autoRenewProdId: renewalHistory[0].auto_renew_product_id,
            renewalHistory : renewalHistory[0]
        })
    }

    isSubscriptionActive = async () => {
        if (Platform.OS === 'ios') {
            // const availablePurchases = await RNIap.getAvailablePurchases();
            // const sortedAvailablePurchases = availablePurchases.sort(
            // (a, b) => b.transactionDate - a.transactionDate
            // );
            const latestAvailableReceipt = this.props.purchase.transactionReceipt;
        
            const isTestEnvironment = __DEV__;
            const decodedReceipt = await RNIap.validateReceiptIos(
            {
                'receipt-data': latestAvailableReceipt,
                password: ITUNES_CONNECT_SHARED_SECRET,
            },
            isTestEnvironment
            );
            const {latest_receipt_info: latestReceiptInfo} = decodedReceipt;
            const isSubValid = !!latestReceiptInfo.find(receipt => {
            const expirationInMilliseconds = Number(receipt.expires_date_ms);
            const nowInMilliseconds = Date.now();
            return expirationInMilliseconds > nowInMilliseconds;
            });
            return isSubValid;
        }
        if (Platform.OS === 'android') {
            // When an active subscription expires, it does not show up in
            // available purchases anymore, therefore we can use the length
            // of the availablePurchases array to determine whether or not
            // they have an active subscription.
            const availablePurchases = await RNIap.getAvailablePurchases();
        
            for (let i = 0; i < availablePurchases.length; i++) {
            if (SUBSCRIPTIONS.ALL.includes(availablePurchases[i].productId)) {
                return true;
            }
            }
            return false;
        }
    } 

    componentDidMount = async() => {
        await this.getReceipt(this.props.purchase);
      }
    
    //   componentWillUnmount() {
    //     if (this._asyncRequest) {
    //       this._asyncRequest.cancel();
    //     }
    //   }
    
    render(){
        const {productId, transactionDate, product} = this.props.purchase;
        

        let unBookmarkButton = {
            text: 'Unbookmark',
            backgroundColor: '#ffbe76',
            underlayColor: '#ffbe76',
            onPress: () => { 
                this.props.removeClassBookmark(productId, null, "student")
                }
        }
        
        let swipeBtns = [unBookmarkButton];

        return (
            
            <Card>
                {/* <Swipeout right={swipeBtns}
                    autoClose={true}
                    backgroundColor= 'transparent'> */}
                    <TouchableHighlight underlayColor='#0984e3'>
                        <View>
                            <CardSection>
                                <Text style={styles.titleStyle}>{`${product.title}(${product.currency})` } </Text>
                            </CardSection>
                            
                            <CardSection>
                                <Text style={styles.descStyle}> Purchase Date: { convertSecToDateForReceipt(transactionDate).toLocaleString()} </Text>
                            </CardSection>
                            <CardSection>
                                <Text style={[styles.descStyle, {color: this.state.isExpired ? 'red':'blue'}]}> Expiry: {convertSecToDateForReceipt(this.state.expiry).toLocaleString()}</Text>
                            </CardSection>

                        </View>
                    </TouchableHighlight>
                {/* </Swipeout> */}
            </Card>
        );
    }

}


const styles = {
    titleStyle: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.green01,
      paddingLeft: 5,
      textAlign: 'left'
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20
      }
  };



const MapStateToProps = ({oClass}) =>
{
    //console.log('org state', state);
    //const { MyPlanHistoryItem } = oClass; 
    
    return {};
}

export default connect(MapStateToProps, {removeClassBookmark, selectClassActions})(MyPlanHistoryItem);
