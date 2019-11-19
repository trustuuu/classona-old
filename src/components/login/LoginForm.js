import React, { Component } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import { Card, CardSection, Input, Button, Spinner} from '../common';
import { emailChangeAction, passwordChangeAction, loginUser, checkLoginUser } from '../../actions';

import colors from '../../styles/colors'

const classonaLetterLogo = require('../../img/classonaLetter.png');


class LoginForm extends Component{

    componentWillMount(){
        //this.props.checkLoginUser();
    }
    onEmailChange(text) {
        this.props.emailChangeAction(text.toLowerCase());
    }

    onPasswordChange(text) {
        this.props.passwordChangeAction(text);
    }

    onButtonPress(){
        const {email, password} = this.props;
        this.props.loginUser({ email, password });
    }

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (
            <TouchableOpacity 
                    style={[{paddingRight: 20,flexDirection: 'column', justifyContent: 'center'}]} 
                    onPress={this.onButtonPress.bind(this)}>
                    <Image style={styles.button} source={require('../../img/enter.png')}></Image>
                    <Text style={{textAlign: 'center'}}>Log In</Text>
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
    render(){
        return (
             <View style={styles.wrapper}>
                <Image
                    source={classonaLetterLogo}
                    style={styles.logo}
                />
                
                    <CardSection style={{borderWidth: 0, borderBottomWidth:0, backgroundColor:'transparent', marginBottom: 5}}>
                    <Input
                        //label="Email"
                        placeholder="email@gmail.com"
                        onChangeText={this.onEmailChange.bind(this)}
                        style={styles.textStyle}
                        value={this.props.email}
                        lightTheme round 
                    />
                    </CardSection>
                    <CardSection style={{borderBottomWidth:0, backgroundColor:'transparent'}}>
                    <Input
                        secureTextEntry
                        //label="Password"
                        placeholder="password"
                        onChangeText={this.onPasswordChange.bind(this)}
                        style={styles.textStyle}
                        value={this.props.password}
                        lightTheme round 
                    />
                    </CardSection>
                    {this.renderError()}
                    <CardSection style={{borderBottomWidth:0, backgroundColor:'transparent', paddingTop: 150, flexDirection:'row', justifyContent:'center'}}>                    
                        {this.renderButton()}
                        <TouchableOpacity 
                            style={[{borderWidth: 0, paddingLeft: 20,flexDirection: 'column', justifyContent: 'center'}]} 
                            onPress={ Actions.register }>
                            <Image style={styles.button} source={require('../../img/signup.png')}></Image>
                            <Text style={{textAlign: 'center'}}>Sign Up</Text>
                        </TouchableOpacity>

                    </CardSection>
                
            
            </View>
        )
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    textStyle: {
        backgroundColor: 'white',
        borderRadius: 25,
//        color: 'white'
    },
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: colors.homeBlue,
        borderWidth: 0
    },
    logo: {
        width: 300,
        height: 100,
        marginBottom: 50,
        resizeMode: 'contain'
    },
    button: {
        width: 50,
        height: 50,
        //marginLeft: 100,
    },
}

const mapStateToProps = ({ auth }) => {
    const {email, password, error, loading} = auth;
    return { email, password, error, loading };
}

export default connect(mapStateToProps, { emailChangeAction, passwordChangeAction, loginUser, checkLoginUser })(LoginForm);