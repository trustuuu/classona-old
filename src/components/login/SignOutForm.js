import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableHighlight, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import { Card, CardSection, Input, Button, Spinner, Header} from '../common';
import { signOutUser} from '../../actions';

import colors from '../../styles/colors'
const classonaLetterLogo = require('../../img/classonaLetter.png');

class SignOutForm extends Component{
    onButtonPress(){
        this.props.signOutUser();
    }

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (

                <Card style={{borderWidth: 0}} >
                    

                    <CardSection>
                        <TouchableOpacity style={styles.buttonContainer} onPress={this.onButtonPress.bind(this)}>
                            <Image style={styles.buttonLeft} source={require('../../img/exit.png')}></Image>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonContainer} onPress={ () => Actions.pop() }>
                            <Image style={styles.buttonRight} source={require('../../img/cloud-cancel.png')}></Image>
                        </TouchableOpacity>
                    </CardSection>

                </Card>
        );
    }
    renderError() {
        if (this.props.error) {
            return (
                <View>
                    <Text style={styles.errorTextStyle}>
                        {this.props.error}
                    </Text>
                </View>
            )
        }
    }
    render(){
        return (
            <ScrollView style={styles.wrapper} >
                <Image
                    source={classonaLetterLogo}
                    style={styles.logo}
                />

                <Card style={{borderWidth: 0}}>
                    {this.renderError()}
                    <CardSection style={{backgroundColor: colors.yellow, borderWidth: 0}}>
                        <Text>Do you want to log out now? I hope you to revisit soon to improve your language.</Text>
                    </CardSection>
                    <CardSection style={{paddingTop:250, backgroundColor: colors.yellow, justifyContent: 'flex-end', borderWidth: 0}}>
                        <View style={styles.buttonContainer} >                    
                        <TouchableOpacity style={{addingLeft: 20, paddingRight: 20,}} onPress={this.onButtonPress.bind(this)}>
                            <Image style={styles.buttonLeft} source={require('../../img/exit.png')}></Image>
                            <Text>Logout</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{addingLeft: 20, paddingRight: 20,}} onPress={ () => Actions.pop() }>
                            <Image style={styles.buttonRight} source={require('../../img/cloud-cancel.png')}></Image>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        </View>
                    </CardSection>
                </Card>
            </ScrollView>
        )
    }
}
const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
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
    buttonContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLeft: {
    width: 50,
    height: 50,
    },
    buttonRight: {
    width: 50,
    height: 50,
    },
}
const mapStateToProps = ({ auth }) => {
    const {error, loading} = auth;
    return {error, loading };
}

export default connect(mapStateToProps, {signOutUser })(SignOutForm);