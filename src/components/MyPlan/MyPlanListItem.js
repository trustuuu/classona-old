import React, {Component} from 'react';
import { ListView, Text, ScrollView, View, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import {CardSection, Card, Button} from '../common';

import { Actions, ActionConst } from 'react-native-router-flux';
import { removeClassBookmark, selectClassActions } from '../../actions';
import Swipeout from 'react-native-swipeout';
import * as RNIap from 'react-native-iap';

import colors from '../../styles/colors';

class MyPlanListItem extends Component {
    constructor(props) {
        super(props);  
        this.onPress = this.buySubscribeItem.bind(this);
        this.state = {error:null}
      }

    buySubscribeItem = async(productId) => {
        
        try{
            // Will return a purchase object with a receipt which can be used to validate on your server.
            const purchase = await RNIap.buySubscription(productId);
            console.log(purchase);

            // save the receipt if you need it, whether locally, or to your server.
            this.setState({ receipt: purchase.transactionReceipt }, () => Actions.Receipt({ receipt: purchase.transactionReceipt }));

        } catch(err) {
            // standardized err.code and err.message available
            console.warn(err.code, err.message);
            this.setState({error:err})
        }
    }
    
    render(){
        const {currency, description, localizedPrice, price, productId,
               subscriptionPeriodNumberIOS, subscriptionPeriodUnitIOS, title} = this.props.product;

        let unBookmarkButton = {
            text: 'Unbookmark',
            backgroundColor: '#ffbe76',
            underlayColor: '#ffbe76',
            onPress: () => { 
                this.props.removeClassBookmark(productId, null, "student")
                }
        }
        
        // let bookmarkButton = {
        //     text: 'Bookmark',
        //     backgroundColor: '#00cec9',
        //     underlayColor: '#dfe6e9',
        //     onPress: () => { 
        //         this.props.setMyPhraseBookmark(this.props.bookmark.bookmarkId, true); 
        //         }
        // }

        let swipeBtns = [unBookmarkButton];
        //let swipeBtns = this.props.bookmark ? [unBookmarkButton] : [bookmarkButton];
        //if (!this.props.bookmark) swipeBtns.push(deleteButton);

        return (
            
            <Card>
                {/* <Swipeout right={swipeBtns}
                    autoClose={true}
                    backgroundColor= 'transparent'> */}
                            <Button style={{backgroundColor: colors.green02}} title='Purchase' onPress={ () => this.buySubscribeItem(productId) }>
                                <Text style={styles.titleStyle}>{title} [ { `${localizedPrice}(${currency})` } ] </Text>
                            </Button>
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
      },
  };



const MapStateToProps = ({oClass}) =>
{
    //console.log('org state', state);
    //const { MyPlanListItem } = oClass; 
    
    return {};
}

export default connect(MapStateToProps, {removeClassBookmark, selectClassActions})(MyPlanListItem);
