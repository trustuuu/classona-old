import React, {Component} from 'react';
import { ListView, Text, Button, ScrollView, View, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import {CardSection, Card} from '../common';
//import { MediaItem } from '../MediaItem';
import { Actions, ActionConst } from 'react-native-router-flux';
import { deleteMyPhrase, goToMyPhrasePlay, setMyPhraseBookmark } from '../../actions';
import Swipeout from 'react-native-swipeout';
import colors from '../../styles/colors';
import global from '../../helpers/global.js';
const bookmarkImg = require('../../img/bookmarkIcon.png');

class ListItem extends Component {
    constructor(props) {
        super(props);  
        this.onPress = this.onSelect.bind(this);
      }

    onSelect()
    {
        // const {media, startSecs, phrase, description, bookmark} = this.props.phrase;
        // const oPhrase = {media, startSecs, phrase, description, bookmark}
        this.props.goToMyPhrasePlay(this.props.phrase);
        // try{
        // global.oClass = this.props.oClass;
        // Actions.classItem();
        // }catch(err)
        // {
        //     console.log(err);
        // }
    }

    renderBookmarkIcon = () => {
        if ((this.props.phrase.bookmark) && (!this.props.bookmark))
        {
            return (
                // <View style={{
                //         flex: 1,
                //         alignItems: 'flex-end',
                //         justifyContent: 'flex-end',
                //         flexDirection: 'column',
                //         alignSelf: 'flex-end',
                //     }}
                // >
                <Image style={{width:18, height:24}} source={bookmarkImg} />
                //</View>
            )
        }
        else{return;}
    }
    
    render(){
        const {phraseKey, phrase, description, media, startSecs, bookmark} = this.props.phrase;

        // let deleteButton = {
        //     text: 'Delete',
        //     backgroundColor: '#d63031',
        //     underlayColor: '#dfe6e9',
        //     onPress: () => {
        //         this.props.deleteMyPhrase(this.props.phrase.phraseKey); 
        //         }
        // }

        const deleteButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImageSmall} source={require('../../img/trash-white.png')} />
                  <Text style={styles.swipeOutTextSmall}>Delete</Text>
                </View>
              ),
                text: 'Delete',
                backgroundColor: '#d63031',
                underlayColor: '#dfe6e9',
                onPress: () => {
                    this.props.deleteMyPhrase(this.props.phrase.phraseKey); 
                }
            }

        // let bookmarkButton = {
        //     text: 'Bookmark',
        //     backgroundColor: '#00cec9',
        //     underlayColor: '#dfe6e9',
        //     onPress: () => { 
        //         this.props.setMyPhraseBookmark(this.props.phrase.phraseKey, true); 
        //         }
        // }

        const bookmarkButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImageSmall} source={require('../../img/bookmark-white.png')} />
                  <Text style={styles.swipeOutTextSmall}>Bookmark</Text>
                </View>
              ),
            text: 'Bookmark',
            backgroundColor: '#FADA83',
            underlayColor: '#dfe6e9',
            onPress: () => { 
                this.props.setMyPhraseBookmark(this.props.phrase.phraseKey, true); 
                }
        }



        // let unBookmarkButton = {
        //     text: 'Unbookmark',
        //     backgroundColor: '#ffbe76',
        //     underlayColor: '#ffbe76',
        //     onPress: () => { 
        //         this.props.setMyPhraseBookmark(this.props.phrase.phraseKey, false); 
        //         }
        // }

        const unBookmarkButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImageSmall} source={require('../../img/bookmark-white.png')} />
                  <Text style={styles.swipeOutTextSmall}>Unbookmark</Text>
                </View>
              ),
            text: 'Unbookmark',
            backgroundColor: '#3A7FEF',
            underlayColor: '#ffbe76',
            onPress: () => {
                this.props.setMyPhraseBookmark(this.props.phrase.phraseKey, false); 
            }
        }
        
        let swipeBtns = bookmark ? [unBookmarkButton] : [bookmarkButton];
        if (!this.props.bookmark) swipeBtns.push(deleteButton);

        // const swipeBtns = [
        //     {
        //         text: 'Delete',
        //         backgroundColor: '#d63031',
        //         underlayColor: '#dfe6e9',
        //         onPress: () => {
        //             this.props.deleteMyPhrase(this.props.phrase.id); 
        //             }
        //     },
        //     {
        //         text: 'Bookmark',
        //         backgroundColor: '#00cec9',
        //         underlayColor: '#dfe6e9',
        //         onPress: () => { 
        //             this.props.setMyPhraseBookmark(this.props.phrase.id, true); 
        //             console.log(`swipe for dup - ${this.props.phrase.id}`)}
        //     }
        // ];
        return (
            <Swipeout right={swipeBtns}
                autoClose={true}
                backgroundColor='transparent'
            >
                <View>
                    <TouchableHighlight underlayColor='#0984e3'>
                        <TouchableOpacity title={phrase} onPress={ () => this.onSelect() }>
                        <Card style={{borderRadius:15, borderBottomWidth: 0, borderTopWidth: 0}}>
                        <CardSection style={{flex:1, flexDirection:'row', justifyContent:'space-between', backgroundColor: colors.white, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomWidth: 0, borderTopWidth: 0}}>
                            <Text style={[styles.titleStyle]}>{phrase} </Text>
                            { this.renderBookmarkIcon() }
                        </CardSection>
                        <CardSection style={{borderBottomWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 15, borderBottomRightRadius: 15}}>
                            <Text style={styles.descStyle}>{description}</Text>
                        </CardSection>
                        </Card>
                        </TouchableOpacity>
                    </TouchableHighlight>
                    </View>
            </Swipeout>

        );
    }

}


const styles = {
    titleStyle: {
      height:24,
      //fontWeight: "bold",
      color: '#434667',
      paddingLeft: 20,
      //textTransform: 'uppercase',
      fontFamily: 'GillSans-SemiBold',
      fontSize: 18
    },
    descStyle: {
        height:24,
        fontSize: 12,
        paddingLeft: 20
      },
    swipeOutView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        //paddingTop:20
    },
    swipeOutImage: {
        width: 20,
        height: 26
    },
    swipeOutText: {
        paddingTop: 5,
        color: colors.white,
        fontFamily: 'GillSans-Light',
        fontSize: 14
    },
    swipeOutImageSmall: {
        width: 14,
        height: 20
    },
    swipeOutTextSmall: {
        paddingTop: 2,
        color: colors.white,
        fontFamily: 'GillSans-Light',
        fontSize: 14
    }
    
  };




const MapStateToProps = (state) =>
{
    //console.log('org state', state);
    //const { classes } = state.oClass; 
    
    return {};
}

export default ListItemPhrase = connect(MapStateToProps, {deleteMyPhrase, goToMyPhrasePlay, setMyPhraseBookmark})(ListItem);
