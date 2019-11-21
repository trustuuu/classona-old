import React, { Component } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity, CheckBox } from 'react-native';
import { Card, CardSection, Input, Button, Spinner } from '../common'
import { connect } from 'react-redux';
import { signupUserAction, setupUser, emailChangeSignUpAction, passwordChangeSignUpAction, passwordConfirmChangeSignUpAction } from '../../actions';

import { Actions } from 'react-native-router-flux';

import colors from '../../styles/colors'

const classonaLetterLogo = require('../../img/classonaLetter.png');

class SignUp3 extends Component {

    constructor(props){
        super(props);
        this.state = {
            radioBtnsData: ['student', 'instructor'],
            checked: 0,
            userType: 'student'
        }
    }

    onButtonPress(){
        this.props.signupUserAction( {...this.props.signupUser, userType:this.state.userType} );
    }

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (
            <TouchableOpacity 
                    style={{paddingRight: 20,flexDirection: 'column', justifyContent: 'center'}} 
                    onPress={this.onButtonPress.bind(this)}>
                    <Image style={styles.button} source={require('../../img/enter.png')}></Image>
                    <Text style={{textAlign: 'center'}}>DONE</Text>
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

    renderRadioBtn() {
        return (
            this.state.radioBtnsData.map((data, key) => {
                const bgColor = this.state.checked == key ? colors.yellow : colors.gray01;

            return (
                <View key={key} style={{justifyContent: 'center'}}>
                    {this.state.checked == key ?
                        <TouchableOpacity
                            style={[styles.userTypeBtn, {backgroundColor:bgColor}]} 
                        >
                            <Text style={{textAlign: 'center', width:200, fontSize:20}}>{data}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={[styles.userTypeBtn, {backgroundColor:bgColor}]} 
                            onPress={
                                        ()=> this.setState({checked: key, userType: data })
                                        //this.props.setupUser({ 'userType': data })}
                                    }
                        >
                            <Text style={{textAlign: 'center', width:200, fontSize:20}}>{data}</Text>
                        </TouchableOpacity>
                    }
                    <View style={{paddingTop:30}}></View>
                </View>
            )
        })
        )
    
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
                    <Text style={{textAlign: 'center', width:300, fontSize:20}}>User Type</Text>
                </TouchableOpacity>
                <Image
                    source={classonaLetterLogo}
                    style={styles.logo}
                />

                <Card style={{borderWidth: 0}}>


                    {this.renderError()}

                    {/* <CardSection style={{borderBottomWidth: 0, backgroundColor:colors.yellow, paddingTop: 60, flexDirection:'row', justifyContent:'center'}}>                     */}
                    <CardSection style={styles.btn} >

                        {this.renderRadioBtn()}
                        <View style={{paddingTop:90}}></View>
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
        backgroundColor: colors.joustBlue,
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
    img:{
        height:20,
        width: 20
    },
    userTypeBtn:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width:300, height:40, borderRadius:20
    },
    btn:{
        flexDirection: 'column',
        backgroundColor: colors.joustBlue,
        justifyContent:'center',
        alignItems: 'center',
        borderWidth: 0, 
        borderBottomWidth: 0
    }
}

const MapStateToProps = (state) =>
{
    const {signupUser} = state.signup;
    return {signupUser};
}

export default connect(MapStateToProps, { setupUser, signupUserAction, emailChangeSignUpAction, passwordChangeSignUpAction, passwordConfirmChangeSignUpAction })(SignUp3);