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
        const classId = className === 'privateClass' ? `${mediaArray[2]}_${mediaArray[5]}` : `${mediaArray[1]}_${mediaArray[4]}`;

        //console.log('bookmark select => ', this.props.bookmark, media, mediaArray, classId, )

        const unBookmarkButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImage} source={require('../../img/bookmark-white.png')} />
                  <Text style={styles.swipeOutText}>Unbookmark</Text>
                </View>
              ),
            text: 'Unbookmark',
            backgroundColor: '#3A7FEF',
            underlayColor: '#ffbe76',
            onPress: () => {
                this.props.removeClassBookmark(bookmarkId, null, "student")
            }
        }
        
        let swipeBtns = [unBookmarkButton];

        return (
            <Swipeout right={swipeBtns}
                autoClose={true}
                backgroundColor='transparent'
            >
                    <View>
                <TouchableHighlight underlayColor='#0984e3'>
                    <TouchableOpacity title={className} onPress={ () => this.onSelect(classId, media, startSecs) }>
                    <Card style={{borderRadius:15, borderBottomWidth: 0, borderTopWidth: 0}}>
                    <CardSection style={{backgroundColor: global.backgroundColor, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomWidth: 0, borderTopWidth: 0}}>
                                <Text style={styles.titleStyle}>{className.replace('privateClass', 'Personal Recording')} </Text>
                    </CardSection>
                    <CardSection style={{borderBottomWidth: 0, borderTopWidth: 0}}>
                        <Text style={styles.descStyle}>{category == "script" ? `bookmark point: (${startSecs}) seconds`: 'class'}</Text>
                    </CardSection>
                    <CardSection style={{backgroundColor: global.backgroundColor, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderBottomWidth: 0, borderTopWidth: 0}}>
                        <Text style={styles.descStyle}>{mediaArray.length > 0 ? `Institution: ${mediaArray[2]}` : 'Private' }</Text>
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
    }
    
  };


const MapStateToProps = ({oClass}) =>
{
    //console.log('org state', state);
    //const { MyBookmarkListItem } = oClass; 
    
    return {};
}

export default ListItemPhrase = connect(MapStateToProps, {removeClassBookmark, selectClassActions})(MyBookmarkListItem);
