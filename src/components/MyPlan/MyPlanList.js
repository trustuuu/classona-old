import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TextInput, Modal, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import * as RNIap from 'react-native-iap';
import {convertSecToDateForReceipt} from '../../helpers/utils';
import { Card, CardSection, Input, Button, Spinner, Header, OptimizedFlatList} from '../common';
import MyPlanListItem from './MyPlanListItem';

import colors from '../../styles/colors';

class MySettings extends Component {

    constructor(props){
        super(props);
        this.state = { products: null, product: null};
    }

    async componentDidMount() {
        const itemSkus = Platform.select({
            ios: [
                'com.igoodworks.classona.quarterly', 'com.igoodworks.classona.monthly1' //, 'com.igoodworks.classona.onetime'
            ],
            android: [
                'com.igoodworks.classona.quarterly', 'com.igoodworks.classona.monthly1' //, 'com.igoodworks.classona.onetime'
            ]
        });

        try {
            await RNIap.prepare();
            //const products = await RNIap.getProducts(itemSkus);
            const products = await RNIap.getSubscriptions(itemSkus);
            // this.setState({ products : products.map(p => ({...p, label: `${p.title}(${p.currency}${p.price})`, value: p.productId}))
            //               });
            this.setState({ products : products });

            // await this.getAvailablePurchases();
            // await this.getPurchaseHistory();
        }
        catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }
        
    }

    componentWillUnmount() {
        RNIap.endConnection();
    }
    
    async onPurchase(){
        try{
            // Will return a purchase object with a receipt which can be used to validate on your server.
            const purchase = await RNIap.buyProduct(this.state.productId);
            this.setState({
                receipt: purchase.transactionReceipt, // save the receipt if you need it, whether locally, or to your server.
            });
        } catch(err) {
            // standardized err.code and err.message available
            console.warn(err.code, err.message);
            const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(async (purchase) => {
                                        this.setState({ receipt: purchase.transactionReceipt }, () => this.goToNext());
                                        subscription.remove();
            });
        }
    }

    //https://github.com/dooboolab/react-native-iap/issues/275
    getAvailablePurchases = async() => {
        try {
          console.info('Get available purchases (non-consumable or unconsumed consumable)');
          const purchases = await RNIap.getAvailablePurchases();
          console.info('Available purchases :: ', purchases);
          let temp = '';
          if (purchases && purchases.length > 0) {

            purchases.forEach(purchase => {
                const testReceipt = RNIap.validateReceiptIos(purchase.transactionReceipt, true);
                
                temp = `${temp} : ${purchase.productId} : ${JSON.stringify(testReceipt)} : 
                        ${purchase.transactionDate} : 
                        ${convertSecToDateForReceipt(purchase.transactionDate).toLocaleString()} : 
                        ${purchase.dataAndroid} :
                        ${purchase.autoRenewingAndroid}: 
                        ${purchase.transactionReceipt} :
                        ${purchase.originalTransactionDateIOS} :
                         end`;

                // if (purchase.productId == 'com.example.premium') {
                //   this.setState({ premium: true });
                //   restoredTitles += 'Premium Version';
                // } else if (purchase.productId == 'com.example.no_ads') {
                //   this.setState({ ads: false });
                //   restoredTitles += restoredTitles.length > 0 ? 'No Ads' : ', No Ads';
                // } else if (purchase.productId == 'com.example.coins100') {
                //   CoinStore.addCoins(100);
                //   await RNIap.consumePurchase(purchase.purchaseToken);
                // }
              })

            this.setState({
              availableItemsMessage: `Got ${purchases.length} items.`,
              receipt: purchases[0].transactionReceipt,
              temp: temp
            });
          }
        } catch (err) {
          console.warn(err.code, err.message);
          Alert.alert(err.message);
        }
      }

    getPurchaseHistory = async() => {
        try {
          console.info('Get purchases history (non-consumable or unconsumed consumable)');
          const purchases = await RNIap.getPurchaseHistory();
          console.info('purchase history:: ', purchases);

          if (purchases && purchases.length > 0) {
            this.setState({
                purchaseHistory: purchases.length,
                purchaseHistoryName: purchases[0].name
              });
          }
        } catch (err) {
          console.warn(err.code, err.message);
          Alert.alert(err.message);
        }
      }
    
    render() {
        if (this.state.products == null){
            return <Spinner size="large" />
        }

        console.log('this.state.products', this.state.products[0].value, this.state.products[0].label, this.state.products);
        return(
            <View style={styles.wapper}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    {/* <ScrollView bounces={true} contentContainerStyle={{flexDirection: 'row', justifyContent: 'center'}}> */}
                    {/* <TouchableOpacity title='GetInfo' onPress={ () => this.getPurchaseHistory() }>
                                    <Text>Get Purchise History</Text>
                    </TouchableOpacity> */}

                    <OptimizedFlatList
                        ListHeaderComponent={this.renderHeader}
                        data={this.state.products}
                            renderItem={({item}) => {
                                return (
                                    <MyPlanListItem
                                        product={item}
                                    />
                                );
                            }
                        }

                        keyExtractor={product => product.productId}
                    />
                    {/* </ScrollView> */}
                </View>
            </View>
        )
    }
}

export default MySettings;

const styles = StyleSheet.create({
    wapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
    },

});