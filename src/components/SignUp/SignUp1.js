import React, { Component } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity} from 'react-native';
import { Card, CardSection, Input, Button, Spinner } from '../common'
import { connect } from 'react-redux';
import { setupUser, emailChangeSignUpAction, passwordChangeSignUpAction, passwordConfirmChangeSignUpAction, displayNameChangeSignUpAction } from '../../actions';

import colors from '../../styles/colors'
import { Actions } from 'react-native-router-flux';
const classonaLetterLogo = require('../../img/classonaLetter.png');

class SignUp1 extends Component {

    onEmailChange(text) {
        this.props.emailChangeSignUpAction(text.toLowerCase());
    }

    onDisplayNameChange(text) {
        this.props.displayNameChangeSignUpAction(text);
    }
    
    onPasswordChange(text) {
        this.props.passwordChangeSignUpAction(text);
    }

    onPasswordConfirmChange(text) {
        this.props.passwordConfirmChangeSignUpAction(text);
    }

    onButtonPress(){
        const { email, password, displayName } = this.props;
        this.props.setupUser({ email, password, displayName });
        Actions.signUp2();
    }

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (
            <TouchableOpacity 
                    style={{paddingRight: 20,flexDirection: 'column', justifyContent: 'center', backgroundColor:colors.green01, width:250, height:40, borderRadius:20}} 
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
                        <Text style={{textAlign: 'center', width:300, fontSize:20}}>Account</Text>
                </TouchableOpacity>
                <Image
                    source={classonaLetterLogo}
                    style={styles.logo}
                />
                <Card style={{borderWidth: 0}}>
                    <Input
                        label="Email"
                        placeholder="email@gmail.com"
                        onChangeText={this.onEmailChange.bind(this)}
                        value={this.props.email}
                        style={styles.textStyle}
                        lightTheme round 
                    />
                    <Input
                        secureTextEntry
                        label="Password"
                        placeholder="password"
                        onChangeText={this.onPasswordChange.bind(this)}
                        style={styles.textStyle}
                        value={this.props.password}
                        lightTheme round 
                    />
                    <Input
                        secureTextEntry
                        label="Confirm"
                        placeholder="password"
                        onChangeText={this.onPasswordConfirmChange.bind(this)}
                        value={this.props.passwordconfirm}
                    />
                    <Input
                        label="Display Name"
                        placeholder="John"
                        onChangeText={this.onDisplayNameChange.bind(this)}
                        value={this.props.displayName}
                        style={styles.textStyle}
                        lightTheme round 
                    />

                    {this.renderError()}

                    <CardSection style={{borderBottomWidth: 0, backgroundColor:colors.yellow, paddingTop: 150, flexDirection:'row', justifyContent:'center'}}>                    
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
    wrapper: {
        flex: 1,
        display: 'flex',
        backgroundColor: colors.yellow,
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

const MapStateToProps = (state) =>
{
    const {email, password, passwordconfirm, displayName } = state.signup;
    return {email, password, passwordconfirm, displayName };
}

export default connect(MapStateToProps, { setupUser, displayNameChangeSignUpAction, emailChangeSignUpAction, passwordChangeSignUpAction, passwordConfirmChangeSignUpAction })(SignUp1);