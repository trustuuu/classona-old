import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, View, Text, StyleSheet, TouchableHighlight, Image, TouchableOpacity, ScrollView, Switch} from 'react-native';
import { initializePlayback, uploadMyPrivateClass, updateDuration, addNewRecord, addNewFile, deleteAllRecord } from '../../actions';
import { Input, Button, Card, CardSection, OptimizedFlatList } from '../common';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import AudioRecord from 'react-native-audio-record';
import Permissions from 'react-native-permissions';
import BackgroundTimer from 'react-native-background-timer';
import colors from '../../styles/colors';

import ProgressBar from '../ProgressBar';
import ListItemRecord from './ListItemRecord';
import AudioDisplayer from './AudioDisplayer';
//import AudioWaveDisplayer from './AudioWaveDisplayer';

import iconArrow from '../../icons/arrow.png';
import iconPlay from '../../icons/play.png';
import iconPause from '../../icons/pause.png';
import iconPrevious from '../../icons/previous.png';
import iconNext from '../../icons/next.png';
import iconFinishRecord from '../../icons/finishRecord.png';
import iconRecord from '../../icons/record.png';
import global from '../../helpers/global.js';
import { decode } from 'base-64';

const Int16Max = 2147483647;
const Int16Min = -2147483647;

const options = (fileName) => ({
    sampleRate: 8000,
    channels: 1,
    bitsPerSample: 16,
    wavFile: fileName,
});

class ClassRecorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            playing: false,
            finished: false,
            currentFileName: '',
            currentFileIndex: 0,
            recordDuration: 0,
            intervalDuration: null,
            intervalUpdate: null,
            currentRecordTimestamp: -1,
            recordedSound: [],
            recordedMax: 0,
        };
    }

    async componentDidMount() {
        await this.checkPermission();
        await TrackPlayer.stop();
        await TrackPlayer.reset();
        this.props.initializePlayback();
        AudioRecord.on('data', data => {
            //console.log(data.length);
            if (Platform.OS === 'ios') {
                const raw8 = decode(data);
                const array8 = new Uint8Array(new ArrayBuffer(raw8.length));
                for(i = 0; i < raw8.length; i++) {
                    array8[i] = raw8.charCodeAt(i);
                }
                const raw16 = new Int16Array( array8.buffer );
                const length16 = raw16.length;
                let temp = [];
                for (let i=0; i < length16; i++) {
                    temp.push(raw16[i]);
                }
                const max_1 = temp.slice(0, length16/2).reduce((acc, curr) => acc > Math.abs(curr) ? acc : Math.abs(curr), 0)/Int16Max;
                const max_2 = temp.slice(length16/2, length16).reduce((acc,curr) => acc > Math.abs(curr) ? acc : Math.abs(curr), 0)/Int16Max;
                this.setState((state) => {
                    return {
                        recordedSound: [ ...state.recordedSound, max_1, max_2],
                    };
                });
            }
        });
    }

    componentWillUnmount()
    {
        if(this.state.recording)
            this._recordFinish();
    }

    checkPermission = async () => {
        const p = await Permissions.check('microphone');
        console.log('permission check', p);
        if (p === 'authorized') return;
        return this.requestPermission();
    };

    requestPermission = async () => {
        console.log("permission is requested");
        const p = await Permissions.request('microphone');
        console.log('permission request', p);
    };

    //////////////////////// Record ////////////////////////////////////
    
    prepareRecordingPath(){
        const currentTime = Math.floor(Date.now());
        const { email } = this.props.user;
        const fileIndex = 1;
        const fileName = `${email}_${email}_privateClass_privateInstitution_1_${Math.floor(currentTime/1000)}`;

        this.props.addNewRecord({
            fileName,
            timestamp: currentTime,
            duration: 0,
            files: [],
        });

        this.setState({
            currentFileName: fileName,
            currentFileIndex: fileIndex,
        });

        AudioRecord.init(options(`${fileName}_${fileIndex}_${global.class}.wav`));
    }

    async _record() {
        this.setState({
            recordedSound: [],
        });
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        this.prepareRecordingPath();

        try {
            await AudioRecord.start();

            const intervalDuration = BackgroundTimer.setInterval(() => {
                this.props.updateDuration({
                    fileName: this.state.currentFileName,
                });
            }, 1000);

            const intervalUpdate = BackgroundTimer.setInterval(async () => {
                if (!this.state.recording) {
                    console.warn(`Can't update, not recording!`);
                    return;
                }
                let { currentFileIndex, currentFileName } = this.state;
                currentFileIndex++;
                this.setState({
                    currentFileIndex,
                });
                const filePath = await AudioRecord.stop();
                this.props.addNewFile({
                    filePath,
                    fileName: currentFileName,
                });
                await AudioRecord.init(options(`${currentFileName}_${currentFileIndex}.wav`));
                await AudioRecord.start();
            }, 2 * 60000); // 1 mins 

            this.setState({
                recording: true,
                intervalDuration,
                intervalUpdate,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async _recordFinish() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({
            recording: false
        });

        try {
            const filePath = await AudioRecord.stop();

            // Clear Intervals
            BackgroundTimer.clearInterval(this.state.intervalDuration);
            BackgroundTimer.clearInterval(this.state.intervalUpdate);

            // Add the last file
            this.props.addNewFile({
                filePath,
                fileName: this.state.currentFileName,
            });

            this.setState({
                intervalDuration: null,
                intervalUpdate: null,
                recordDuration: 0
            });
            
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    //////////////////////// Player ////////////////////////////////////
    
    async _play(files) {
        if (this.state.recording) {
            console.warn('finish recording first!');
            return;
        }

        console.log('play files', files);

        if (files) {
            await TrackPlayer.reset();
            
            let tracks = files.map((filePath)=> ({
                id: `file://${filePath}`,
                url: `file://${filePath}`,
                title: 'recordedFile',
                artist: 'private',
                album: 'record',
                date: '2014-05-20T07:00:00+00:00', // RFC 3339
            }));

            await TrackPlayer.add(tracks)
                .then(() => {
                    console.log('added ', tracks);
                })
                .catch((err) => {
                    console.error(err);
                });
            await TrackPlayer.play();

            this.setState({
                recordedSound: [],
                playing: true,
            });
        } else
            console.log("file does not exist yet");
    }

    async _playStop() {
        console.log("stop playing");
        this.setState({
            playing: false,
        });
        await TrackPlayer.stop();
    }

    async _previous() {
        // move backward 10 secs
        const currentTime = await TrackPlayer.getPosition();
        await TrackPlayer.seekTo(currentTime - 10);
    }

    async _next() {
        // move forward 10 secs
        const currentTime = await TrackPlayer.getPosition()
        await TrackPlayer.seekTo(currentTime + 10);
    }

    _isTrackPlayerNotPlaying() {
        return (this.props.state == TrackPlayer.STATE_PAUSED) || (this.props.state == TrackPlayer.STATE_STOPPED)|| (this.props.state == '')|| (this.props.state == 1);
    }

    //james@sample.com/james@sample.com_Conversation Class_ETC_2_1548993329_1.wav
    _renderController() {
        if(this._isTrackPlayerNotPlaying()){
            return (
                    <View style={styles.controls}>
                    {
                        this.state.recording ? (
                            <TouchableOpacity 
                                style={styles.recordPause}
                                onPress={() => this._recordFinish()}
                            >
                                <Image 
                                    style={styles.controlIcon}
                                    source={ iconFinishRecord }
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                style={styles.recordPause}
                                onPress={() => this._record()}
                            >
                                <Image 
                                    style={styles.controlIcon}
                                    source={iconRecord} 
                                />
                            </TouchableOpacity>
                        )
                    }
                    </View>
            );
        }
        else
            return (
                    <View style={styles.controls}>
                        <TouchableOpacity 
                            onPress={() => this._previous()}
                        >
                            <Image 
                                style={styles.controlIcon}
                                source={iconPrevious}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.playPause}
                            onPress={() => this._playStop()}
                        >
                            <Image 
                                style={styles.controlIcon}
                                source={(this._isTrackPlayerNotPlaying()) ? iconPlay : iconPause}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this._next()}
                        >
                            <Image 
                                style={styles.controlIcon}
                                source={iconNext}
                            />
                        </TouchableOpacity>
                    </View>
            );
    }

    _renderHeader = () => {
        return null;
     };

     // 'tom@sample.com/tom@sample.com_james@sample.com_Conversation Class_ETC_2_1548993329_1.wav'
    render() {
        return (
        <View style={styles.wrapper}>
            <OptimizedFlatList
                ListHeaderComponent={this._renderHeader}
                data={this.props.records}
                renderItem={({item}) => {
                    
                    return (
                        <ListItemRecord
                            key={item.timestamp}
                            recording={this.state.recording}
                            playing={this.state.playing}
                            oRecord={item}
                            play={(files)=> this._play(files)}
                        />
                    );
                }}
            />
             {/* <AudioWaveDisplayer
                filePath={'TrackPlayer'}
                height={100}
                bits={16}
                startTime={0}
                endTime={10}
            />  */}
            {   
                this.state.recording && (Platform.OS === 'ios') &&
                (
                    <AudioDisplayer
                        data={this.state.recordedSound}
                        minimumHeight={10}
                        height={10}
                        width={2}
                        max={this.state.recordedMax}
                        multiplyer={10000000}
                    />
                )
            }
            {
                this.state.playing  &&
                (
                    <View style={{marginBottom: 5}}>
                        <ProgressBar />
                    </View>
                )
            }
            {this._renderController()}
        </View>
      );
    }
}

const styles = {
    wrapper: {
        flex: 1,
        flexDirection: 'column',
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
    recordPause: {
        padding: 10,
        marginHorizontal: 15
    },
    playPause: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ffffff',
        padding: 10,
        marginHorizontal: 15
    },
    listenSwitch: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rectangle: {
        width: 5,
        height: 5,
        backgroundColor: 'red'
    }
};

const MapStateToProps = ({player, recorder, auth}) => {
    const { tracks, currentTrackId, state, currentPosition } = player;
    const track = tracks ? tracks.find((track) => track.id == currentTrackId) : null;
    const trackLoaded = tracks ? tracks.length > 0 : false;

    const { records } = recorder;
    const { user } = auth;

    return { records, user, tracks, track, currentTrackId, state, currentPosition, trackLoaded};
}

export default connect(MapStateToProps, { initializePlayback, updateDuration, uploadMyPrivateClass, addNewRecord, addNewFile, deleteAllRecord })(ClassRecorder);
