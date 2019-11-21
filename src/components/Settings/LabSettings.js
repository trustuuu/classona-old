import React, { Component } from 'react';
import { Text, View, ScrollView, TextInput, Modal, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import Tts from 'react-native-tts';

import { Card, CardSection, Input, Button, Spinner, Header, TTSPlayerSetting} from '../common';
import { saveTTSSetting } from '../../actions';
import colors from '../../styles/colors';
import global from '../../helpers/global.js';


class LabSettings extends Component{

    // constructor(props) {
    //     super(props);
    // }
    
    // renderError() {
    //     if (this.props.error) {
    //         return (
    //             <View style={{ backgroundColor: 'white'}}>
    //                 <Text style={styles.errorTextStyle}>
    //                     {this.props.error}
    //                 </Text>
    //             </View>
    //         )
    //     }
    // }

    onSave = async () => {
        const { firstLanguage, firstLanguageVoice, language, voice, interval, play } = this.props;

        this.props.saveTTSSetting({'firstLanguage':firstLanguage , 
        'firstLanguageVoice':firstLanguageVoice, 
        'language':language , 
        'voice':voice, 'myClass':global.class, 'interval':interval, 'play':play });

    };

    render(){
        //const {phrase, description, startSecs, media } = this.props;
        return (
            <ScrollView>
            <View style={[styles.container, {borderWidth: 0, flex: 1}]}>
            <Card style={{borderWidth: 0, backgroundColor: colors.green01}}>
                <CardSection style={styles.container}>        
                    <TTSPlayerSetting />
                </CardSection>
                <CardSection style={styles.container}>  
                    <TouchableOpacity style={styles.buttonContainer} onPress={this.onSave.bind(this)}>
                        <Image style={styles.buttonLeft} source={require('../../img/save.png')}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => Actions.pop() }>
                        <Image style={styles.buttonRight} source={require('../../img/cancel.png')}></Image>
                    </TouchableOpacity>
                </CardSection>
            </Card>
            </View>
            </ScrollView>
        )
    }
}

const styles = {
    container: {
    flex: 1,
    borderBottomWidth: 0,
    backgroundColor: colors.green01,
    },
    buttonContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
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
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}

const mapStateToProps = ({myDictionary}) => { //{ auth, myDictionary }) => {
    //const {email, password, error, loading} = state.auth;
    const {error, loading, firstLanguage, firstLanguageVoice, language, voice, myClass, interval, play } = myDictionary;
    return { error, loading, firstLanguage, firstLanguageVoice, language, voice, myClass, interval, play };
}

export default connect(mapStateToProps, {saveTTSSetting })(LabSettings);