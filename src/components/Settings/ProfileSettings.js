import React, { Component } from 'react';
import { Text, View, ScrollView, TextInput, Modal, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'

import { Card, CardSection, Input, Button, Spinner, Header, ReadText} from '../common';
import ImageButton from '../common/ImageButton';

import global from '../../helpers/global.js';

import { getProfile } from '../../actions';
import colors from '../../styles/colors';
import imgEdit from '../../img/edit.png';

class ProfileSettings extends Component{

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
    componentDidMount(){
        this.props.getProfile();    
    }

    onButtonEdit(){
        //const {phrase, description, startSecs, media, bookmark } = this.props.phrase;
        //const oPhrase = {media, startSecs, phrase, description, bookmark};
        //this.props.editToMyWord(this.props.phrase);
        Actions.profileSettingsEdit();
    }

    onSave = async () => {
        // const { firstLanguage, firstLanguageVoice, language, voice, myClass, interval, play } = this.props;

        // this.props.saveTTSSetting({'firstLanguage':firstLanguage , 
        // 'firstLanguageVoice':firstLanguageVoice, 
        // 'language':language , 
        // 'voice':voice, 'myClass':myClass, 'interval':interval, 'play':play });

    };

    render(){
        if (this.props.user == null) return (<View></View>);

        const { displayName, email, emailVerified, phoneNumber, photoURL } = this.props.user;
        return (
            <ScrollView contentContainerStyle={[styles.TopContainer]}>
                <Header style={{backgroundColor:colors.green01}}/>
                <View style={[styles.TopContainer, {justifyContent: 'flex-start'}]}>
                
                    <Card style={{borderWidth: 0, backgroundColor: colors.green01}}>
                        <CardSection style={[styles.container, {backgroundColor:colors.yellow}]}>        
                            <ReadText value='My Profile' />
                        </CardSection>
                        <CardSection style={[styles.container, {paddingTop:40, paddingBottom:40}]}>        
                            <ReadText label='Photo' value={photoURL == null ? '(blank)' : photoURL} />
                        </CardSection>
                        <CardSection style={styles.container}>        
                            <ReadText label='Display Name' value={displayName == null ? '(blank)' : displayName} />
                        </CardSection>
                        <CardSection style={styles.container}>        
                            <ReadText label='Email' value={email == null ? '(blank)' : email} />
                        </CardSection>
                        <CardSection style={styles.container}>        
                            <ReadText label='Phone' value={phoneNumber == null ? '(blank)' : phoneNumber} />
                        </CardSection>
                        <CardSection style={styles.container}>        
                            <ReadText label='Email verified' value={emailVerified == null ? 'No' : emailVerified ? 'Yes' : 'No'} />
                        </CardSection>
                        <CardSection style={styles.container}>        
                            <ReadText label='Class' value={global.class == 'classes' ? 'English' : global.class} />
                        </CardSection>
                        <CardSection style={styles.container}>        
                            <ReadText label='User role' value={global.userType} />
                        </CardSection>
                    </Card>

                </View>
                <View style={[styles.TopContainer1, {justifyContent: 'flex-end'}]}>
                    <View style={styles.buttonContainer}>  
                        <ImageButton
                            source={imgEdit}
                            onPress={this.onButtonEdit.bind(this)}
                            //style={styles.playPause}
                            imageStyle={styles.img}
                            label='Edit'
                            //disabled = {}
                        />
                        <ImageButton
                            source={require('../../img/cancel.png')}
                            onPress={() => Actions.pop()}
                            //style={styles.playPause}
                            imageStyle={styles.img}
                            label='Cancel'
                            //disabled = {}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}
const styles = {
    TopContainer1: {
        flex: 1,
        flexDirection: 'column',
    },
    TopContainer: {
        flex: 1,
        flexDirection: 'column',
        //borderWidth: 0, Height:'100%',
        backgroundColor: colors.green01,
        alignItems: 'stretch',
    },
    container: {
        borderBottomWidth: 0,
        backgroundColor: colors.green01,
    },
    buttonContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        //alignItems: 'stretch',
    },
    
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    img: {
        width: 40,
        height: 40
    },
}

const mapStateToProps = ({profile}) => {
    const {error, loading, user } = profile;
    return { error, loading, user };
}

export default connect(mapStateToProps, {getProfile })(ProfileSettings);