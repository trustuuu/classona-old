import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableHighlight, TextInput, Modal, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import * as RNIap from 'react-native-iap';
import {convertSecToDateForReceipt} from '../../helpers/utils';
import { Card, CardSection, Input, Button, Spinner, Header, OptimizedFlatList} from '../common';
import MyPlanHistoryItem from './MyPlanHistoryItem';
import MyPlanList from './MyPlanList';
import colors from '../../styles/colors';

class MyPlanHistory extends Component {

    constructor(props){
        super(props);
        this.state = { products: null, availablePurchases: null };
    }

    async componentDidMount() {
        try {
            const result = await RNIap.initConnection();
            
            console.log('RNIAP', result);

            //await RNIap.prepare();
            
            await this.getProducts();
            await this.getAvailablePurchases();
        }
        catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }
        
    }

    componentWillUnmount() {
        RNIap.endConnection();
    }
    
    //https://github.com/dooboolab/react-native-iap/issues/275
    getAvailablePurchases = async() => {
        try {
          const availablePurchases = await RNIap.getAvailablePurchases();
          const purchases = availablePurchases.map( item => {
            return {...item, product: this.state.products.find( p => p.productId == 'com.igoodworks.classona.monthly1') } 
            }
          )

          let temp = '';
          if (purchases && purchases.length > 0) {
            this.setState({
                availablePurchases: purchases
            });
          }
        } catch (err) {
          console.warn(err.code, err.message);
          Alert.alert(err.message);
        }
      }

    getProducts = async() => {
        try {
            const itemSkus = Platform.select({
                ios: [
                    'com.igoodworks.classona.quarterly', 'com.igoodworks.classona.monthly1', 'com.igoodworks.classona.monthly', 'com.igoodworks.classona.onetime'
                ],
                android: [
                    'com.igoodworks.classona.quarterly', 'com.igoodworks.classona.monthly1', 'com.igoodworks.classona.monthly', 'com.igoodworks.classona.onetime'
                ]
            });
    
          const products = await RNIap.getSubscriptions(itemSkus);
          if (products && products.length > 0) {

            this.setState({
                products: products
            });
          }
        } catch (err) {
          console.warn(err.code, err.message);
          Alert.alert(err.message);
        }
      }

    render() {
        if (this.state.availablePurchases == null){
            //return <Spinner size="large" />
            return (
                <View style={styles.wapper}>
                <TouchableHighlight style={styles.floatingButton} onPress={() => Actions.myPlanList()} >
                  <Text> + </Text>
                </TouchableHighlight>

            </View>
            )
        }

        return(
            <View style={styles.wapper}>
                <View style={{flex: 1}}>
                    <ScrollView bounces={true}>
                    <OptimizedFlatList
                        ListHeaderComponent={this.renderHeader}
                        data={this.state.availablePurchases}
                            renderItem={({item}) => {
                                return (
                                    <MyPlanHistoryItem
                                    purchase={item}
                                    />
                                );
                            }
                        }

                        keyExtractor={purchase => purchase.productId}
                    />
                    </ScrollView>
                </View>
                <TouchableHighlight style={styles.floatingButton} onPress={() => Actions.myPlanList()} >
                  <Text> + </Text>
                </TouchableHighlight>

            </View>
        )
    }
}

export default MyPlanHistory;

const styles = StyleSheet.create({
    wapper: {
    flex: 1,
    flexDirection: 'column',
    },
    floatingButton: {
      backgroundColor: colors.green02,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 40,
      right: 50,
      height: 50,
      width: 50,
      shadowColor: '#000000',
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowOffset: {
          height: 1,
          width: 0,
      }
  },
});

