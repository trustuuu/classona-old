import React, {Component} from 'react';
import { ListView, Text, Button, ScrollView, View, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import {CardSection, Card} from '../common';
//import { MediaItem } from '../MediaItem';
import { Actions, ActionConst } from 'react-native-router-flux';
import { noteChangeAction, removeClassNote } from '../../actions';
import Swipeout from 'react-native-swipeout';
import colors from '../../styles/colors';
import global from '../../helpers/global.js';
const bookmarkImg = require('../../img/bookmark.png');

class ClassNoteItem extends Component {
    constructor(props) {
        super(props);  
        this.onPress = this.onSelect.bind(this);
      }

    onSelect()
    {
        this.props.noteChangeAction(this.props.oNote) 
        Actions.ClassNoteEdit({oNote:this.props.oNote})
    }
    
    render(){

        const {noteId, note, description} = this.props.oNote;

        let deleteButton = {
            text: 'Delete',
            backgroundColor: '#d63031',
            underlayColor: '#dfe6e9',
            onPress: () => {
                this.props.removeClassNote(this.props.oNote); 
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

        // let unBookmarkButton = {
        //     text: 'Unbookmark',
        //     backgroundColor: '#ffbe76',
        //     underlayColor: '#ffbe76',
        //     onPress: () => { 
        //         this.props.setMyPhraseBookmark(this.props.phrase.phraseKey, false); 
        //         }
        // }
        
        let swipeBtns = [];
        if (global.userType == 'instructor')
        {
            swipeBtns = [deleteButton];
        }

        return (
            
            <Card>
                <Swipeout right={swipeBtns}
                    autoClose={true}
                    backgroundColor= 'transparent'>
                    <TouchableHighlight underlayColor='#0984e3'>
                        <View>
                            <CardSection>
                                <TouchableOpacity style={styles.titleStyle} title={note} onPress={ () => this.onSelect() }>
                                    <Text style={styles.titleStyle}>{note} </Text>
                                </TouchableOpacity>
                            </CardSection>
                            
                            <CardSection>
                                <Text style={styles.descStyle}>{description} </Text>
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
    const { note, loading, error } = oClass; 
    
    return {note, loading, error};
}

export default connect(null, { noteChangeAction, removeClassNote })(ClassNoteItem);
