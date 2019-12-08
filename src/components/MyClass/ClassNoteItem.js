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
        //if ((global.userType == 'instructor') && (this.props.oNote.instructor.toLowerCase() == global.email))
        {
            this.props.noteChangeAction(this.props.oNote) 
            Actions.ClassNoteEdit({oNote:this.props.oNote})
        }
    }
    
    render(){

        const {noteId, note, description} = this.props.oNote;

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
            
            // <Card>
            //     <Swipeout right={swipeBtns}
            //         autoClose={true}
            //         backgroundColor= 'transparent'>
            //         <TouchableHighlight underlayColor='#0984e3'>
            //             <View>
            //                 <CardSection>
            //                     <TouchableOpacity style={styles.titleStyle} title={note} onPress={ () => this.onSelect() }>
            //                         <Text style={styles.titleStyle}>{note} </Text>
            //                     </TouchableOpacity>
            //                 </CardSection>
                            
            //                 <CardSection>
            //                     <Text style={styles.descStyle}>{description} </Text>
            //                 </CardSection>
            //             </View>
            //         </TouchableHighlight>
            //     </Swipeout>
            // </Card>


            <Swipeout right={swipeBtns}
            autoClose={true}
            backgroundColor='transparent'
            >
                <View>
            <TouchableHighlight underlayColor='#0984e3'>
                <TouchableOpacity title={note} onPress={ () => this.onSelect() }>
                <Card style={{borderBottomWidth: 0, borderTopWidth: 0}}>
                <CardSection 
                    style={{flex:1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            backgroundColor: global.backgroundColor,
                            paddingTop: 10,
                            //height: 50, 
                            borderRadius: 15, 
                            borderBottomWidth: 0, 
                            borderTopWidth: 0}}
                    >
                    <Text style={[styles.titleStyle]}>{note} </Text>
                    <Text style={[styles.titleStyle, {fontFamily: 'GillSans-Light'}]}>{description} </Text>
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
        //fontWeight: "bold",
        color: '#434667',
        paddingLeft: 20,
        textTransform: 'uppercase',
        fontFamily: 'GillSans-SemiBold',
        fontSize: 14
      },
      descStyle: {
          fontSize: 12,
          paddingLeft: 20
        },
      swipeOutView: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
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



const MapStateToProps = ({oClass}) =>
{
    const { note, loading, error } = oClass; 
    
    return {note, loading, error};
}

export default connect(null, { noteChangeAction, removeClassNote })(ClassNoteItem);
