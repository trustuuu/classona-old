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
                    //<View key={index}>
                    <CardSection style={[{ backgroundColor : (track.id == this.state.currentTrackId) ? colors.selectYellow : colors.white, 
                                        borderRadius:25, 
                                        paddingLeft: 15,
                                        marginTop: 5}]}
                    >
                    
                        <TouchableOpacity style={styles.TouchableText} 
                        onPress={() => this.onPress(track.id)}
                        >
                            <Text>
                                {track.title}
                            </Text>
                        </TouchableOpacity>
                    </CardSection>
                    //</View>  
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
            <View style={{flex:1, flexDirection:'column', backgroundColor:colors.screenBGColor, justifyContent:'space-between', alignItems:'stretch'}}>
                <View style={{flex:8}}>
                <Header headerText='Class media list' textStyle={{color:colors.white, fontFamily:'GillSans-Light'}}
                            viewStyle={{backgroundColor:colors.homeBlue, height:80}}/>
                <ScrollView> 
                        <Card>
                            <CardSection style={{borderRadius:25, marginTop:20, marginBottom:20, backgroundColor:colors.playBGColor}}>
                                {this.trackHeader()}
                            </CardSection>
                            {this.trackList()}
                        </Card>
                </ScrollView>
                </View>
                <View style={{flex:1, alignItems:'center'}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={ () => Actions.pop() }>
                        <Text style={{color:colors.white}}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = {
    TouchableText: {
        //backgroundColor: '#DDDDDD',
        padding: 2,
        alignItems:'stretch'
        //borderRadius:15
    },
    titleStyle: {
      fontSize: 15,
      //fontWeight: "bold",
      color: colors.white,
      paddingLeft: 15,
      alignItems:'stretch'
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20
      },
      buttonStyle: {
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 5, 
        backgroundColor: '#405CE5',
        borderRadius: 25, 
        height: 48, 
        width: 250, 
        //margin:5
    }
  };

// const MapStateToProps = ({player}) =>
// {
//     const { tracks, currentTrackId } = player; 
//     const track =  tracks ? tracks.find((track) => track.id == currentTrackId) : null

//     return {tracks, track, currentTrackId};
// }


export default MediaList;
//export default connect(MapStateToProps, {})(MediaList);
