
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Text, Button, View, ScrollView, Dimensions,
         TouchableOpacity, ImageBackground,
        StatusBar, Platform, TextInput, Input,
        TouchableHighlight } from 'react-native';
import {CardSection, Card, Spinner } from '../common';
//import CardSectionKey from './common/CardSectionKey';
import { fetchLibrary, initializePlayback, setBlockStart, setBlockEnd } from '../../actions';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import Scripts  from './Scripts';
import ScriptsEdit from './ScriptsEdit';

import ImageButton from '../common/ImageButton';
import ProgressBar from '../ProgressBar';
import colors from '../../styles/colors';

import iconArrow from '../../icons/arrow.png';
import iconPlay from '../../icons/play.png';
import iconPause from '../../icons/pause.png';
import iconPrevious from '../../icons/previous.png';
import iconNext from '../../icons/next.png';
import global from '../../helpers/global.js';


const { width, height } = Dimensions.get('window');

class ClassPlayer extends Component {
    
    constructor(props) {
        super(props);
        const oItems = (this.props.oClass === undefined) ? global.oClass.items : this.props.oClass.items;
        if (this.props.oClass !== undefined) global.oClass = this.props.oClass;


        this.state = {
                items: oItems.sort((item1, item2) => item1.seq - item2.seq),
                blockStart: 0,
                blockEnd: 0,
                currentPosition: this.props.startSecs ? this.props.startSecs : 0,
                startSecs: this.props.startSecs,
                tracks: null,
            };

        this.scrolling = this.scrolling.bind(this);
      }

    async componentDidMount()
    {
        //ref:https://teamtreehouse.com/library/foreach-index-and-array-parameters
        await TrackPlayer.reset();
        await this.props.fetchLibrary(this.props.oClass.items);
        await this.props.initializePlayback();
    }

    async componentWillUnmount()
    {
        //clearInterval(this._progressInterval);
        //clearInterval(this.activeInterval);
        this.setState({tracks:null})
        await TrackPlayer.reset();
        this.props.setBlockEnd(0);
        this.props.setBlockStart(0);
    }


    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.currentPosition !== prevState.currentPosition){
            return { currentPosition: nextProps.currentPosition };
        }
        else if (nextProps.tracks != prevState.tracks){
            return { tracks: nextProps.tracks}
        }
        else{
            return null;
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.currentPosition!==this.props.currentPosition){
            this.setState({currentPosition: this.props.currentPosition});
            if ((this.props.tracks.length > 0) && (this.props.blockEnd > 0) && (this.state.currentPosition > this.props.blockEnd)){
                await TrackPlayer.pause();
                await TrackPlayer.seekTo(this.props.blockStart);
            } 
        }
        if (prevProps.tracks != this.props.tracks){

            this.addTracks();
            this.setState({tracks:this.props.tracks})
        }

      }

    scrolling() {
        // Start scrolling if there's more than one stock to display
        return;
        if (this.props.tracks.length > 1) {
            // Increment position with each new interval
            //position = this.state.currentPosition + 20;
            position = this.state.currentPosition + 20;
            this.ticker.scrollTo({ y: position, animated: true });
            // After position passes this value, snaps back to beginning
            let maxOffset = 20000;
            
            // Set animation to repeat at end of scroll
            if (false) { //this.state.currentPosition > maxOffset) {
                 this.ticker.scrollTo({ y: 0, animated: false })
                 this.setState({ currentPosition: 0 });
            }
            else {
                this.setState({ currentPosition: position });
            }
        }
    }

    async addTracks () {
        if (this.props.trackLoaded)
        {
            const queueTracks = await TrackPlayer.getQueue();
            
            if (queueTracks.length < 1){

                let state = await TrackPlayer.getState();
                // console.log('addTracks before  -> state', state);
                // console.log('addTracks', queueTracks, this.props.tracks);

                await TrackPlayer.add(this.props.tracks);

                const queueTracks2 = await TrackPlayer.getQueue();
                state = await TrackPlayer.getState();
            }

        }   
    }

    async onStartPlay () {
        
        const currentTrackId = await TrackPlayer.getCurrentTrack();
        const currentTrack = await TrackPlayer.getTrack(currentTrackId);
        console.log("track information", currentTrackId, currentTrack);
        if (this.props.media != undefined) {
            TrackPlayer.skip(this.props.media);
        }
        
        if (this.props.startSecs != undefined) {
            
            TrackPlayer.play();
            //if repeat block set
            if ((this.props.blockStart != undefined) && (this.props.blockStart > 0)){

                TrackPlayer.seekTo(this.props.blockStart);
            }
            else if ((this.props.triggerSource !== undefined) && (this.props.triggerSource == 'bookmark') && (this.state.startSecs != null)){

                TrackPlayer.seekTo(this.state.startSecs);
                this.setState({startSecs:null});
            }
            
        }
        else {
            try{

                TrackPlayer.play()

            }catch(e){
                console.log('error', e)
            }
            let state = await TrackPlayer.getState();
            console.log('play-state', state);
        }
    }

    onStopPlay () {
        //console.log('stop play');
        //clearInterval(this._progressInterval);
        //clearInterval(this.activeInterval);
        TrackPlayer.stop();
    }

    async _playPause() {
        if((this.props.state == TrackPlayer.STATE_PAUSED) || (this.props.state == TrackPlayer.STATE_READY)|| (this.props.state == TrackPlayer.STATE_STOPPED)|| (this.props.state == '')|| (this.props.state == 1)){
            await this.onStartPlay();
        } else {
            await TrackPlayer.pause();
        }

        let state = await TrackPlayer.getState();
        console.log('_playPause->state', this.props, state);
    }

    async _goBack() {
        //this.props.dispatch(navigateTo('library'));
        await TrackPlayer.skipToPrevious();
    }

    async _previous() {
        // TODO add tracks to the queue
        //TrackPlayer.seekTo()
        await TrackPlayer.skipToPrevious();        
    }

    async _next() {
        // TODO add tracks to the queue
        await TrackPlayer.skipToNext();
    }

    async _startBlock() {
        const pos = await TrackPlayer.getPosition();
        this.props.setBlockStart(pos);
        //this.props.setBlockEnd(0);
        //this.setState({'blockStart': pos, 'blockEnd': pos, 'blockStatus': 'start'});
    }

    async _endBlock() {
        const pos = await TrackPlayer.getPosition();
        TrackPlayer.pause();
        this.props.setBlockEnd(pos);

    }

    async _resetlock() {
        this.props.setBlockEnd(0);
        this.props.setBlockStart(0);
        
    }

    showSpin = () => {
        if (this.props.loading){
            return <Spinner size="large" />
        }
    }

    render(){
        const item =  this.props.track != null ? {...this.props.track.customData} : {...this.state.items[0]};
        let title = ((this.props.track != null) && (this.props.tracks != null)) ? `${this.props.track.title}/${this.props.tracks.length})` : `${item.className} by ${item.instructor} in ${item.institution}`;
        if (title.indexOf('privateInstitution') > -1) title = 'My Private Recording';
        const {className, instructor, institution} = item;

        // if (this.props.trackLoaded)
        // {
        //         console.log('this.state.tracks', this.state.tracks);
        //         TrackPlayer.getQueue().then((oTracks) => {
        //             if (oTracks.length < 1)
        //             {
        //                 TrackPlayer.add(this.props.tracks)
        //                 .then(() => {
        //                     this.setState({tracks:this.props.tracks})
        //                     console.log('this.state.tracks added', this.state.tracks);
        //                 })
        //                 .catch((error) => {
        //                     console.log('error while adding tracks', error);
        //                 });
        //             }
        //         });
        // }    

        //let artworkHeight = height / 2;
        //if(artworkHeight > width) artworkHeight = width;
        //const this.state.trackLoaded = this.props.tracks ? this.props.tracks.length > 0 : false;
        //const { items } = this.props.oClass;
        
        //console.log("scripts", scripts, test, "test", sss.map(s => s.word).join(', '));
        // if (this.props.loading){
        //     return <Spinner size="large" />;
        // }

        return (
            <View style={{flex: 1}}>
                <ScrollView
                    ref={(ref) => this.ticker = ref}
                    bounces={true}
                >
                    <Card>
                    {
                        //(global.userType == 'student') ?
                        ((global.userType == 'student') && (title != 'My Private Recording')) ?
                        <Scripts key={item.media} item={item} currentTrackId={this.props.currentTrackId} currentPosition={this.props.currentPosition} blockStart={this.props.blockStart} blockEnd={this.props.blockEnd} />
                        :
                        <ScriptsEdit key={item.media} item={item} currentTrackId={this.props.currentTrackId} currentPosition={this.props.currentPosition} blockStart={this.props.blockStart} blockEnd={this.props.blockEnd} />
                    }
                    </Card>
                    {this.showSpin()}
                </ScrollView>
                
                <View style={styles.floatingButtonView}>
                    <TouchableHighlight style={[styles.floatingButton, {backgroundColor: colors.green01}]} onPress={this._startBlock.bind(this)} >
                        <Text>{(this.props.blockStart > 0) ? `[${Math.round(this.props.blockStart)}]` : '>'}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={[styles.floatingButton, {backgroundColor: colors.yellow}]} onPress={this._endBlock.bind(this)} >
                        <Text>{(this.props.blockEnd) > 0 ? `[${Math.round(this.props.blockEnd)}]` : '<' }</Text>
                    </TouchableHighlight>
                    {
                        ((this.props.blockEnd > 0) || (this.props.blockStart > 0)) ?
                            <TouchableHighlight style={[styles.floatingButton, {backgroundColor: colors.lightRed}]} onPress={this._resetlock.bind(this)} >
                                <Text> {this.props.currentPosition.toFixed(1)} </Text>
                            </TouchableHighlight>
                            :
                            <View></View>
                    }
                </View>

                <View style={{marginBottom: 5}}>
                    <ProgressBar />
                </View>
                <View>
                    <Text style={{backgroundColor:colors.green01}}>{ title }</Text>
                </View>
                <View style={styles.controls}>
                    <ImageButton
                        source={iconPrevious}
                        onPress={this._previous.bind(this)}
                        imageStyle={styles.controlIcon}
                        disabled = {!this.props.trackLoaded}
                    />
                    <ImageButton
                        source={((this.props.state == TrackPlayer.STATE_PAUSED) || (this.props.state == TrackPlayer.STATE_STOPPED) || (this.props.state == TrackPlayer.STATE_READY) || (this.props.state == '')|| (this.props.state == 1)) ? iconPlay : iconPause}
                        onPress={this._playPause.bind(this)}
                        style={styles.playPause}
                        imageStyle={styles.controlIcon}
                        disabled = {!this.props.trackLoaded}
                    />
                    <ImageButton
                        source={iconNext}
                        onPress={this._next.bind(this)}
                        imageStyle={styles.controlIcon}
                        disabled = {!this.props.trackLoaded}
                    />
                </View>
            </View>
        );
    }

}

const styles = {
    TouchableText: {
        //backgroundColor: '#DDDDDD',
        padding: 2
    },
    artworkLandscape: {
        //TODO
    },
    info: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 20
    },
    title: {
        color: '#e6e6e6',
        fontSize: 19,
        fontWeight: '500'
    },
    artist: {
        color: '#9a9a9a',
        fontSize: 16,
        fontWeight: '400'
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


    floatingButtonView: {
        flex:1,
        flexDirection: 'column', justifyContent: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 160,
        right: 20,
        height: 50,
        width: 50,
    },
    floatingButton: {
        backgroundColor: colors.green02,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        shadowColor: colors.green01, //'#000000',
        shadowOpacity: 0.8,
        opacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0,
        }
    },
  };

const MapStateToProps = ({player}) =>
{
    console.log('state in MapStateToProps of ClassPlayer', player);

    const { tracks, currentTrackId, state, currentPosition, blockStart, blockEnd, loading } = player; 
    const track = currentTrackId !== null ? (tracks ? tracks.find((track) => track.id == currentTrackId) : null) : null;
    const trackLoaded = tracks ? tracks.length > 0 : false;
    
    return {tracks, track, currentTrackId, state, currentPosition, trackLoaded, blockStart, blockEnd, loading};
}


export default connect(MapStateToProps, {fetchLibrary, initializePlayback, setBlockStart, setBlockEnd })(ClassPlayer);
