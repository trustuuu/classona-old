import React, { Component } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import { Card, CardSection, Input, Button, Spinner, RNPickerSelect } from '../common'
import { connect } from 'react-redux';
import { setupUser, emailChangeSignUpAction, passwordChangeSignUpAction, passwordConfirmChangeSignUpAction, getAllLanguages } from '../../actions';

import languageData from '../common/languageLearn.json';

import colors from '../../styles/colors'
import { Actions } from 'react-native-router-flux';

const classonaLetterLogo = require('../../img/classonaLetter.png');

class SignUp2 extends Component {

    componentDidMount(){
        
        this.props.getAllLanguages();
    }
    onButtonPress(){
        Actions.signUp3();
    }

    onLanguagePress = async lang => {
        try {
            //await Tts.setDefaultLanguage(voice.language);
        //await Tts.setDefaultVoice(voice.id);
            //this.setState({ selectedLanguage: lang});


            //const voiceCode = languageData.filter(item => item.value == lang)[0].voiceCode;

            const languages = this.props.languages.filter(item => item.languageId == lang)

            if (languages.length < 1) return;

            const classMeta = languages.length > 0 ? languages[0].classMeta : "classes";
            const voiceCode = languages[0].voiceCode;

            this.props.setupUser({ language: lang, voiceCode: voiceCode, classMeta: classMeta});
            //this.props.switchLanguage(lang);
        } catch (err) {
            // My Samsung S9 has always this error: "Language is not supported"
            console.log(`setDefaultLanguage error `, err);
        }
      };

      onMotherLanguagePress = async lang => {
        try {
            //await Tts.setDefaultLanguage(voice.language);
            //await Tts.setDefaultVoice(voice.id);
            //this.setState({ selectedLanguage: lang});

            const motherLanguageVoiceCode = this.props.languages.filter(item => item.value == lang)[0].voiceCode;
            this.props.setupUser({ motherLanguage: lang, motherLanguageVoiceCode: motherLanguageVoiceCode});
            
        } catch (err) {
            // My Samsung S9 has always this error: "Language is not supported"
            console.log(`setDefaultLanguage error `, err);
        }
      };

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (
            <TouchableOpacity 
                    style={{paddingRight: 20,flexDirection: 'column', justifyContent: 'center', backgroundColor:colors.yellow, width:250, height:40, borderRadius:20}} 
                    onPress={this.onButtonPress.bind(this)}>
                    <Text style={{textAlign: 'center'}}>NEXT</Text>
            </TouchableOpacity>
        );
    }

    renderError() {
        if (this.props.error) {
            return (
                <View style={{ backgroundColor: 'white'}}>
                    <Text style={styles.errorTextStyle}>
                        {this.props.error}
                    </Text>
                </View>
            )
        }
    }

    render() {

        return (
            <ScrollView style={styles.wrapper}>
                    <TouchableOpacity 
                        style={{flexDirection: 'row', justifyContent: 'center', width:400, height:40, borderRadius:20}} 
                        onPress={() => Actions.pop()}>
                        <Image
                            source={require('../../img/left-arrow.png')}
                            style={{width:30, height:30}}
                        />
                        <Text style={{textAlign: 'center', width:300, fontSize:20}}>Select Language</Text>
                    </TouchableOpacity>
                <Image
                    source={classonaLetterLogo}
                    style={styles.logo}
                />
                <Card style={{borderWidth: 0}}>
                    <CardSection style={styles.cardSection}>
                        <Text style={{fontSize:20}}>What is your mother language?</Text>    
                    </CardSection>
                    <CardSection style={styles.cardSection}>
                        <RNPickerSelect
                            placeholder={{
                                label: 'Select a language...',
                                value: null,
                                color: '#9EA0A4',
                            }}
                            items={this.props.languages}//{languageData}
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
                            value={this.props.signupUser.motherLanguage}
                            ref={(el) => {
                                //this.inputRefs.picker = el;
                            }}
                        />
                    </CardSection>

                    <CardSection style={styles.cardSection}>
                        <Text style={{fontSize:20}}>Which language do you want to study or teach?</Text>    
                    </CardSection>
                    <CardSection style={styles.cardSection}>
                        <RNPickerSelect
                            placeholder={{
                                label: 'Select a language...',
                                value: null,
                                color: '#9EA0A4',
                            }}
                            items={this.props.languages}
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
                            value={this.props.signupUser.language}
                            ref={(el) => {
                                //this.inputRefs.picker = el;
                            }}
                        />
                    </CardSection>

                    <CardSection style={styles.cardSection}>
                        {this.renderError()}
                    </CardSection>

                    <CardSection style={{borderBottomWidth: 0, backgroundColor:colors.lightRed, paddingTop: 120, flexDirection:'row', justifyContent:'center'}}>                    

                        {this.renderButton()}

                    </CardSection>
                </Card>
            </ScrollView>
        );
    };
}


const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    textStyle: {
        backgroundColor: colors.green01,
        borderRadius: 25,
    },
    cardSection: {
        backgroundColor: colors.lightRed,
        borderWidth: 0,
        borderBottomWidth: 0
    },
    wrapper: {
        flex: 1,
        display: 'flex',
        backgroundColor: colors.lightRed,
        flexDirection: 'column',
        height: '100%',
        contentContainerStyle: 'center',
        paddingTop: 80,
    },
    logo: {
        width: 300,
        height: 80,
        marginTop: 50,
        marginBottom: 50,
        alignItems: 'center',
    },
    button: {
        width: 50,
        height: 50,
        //marginLeft: 100,
    },
}


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
        width: 330
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

const MapStateToProps = (state) =>
{
    const { signupUser } = state.signup;
    const { languages } = state.myLanguage;
    console.log('signupUser', signupUser);
    return { signupUser, languages };
}

export default connect(MapStateToProps, { setupUser, emailChangeSignUpAction, passwordChangeSignUpAction, passwordConfirmChangeSignUpAction, getAllLanguages })(SignUp2);