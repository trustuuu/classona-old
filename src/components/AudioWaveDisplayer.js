import React, { Component } from 'react';
import { Platform, View, Dimensions, Text } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { decode } from 'base-64';
import colors from '../styles/colors';
import RNFetchBlob from 'rn-fetch-blob';
import { ma } from '../helpers/utils';
import TrackPlayer from 'react-native-track-player';
const RNFS = require('react-native-fs');

//@padding: for audio wave cloud box
//@width: box of displayed box 
//@height: cloud box height
//@filePath: if given, should be 
//           the full path of files in storage ex) james@sample.com/james@sample.com_james@sample.com_.....
//           Or 
//           the relative path from RNFS.DocumentDirectoryPath  ex) james@sample.com_james@sample.com_...
//           Or
//           'TrackPlayer' for displaying file which is being played on TrackPlayer
//              
//           otherwise, @data should be given
//@data: base64 encode string for audio data 
//@minimumHeight: height of box when data is 0
//@multiplyer: lengthen the height of the audio signals
//@movAvg: size of window for moving average 

//@bits: wav bits
//@sampleRate: wav sample rate
//
//@startTime: start time for displaying wave. if @startTime > @endTime, set to 0
//@endTime: end time for displaying wave if @endTime > file's length, set to end of data 
//@currentTime: current time for indicatring current position (used for playing
//
//when 'TrackPlayer' is filePath, @startTime, @endTime, @currentTime is from TrackPlayer

const defaultValue = {
    padding: 10, 
    width: 1,
    minimumHeight: 4,
    multiplyer: 3,
    height: 50,
    sampleRate: 8000,
    movAvg: 3,
    bits: 16,
    data: '',
    startTime: 0,
    endTime:0,
    current:-1,
    max:32767,
    colorOfWave: colors.green01,
    colorOfCurrent: 'red'
};

class AudioWaveDisplayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPosition: 0,
            currentTrackId: null
        };
    }

    async componentDidMount() {
        await this._getData();
    }

    async componentWillUpdate(nextProps, nextState) {
        if (this.state.currentTrackId !== nextProps.currentTrackId) {
            await this._getData();
        }
    }

    async _getData() {
        let base64Str = null; 
        const { filePath, data, bits } = {
            ...defaultValue,
            ...this.props
        };

        if (filePath) {
            if (filePath === 'TrackPlayer') {
                const currentTrackId = this.props.currentTrackId; 
                console.log(currentTrackId);
                if (currentTrackId) {
                    this.setState({
                       currentTrackId 
                    });
                    const isExist = await RNFS.exists(currentTrackId);
                    if (isExist)
                        base64Str = await RNFS.readFile(currentTrackId, 'base64');
                    else
                        return;
                } else {
                    this.setState({
                        currentTrackId: null,
                    });
                    return;
                }
            }
            else {
                try {
                    const basename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
                    const fullFilePath = `file://${RNFS.DocumentDirectoryPath}/classona/${basename}`;
                    const isExist = await RNFS.exists(fullFilePath);
                    if (!isExist) {
                        console.log(`AudioWaveDisplayer: get ${filePath} from firebase store`);
                        const storageRef = await firebase.storage().ref(filePath);
                        const url = await storageRef.getDownloadURL();
                        const response = await RNFetchBlob.config({ fileCache : true, path:`${RNFS.DocumentDirectoryPath}/classona/${basename}` }).fetch('GET', url); // read file from firebase storage
                    }
                    base64Str = await RNFS.readFile(fullFilePath, 'base64'); //convert read file to base64 string
                } catch (error) {
                    console.log('AudioWaveDisplayer[ERROR]:', filePath, error);
                }
            }
        } else {
            base64Str = data;
        }

        if(typeof base64Str !== 'string' || base64Str === '')
            return;

        // convert base64 string to array of numbers according to @this.props.bits
        const raw8 = decode(base64Str);
        let length = raw8.length-4096;
        let array = new Uint8Array(new ArrayBuffer(length));
        for(i = 0; i < length; i++) {
            array[i] = raw8.charCodeAt(i+4096); //24 bytes for wav header
        }

        let processedData = (this.props.bits === 16) ? new Int16Array(array.buffer) : array;

        this.setState({
            data: processedData,
        });
    }

    _chunk(array, size) {
        const chunked_arr = [];
        for (let i = 0; i < array.length; i++) {
            const last = chunked_arr[chunked_arr.length - 1];
            if (!last || last.length === size) {
                chunked_arr.push([array[i]]);
            } else {
                last.push(array[i]);
            }
        }
        return chunked_arr;
    }

    render() {
        const { 
            minimumHeight, 
            sampleRate,
            height,
            width,
            multiplyer,
            padding,
            movAvg,
            max,
            colorOfWave,
            colorOfCurrent,
            filePath,
            current,
            state
        } = {
            ...defaultValue, // default  value is at line 18 
            ...(this.props)
        };

        let { 
            startTime,
            endTime,
        } = {
            ...defaultValue, // default  value is at line 18 
            ...(this.props)
        };

        if (startTime < 0)// check arguments
            startTime = 0;
        
        if (startTime > endTime){
            let temp = endTime;
            endTime = startTime;
            startTime = temp; 
        }

        const { 
            data 
        } = this.state;

        if (endTime*sampleRate > data.length) {
            endTime = data.length / sampleRate;
        }

        console.log("state", state);

        if (filePath === 'TrackPlayer' && state === TrackPlayer.STATE_STOPPED)
            return null;

        let boxHeights = [];
        let temp = [];
        let i = 0;
        const numOfBoxes = (Dimensions.get('window').width-padding)/width;
        for (let j = startTime*sampleRate; i < endTime * sampleRate;) {
            temp[i++] = data[j++];
        }

        const dataLength = temp.length;
        const sizeOfChunk = Math.floor(dataLength/numOfBoxes);
        const currentIndex = Math.floor(((current-startTime) * sampleRate ) / sizeOfChunk);
        boxHeights = this._chunk(temp, sizeOfChunk).map(chunked_arr => {
            return Math.max(...chunked_arr);
        });
        boxHeights = ma(boxHeights, movAvg).map((boxHeight) => minimumHeight + multiplyer * (height * boxHeight / max));
        return (
            <View key={boxHeights.toString()} style={{
                flexDirection: 'row',
                height: height,
                alignItems: 'center',
                backgroundColor: 'red', 
                justifyContent: this.props.filePath ? 'center' :'flex-end',
            }}>
            {
                boxHeights.map((boxHeight, index) => {
                    return (
                        <View key={index} style={{height: ((index === currentIndex) ? height : boxHeight), width: width, backgroundColor: ((index === currentIndex ) ? colorOfCurrent : colorOfWave) }}/> 
                    );
                })
            }
            </View>
        );
    }
}

const MapStateToProps = ({player}) => {
    const { currentTrackId, state, currentPosition } = player;
    return { currentTrackId, state, currentPosition };
}

export default connect(MapStateToProps, null)(AudioWaveDisplayer);
