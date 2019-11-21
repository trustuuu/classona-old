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
const bookmarkImg = require('../../img/bookmark.png');

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
                <View style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        flexDirection: 'column',
                        alignSelf: 'flex-end',
                    }}
                >
                <Image style={{width:20, height:20}} source={bookmarkImg} />
                </View>
            )
        }
        else{return;}
    }
    
    render(){
        const {phraseKey, phrase, description, media, startSecs, bookmark} = this.props.phrase;

        let deleteButton = {
            text: 'Delete',
            backgroundColor: '#d63031',
            underlayColor: '#dfe6e9',
            onPress: () => {
                this.props.deleteMyPhrase(this.props.phrase.phraseKey); 
                }
        }

        let bookmarkButton = {
            text: 'Bookmark',
            backgroundColor: '#00cec9',
            underlayColor: '#dfe6e9',
            onPress: () => { 
                this.props.setMyPhraseBookmark(this.props.phrase.phraseKey, true); 
                }
        }

        let unBookmarkButton = {
            text: 'Unbookmark',
            backgroundColor: '#ffbe76',
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
            
            <Card>
                <Swipeout right={swipeBtns}
                    autoClose={true}
                    backgroundColor= 'transparent'>
                    <TouchableHighlight underlayColor='#0984e3'>
                        <View>
                            <CardSection>
                                <TouchableOpacity style={styles.titleStyle} title={phrase} onPress={ () => this.onSelect() }>
                                    <Text style={styles.titleStyle}>{phrase} </Text>
                                </TouchableOpacity>
                                { this.renderBookmarkIcon() }
                            </CardSection>
                            
                            <CardSection>
                                <Text style={styles.descStyle}>{description} </Text>
                            </CardSection>
                            {/* <CardSection>
                                <Text style={styles.descStyle}>{media}</Text>
                            </CardSection> */}
                        </View>
                    </TouchableHighlight>
                </Swipeout>
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



const MapStateToProps = (state) =>
{
    //console.log('org state', state);
    //const { classes } = state.oClass; 
    
    return {};
}

export default ListItemPhrase = connect(MapStateToProps, {deleteMyPhrase, goToMyPhrasePlay, setMyPhraseBookmark})(ListItem);
