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
import iconPlay from '../../icons/icon_play.png';
import colors from '../../styles/colors';
import languageData from './language.json';

//type props = {};
class TTSPlayerSetting extends Component{
    state = {
        voices: [{id:'com.apple.ttsbundle.Yuna-compact'},{id:'com.apple.ttsbundle.Tessa-compact'}],
        ttsStatus: "initiliazing",
        voice: null,
        firstLanguageVoice: null,
        language: null,
        firstLanguage: null,
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

    async componentDidMount()
    {
        this.setState({voice: this.props.voice,
          firstLanguageVoice: this.props.firstLanguageVoice,
          language: this.props.language,
          firstLanguage: this.props.firstLanguage,
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
        Tts.getInitStatus().then(await this.initTts());
    }

    static getDerivedStateFromProps(prevState, nextProps){
      //console.log('getDerivedStateFromProps',  prevState.language, nextProps.language, nextProps.voice);
        if(nextProps.voice !== prevState.voice) return { voice: nextProps.voice };
        else if(nextProps.interval !== prevState.interval) return { interval: nextProps.interval };
        else if(nextProps.firstLanguageVoice !== prevState.firstLanguageVoice) return { firstLanguageVoice: nextProps.firstLanguageVoice };
        else if(nextProps.language !== prevState.language) return { language: nextProps.language };
        else if(nextProps.firstLanguage !== prevState.firstLanguage) return { firstLanguage: nextProps.firstLanguage };
        else if(nextProps.play !== prevState.play) return { play: nextProps.play };
        else return null;
        
    }

    componentDidUpdate(prevProps, prevState) {
      //console.log('componentDidUpdate, prevProps, prevState', prevProps.language, this.props.language, this.props.voice, prevProps, prevState);
      if(prevProps.voice !== this.props.voice) {
        //console.log('this.props.voice', this.props.voice);
        this.setState({voice: this.props.voice});
      }
      if(prevProps.firstLanguageVoice !== this.props.firstLanguageVoice) this.setState({firstLanguageVoice: this.props.firstLanguageVoice});
      if(prevProps.language !== this.props.language) this.setState({language: this.props.language});
      if(prevProps.firstLanguage !== this.props.firstLanguage) this.setState({firstLanguage: this.props.firstLanguage});
      if(prevProps.interval !== this.props.interval) this.setState({interval: this.props.interval});
      if(prevProps.play !== this.props.play) this.setState({play: this.props.play});
      //  if(prevProps.voice !== this.props.voice) {
      //   console.log('play1 ==?', prevProps.play, this.state.play, this.props.play);
      //     this.setState({voice: this.props.voice,
      //     firstLanguageVoice: this.props.firstLanguageVoice,
      //     language: this.props.language,
      //     firstLanguage: this.props.firstLanguage,
      //     interval: this.props.interval,
      //     play: this.props.play});
      // }
      //console.log('play ==?', prevProps.language, "======", this.state.language, this.props.language, this.state.voices, this.state.voices.filter((voice) => voice.languageId == this.state.language));
    }

    //{language: "ar-SA", id: "com.apple.ttsbundle.Maged-compact", quality: 300, name: "Maged"}
    initTts = async () => {
      const voices = await Tts.voices();
      //console.log('voices=>', voices);
      const availableVoices = voices
          .filter(v => !v.networkConnectionRequired && !v.notInstalled)
          .map(v => {
          return { id: v.id, name: v.name, language: v.language, label: `${v.name}(${v.language})`, languageId: v.language.split('-')[0], value: v.id} //value: {id: v.id, name: v.name, language: v.language, languageId: v.language.split('-')[0]} };
          });
      //console.log('availableVoices', availableVoices);

      let voice = null;
      if (voices && voices.length > 0) {
          
          //voice = voices[0].id;
          try {
              await Tts.setDefaultLanguage(voices[0].language);
          }
          catch (err) {
              // My Samsung S9 has always this error: "Language is not supported"
              console.log(`setDefaultLanguage error `, err);
          }
          this.setState({
              voices: availableVoices,
              //voice,
              ttsStatus: "initialized"
          });
      }
      else{
          this.setState({ ttsStatus: "initialized" });
      }
    };

    readText = async (text, voiceId) => {

      const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      //console.log('readText', voiceId, voice, this.state.voices);
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


    setSpeechInterval = async rate => {
      this.setState({ interval: rate.toFixed(0) });
    };

    setSpeechIntervalChange = async rate => {
      clearTimeout(this.sliderTimeoutId)
      this.sliderTimeoutId = setTimeout(() => {
        this.setSpeechInterval(rate)
      }, 100)
    }

    setSpeechRate = async rate => {
      await Tts.setDefaultRate(rate);
      this.setState({ speechRate: rate });
    };

    setSpeechRateChange = async rate => {
      clearTimeout(this.sliderTimeoutId)
      this.sliderTimeoutId = setTimeout(() => {
        this.setSpeechRate(rate)
      }, 100)
    }

    setSpeechPitch = async rate => {
      await Tts.setDefaultPitch(rate);
      this.setState({ speechPitch: rate });
    };

    setSpeechPitchChange = async rate => {
      clearTimeout(this.sliderTimeoutId)
      this.sliderTimeoutId = setTimeout(() => {
        this.setSpeechPitch(rate)
      }, 100)
    }


    onVoicePress = async voice => {
      //const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      //console.log('voice sel 1=>', voice);
      try {

      //await Tts.setDefaultLanguage(voice.language);
      } catch (err) {
      // My Samsung S9 has always this error: "Language is not supported"
      console.log(`setDefaultLanguage error `, err);
      }
      //await Tts.setDefaultVoice(voice.id);
      this.setState({ voice: voice});
      this.props.switchVoice(voice);
    };


    onLanguagePress = async lang => {
      //const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      //console.log('voice lang=>', lang);
      try {

      //await Tts.setDefaultLanguage(voice.language);
      } catch (err) {
      // My Samsung S9 has always this error: "Language is not supported"
      console.log(`setDefaultLanguage error `, err);
      }
      //await Tts.setDefaultVoice(voice.id);
      this.setState({ language: lang});
      this.props.switchLanguage(lang);
    };

    onMotherVoicePress = async voice => {
      //const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      //console.log('onMotherVoicePress voice=>', voice);
      try {
        //await Tts.setDefaultLanguage(voice.language);
      } catch (err) {
      // My Samsung S9 has always this error: "Language is not supported"
      console.log(`setDefaultLanguage error `, err);
      }
        //await Tts.setDefaultVoice(voice.id);
      this.setState({ firstLanguageVoice: voice});
      this.props.switchFirstLanguageVoice(voice);
    };

    onMotherLanguagePress = async lang => {
      //console.log('onMotherLanguagePress lang=>', lang);
      //const voice = this.state.voices.filter(voice => voice.id == voiceId)[0];
      try {
        //await Tts.setDefaultLanguage(voice.language);
      } catch (err) {
      // My Samsung S9 has always this error: "Language is not supported"
      //console.log(`setDefaultLanguage error `, err);
      }
        //await Tts.setDefaultVoice(voice.id);
      this.setState({ firstLanguage: lang});
      this.props.switchFirstLanguage(lang);
    };

    
render() {
    console.log('render', this.state.voices, this.state.language, this.state.voice, this.state.voices.filter((voice) => voice.languageId == this.state.language));
    return (
      <View style={[styles.container, styles.cardStyle, {borderWidth: 0}]}>
        <Card containerStyle={styles.cardStyle}>
          <CardSection style={styles.container}>   
            <Text style={styles.groupLabelStyle}>Language</Text>
          </CardSection>

          <CardSection style={styles.container}>   
            {/* <TextInput
              style={styles.textInput}
              multiline={true}
              onChangeText={text => this.setState({ text })}
              value={this.state.phrase}
              onSubmitEditing={Keyboard.dismiss}
            /> */}
            <View style={styles.groupContainer}>
              <Input containerStyle={{//margin:5,
                                      borderRadius: 15,
                                      height:60,
                                      width: 350,
                                      backgroundColor:'#FFFFFF'}}
                      inputStyle={{paddingTop:1,borderRadius: 25, width: 250, backgroundColor:'#FFFFFF' }}

                      multiline={true}
                      onChangeText={text => this.setState({ text })}
                      value={this.state.phrase}
                      onSubmitEditing={Keyboard.dismiss}
                      lightTheme round />


              <ImageButton
                source={iconPlay}
                onPress={() => this.readText(this.state.phrase, this.state.voice)}
                style={styles.iconPlay}
                imageStyle={styles.controlIcon}
              />
            </View>
          </CardSection>

          <CardSection style={styles.container}>
            <RNPickerSelect
              placeholder={{
                  label: 'Select a language...',
                  value: null,
                  color: '#9EA0A4',
                  borderRadius: 25,
                  //width: 350
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
              selectStyle={styles.selectStyle}
              value={this.state.language}
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
              items={this.state.voices.filter((voice) => voice.languageId == this.state.language)}
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
              selectStyle={styles.selectStyle}
              value={this.state.voice}
              ref={(el) => {
                  //this.inputRefs.picker = el;
              }}
            />
          </CardSection>
        </Card>
          
        <Card>
          <CardSection style={styles.container}>   
            <Text style={styles.groupLabelStyle}>Mother Language</Text>
          </CardSection>
          <CardSection style={styles.container}>   
            {/* <TextInput
              style={styles.textInput}
              multiline={true}
              onChangeText={text => this.setState({ text })}
              value={this.state.description}
              onSubmitEditing={Keyboard.dismiss}
            /> */}
            <View style={styles.groupContainer}>
            <Input containerStyle={{//margin:5,
                                    
                                    borderRadius: 15,
                                    height:60,
                                    width: 350,
                                    backgroundColor:'#FFFFFF'}}
                    inputStyle={{paddingTop:1,borderRadius: 25, width: 250, backgroundColor:'#FFFFFF' }}

                    multiline={true}
                    onChangeText={text => this.setState({ text })}
                    value={this.state.description}
                    onSubmitEditing={Keyboard.dismiss}
                    lightTheme round />

            <ImageButton
              source={iconPlay}
              onPress={() => this.readText(this.state.description, this.state.firstLanguageVoice)}
              style={styles.iconPlay}
              imageStyle={styles.controlIcon}
            />
            </View>
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
                selectStyle={styles.selectStyle}
                value={this.state.firstLanguage}
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
                items={this.state.voices.filter((voice) => voice.languageId == this.state.firstLanguage)}
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
                selectStyle={styles.selectStyle}
                value={this.state.firstLanguageVoice}
                ref={(el) => {
                    //this.inputRefs.picker = el;
                }}
              />
          </CardSection>
          <CardSection style={styles.container}>   
            {/* <Text style={styles.textLabel}>Play interval (sec)</Text>
            <TextInput
              style={[styles.textInput, { marginLeft:10, width:50 }]}
              multiline={true}
              onChangeText={text => this.handleChange({'interval': text})}
              value={this.state.interval}
              onSubmitEditing={Keyboard.dismiss}
            /> */}
          </CardSection>
          <CardSection style={styles.container}>   
            <Text style={styles.groupLabelStyle}>Play Options</Text>
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
                selectStyle={styles.selectStyle}
                value={this.props.play.toLowerCase()}
                ref={(el) => {
                    //this.inputRefs.picker = el;
                }}
              />
            
          </CardSection>
          <CardSection style={styles.container}>
            <View style={[styles.groupContainer, {flexDirection:'column'}]}>

            <View style={styles.sliderContainer}>
            <View style={styles.sliderContainer}>
                <Text
                  style={styles.sliderLabel}
                >{`Interval: ${this.state.interval}`}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={2}
                  maximumValue={10}
                  value={parseInt(this.state.interval)}
                  onSlidingComplete={this.setSpeechInterval}
                  onValueChange={this.setSpeechIntervalChange}
                />
              </View>
              </View>

              <View style={styles.sliderContainer}>
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
                  onValueChange={this.setSpeechRateChange}
                />
              </View>
              </View>

              <View style={styles.sliderContainer}>
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
                    onValueChange={this.setSpeechPitchChange}
                  />
                </View>
              </View>
            </View>

          </CardSection>
        </Card>

        {/* <Text style={styles.label}>{`Status: ${this.state.ttsStatus ||
          ""}`}</Text>

        <Text style={styles.label}>{`Selected Voice: ${this.state
          .voice || ""}`}</Text> */}
        

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
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: colors.screenBGColor,
  },
  cardStyle: {
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
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
    flex:1,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center"
  },
  sliderLabel: {
    textAlign: "center",
    marginRight: 20,
    marginLeft:10
  },
  slider: {
    width: 200,
    marginRight:10
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
  iconPlay: {
      borderRadius: 50,
      borderWidth: 2,
      borderColor: '#ffffff',
      marginRight: 10,
      //padding: 5,
      //marginHorizontal: 15
  },
  groupContainer: {
    flex:1, 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center', 
    borderRadius:15, 
    backgroundColor:'white',
    //marginRight:0
  },
  selectStyle: {
    borderRadius: 25, 
    width:345, 
    backgroundColor:'white', 
    borderColor:'transparent'
  },
  groupLabelStyle: {
    fontSize: 18,
    marginLeft:10,
    fontFamily:'GillSans-SemiBold'
  }
});

const pickerSelectStyles = StyleSheet.create({
    pickerTextStyle: {
        fontSize: 13,
        paddingLeft: 20,
    },
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 0,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: colors.screenBGColor,
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
        backgroundColor: colors.screenBGColor,
        color: 'black',
        width: 250
    },
});
