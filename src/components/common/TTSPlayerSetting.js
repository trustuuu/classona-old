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
  TouchableOpacity, Picker, label, input
} from "react-native";

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import Tts from 'react-native-tts';

import { getTTSSetting, switchLanguage, switchVoice, switchFirstLanguage, switchFirstLanguageVoice, textChangeAction } from '../../actions';
import { Card, CardSection, Input, Button, Spinner, Header, RNPickerSelect} from '../common';
import ImageButton from './ImageButton';
import iconPlay from '../../icons/play.png';
import colors from '../../styles/colors';
import languageData from './language.json';

//type props = {};
class TTSPlayerSetting extends Component{
    state = {
        voices: [{id:'com.apple.ttsbundle.Yuna-compact'}],
        ttsStatus: "initiliazing",
        selectedVoice: null,
        selectMotherVoice: null,
        selectedLanguage: null,
        selectMotherLanguage: null,
        speechRate: 0.5,
        speechPitch: 1,
        phrase: 'Hello, Welcome to echo study! Enjoy learning and sharing.',
        description: '안녕하세요 에코 스터디에 오신걸 환영합니다. 즐거운 시간되세요.',
        interval: "3",
        play: ''
    }

    constructor(props) {
      super(props);
      this.props.getTTSSetting();
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount()
    {
        this.setState({selectedVoice: this.props.voice,
          selectMotherVoice: this.props.firstLanguageVoice,
          selectedLanguage: this.props.language,
          selectMotherLanguage: this.props.firstLanguage,
          interval: this.props.interval,
          play: this.props.play});

        Tts.addEventListener("tts-start", event =>
        this.setState({ ttsStatus: "started" })
        );
        Tts.addEventListener("tts-finish", event =>
        this.setState({ ttsStatus: "finished" })
        );
        Tts.addEventListener("tts-cancel", event =>
        this.setState({ ttsStatus: "cancelled" })
        );
        Tts.setDefaultRate(this.state.speechRate);
        Tts.setDefaultPitch(this.state.speechPitch);
        Tts.getInitStatus().then(this.initTts);
    }

    static getDerivedStateFromProps(nextProps, prevState){
      console.log('getDerivedStateFromProps', nextProps,  prevState);
        if(nextProps.voice !== prevState.selectedVoice) return { voice: nextProps.voice };
        else if(nextProps.interval !== prevState.interval) return { interval: nextProps.interval };
        else if(nextProps.firstLanguageVoice !== prevState.selectMotherVoice) return { firstLanguageVoice: nextProps.firstLanguageVoice };
        else if(nextProps.language !== prevState.selectedLanguage) return { language: nextProps.language };
        else if(nextProps.firstLanguage !== prevState.selectMotherLanguage) return { firstLanguage: nextProps.firstLanguage };
        else if(nextProps.play !== prevState.play) return { play: nextProps.play };
        else return null;
        
    }

    componentDidUpdate(prevProps, prevState) {
      console.log('componentDidUpdate', prevProps.play, this.props.play, prevState);
      if(prevProps.voice !== this.props.voice) this.setState({selectedVoice: this.props.voice});
      if(prevProps.firstLanguageVoice !== this.props.firstLanguageVoice) this.setState({selectMotherVoice: this.props.firstLanguageVoice});
      if(prevProps.language !== this.props.language) this.setState({selectedLanguage: this.props.language});
      if(prevProps.firstLanguage !== this.props.firstLanguage) this.setState({selectMotherLanguage: this.props.firstLanguage});
      if(prevProps.interval !== this.props.interval) this.setState({interval: this.props.interval});
      if(prevProps.play !== this.props.play) this.setState({play: this.props.play});
      //  if(prevProps.voice !== this.props.voice) {
      //   console.log('play1 ==?', prevProps.play, this.state.play, this.props.play);
      //     this.setState({selectedVoice: this.props.voice,
      //     selectMotherVoice: this.props.firstLanguageVoice,
      //     selectedLanguage: this.props.language,
      //     selectMotherLanguage: this.props.firstLanguage,
      //     interval: this.props.interval,
      //     play: this.props.play});
      // }
      console.log('play ==?', prevProps.play, this.state.play, this.props.play, this.props.interval);
    }

    //{language: "ar-SA", id: "com.apple.ttsbundle.Maged-compact", quality: 300, name: "Maged"}
    initTts = async () => {
      const voices = await Tts.voices();
      console.log('voices=>', voices);
      const availableVoices = voices
          .filter(v => !v.networkConnectionRequired && !v.notInstalled)
          .map(v => {
          return { id: v.id, name: v.name, language: v.language, label: `${v.name}(${v.language})`, languageId: v.language.split('-')[0], value: v.id} //value: {id: v.id, name: v.name, language: v.language, languageId: v.language.split('-')[0]} };
          });
      let selectedVoice = null;
      if (voices && voices.length > 0) {
          
          selectedVoice = voices[0].id;
          try {
              await Tts.setDefaultLanguage(voices[0].language);
          }
          catch (err) {
              // My Samsung S9 has always this error: "Language is not supported"
              console.log(`setDefaultLanguage error `, err);
          }
          this.setState({
              voices: availableVoices,
              selectedVoice,
              ttsStatus: "initialized"
          });
      }
      else{
          this.setState({ ttsStatus: "initialized" });
      }
    };

    readText = async (text, voiceId) => {

      const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      console.log('readText', voiceId, voice, this.state.voices);
       try{
        await Tts.setDefaultLanguage(voice.language);
      } catch (err) {
        // My Samsung S9 has always this error: "Language is not supported"
        console.log(`setDefaultLanguage error `, err);
      }
      
      await Tts.setDefaultVoice(voice.id);

      Tts.stop();
      Tts.speak(text);

    };

    handleChange = (event) => {
      this.setState(event);
      this.props.textChangeAction(event);
    }

    setSpeechRate = async rate => {
      await Tts.setDefaultRate(rate);
      this.setState({ speechRate: rate });
    };

    setSpeechPitch = async rate => {
      await Tts.setDefaultPitch(rate);
      this.setState({ speechPitch: rate });
    };


    onVoicePress = async voice => {
      //const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      console.log('voice sel 1=>', voice);
      try {

      //await Tts.setDefaultLanguage(voice.language);
      } catch (err) {
      // My Samsung S9 has always this error: "Language is not supported"
      console.log(`setDefaultLanguage error `, err);
      }
      //await Tts.setDefaultVoice(voice.id);
      this.setState({ selectedVoice: voice});
      this.props.switchVoice(voice);
    };


    onLanguagePress = async lang => {
      //const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      console.log('voice lang=>', lang);
      try {

      //await Tts.setDefaultLanguage(voice.language);
      } catch (err) {
      // My Samsung S9 has always this error: "Language is not supported"
      console.log(`setDefaultLanguage error `, err);
      }
      //await Tts.setDefaultVoice(voice.id);
      this.setState({ selectedLanguage: lang});
      this.props.switchLanguage(lang);
    };

    onMotherVoicePress = async voice => {
      //const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      console.log('onMotherVoicePress voice=>', voice);
      try {
        //await Tts.setDefaultLanguage(voice.language);
      } catch (err) {
      // My Samsung S9 has always this error: "Language is not supported"
      console.log(`setDefaultLanguage error `, err);
      }
        //await Tts.setDefaultVoice(voice.id);
      this.setState({ selectMotherVoice: voice});
      this.props.switchFirstLanguageVoice(voice);
    };

    onMotherLanguagePress = async lang => {
      console.log('onMotherLanguagePress lang=>', lang);
      //const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      try {
        //await Tts.setDefaultLanguage(voice.language);
      } catch (err) {
      // My Samsung S9 has always this error: "Language is not supported"
      //console.log(`setDefaultLanguage error `, err);
      }
        //await Tts.setDefaultVoice(voice.id);
      this.setState({ selectMotherLanguage: lang});
      this.props.switchFirstLanguage(lang);
    };

    
render() {
    return (
      <View style={[styles.container, {borderWidth: 0}]}>
        <Card style={{borderWidth: 0, backgroundColor: colors.green01}}>
          <CardSection style={styles.container}>   
            <TextInput
              style={styles.textInput}
              multiline={true}
              onChangeText={text => this.setState({ text })}
              value={this.state.phrase}
              onSubmitEditing={Keyboard.dismiss}
            />

            <ImageButton
              source={iconPlay}
              onPress={() => this.readText(this.state.phrase, this.state.selectedVoice)}
              style={styles.playPause}
              imageStyle={styles.controlIcon}
            />
          </CardSection>

          <CardSection style={styles.container}>
            <RNPickerSelect
              placeholder={{
                  label: 'Select a language...',
                  value: null,
                  color: '#9EA0A4',
              }}
              items={languageData}
              onValueChange={(value) => {
                  this.onLanguagePress(value);
              }}
              onUpArrow={() => {
                  //this.inputRefs.name.focus();
              }}
              onDownArrow={() => {
                  //this.inputRefs.picker2.togglePicker();
              }}
              style={{ ...pickerSelectStyles }}
              value={this.props.language}
              ref={(el) => {
                  //this.inputRefs.picker = el;
              }}
            />
          </CardSection>
          <CardSection style={styles.container}>
            <RNPickerSelect
              placeholder={{
                  label: 'Select a voice...',
                  value: null,
                  color: '#9EA0A4',
              }}
              items={this.state.voices.filter((voice) => voice.languageId == this.props.language)}
              onValueChange={(value) => {
                  this.onVoicePress(value);
              }}
              onUpArrow={() => {
                  //this.inputRefs.name.focus();
              }}
              onDownArrow={() => {
                  //this.inputRefs.picker2.togglePicker();
              }}
              style={{ ...pickerSelectStyles }}
              value={this.props.voice}
              ref={(el) => {
                  //this.inputRefs.picker = el;
              }}
            />
          </CardSection>
        </Card>
          
        <Card>
          <CardSection style={styles.container}>   
            <TextInput
              style={styles.textInput}
              multiline={true}
              onChangeText={text => this.setState({ text })}
              value={this.state.description}
              onSubmitEditing={Keyboard.dismiss}
            />
            <ImageButton
              source={iconPlay}
              onPress={() => this.readText(this.state.description, this.state.selectMotherVoice)}
              style={styles.playPause}
              imageStyle={styles.controlIcon}
            />
          </CardSection>

          <CardSection style={styles.container}>
              <RNPickerSelect
                placeholder={{
                    label: 'Select a language...',
                    value: null,
                    color: '#9EA0A4',
                }}
                items={languageData}
                onValueChange={(value) => {
                    this.onMotherLanguagePress(value);
                }}
                onUpArrow={() => {
                    //this.inputRefs.name.focus();
                }}
                onDownArrow={() => {
                    //this.inputRefs.picker2.togglePicker();
                }}
                style={{ ...pickerSelectStyles }}
                value={this.props.firstLanguage}
                ref={(el) => {
                    //this.inputRefs.picker = el;
                }}
              />
          </CardSection>
          <CardSection style={styles.container}>
              <RNPickerSelect
                placeholder={{
                    label: 'Select a mother voice...',
                    value: null,
                    color: '#9EA0A4',
                }}
                items={this.state.voices.filter((voice) => voice.languageId == this.props.firstLanguage)}
                onValueChange={(value) => {
                    this.onMotherVoicePress(value);
                }}
                onUpArrow={() => {
                    //this.inputRefs.name.focus();
                }}
                onDownArrow={() => {
                    //this.inputRefs.picker2.togglePicker();
                }}
                style={{ ...pickerSelectStyles }}
                value={this.props.firstLanguageVoice}
                ref={(el) => {
                    //this.inputRefs.picker = el;
                }}
              />
          </CardSection>
          <CardSection style={styles.container}>   
            <Text style={styles.textLabel}>Play interval (sec)</Text>
            <TextInput
              style={[styles.textInput, { marginLeft:10, width:50 }]}
              multiline={true}
              onChangeText={text => this.handleChange({'interval': text})}
              value={this.state.interval}
              onSubmitEditing={Keyboard.dismiss}
            />
          </CardSection>
          <CardSection style={styles.container}>   
            <Text style={styles.pickerTextStyle}>Select field for play</Text>
          </CardSection>
          <CardSection style={styles.container}>
            < RNPickerSelect
                placeholder={{
                    label: 'Select',
                    value: null,
                    color: '#9EA0A4',
                }}
                items={[{'label':'phrase', 'value':'phrase'}, {'label':'description', 'value':'description'}]}
                onValueChange={(value) => {
                    this.handleChange({'play': value});
                }}
                onUpArrow={() => {
                    //this.inputRefs.name.focus();
                }}
                onDownArrow={() => {
                    //this.inputRefs.picker2.togglePicker();
                }}
                style={{ ...pickerSelectStyles }}
                value={this.props.play.toLowerCase()}
                ref={(el) => {
                    //this.inputRefs.picker = el;
                }}
              />
            
          </CardSection>
        </Card>

        <Text style={styles.label}>{`Status: ${this.state.ttsStatus ||
          ""}`}</Text>

        <Text style={styles.label}>{`Selected Voice: ${this.state
          .selectedVoice || ""}`}</Text>

        <View style={styles.sliderContainer}>
          <Text
            style={styles.sliderLabel}
          >{`Speed: ${this.state.speechRate.toFixed(2)}`}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.01}
            maximumValue={0.99}
            value={this.state.speechRate}
            onSlidingComplete={this.setSpeechRate}
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text
            style={styles.sliderLabel}
          >{`Pitch: ${this.state.speechPitch.toFixed(2)}`}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2}
            value={this.state.speechPitch}
            onSlidingComplete={this.setSpeechPitch}
          />
        </View>


      </View>
    );
  }
}

const mapStateToProps = ({myDictionary}) => { //{ auth, myDictionary }) => {
    //const {email, password, error, loading} = state.auth;
    console.log('myDictionary', myDictionary);
    
    const {error, loading, firstLanguage, firstLanguageVoice, language, voice, interval, play } = myDictionary;
    return { error, loading, firstLanguage, firstLanguageVoice, language, voice, interval, play };
}


export default connect(mapStateToProps, {getTTSSetting, switchLanguage, switchVoice, switchFirstLanguage, switchFirstLanguageVoice, textChangeAction })(TTSPlayerSetting);


const styles = StyleSheet.create({
  container: {
    //marginTop: 26,
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    //backgroundColor: "#F5FCFF"
    borderBottomWidth: 0,
    backgroundColor: colors.green01,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  label: {
    textAlign: "center"
  },
  sliderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  sliderLabel: {
    textAlign: "center",
    marginRight: 20
  },
  slider: {
    width: 150
  },
  textLabel: {
    flex: 1,
    width: "100%"
  },
  textInput: {
    borderColor: "gray",
    borderWidth: 1,
    flex: 1,
    width: 250
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

const pickerSelectStyles = StyleSheet.create({
    pickerTextStyle: {
        fontSize: 13,
        paddingLeft: 20
    },
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: colors.green01,
        color: 'black',
        width: 250
    },
    inputAndroid: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 0,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: colors.green01,
        color: 'black',
        width: 250
    },
});