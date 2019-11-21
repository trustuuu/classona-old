import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ActionSheetIOS } from 'react-native';
import { connect } from 'react-redux';
//import { Actions } from 'react-native-router-flux';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import {CardSection, Card } from '../common';
import TrackPlayer from 'react-native-track-player';
import { copyToMyWord, addClassBookmark, removeClassBookmark } from '../../actions';
import global from '../../helpers/global.js';
const bookmarkImg = require('../../img/bookmark.png');

class Scripts extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sheet: <View></View>
            };
    }

    onPress = (trackId, startSecs, position) => {
        console.log('trackId in ClassPlayer', trackId, startSecs, position)
        TrackPlayer.skip(trackId);
        TrackPlayer.play();
        TrackPlayer.seekTo(startSecs);
    }

    componentDidMount(){
        const actionSheet = OpenContextMenu(this, () => {
            let menuCallback = [() => { return null }];
            menuCallback[0]()
            }, 1, 1, ['Cancel']
        )
        
        this.setState({sheet: actionSheet});
    }

    onRemoveBoomark = (script) => {
        this.props.removeClassBookmark(script.scriptId, null, "student");
    }
    
    hightLightScript = (item, script) => {
        const {currentTrackId, currentPosition} = this.props;
        let result = 'white';
        if (item.media != currentTrackId) result = 'white';
        if (this.props.blockStart > 0) {
            if (this.props.blockEnd == 0) {
                result = (((script.startSecs + 3 ) >= this.props.blockStart) && (currentPosition >= (script.endSecs))) ? "red" : "white";
            }
            else if (this.props.blockEnd > 0 ) result = (((script.startSecs + 3 ) >= this.props.blockStart) && (script.endSecs <= this.props.blockEnd)) ? "red" : "white";
        }else{
            result = ((script.startSecs <= currentPosition) && (currentPosition <= script.endSecs)) ? "yellow" : "white";
        }
        return result;
    }

    renderBookmarkIcon = (script) => {
        const index = this.props.bookmarks.findIndex( a => a.bookmarkId == script.scriptId);
        
        if (index > -1)
        {
            return (
                <Image style={{width:6, height:17}} source={bookmarkImg} />
            )
        }
        else{return;}
    }

    render(){
        const {item, currentTrackId, currentPosition} = this.props;

        //let copiedScripts = [...item.scripts].sort((item1, item2) => item1.startSecs - item2.startSecs);
        
        let copiedScripts = [...item.scripts.map(
            (script) => {
                return {...script, bookmark: this.props.bookmarks.findIndex( a => a.bookmarkId == script.scriptId) > -1}
            })].sort((item1, item2) => item1.startSecs - item2.startSecs);

        return (
            <View>
            <CardSection key={item.seq} style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                            alignItems: 'stretch',
                                        }}>
                                    
            { copiedScripts.map((script, index) => 
                        <View key={`view${index}`} style={{flexDirection: 'row', justifyContent: 'flex-start'}}> 
                        <TouchableOpacity key={`bookmark${index}`} 
                            onPress={
                                (event) => {
                                    let actionBookmark = OpenContextMenu(this, (index) => {
                                        let menuCallback = [];
                                        menuCallback.push(() => this.props.removeClassBookmark(script.scriptId, null, "student"));
                                        menuCallback.push(() => {return null});
                                        menuCallback[index]();
                                    }, 1, 1, ['Remove bookmark', 'Cancel']);
                                    this.setState({sheet: actionBookmark}) 

                                    this.ActionSheet.show();
                                }
                            }

                        >
                            {this.renderBookmarkIcon(script)}
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                        style={styles.TouchableText} 
                        onPress={() => this.onPress(item.media, script.startSecs, item.seq * index * 21)}
                        key={index}
                        onLongPress={
                            (event) => {
                                const actionSheet = OpenContextMenu(this, (index) => {
                                    
                                    let menuCallback = [];
                                    menuCallback.push(() => this.props.copyToMyWord({'media':item.media, 'startSecs':script.startSecs, 'phrase': script.word, 'description':'', bookmark:false}));
                                    
                                    script.bookmark ?
                                    menuCallback.push(() => this.props.removeClassBookmark(script.scriptId, null, global.userType))
                                    :
                                    menuCallback.push(() => this.props.addClassBookmark(`${item.media}_${script.startSecs}`, null, global.userType, global.class, item, script.startSecs, "script"));
                                    
                                    menuCallback.push(() => { return null });
                                    menuCallback[index]();

                                }, 2, 2, 
                                script.bookmark ? ['Add to dictionary', 'Remove bookmark', 'Cancel'] : ['Add to dictionary', 'Add to bookmark', 'Cancel']
                                )
                                
                                this.setState({sheet: actionSheet});
                                
                                this.ActionSheet.show();
                            }

                        }
                        //onLongPress={(event) => OpenContextMenu(event, script.word, () => Actions.myPhraseEdit({wordType: 'wordFromClass', phrase: script.word, startSecs: script.startSecs, media: item.media, description: ''}) )}
                            >
                        <Text
                        //editable={true} 
                        selectable={true}
                        
                        style={{ backgroundColor : this.hightLightScript(item, script)}}
                        >
                        {script.word.replace(/[\n\r]/g, ' ')}
                        </Text>
                        </TouchableOpacity>
                        </View>
                    )} 
            </CardSection>
            {this.state.sheet}
            </View>
        );
    }

}


const OpenBookmarkContextMenuOld = (event, item, script, callback) => {
    ActionSheetIOS.showActionSheetWithOptions({
        options: ['Remove bookmark', 'Cancel'],
        cancelButtonIndex: 1,
        title: 'Actions',
        //message : 'What do you want to do now?'
    }, (buttonIndexThatSelected) => {
        // Do something with result
        if (buttonIndexThatSelected !== 1){
            if(callback && typeof callback === 'function') callback(buttonIndexThatSelected);
        }

    });
}

const OpenContextMenuOld = (event, item, script, callback) => {
    ActionSheetIOS.showActionSheetWithOptions({
        options: script.bookmark ? ['Add to dictionary', 'Remove bookmark', 'Add to favorites', 'Replay', 'Cancel'] : ['Add to dictionary', 'Add to bookmark', 'Add to favorites', 'Replay', 'Cancel'],
        cancelButtonIndex: 4,
        title: 'Actions',
        //message : 'What do you want to do now?'
    }, (buttonIndexThatSelected) => {
        // Do something with result
        if (buttonIndexThatSelected !== 4){
            if(callback && typeof callback === 'function') callback(buttonIndexThatSelected);
        }

    });
}

const OpenContextMenu = (my, callback, cancelIndex, distructIndex, options) => {
    console.log('OpenContextMenu => ', callback, cancelIndex, distructIndex, options);
    return (
        <ActionSheet
            ref={ (ref) => my.ActionSheet = ref}
            title = {'Actions'}
            options = {options} 
            cancelButtonIndex = {cancelIndex}
            distructiveButtonIndex={distructIndex}
            onPress={ (buttonIndexThatSelected) => {
                if(callback && typeof callback === 'function') callback(buttonIndexThatSelected);
            }}
        />
    )
}


const styles = {
    TouchableText: {
        //backgroundColor: '#DDDDDD',
        padding: 2
    },
}

const MapStateToProps = ({oClass}) =>
{
    //('Script MapStateToProps', oClass);
    const { bookmarks, loading, error } = oClass; 
    return {bookmarks, loading, error};
}


export default connect(MapStateToProps, { copyToMyWord, addClassBookmark, removeClassBookmark })(Scripts);
