import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Slider,
  TextInput,
  Keyboard,
  TouchableOpacity
} from "react-native";

import { Actions } from 'react-native-router-flux'
import Tts from 'react-native-tts';
import { connect } from 'react-redux';

import { Card, CardSection, Input, Button, Spinner, Header} from '../common';
import { getTTSSetting } from '../../actions';

import ImageButton from '../common/ImageButton';
import colors from '../../styles/colors';

import iconArrow from '../../icons/arrow.png';
import iconPlay from '../../icons/play.png';
import iconPause from '../../icons/pause.png';
import iconPrevious from '../../icons/previous.png';
import iconNext from '../../icons/next.png';


type props = {};
class TTSPlayer extends Component<props> {
        state = {
            voices: [{id:'com.apple.ttsbundle.Yuna-compact'}],
            ttsStatus: "initiliazing",
            selectedVoice: null,
            speechRate: 0.5,
            speechPitch: 1,
        }


     constructor(props) {
        super(props);
        this.state = {
                ttsStatus: 'stopped',
            };
    }

    listenerStart =  event => this.setState({ ttsStatus: "started" });
    listenerFinish =  event => this.setState({ ttsStatus: "finished" });
    listenerCancel =  event => this.setState({ ttsStatus: "cancelled" });

    componentDidMount()
    {
        this.props.getTTSSetting();
        
        Tts.addEventListener("tts-start", this.listenerStart);
        Tts.addEventListener("tts-finish", this.listenerFinish);
        Tts.addEventListener("tts-cancel", this.listenerCancel);
        //Tts.getInitStatus().then(this.initTts);

    }

    omponentWillUnmount()
    {
        Tts.removeEventListener("tts-start", this.listenerStart);
        Tts.removeEventListener("tts-finish", this.listenerFinish);
        Tts.removeEventListener("tts-cancel", this.listenerCancel);
    }

    initTts = async () => {
        // const voices = await Tts.voices();
        // console.log('voices=>', voices);
        // const availableVoices = voices
        //     .filter(v => !v.networkConnectionRequired && !v.notInstalled)
        //     .map(v => {
        //     return { id: v.id, name: v.name, language: v.language };
        //     });
        // let selectedVoice = null;
        // if (voices && voices.length > 0) {
        //     selectedVoice = voices[0].id;
        //     try {
        //         await Tts.setDefaultLanguage(voices[0].language);
        //     }
        //     catch (err) {
        //         // My Samsung S9 has always this error: "Language is not supported"
        //         console.log(`setDefaultLanguage error `, err);
        //     }
        //     this.setState({
        //         voices: availableVoices,
        //         selectedVoice,
        //         ttsStatus: "initialized"
        //     });
        // }
        // else{
            this.setState({ ttsStatus: "initialized" });
        // }
    };

    readText = async () => {
      if (this.state.ttsStatus == 'started') 
        {
            await Tts.stop();
            this.setState({ ttsStatus: "cancelled" });
            return;
        } 

        const voice = this.props.play.toLowerCase() == 'phrase' ? this.props.voice : this.props.firstLanguageVoice;
        
        try{
            //await Tts.setDefaultLanguage(this.props.language);
        }catch (err) {
            // My Samsung S9 has always this error: "Language is not supported"
            console.log(`setDefaultLanguage error `, err);
        }
        await Tts.setDefaultVoice(voice);

        Tts.stop();
        Tts.speak(this.props.phrase);
    };

    
render() {
    
    return (
      <View style={styles.controls}>
                    <ImageButton
                        source={iconPrevious}
                        //onPress={}
                        imageStyle={styles.controlIcon}
                        //disabled = {}
                    />
                    <ImageButton
                        source={((this.state.ttsStatus == 'cancelled') || (this.state.ttsStatus == 'finished') || 
                        (this.state.ttsStatus == 'stopped')|| (this.state.ttsStatus == 'initialized')|| (this.state.ttsStatus == '')) ? iconPlay : iconPause}
                        onPress={this.readText.bind(this)}
                        style={styles.playPause}
                        imageStyle={styles.controlIcon}
                        //disabled = {}
                    />
                    <ImageButton
                        source={iconNext}
                        //onPress={}
                        imageStyle={styles.controlIcon}
                        //disabled = {}
                    />
      </View>
    );
  }
}


const MapStateToProps = ({myDictionary}) =>
{
    const { firstLanguage, firstLanguageVoice, language, voice, interval, play } = myDictionary; 
    return {firstLanguage, firstLanguageVoice, language, voice, interval, play};
}


export default connect(MapStateToProps, {getTTSSetting})(TTSPlayer);


const styles = StyleSheet.create({
    wapper: {
    flex: 1,
    flexDirection: 'column',
    },

    buttonContainer: {
    //flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    },

   button: {
    width: 50,
    height: 50,
    marginRight: 10,
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
    }
});
