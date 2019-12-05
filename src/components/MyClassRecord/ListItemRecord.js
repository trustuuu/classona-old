import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ListView, Text, Button, ScrollView, View, TouchableHighlight } from 'react-native';
import {CardSection, Card} from '../common';
//import { MediaItem } from './MediaItem';
import { Actions, ActionConst } from 'react-native-router-flux';
import colors from '../../styles/colors';
import global from '../../helpers/global.js';
import { deleteRecord, uploadMyPrivateClass  } from '../../actions';

import Swipeout from 'react-native-swipeout';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import TrackPlayer from 'react-native-track-player';

class ListItemRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfFiles: 0,
            uploading: false,
            tracks: [{url: ''}],
            error: ''
        };
    }

    _play() {
       console.log('_play');
       const {files} = this.props.oRecord;
        if (files) {
            TrackPlayer.reset()
            .then(() => {
                console.log('files', files);

                let tracks = [{
                    id: `file://${files[0]}`,
                    url: `file://${files[0]}`,
                    title: 'recordedFile',
                    artist: 'private',
                    album: 'record',
                    date: '2014-05-20T07:00:00+00:00', // RFC 3339
                }]
                console.log('tracks => ', tracks);
                
                TrackPlayer.add(tracks)
                .then(() => {
                    this.setState({tracks: tracks});
                    console.log('added ', tracks);
                    TrackPlayer.play();
                })
                .catch((err) => {
                    this.setState({error: err});
                    console.error(err);
                });
            })
            

        } else
            console.log("file does not exist yet");
    }

    render(){
        const { fileName, files, timestamp, duration} = this.props.oRecord;
        const { recording, playing } = this.props;
        const { numberOfFiles, uploading } = this.state;
        console.log('this.props.play', this.props.play);
        const swipeBtns = (!uploading) ? [
            {
                text: 'Upload',
                backgroundColor: '#00cec9',
                underlayColor: '#dfe6e9',
                onPress: () => {
                    if (!uploading) {
                        this.setState({
                            numberOfFiles: files.length,
                            uploading: true,
                        });
                        this.props.uploadMyPrivateClass(fileName, files);
                    }
                },
            },
            {
                text: 'Delete',
                backgroundColor: '#d63031',
                underlayColor: '#dfe6e9',
                onPress: () => {
                    if (!uploading)
                        this.props.deleteRecord(fileName, files);
                },
            }
        ]: [];

        const progress = Math.floor(((numberOfFiles - files.length)/ numberOfFiles) * 100);
        const date = new Date(timestamp);
        const time = `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        return (
            <Card>
                <Swipeout 
                    right={swipeBtns}
                    autoclose={true}
                    backgroundColor='transparent'
                >
                    <TouchableHighlight
                        underlayColor='#0984e3'
                    >
                        <View>
                            <CardSection>
                                <Button 
                                    style={styles.titleStyle}
                                    title={`${time}`}
                                    onPress={ () => this._play()} //this.props.play(files)}
                                >
                                </Button>
                                { 
                                    uploading
                                    ? (
                                        <AnimatedCircularProgress
                                          size={40}
                                          style={styles.progressIndicator}
                                          width={1}
                                          fill={progress}
                                          tintColor="#00e0ff"
                                          onAnimationComplete={() => console.log('onAnimationComplete')}
                                          backgroundColor="#3d5875"
                                        >
                                        {
                                          (fill) => (
                                            <Text>
                                              { `${fill}%` }
                                            </Text>
                                          )
                                        }
                                        </AnimatedCircularProgress>
                                    ) : (
                                        <Text style={styles.textStyle}>
                                            { `${duration} secs `}
                                            {/* { `${duration} secs [${this.state.error}]===[${this.state.tracks[0].url}]`} */}
                                        </Text>
                                    )
                                }
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
      paddingLeft: 15
    },
    progressIndicator: {
      marginLeft: 'auto',
      marginRight: 10,
    },
    textStyle: {
      marginLeft: 'auto',
      marginRight: 10,
      alignSelf: 'center',
      color: '#007aff',
      fontSize: 16,
      fontWeight: '600',
      paddingTop: 10,
      paddingBottom: 10
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20
    },
};

export default ListItemSwipable = connect(null, { deleteRecord, uploadMyPrivateClass })(ListItemRecord);
