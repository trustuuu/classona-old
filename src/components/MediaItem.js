import React, {Component} from 'react';
import { Text, Button, View, ScrollView, Dimensions } from 'react-native';
import {CardSection, Card} from './common';
import firebase from 'firebase';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';

const { width, height } = Dimensions.get('window');

class MediaItem extends Component {
    
    constructor(props) {
        super(props);
        
        //console.log("script sort", this.props.oClass.items[0].scripts.sort((script1, script2) => parseFloat(script1.startSecs) - parseFloat(script2.startSecs)));
        //objs.sort((a, b) => a.last_nom.localeCompare(b.last_nom));
        this.state = {
                currentPosition: 0,
                items: this.props.oClass.items.sort((item1, item2) => item1.seq - item2.seq)
                //scripts: this.props.oClass.items[0].scripts.sort((script1, script2) => parseFloat(script1.startSecs) - parseFloat(script2.startSecs))
            };

        this.scrolling = this.scrolling.bind(this);
      }

    async componentDidMount()
    {
        //ref:https://teamtreehouse.com/library/foreach-index-and-array-parameters
        
        // TrackPlayer.getQueue().then((queueTracks) => {
        //     console.log('track queue', queueTracks);
        //     TrackPlayer.remove(queueTracks);
            //tracks.forEach((track) => {TrackPlayer.remove(tracks)});
        await TrackPlayer.reset();

        //let classTracks =[]; // = new Array(this.props.oClass.items.length);

        // await TrackPlayer.setupPlayer({
        //     maxCacheSize: 1024 * 5 // 5 mb
        // });
        // TrackPlayer.updateOptions({
        //     capabilities: [
        //         TrackPlayer.CAPABILITY_PLAY,
        //         TrackPlayer.CAPABILITY_PAUSE,
        //         TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        //         TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        //     ]
        // });
        await this.state.items.forEach(async (item, index) => {
                
                console.log('track forEach', item, index, `${item.instructor}/${item.media}`);
                
                var storageRef = await firebase.storage().ref(`${item.instructor}/${item.media}`);
                var url = await storageRef.getDownloadURL();
                item.mediaUrl = url; 
        });
        //console.log("items, copyItems before setState", this.state.items, copyItems);
        //this.setState({items: copyItems})
        console.log("items, copyItems afterward", this.state.items, copyItems);
        
        //AppState.addEventListener('change', this.handleAppStateChange);
        //ref: https://github.com/react-native-kit/react-native-track-player/issues/256
        this._progressInterval = setInterval( async () => {
            const state = await TrackPlayer.getState()
            const pos = await TrackPlayer.getPosition();
            const currentTrack = await TrackPlayer.getCurrentTrack();
            
            if (state == TrackPlayer.STATE_PLAYING) {
              this.setState(prevState => {
                let time = Math.floor(Math.max(prevState.currentTime, pos))
                console.log(prevState.currentTime, pos, time)
                return { currentTime: time, pos: pos, seekValue: time, currentTrack: currentTrack }
              });
            }
          }, 100);

          //this.activeInterval = setInterval(this.scrolling, 2000);
    }

    componentWillUnmount()
    {
        clearInterval(this._progressInterval);
        //clearInterval(this.activeInterval);
    }

    scrolling() {
        // Start scrolling if there's more than one stock to display
        if (this.state.scripts.length > 1) {
            // Increment position with each new interval
            position = this.state.currentPosition + 5;
            this.ticker.scrollTo({ y: position, animated: true });
            // After position passes this value, snaps back to beginning
            let maxOffset = 20000;
            
            // Set animation to repeat at end of scroll
            if (this.state.currentPosition > maxOffset) {
                 this.ticker.scrollTo({ y: 0, animated: false })
                 this.setState({ currentPosition: 0 });
            }
            else {
                this.setState({ currentPosition: position });
            }
        }
    }

    async onStartPlay () {
            TrackPlayer.setupPlayer().then(  () => {
            console.log("inside", this.state.items);
            this.state.items.forEach((item, index) => {
                console.log("mediaUrl", item.mediaUrl);

                const track = {
                    id: item.media,                
                    url: item.mediaUrl, // Load media from the network                
                    title: `${item.className}[${item.instructor}]-${index}`,
                    artist: item.instructor,
                    album: `${item.className}-${index}`,
                    genre: item.institution,
                    date: '2014-05-20T07:00:00+00:00', // RFC 3339
                    customData: item.scripts
                }
                //classTracks.push(track);

                 TrackPlayer.add(track)
                .then(() => {
                    console.log('track added')
                })
                .catch((error) => {
                    console.log('error while adding tracks', error);
                });
                            
            })
                         
        
        })
        .catch((error) => {
                console.log('error while find media', error);
            });


        await TrackPlayer.getQueue().then(async (oTracks) => {
            console.log('TrackPlayer.getTrack(id).customData', oTracks);
            //this.setState({"scripts": this.props.oClass.items[0].scripts});
        });

        console.log('play');
        TrackPlayer.play();

        const currentTrackId = await TrackPlayer.getCurrentTrack();
        const currentTrack = await TrackPlayer.getTrack(currentTrackId);
        console.log('currentTrack', currentTrackId, currentTrack, currentTrack.customData);
    }

    onStopPlay () {
        //console.log('stop play');
        TrackPlayer.stop();
    }

    render(){
        const {className, instructor, institution} = this.state.items[0];
        //const { items } = this.props.oClass;
        
        //console.log("scripts", scripts, test, "test", sss.map(s => s.word).join(', '));

        return (
            <View style={{flex: 1}}>
        <ScrollView
            ref={(ref) => this.ticker = ref}
            bounces={true}
        >

            <Card>
                {/* <CardSection style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                        }}>
                {
                        this.state.items.map(item => 
                            <Text style={styles.descStyle}>
                            Media: {item.media}
                            </Text>
                        )
                    
                }
                </CardSection> */}
                {
                    this.state.items.map((item) => 
                        <CardSection style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                        }}>
                        
                        {item.scripts.sort((item1, item2)=> item1.startSecs - item2.startSecs)
                            .map(script => 
                                    <Text 
                                        style={{backgroundColor: 'white', backgroundColor : ((item.media == this.state.currentTrack) && (script.startSecs < this.state.pos) && (this.state.pos < script.endSecs)) ? "yellow" : "white"}}>
                                    {script.word.replace(/[\n\r]/g, ' ')}
                                    </Text>
                                )} 
                        </CardSection>
                    )
                }
                <CardSection>
                    
                </CardSection>
            </Card>
            </ScrollView>

                <View>
                <Button style={styles.titleStyle} title="Play" onPress={ () => this.onStartPlay() }>
                            Play
                    </Button>
                    <Button style={styles.titleStyle} title="Stop" onPress={ () => this.onStopPlay() }>
                            Stop
                    </Button>
                    <Text>{this.state.pos}</Text>
                </View>
            </View>
        );
    }

}

const styles = {
    titleStyle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "blue",
      paddingLeft: 15
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20
      }
  };

export default MediaItem;