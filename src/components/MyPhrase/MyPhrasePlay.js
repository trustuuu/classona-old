import React, { Component } from 'react';
import { Text, View, TextInput, Modal, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import Tts from 'react-native-tts';

import { Card, CardSection, Input, Button, Spinner, Header, TTSPlayer} from '../common';
import { editToMyWord } from '../../actions';

class MyPhrasePlay extends Component{

    constructor(props) {
        super(props);
    }


    onButtonEdit(){
        //const {phrase, description, startSecs, media, bookmark } = this.props.phrase;
        //const oPhrase = {media, startSecs, phrase, description, bookmark};
        this.props.editToMyWord(this.props.phrase);
    }

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (
            <CardSection>
                <Button onPress={this.onButtonEdit.bind(this)}>
                    Edit
                </Button>
            </CardSection>
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
        const {phrase, description, startSecs, media } = this.props.phrase;
        return (
            <View style={{flex: 1}}>
            <Card>
                <Header/>
                <CardSection>
                    <Text>
                        {phrase}
                    </Text>
                </CardSection>
                <CardSection>
                    <Text>
                        {description}
                    </Text>
                </CardSection>
                <CardSection>           
                    <TTSPlayer phrase={phrase}/>         
                </CardSection>

                {this.renderError()}
                {this.renderButton()}

                <CardSection>           
                    <Button onPress={ Actions.pop }>
                        Cancel
                    </Button>
                </CardSection>
            </Card>
            </View>
        )
    }
}
const styles = {
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

export default connect(mapStateToProps, { editToMyWord })(MyPhrasePlay);