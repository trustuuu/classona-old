import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TextInput, Modal, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import * as RNIap from 'react-native-iap';

import { Card, CardSection, Input, Button, Spinner, Header, RNPickerSelect} from '../common';
import colors from '../../styles/colors';

class MySettings extends Component {

    constructor(props){
        super(props);
        this.state = { products: null, product: null};
    }

    async componentDidMount() {
        const itemSkus = Platform.select({
            ios: [
                'com.igoodworks.classona.quarterly', 'com.igoodworks.classona.monthly', 'com.igoodworks.classona.onetime'
            ],
            android: [
                'com.igoodworks.classona.quarterly', 'com.igoodworks.classona.monthly', 'com.igoodworks.classona.onetime'
            ]
        });

        try {
            //await RNIap.prepare();
            const products = await RNIap.getProducts(itemSkus);
            this.setState({ products : products.map(p => ({...p, label: `${p.title}(${p.currency}${p.price})`, value: p.productId}))
                          });
            const subs = await RNIap.getSubscriptions(itemSkus);
        }
        catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }
        
        // RNIap.getProducts(itemSkus).then((prśducts) => {
        //     //handle success of fetch product list
        //     console.log('products 2nd', products);
        // }).catch((error) => {
        //     console.log(error.message);
        // })
    }

    componentWillUnmount() {
        RNIap.endConnection();
    }
    // RNIap.buyProduct('com.igoodworks.classona').then(purchase => {
    //     this.setState({
    //        receipt: purchase.transactionReceipt
    //     });
    //         // handle success of purchase product
    //     }).catch((error) => {
    //         console.log(error.message);
    //     })
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

    render() {
        if (this.state.products == null){
            return <Spinner size="large" />
        }

        return(
            <View style={[styles.container, {borderWidth: 0}]}>
                        <RNPickerSelect
                        placeholder={{
                            label: 'Select a plan...',
                            value: null,
                            color: '#9EA0A4',
                        }}
                        items={this.state.products}
                        onValueChange={(value) => {
                            this.setState({productId : value})
                            //this.onLanguagePress(value);
                        }}
                        onUpArrow={() => {
                            //this.inputRefs.name.focus();
                        }}
                        onDownArrow={() => {
                            //this.inputRefs.picker2.togglePicker();
                        }}
                        style={{ ...pickerSelectStyles }}
                        value={this.state.productId}
                        ref={(el) => {
                            //this.inputRefs.picker = el;
                        }}
                        />
            </View>
        )
    }
}

export default MySettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 0,
    backgroundColor: colors.green01,
  }
});

const pickerSelectStyles = StyleSheet.create({
    pickerTextStyle: {
        fontSize: 13,
        paddingLeft: 20
    },
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: colors.green01,
        color: 'black',
        width: 250
    },
    inputAndroid: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 0,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: colors.green01,
        color: 'black',
        width: 250
    },
});