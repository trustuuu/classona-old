import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { noteChangeAction, updateClassNote, addClassNote } from '../../actions';
import { Card, Header, Input, CardSection, Spinner } from '../common';
import colors from '../../styles/colors';
import global from '../../helpers/global.js';

const button_review = require('../../img/button_review.png');
const button_dic = require('../../img/button_dic.png');
const button_learn = require('../../img/button_learn.png');
const button_refresh = require('../../img/button_refresh.png');


class ClassNoteEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
                note: {note:'', description:''}
            };
      }

    async componentDidMount()
    {
        //if (this.props.oNote !== undefined) this.setState({note: this.props.oNote})
    }

    static getDerivedStateFromProps(nextProps, prevState){
        
        if(nextProps.note !== prevState.note){
            return { note: nextProps.note == null ? {note:'', description:''} : nextProps.note};
        }
        else{
            return null;
        }
    }

     componentDidUpdate(prevProps, prevState) {
        if(prevProps.note!==this.props.note){
          this.setState({note: this.props.note});
        }
      }


    showSpin = () => {
        if (this.props.loading){
            return <Spinner size="large" />
        }
    }

    renderHeader = () => {
        return <Input placeholder="Type Here..." lightTheme round />;
     };


    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }
        if (global.userType == 'instructor')
        {
            return (
                <TouchableOpacity  style={styles.buttonRight} onPress={this.onButtonPress.bind(this)}>
                    <Image style={styles.buttonLeft} source={require('../../img/save.png')}></Image>
                </TouchableOpacity>
            );
        }
        else return;
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

    onButtonPress(){
        //const {note, description} = this.state.note;
        if ( this.props.noteAction == 'addClassNote'){
            this.props.addClassNote(this.state.note);
        }
        else
        {
            this.props.updateClassNote(this.state.note);
        }
    }


    render()
    {
        return (
            <View style={{flex: 1}}>
                <Card>
                    {/* <Header/> */}
                    <CardSection>
                        <TextInput
                            style={{height:100}}
                            editable = {true}
                            multiline = {true}
                            label="Note"
                            //placeholder="email@gmail.com"
                            autoFocus={true}
                            name="note"
                            //returnKeyType = { "next" }
                            //onSubmitEditing={() => { this.description.focus(); }}
                            blurOnSubmit={false}
                            onChangeText={(text) => { 
                                                    this.props.noteChangeAction({...this.state.note, note:text}) 
                                                }}
                            value={this.state.note.note}
                        />
                    </CardSection>
                    <CardSection>
                        <TextInput
                            //secureTextEntry
                            style={{height:100}}
                            editable = {true}
                            multiline = {true}
                            label="Description"
                            placeholder="Description"
                            name="description"
                            ref={(input) => { this.description = input; }}
                            onChangeText={(text) => {
                                                    this.props.noteChangeAction({...this.state.note, description:text})
                                                }}
                            value={this.state.note.description}
                        />
                    </CardSection>

                    {this.renderError()}
                    <CardSection style={styles.buttonContainer} >                    
                        {this.renderButton()}
                        <TouchableOpacity style={styles.buttonRight} onPress={ () => Actions.pop() }>
                            <Image style={styles.buttonRight} source={require('../../img/cancel.png') }></Image>
                        </TouchableOpacity>
                    </CardSection>
                </Card>
                    {this.showSpin()}
            </View>
        );
    }

}

const MapStateToProps = ({oClass}) =>
{
    const { note, error, loading } = oClass; 
    return { note, error, loading };
}

const styles = {
    buttonContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    buttonLeft: {
    width: 50,
    height: 50,
    margin: 10
    },
    buttonRight: {
    width: 50,
    height: 50,
    margin: 10
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}


export default connect(MapStateToProps, { noteChangeAction, updateClassNote, addClassNote })(ClassNoteEdit);
