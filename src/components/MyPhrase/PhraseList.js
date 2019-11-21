import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getAllMyPhrases, getMyPhrasesBookmark, getTTSSetting } from '../../actions';
import ListItemPhrase from './ListItemPhrase';
import { Input, OptimizedFlatList, FlatListItem } from '../common';
import Tts from 'react-native-tts';

const button_review = require('../../img/button_review.png');
const button_dic = require('../../img/button_dic.png');
const button_learn = require('../../img/button_learn.png');
const button_refresh = require('../../img/button_refresh.png');


import ImageButton from '../common/ImageButton';
import colors from '../../styles/colors';

import iconArrow from '../../icons/arrow.png';
import iconPlay from '../../icons/play.png';
import iconPause from '../../icons/pause.png';
import iconPrevious from '../../icons/previous.png';
import iconNext from '../../icons/next.png';


class PhraseList extends Component {
        constructor(props) {
        super(props);
        this.state = {
                ttsStatus: 'stopped',
                enterTime: null,
            };
      }

    componentDidMount()
    {
        //this.props.classAllFetchActions();
        this.onButtonRefresh();
        this.props.getTTSSetting();

        Tts.addEventListener("tts-start", event =>
        this.setState({ ttsStatus: "started" })
        );
        //Tts.addEventListener("tts-finish", this.playing);
        Tts.addEventListener("tts-cancel", event => {
                
                this.setState({ ttsStatus: "cancelled" })
            }
        );
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.enterTime !== nextProps.enterTime) {
            this.onButtonRefresh();
        }
    }

    onButtonRefresh()
    {
        if (this.props.bookmark)
        {
            this.props.getMyPhrasesBookmark();
        }else{
            this.props.getAllMyPhrases();
        }
        
    }

    renderHeader = () => {
        return <Input placeholder="Type Here..." lightTheme round />;
     };

    playing = () => {
        if (this.state.playlist == undefined) return;

        if ((this.state.playlist.length > 0) && (this.state.ttsStatus == "started"))
        {
            let newPlayList = this.state.playlist.slice(0);

            const playItem = newPlayList.shift();
            this.setState({'playlist': newPlayList});
            
            setTimeout(() => {
                    if ((this.state.ttsStatus == "started"))
                    {
                    const playText = this.props.play.toLowerCase() == 'phrase' ? playItem.phrase : playItem.description;
                    Tts.speak(playText); 
                    }
                }, 1000 * this.props.interval);
        }else{
            this.setState({ ttsStatus: "finished" });
        }
    }

    readText = async () => {
        
        let displayPhrases = [];
        if (this.props.bookmark){
            displayPhrases = this.props.phrasesBookmark;
        }
        else{
            displayPhrases = this.props.phrases;
        }

        if (this.state.ttsStatus == 'started') 
        {
            await Tts.stop();
            this.setState({ ttsStatus: "cancelled" });
            Tts.removeEventListener("tts-finish", this.playing);
            return;
        } 

        Tts.addEventListener("tts-finish", this.playing);
        const voice = this.props.play.toLowerCase() == 'phrase' ? this.props.voice : this.props.firstLanguageVoice;
        
        try{
            //await Tts.setDefaultLanguage(this.props.language);
        }catch (err) {
            // My Samsung S9 has always this error: "Language is not supported"
            console.log(`setDefaultLanguage error `, err);
        }
        await Tts.setDefaultVoice(voice);

        Tts.stop();
        if (displayPhrases.length > 0)
        {
            let newPlayList = displayPhrases.slice(0);
            const playItem = newPlayList.shift();
            this.setState({'playlist': newPlayList});

            const playText = this.props.play.toLowerCase() == 'phrase' ? playItem.phrase : playItem.description;
            await Tts.speak(playText);
        }
        
    };

    render()
    {
        let displayPhrases = [];
        if (this.props.bookmark){
            displayPhrases = this.props.phrasesBookmark;
        }
        else{
            displayPhrases = this.props.phrases;
        }
        //this.setState({phrases: displayPhrases});

        return (
            <View style={styles.wapper}>
                <View style={{flex: 1}}>
                    <ScrollView
                        //ref={(ref) => this.ticker = ref}
                        bounces={true}
                    >
                    <OptimizedFlatList
                        ListHeaderComponent={this.renderHeader}
                        data={displayPhrases}
                            renderItem={({item}) => {
                                return (
                                    <ListItemPhrase
                                        phrase={item} bookmark={this.props.bookmark}
                                    />
                                );
                            }
                        }

                        keyExtractor={phrase => phrase.phraseKey}
                    />
                    </ScrollView>
                </View>

                <View style={styles.controls}>
                    <ImageButton
                        source={iconPrevious}
                        //onPress={}
                        imageStyle={styles.controlIcon}
                        //disabled = {}
                    />
                    <ImageButton
                        source={((this.state.ttsStatus == 'cancelled') || (this.state.ttsStatus == 'finished') || 
                        (this.state.ttsStatus == 'stopped')|| (this.state.ttsStatus == '')) ? iconPlay : iconPause}
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
                
            </View>
            
        );
    }
}


const MapStateToProps = ({myDictionary}) =>
{
    const { phrases, firstLanguage, firstLanguageVoice, language, voice, interval, play, phrasesBookmark } = myDictionary; 
    return {phrases, firstLanguage, firstLanguageVoice, language, voice, interval, play, phrasesBookmark};
}


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

export default connect(MapStateToProps, {getAllMyPhrases, getMyPhrasesBookmark, getTTSSetting})(PhraseList);
