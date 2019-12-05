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
            <View style={{flex:1, flexDirection:'column', justifyContent:'space-between', alignItems:'stretch', backgroundColor: colors.screenBGColor}}>
                <ScrollView style={{padding: 0}}>
                    <View style={[styles.container, {borderWidth: 0, flex: 1}]}>
                        <Card style={{borderWidth: 0, backgroundColor: colors.gray01}}>
                            <CardSection style={styles.container}>        
                                <TTSPlayerSetting />
                            </CardSection>
                        </Card>
                    </View>
                </ScrollView>
                <View style={{flex:1, flexDirection: 'row', justifyContent:'center', alignItems:'flex-end'}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={this.onSave.bind(this)}>
                        <Text style={{textAlign: 'center', color:'white'}}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonStyle, {marginLeft:5}]} onPress={()=> {Actions.pop()}}>
                        <Text style={{textAlign: 'center', color:'white'}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}

const styles = {
    container: {
    flex: 1,
    borderBottomWidth: 0,
    backgroundColor: colors.screenBGColor,
    padding: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    // paddingTop: 0,
    // paddingBottom: 0,
    // paddingLeft: 0,
    // paddingRight: 0
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
    },
    buttonStyle: {
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 5, 
        backgroundColor: '#405CE5',
        borderRadius: 25, 
        height: 48, 
        width: 150, 
        //margin:5
    },
}

const mapStateToProps = ({myDictionary}) => { //{ auth, myDictionary }) => {
    //const {email, password, error, loading} = state.auth;
    const {error, loading, firstLanguage, firstLanguageVoice, language, voice, myClass, interval, play } = myDictionary;
    return { error, loading, firstLanguage, firstLanguageVoice, language, voice, myClass, interval, play };
}

export default connect(mapStateToProps, {saveTTSSetting })(LabSettings);