import React, { Component } from 'react';
import { Text, View, TextInput, Modal, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import { Card, CardSection, Input, Button, Spinner, Header} from './common';
import { wordChangeAction, descriptionChangeAction, addWordToDictionary } from '../actions';

import colors from '../styles/colors';

class MyWord extends Component{

    constructor(props) {
        super(props);
        //const { phrase } = props.phrase;
        this.state = { phrase: '', description: ''};
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.phrase !== prevState.phrase){
            return { phrase: nextProps.phrase };
        }
        else if(nextProps.description !== prevState.description){
            
            return { description: nextProps.description };
        }
        else{
            return null;
        }
    }

     componentDidUpdate(prevProps, prevState) {
        if(prevProps.phrase!==this.props.phrase){
          //Perform some operation here
          this.setState({phrase: this.props.phrase});
        }
        if(prevProps.description!==this.props.description){
          //Perform some operation here
          this.setState({description: this.props.description});
        }
      }

    onWordChange(text) {
        this.props.wordChangeAction(text);
    }

    onDescriptionChange(text) {
        this.props.descriptionChangeAction(text);
    }

    onButtonPress(){
        const {phrase, description} = this.state.phrase;
        const {media, startSecs} = this.props.phrase;
        const oPhrase = {phraseKey:'', media, startSecs, phrase, description, bookmark:false};
        this.props.addWordToDictionary(oPhrase); //media, startSecs, phrase, description);
    }

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (
            <TouchableOpacity style={styles.buttonContainer} onPress={this.onButtonPress.bind(this)}>
                <Image style={styles.buttonLeft} source={require('../img/save.png')}></Image>
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
            <View style={{flex: 1}}>
            <Card>
                <Header/>
                <CardSection>
                    <TextInput
                        style={{height:100}}
                        editable = {true}
                        multiline = {true}
                        label="Phrase"
                        //placeholder="email@gmail.com"
                        autoFocus={true}
                        name="phrase"
                        returnKeyType = { "next" }
                        onSubmitEditing={() => { this.description.focus(); }}
                        blurOnSubmit={false}
                        onChangeText={this.onWordChange.bind(this)}
                        value={this.state.phrase}
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
                        onChangeText={this.onDescriptionChange.bind(this)}
                        value={this.state.description}
                    />
                </CardSection>

                {this.renderError()}
                <CardSection>                    
                    {this.renderButton()}
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => Actions.pop() }>
                        <Image style={styles.buttonRight} source={require('../img/cancel.png')}></Image>
                    </TouchableOpacity>
                </CardSection>
            </Card>
            </View>
        )
    }
}
const styles = {
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
    const { phrase, error, loading } = myDictionary;
    return { error, loading, phrase };
}

export default connect(mapStateToProps, { wordChangeAction, descriptionChangeAction, addWordToDictionary })(MyWord);