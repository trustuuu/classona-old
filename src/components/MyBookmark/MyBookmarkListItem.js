import React, {Component} from 'react';
import { ListView, Text, Button, ScrollView, View, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import {CardSection, Card} from '../common';
//import { MediaItem } from '../MediaItem';
import { Actions, ActionConst } from 'react-native-router-flux';
import { removeClassBookmark, selectClassActions } from '../../actions';
import Swipeout from 'react-native-swipeout';
import colors from '../../styles/colors';
import global from '../../helpers/global.js';
const bookmarkImg = require('../../img/bookmark.png');

class MyBookmarkListItem extends Component {
    constructor(props) {
        super(props);  
        this.onPress = this.onSelect.bind(this);
      }

    onSelect(classId, media, startSecs)
    {
        const triggerSource = 'bookmark';
        this.props.selectClassActions(classId, media, startSecs, triggerSource);
    }
    
    render(){
        const {className, startSecs, category, media, bookmarkId} = this.props.bookmark;
        const mediaArray = media ? media.split('_') : [];
        //const classId = `${mediaArray[1]}_${mediaArray[4]}`;
        const classId = className === 'privateClass' ? `${mediaArray[2]}_${mediaArray[5]}` : `${mediaArray[1]}_${mediaArray[4]}`;

        console.log('bookmark select => ', this.props.bookmark, media, mediaArray, classId, )
        // let deleteButton = {
        //     text: 'Delete',
        //     backgroundColor: '#d63031',
        //     underlayColor: '#dfe6e9',
        //     onPress: () => {
        //         this.props.deleteMyPhrase(this.props.bookmark.bookmarkId); 
        //         }
        // }

        let unBookmarkButton = {
            text: 'Unbookmark',
            backgroundColor: '#ffbe76',
            underlayColor: '#ffbe76',
            onPress: () => { 
                this.props.removeClassBookmark(bookmarkId, null, "student")
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
                <Swipeout right={swipeBtns}
                    autoClose={true}
                    backgroundColor= 'transparent'>
                    <TouchableHighlight underlayColor='#0984e3'>
                        <View>
                            <CardSection>
                                <TouchableOpacity style={styles.titleStyle} title={className} onPress={ () => this.onSelect(classId, media, startSecs) }>
                                    <Text style={styles.titleStyle}>{className} </Text>
                                </TouchableOpacity>
                            </CardSection>
                            
                            <CardSection>
                                <Text style={styles.descStyle}>{ category == "script" ? `bookmark point: (${startSecs}) seconds`: 'class'} </Text>
                            </CardSection>
                            <CardSection>
                                <Text style={styles.descStyle}>{mediaArray.length > 0 ? `Institution: ${mediaArray[2]}` : 'Private' }</Text>
                            </CardSection>
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



const MapStateToProps = ({oClass}) =>
{
    //console.log('org state', state);
    //const { MyBookmarkListItem } = oClass; 
    
    return {};
}

export default ListItemPhrase = connect(MapStateToProps, {removeClassBookmark, selectClassActions})(MyBookmarkListItem);
