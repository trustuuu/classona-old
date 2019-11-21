import React, { Component } from 'react';
import { Text, View, ScrollView, TextInput, Modal, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'

import { Card, CardSection, Input, Button, Spinner, Header, ReadText} from '../common';
import ImageButton from '../common/ImageButton';

import { getProfile, updateProfile, textChange } from '../../actions';
import colors from '../../styles/colors';
import imgSave from '../../img/save.png';

class ProfileSettingsEdit extends Component{

    constructor(props) {
        super(props);
        this.state = {user:null};
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        
        if(nextProps.user !== prevState.user){
            return { user: nextProps.user == null ? {phoneNumber:'',displayName:'',photoURL:''} : nextProps.user};
        }
        // else if(nextProps.displayName !== prevState.displayName){
            
        //      return { displayName: nextProps.displayName };
        // }
        else{
            return null;
        }
    }

     componentDidUpdate(prevProps, prevState) {

        if(prevProps.user!==this.props.user){
          //Perform some operation here
          this.setState({user: this.props.user});
        }

        // if(prevProps.displayName!==this.props.displayName){
        //   //Perform some operation here
        //   this.setState({displayName: this.props.displayName});
        // }

      }

    componentDidMount(){
        this.props.getProfile();    
    }

    onSave = () => {
        // const { firstLanguage, firstLanguageVoice, language, voice, myClass, interval, play } = this.props;
        this.props.updateProfile(this.state.user);
        // this.props.saveTTSSetting({'firstLanguage':firstLanguage , 
        // 'firstLanguageVoice':firstLanguageVoice, 
        // 'language':language , 
        // 'voice':voice, 'myClass':myClass, 'interval':interval, 'play':play });

    };


    onTextChange = (event) => {
      //this.setState(event);
      this.props.textChange(event);
    }

    render(){
        if (this.props.user == null) return (<View></View>);

        const { displayName, email, emailVerified, phoneNumber, photoURL } = this.state.user;

        return (
            <ScrollView contentContainerStyle={[styles.TopContainer]}>
                <Header style={{backgroundColor:colors.green02}}/>
                <View style={[styles.TopContainer, {justifyContent: 'flex-start'}]}>
                
                    <Card style={{borderWidth: 0, backgroundColor: colors.green02}}>
                        <CardSection style={[styles.container, {backgroundColor:colors.green01}]}>        
                            <ReadText value='My Profile' />
                        </CardSection>
                        <CardSection style={[styles.container, {paddingTop:40, paddingBottom:40}]}>        
                            <ReadText label='Photo' value={photoURL == null ? '(blank)' : photoURL} />
                        </CardSection>
                        <CardSection style={styles.containerEdit}>         
                            <Input
                                label="Displayname"
                                placeholder="James Bonds"
                                onChangeText={text => this.onTextChange({'displayName': text})}
                                value={this.state.user.displayName}
                                style={[styles.textStyle]}
                                lightTheme round 
                            />
                        </CardSection>
                        <CardSection style={styles.container}>        
                            <ReadText label='Email' value={email == null ? '(blank)' : email} />
                        </CardSection>
                        {/* <CardSection style={styles.container}>
                        <Input
                                label="Phone"
                                placeholder="111-222-3333"
                                onChangeText={text => this.onTextChange({'phoneNumber': text})}
                                value={this.state.user.phoneNumber}
                                style={styles.textStyle}
                                lightTheme round 
                            />
                        </CardSection> */}
                        <CardSection style={styles.container}>        
                            <ReadText label='Email verified' value={emailVerified == null ? 'No' : emailVerified ? 'Yes' : 'No'} />
                        </CardSection>
                    </Card>

                </View>
                <View style={[styles.TopContainer, {justifyContent: 'flex-end'}]}>
                    <View style={styles.buttonContainer}>  
                        <ImageButton
                            source={imgSave}
                            onPress={this.onSave.bind(this)}
                            //style={styles.playPause}
                            imageStyle={styles.img}
                            label='Save'
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
    TopContainer: {
        flex: 1,
        flexDirection: 'column',
        //borderWidth: 0, Height:'100%',
        //backgroundColor: colors.green02,
        alignItems: 'stretch',
    },
    container: {
        borderBottomWidth: 0,
        backgroundColor: colors.gray01,
    },
    containerEdit: {
        borderBottomWidth: 1,
        //backgroundColor: colors.yellow,
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

export default connect(mapStateToProps, {getProfile, updateProfile, textChange })(ProfileSettingsEdit);