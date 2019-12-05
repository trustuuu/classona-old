import React, { Component } from 'react';
import { Text, View, TextInput, Modal, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import { Card, CardSection, Input, Button, Spinner, Header} from '../common';
import { wordChangeAction, descriptionChangeAction, addWordToDictionary, addMyPhraseToDictionary, editMyPhrase } from '../../actions';

import colors from '../../styles/colors';

class MyPhraseEdit extends Component{

    constructor(props) {
        super(props);
        //const { phrase } = props.phrase;
        this.state = { phrase: {phrase:'', description: ''}};
    }

    componentDidMount()
    {
        if (this.props.phraseSource == 'manualWord')
        {
            this.setState({phrase: {phrase:'', description:''}});
        }
    }
    static getDerivedStateFromProps(nextProps, prevState){
        
        if(nextProps.phrase !== prevState.phrase){
            return { phrase: nextProps.phrase == null ? {phrase:'', description:''} : nextProps.phrase};
        }
        // else if(nextProps.phrase.description !== prevState.phrase.description){
            
        //     return { phrase: nextProps.phrase };
        // }
        else{
            return null;
        }
    }

     componentDidUpdate(prevProps, prevState) {
        if(prevProps.phrase!==this.props.phrase){
          //Perform some operation here
          this.setState({phrase: this.props.phrase});
        }
        // if(prevProps.description!==this.props.description){
        //   //Perform some operation here
        //   this.setState({description: this.props.description});
        // }
      }

    onWordChange(text) {
        this.props.wordChangeAction(text);
    }

    onDescriptionChange(text) {
        this.props.descriptionChangeAction(text);
    }

    onButtonPress(){
        const {phrase, description} = this.state.phrase;
        const {phraseKey, media, startSecs, bookmark} = this.props.phrase;

        let oPhrase = {phraseKey, media, startSecs, phrase, description, bookmark};
        if (this.props.phraseSource == 'manualWord')
        {
            
            this.props.addMyPhraseToDictionary(phrase, description, '');
        }
        else if ( this.props.phraseSource == 'editToMyWord'){
            
            this.props.editMyPhrase(oPhrase);
        }
        else
        {
            this.props.addWordToDictionary(oPhrase);
        }
    }

    renderButton() {
        if (this.props.loading){
            return <Spinner size="large" />;
        }

        return (
            <TouchableOpacity style={styles.buttonContainer} onPress={this.onButtonPress.bind(this)}>
                <Image style={styles.buttonLeft} source={require('../../img/save.png')}></Image>
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
            <View style={{flex: 1, backgroundColor:'#F6F7FB'}}>
                <View style={{backgroundColor:'#405CE5', paddingTop: 30}}>
                <Header viewStyle={{backgroundColor:'#405CE5'}}
                        textStyle={{fontSize:14, fontFamily: 'GillSans-SemiBold', textTransform: 'uppercase', color: colors.white}}
                        headerText="Add To Dictionary" />
                </View>
            <Card>
                <CardSection style={{marginLeft:10, marginRight:10, borderRadius:25, borderBottomWidth:0}}>
                    <TextInput
                        style={{height:150}}
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
                        value={this.state.phrase.phrase}
                    />
                </CardSection>
                <CardSection style={{marginLeft:10, marginRight:10, marginTop:5, borderRadius:25, borderBottomWidth:0}}>
                    <TextInput
                        //secureTextEntry
                        style={{height:150}}
                        editable = {true}
                        multiline = {true}
                        label="Description"
                        placeholder="Description"
                        name="description"
                        ref={(input) => { this.description = input; }}
                        onChangeText={this.onDescriptionChange.bind(this)}
                        value={this.state.phrase.description}
                    />
                </CardSection>

                {this.renderError()}
                <CardSection style={{backgroundColor:'transparent', borderBottomWidth:0}}>                    
                    {/* {this.renderButton()}
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => Actions.pop() }>
                        <Image style={styles.buttonRight} source={require('../../img/cancel.png')}></Image>
                    </TouchableOpacity> */}
                <View style={{flex:1, flexDirection: 'row', justifyContent:'center', alignItems:'flex-end'}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={this.onButtonPress.bind(this)}>
                        <Text style={{textAlign: 'center', color:'white'}}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonStyle, {marginLeft:5}]} onPress={()=> {Actions.pop()}}>
                        <Text style={{textAlign: 'center', color:'white'}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
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
    buttonStyle: {
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 5, 
        backgroundColor: '#405CE5',
        borderRadius: 25, 
        height: 48, 
        width: 150, 
        //margin:5
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}
const mapStateToProps = ({myDictionary}) => {
    //console.log('mapStateToProps myDictionary', myDictionary);
    //const { media, startSecs, phrase, description, error, loading, bookmark } = myDictionary;
    const { phrase, error, loading } = myDictionary;
    
    return { phrase, error, loading};
}

export default connect(mapStateToProps, { wordChangeAction, descriptionChangeAction, addWordToDictionary, addMyPhraseToDictionary, editMyPhrase })(MyPhraseEdit);