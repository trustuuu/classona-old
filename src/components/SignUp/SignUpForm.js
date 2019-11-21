import React, { Component } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity} from 'react-native';
import { Card, CardSection, Input, Button, Spinner } from '../common'
import { connect } from 'react-redux';
import { signupUserAction, emailChangeSignUpAction, passwordChangeSignUpAction, passwordConfirmChangeSignUpAction } from '../../actions';

import colors from '../../styles/colors'
const classonaLetterLogo = require('../img/classonaLetter.png');

class SignUpForm extends Component {

    onEmailChange(text) {
        this.props.emailChangeSignUpAction(text);
    }

    onPasswordChange(text) {
        this.props.passwordChangeSignUpAction(text);
    }

    onPasswordConfirmChange(text) {
        this.props.passwordConfirmChangeSignUpAction(text);
    }

    onButtonPress(){
        const {email, password} = this.props;
        this.props.signupUserAction({ email, password });
    }

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (
            <TouchableOpacity 
                    style={{paddingRight: 20,flexDirection: 'column', justifyContent: 'center'}} 
                    onPress={this.onButtonPress.bind(this)}>
                    <Image style={styles.button} source={require('../img/enter.png')}></Image>
                    <Text style={{textAlign: 'center'}}>Register</Text>
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
                        label="Password Confirm"
                        placeholder="password"
                        onChangeText={this.onPasswordConfirmChange.bind(this)}
                        value={this.props.passwordconfirm}
                    />

                    {this.renderError()}

                    <CardSection style={{borderBottomWidth: 0, backgroundColor:colors.green02, paddingTop: 60, flexDirection:'row', justifyContent:'center'}}>                    

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
        backgroundColor: colors.green02,
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
    const {email, password, passwordconfirm } = state.signup;
    return {email, password, passwordconfirm };
}

export default connect(MapStateToProps, { signupUserAction, emailChangeSignUpAction, passwordChangeSignUpAction, passwordConfirmChangeSignUpAction })(SignUpForm);