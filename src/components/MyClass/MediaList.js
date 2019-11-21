import React, { Component } from 'react';
//import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Text, Button, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import {CardSection, Card, Header } from '../common';
import TrackPlayer from 'react-native-track-player';

import ImageButton from '../common/ImageButton';
import colors from '../../styles/colors';

class MediaList extends Component {

    constructor(props) {
        super(props);
        this.state = {
                tracks: null,
                currentTrackId: null
            };
    }
    async componentDidMount()
    {
        const oTracks = await TrackPlayer.getQueue();
        const currentTrackId = await TrackPlayer.getCurrentTrack();
        this.setState({tracks: oTracks, currentTrackId: currentTrackId});
    }

    trackHeader = () => {
        if (this.state.tracks == null) return;
        if (this.state.tracks.length < 1) return;

        const track = this.state.tracks[0];
        return (
            <View>
                <Text style={styles.titleStyle}>{`Institution: ${track.genre}`}</Text>
                <Text style={styles.titleStyle}>{`Instructor: ${track.artist}`}</Text>
                <Text style={styles.titleStyle}>{`Class: ${track.album.split('-')[0]}`}</Text>
            </View>
        );
    }

    trackList = () => {

        if (this.state.tracks == null) return;

        const newTracks = this.state.tracks.map((track, index) => {
                return(
                    <View key={index}>
                    
                    <TouchableOpacity style={styles.TouchableText} 
                    onPress={() => this.onPress(track.id)}
                    >
                        <Text style={[styles.titleStyle, { backgroundColor : (track.id == this.state.currentTrackId) ? "yellow" : "white"}]} >
                            {track.title}
                        </Text>
                    </TouchableOpacity>
                    </View>  
                ); 
            });
        
        return newTracks;
    }

    onPress = (trackId) => {
        TrackPlayer.skip(trackId);
        TrackPlayer.play();
        this.setState({'currentTrackId': trackId});
    }

    render()
    {
        return(
            
            <ScrollView contentContainerStyle={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}>
                <Header headerText='Class media list' style={{backgroundColor:colors.green01, fontWeight: "bold"}}/>
                <Card>
                    {this.trackHeader()}
                </Card>
                <Card>
                    {this.trackList()}
                </Card>
                <Card>
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => Actions.pop() }>
                        <Image style={styles.buttonRight} source={require('../../img/save.png')}></Image>
                    </TouchableOpacity>
                </Card>
            </ScrollView>
        )
    }
}


const styles = {
    TouchableText: {
        //backgroundColor: '#DDDDDD',
        padding: 2
    },
    titleStyle: {
      fontSize: 15,
      //fontWeight: "bold",
      //color: colors.green01,
      paddingLeft: 15
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20
      },
    buttonContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        paddingBottom: 100
    },
    buttonLeft: {
        width: 50,
        height: 50,
        marginLeft: 120,
    },
    buttonRight: {
        width: 50,
        height: 50,
    },
  };

// const MapStateToProps = ({player}) =>
// {
//     const { tracks, currentTrackId } = player; 
//     const track =  tracks ? tracks.find((track) => track.id == currentTrackId) : null

//     return {tracks, track, currentTrackId};
// }


export default MediaList;
//export default connect(MapStateToProps, {})(MediaList);
