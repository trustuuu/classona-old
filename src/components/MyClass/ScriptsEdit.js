import React, { Fragment, Component } from 'react';
import { View, ScrollView, TextInput, Text, Image, TouchableOpacity, ActionSheetIOS, Modal, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
//import { Actions } from 'react-native-router-flux';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import {CardSection, Card, Button, Spinner, Header } from '../common';
import TrackPlayer from 'react-native-track-player';
import { copyToMyWord, addClassBookmark, removeClassBookmark, changeScript, updateScript } from '../../actions';
import global from '../../helpers/global.js';
import colors from '../../styles/colors';
import ImageButton from '../common/ImageButton';

const bookmarkImg = require('../../img/bookmark.png');


import iconArrow from '../../icons/arrow.png';
import iconPlay from '../../icons/play.png';
import iconPause from '../../icons/pause.png';
import iconPrevious from '../../icons/previous.png';
import iconNext from '../../icons/next.png';

class ScriptsEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            scripts: [...this.props.item.scripts].sort((item1, item2) => item1.startSecs - item2.startSecs),
            item: {...this.props.item},
            modalVisible: false,
            scriptIndex: 0,
            modalContainerHeight: null,
            script: {word:''},
            editorShow: false,
            sheet: <View></View>
            };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.script !== prevState.script){
            return { script: nextProps.script };
        }
        // if(nextProps.tracks !== prevState.tracks){
        //     return { tracks: nextProps.tracks };
        // }
        else{
            return null;
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.script!==this.props.script){
            this.setState({script: this.props.script});
        }
    }

    componentDidMount(){
        const actionSheet = OpenContextMenu(this, () => {
            let menuCallback = [() => { return null }];
            menuCallback[0]()
        }, 1, 1, ['Cancel']
        )
        
        this.setState({sheet: actionSheet});
    }

    //openModal = () => this.setState({ modalVisible: true });
    closeModal = () => this.setState({ modalVisible: false });


    onPress = (item, script, index, cmd) => {
        
        const trackId = item.media;
        const position = item.seq * index * 21;

        //this.setState({ modalVisible: true, script });

        //TrackPlayer.skip(trackId);
        TrackPlayer.seekTo(script.startSecs);
        TrackPlayer.play();
        //if(cmd != 'pause') TrackPlayer.play();
        //if(cmd == 'pause') TrackPlayer.pause();
    }

    startEdit = (script, index) => {
        TrackPlayer.pause();
        this.setState({'script': {...script}, editorShow: true});
    }

    onRemoveBoomark = (script) => {
        this.props.removeClassBookmark(script.scriptId, null, "student");
    }
    
    hightLightScript = (item, script, index) => {
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

    showScript = (item, script, index) => {
        const {currentTrackId, currentPosition} = this.props;

        //console.log('showScript item, script, index ->', currentPosition, item, script, index)
        if (item.media != currentTrackId){
            return null;
        }else if (((script.startSecs - 14 ) <= currentPosition) && (currentPosition <= (script.endSecs + 14 ))) {
                return (
                    <View key={`modal${index}`}
                            style={{flexDirection: 'column', 
                            justifyContent: 'flex-start', 
                            alignItems: 'stretch'}}>

                        <TouchableOpacity key={`bookmark${index}`} 
                            
                            // onPress={(event) => 
                            //     {
                            //         const actionBookmark = OpenBookmarkContextMenu(this, event, item, script, (index) => {                                        
                            //             let menuCallback = [];
                            //             menuCallback.push(this.props.removeClassBookmark(script.scriptId, null, globay.userType))
                            //         });
                            //         this.setState({sheet: actionBookmark});
                            //         this.ActionSheet.show();
                            //     }
                            // }

                            onPress={
                                (event) => {
                                    let actionBookmark = OpenContextMenu(this, (index) => {
                                        let menuCallback = [];
                                        menuCallback.push(() => this.props.removeClassBookmark(script.scriptId, null, globay.userType));
                                        menuCallback.push(() => {return null});
                                        menuCallback[index]();
                                    }, 1, 1, ['Remove bookmark', 'Cancel']);
                                    this.setState({sheet: actionBookmark}) 

                                    this.ActionSheet.show();
                                }
                            }
                        >
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.TouchableText} 
                                        onPress={() => this.onPress(item.media, script, item)}
                                        key={`modalS${index}`}>
                             <Text
                                style={{
                                    backgroundColor:((script.startSecs <= currentPosition) && (currentPosition <= script.endSecs)) ? 'yellow' : 'white', 
                                    paddingBottom:10
                                    }}
                                multiline                       
                            >{script.word.replace(/[\n\r]/g, ' ')}</Text>
                            {/* <TextInput
                                style={{
                                    backgroundColor:((script.startSecs <= currentPosition) && (currentPosition <= script.endSecs)) ? 'yellow' : 'white', 
                                    paddingBottom:10
                                    }}
                                editable={false} 
                                selectable={false}
                                multiline                       
                                value={script.word.replace(/[\n\r]/g, ' ')}
                            /> */}
                        </TouchableOpacity>
                    </View>
                )
                
            
        }
        else{
            return null;
        }
        
    }

    showEditor = (item, script, index) => {

        const {currentTrackId, currentPosition} = this.props;
        let result = '';
        if (item.media != currentTrackId){
            return null;
        }
        else if((script.startSecs <= currentPosition ) && (currentPosition <= script.endSecs)) { // && this.state.editorShow) {
                    return (
                            <View key={`modal${index}`}
                                        style={{flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch'}}>
                                        <TextInput
                                    style={[styles.editor, {backgroundColor:colors.green01}]}
                                    editable={true} 
                                    selectable={true}
                                    multiline
                                    onFocus={() => this.setState({'modalContainerHeight': 260})}  
                                    //onBlur={() => this.setState({'modalContainerHeight': null})}                      
                                    onChangeText={(text) => {
                                        this.props.changeScript({...script, word:text});
                                        }}
                                        value={this.state.script.word ? this.state.script.word : script.word.replace(/[\n\r]/g, ' ')}
                                        // value={
                                        //         this.setState({'script': {...this.state.script, word: this.state.script.word ? this.state.script.word : script.word.replace(/[\n\r]/g, ' ')}})
                                        //       }
                                        /> 
                            </View>
                        )
        }
        else{
            return null;
        }
        
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

    async onStartPlay () {
        this.props.changeScript({...this.state.script, word:''});
        TrackPlayer.play();
    }

    async _playPause() {
        if((this.props.state == TrackPlayer.STATE_PAUSED) || (this.props.state == TrackPlayer.STATE_STOPPED)|| (this.props.state == '')|| (this.props.state == 1)){
            await this.onStartPlay();
        } else {
            await TrackPlayer.pause();
        }
    }

    async _previous() {
        // TODO add tracks to the queue
        
        const nextScripts = this.state.scripts.filter(s => s.startSecs < this.props.currentPosition);
        this.props.changeScript({...nextScripts[nextScripts.length - 2], word:''})

        if (nextScripts.length > 0) await TrackPlayer.seekTo(nextScripts[nextScripts.length - 2].startSecs);      
    }

    async _next() {
        // TODO add tracks to the queue
        //TrackPlayer.play();
        const nextScripts = this.state.scripts.filter(s => s.startSecs > this.props.currentPosition);
        
        this.props.changeScript({...nextScripts[0], word:''})
        if (nextScripts.length > 0) await TrackPlayer.seekTo(nextScripts[0].startSecs);
        //await TrackPlayer.skipToNext();
    }

    onButtonPress(){

        this.setState({'modalContainerHeight': null, editorShow: false});
        this.props.updateScript(this.props.item, this.state.script)
    }

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (
            <TouchableOpacity style={[{marginLeft: 30, flexDirection: 'column', justifyContent: 'center'}]} onPress={this.onButtonPress.bind(this)}>
                <Image style={styles.buttonCenter} source={require('../../img/save.png')}></Image>
                <Text style={{textAlign: 'center'}}>Save</Text>
            </TouchableOpacity>
        );
    }

    render(){
        let {item, currentTrackId, currentPosition} = this.props;

        //let copiedScripts = [...item.scripts].sort((item1, item2) => item1.startSecs - item2.startSecs);
        
        let copiedScripts = [...item.scripts.map(
            (script) => {
                return {...script, bookmark: this.props.bookmarks.findIndex( a => a.bookmarkId == script.scriptId) > -1}
            })].sort((item1, item2) => item1.startSecs - item2.startSecs);

        return (
                    <View>
                    <Fragment>
                        <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={this.closeModal}
                        onShow={() => TrackPlayer.pause()}
                        >
                            <View style={{backgroundColor:'#405CE5', paddingTop: 10}}>
                                <Header viewStyle={{backgroundColor:'#405CE5', height:70}}
                                        textStyle={{fontSize:14, fontFamily: 'GillSans-SemiBold', textTransform: 'uppercase', color: colors.white}}
                                        headerText='Script Edit' />
                            </View>
                            <View style={[styles.modalContainer, {maxHeight: this.state.modalContainerHeight, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}]}>
                            
                                {/* <Text style={[styles.description, {textAlign: 'center', height: 40, fontSize:18, backgroundColor:colors.yellow}]}>
                                    Editor
                                </Text> */}
                                <Text style={[styles.description, {height:20, backgroundColor:colors.white}]}>
                                </Text>
                                {
                                    copiedScripts.map((script, index) => {
                                        return this.showScript(item, script, index)
                                    })
                                } 
                            </View>

                            <View style={{flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch'}}>
                            <ScrollView style={{contentContainerStyle: 'flex-end'}}>
                                <View style={{justifyContent: 'flex-start', alignItems: 'stretch'}}>
                                    {
                                        copiedScripts.map((script, index) => this.showEditor(item, script, index))
                                    }
                                    <CardSection>
                                        <View style={[styles.buttonContainer]}>
                                            {this.renderButton()}
                                            <TouchableOpacity style={[{marginLeft: 10,flexDirection: 'column', justifyContent: 'center'}]} onPress={ () => this.closeModal() }>
                                                <Image style={styles.buttonRight} source={require('../../img/cancel.png')}></Image>
                                                <Text style={{textAlign: 'center'}}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[{paddingLeft: 40,flexDirection: 'column', justifyContent: 'center'}]} onPress={this.startEdit.bind(this)}>
                                                <Image style={styles.buttonLeft} source={require('../../img/save.png')}></Image>
                                                <Text style={{textAlign: 'center'}}>Edit</Text>
                                            </TouchableOpacity>
                                
                                        </View>
                                    </CardSection>

                                    <CardSection style={{justifyContent: 'center', alignItems: 'stretch', backgroundColor: colors.green01}}>                    
                                        <View style={[styles.controls]}>
                                            <ImageButton
                                                source={iconPrevious}
                                                onPress={this._previous.bind(this)}
                                                imageStyle={styles.controlIcon}
                                                //disabled = {!this.props.trackLoaded}
                                            />
                                            <ImageButton
                                                source={((this.props.state == TrackPlayer.STATE_PAUSED) || (this.props.state == TrackPlayer.STATE_STOPPED) || (this.props.state == '')|| (this.props.state == 1)) ? iconPlay : iconPause}
                                                onPress={this._playPause.bind(this)}
                                                style={styles.playPause}
                                                imageStyle={styles.controlIcon}
                                                //disabled = {!this.props.trackLoaded}
                                            />
                                            <ImageButton
                                                source={iconNext}
                                                onPress={this._next.bind(this)}
                                                imageStyle={styles.controlIcon}
                                                //disabled = {!this.props.trackLoaded}
                                            />
                                        </View>
                                    </CardSection>                    
                                </View>
                            </ScrollView>
                            </View>

                        </Modal>

                    </Fragment>

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
                                    onPress={() => this.onPress(item, script, index)}
                                    key={index}
                                    onLongPress={
                                        (event) => {
                                            const actionSheet = OpenContextMenu(this, (index) => {
                                                let menuCallback = [];
                                                menuCallback.push(() => this.props.copyToMyWord({'media':item.media, 'startSecs':script.startSecs, 'phrase': script.word, 'description':'', bookmark:false}));
                                                
                                                console.log('script.bookmark', script, script.bookmark);
                                                script.bookmark ?
                                                menuCallback.push(() => this.props.removeClassBookmark(script.scriptId, null, global.userType))
                                                :
                                                menuCallback.push(() => this.props.addClassBookmark(`${item.media}_${script.startSecs}`, null, global.userType, global.class, item, script.startSecs, "script"));
                                                
                                                menuCallback.push(() => {
                                                    const trackId = item.media;
                                                    console.log('press Edit script trackId ->', script, trackId);

                                                    this.onPress(item, script, index, 'pause');
                                                    // TrackPlayer.skip(trackId);
                                                    // TrackPlayer.play();
                                                    // TrackPlayer.seekTo(script.startSecs)
                                                    // .then(() => {
                                                    //     console.log('press Edit script pause');
                                                    //     TrackPlayer.pause();
                                                    //     this.setState({ modalVisible: true, script })
                                                    // }
                                                    // );
                                                    this.setState({ modalVisible: true, script });
                                                    
                                                });

                                                menuCallback.push(() => { return null });
                                                menuCallback[index]();
                                            }, 3, 3, 
                                            script.bookmark ? ['Add to dictionary', 'Remove bookmark', 'Edit Script', 'Cancel'] : ['Add to dictionary', 'Add to bookmark', 'Edit Script', 'Cancel']
                                            )
                                            
                                            this.setState({sheet: actionSheet});
                                            
                                            this.ActionSheet.show();
                                        }
                                    }
                                >

                                    <Text
                                        //editable={true} 
                                        selectable={true}
                                        
                                        style={{ backgroundColor : this.hightLightScript(item, script, index)}}
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
        options: script.bookmark ? ['Add to dictionary', 'Remove bookmark', 'Edit Script', 'Replay', 'Cancel'] : ['Add to dictionary', 'Add to bookmark', 'Edit Script', 'Replay', 'Cancel'],
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

const OpenBookmarkContextMenu = (my, event, item, script, callback) => {
    return(
        <ActionSheet
            ref={ (ref) => my.ActionSheetBk = ref}
            title = {'Actions'}
            options = { ['Remove bookmark', 'Cancel']}
            cancelButtonIndex = {1}
            distructiveButtonIndex={1}
            onPress={ (buttonIndexThatSelected) => {
                if(callback && typeof callback === 'function') callback(buttonIndexThatSelected);
            }}
        />
    )
    
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
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'transparent', //"#DCDCDC",
        borderRadius: 4,
        borderColor: "#C0C0C0",
        //borderWidth: 2,
        //height: 200,
        marginHorizontal: 5, //10,
        marginVertical: 5, //300
        //maxHeight: 300
    },
    description: {
        padding: 10,
        fontSize: 14,
        height: 50, //maxHeight: 100, 
    },
    editor: {
        padding: 10,
        fontSize: 14,
        height: 60, maxHeight: 60,
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        // position: 'absolute',
        // top: 200,
    },
    buttonContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    buttonLeft: {
        width: 50,
        height: 50,
        //marginLeft: 100,
    },
    buttonRight: {
        width: 50,
        height: 50,
        //marginRight: 100,
    },
    buttonCenter: {
        width: 50,
        height: 50,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: colors.green01,
    },

    controlIcon: {
        width: 40,
        height: 40
    },
    playPause: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ffffff',
        padding: 10,
        marginHorizontal: 15
    },

}

const MapStateToProps = ({oClass, player}) =>
{
    const { bookmarks, loading, error, script } = oClass; 
    const {state, currentPosition} = player;
    
    return {bookmarks, loading, error, state, currentPosition, script};
}


export default connect(MapStateToProps, { copyToMyWord, addClassBookmark, removeClassBookmark, changeScript, updateScript })(ScriptsEdit);
