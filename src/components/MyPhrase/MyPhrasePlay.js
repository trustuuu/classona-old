import React, { Component } from 'react';
import { Text, View, TextInput, Modal, TouchableOpacity, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import Tts from 'react-native-tts';

import { Card, CardSection, Input, Button, Spinner, Header, TTSPlayer} from '../common';
import { editToMyWord } from '../../actions';
import colors from '../../styles/colors';

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
            <TouchableOpacity style={styles.buttonStyle} onPress={this.onButtonEdit.bind(this)}>
                        <Text style={{color:colors.white}}>EDIT</Text>
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
        const {phrase, description, startSecs, media } = this.props.phrase;
        return (
            // <View style={{flex: 1}}>
            //     <Header headerText='Class media list' textStyle={{color:colors.white, fontFamily:'GillSans-Light'}}
            //                 viewStyle={{backgroundColor:colors.homeBlue, height:80}}/>
            // <Card>
            //     <CardSection>
            //         <Text>
            //             {phrase}
            //         </Text>
            //     </CardSection>
            //     <CardSection>
            //         <Text>
            //             {description}
            //         </Text>
            //     </CardSection>
            //     <CardSection>           
            //         <TTSPlayer phrase={phrase}/>         
            //     </CardSection>

            //     {this.renderError()}
            //     {this.renderButton()}

            //     <CardSection>           
            //         <Button onPress={ Actions.pop }>
            //             Cancel
            //         </Button>
            //     </CardSection>
            // </Card>
            // </View>


            <View style={{flex:10, flexDirection:'column', backgroundColor:colors.screenBGColor, justifyContent:'space-between', alignItems:'stretch'}}>
                <View style={{flex:8}}>
                <Header headerText='Phrase Play' textStyle={{color:colors.white, fontFamily:'GillSans-Light'}}
                            viewStyle={{backgroundColor:colors.homeBlue, height:80}}/>
                <ScrollView> 
                        <Card>
                        <CardSection style={[{ backgroundColor : colors.white, 
                                            borderTopLeftRadius:25, 
                                            borderTopRightRadius:25, 
                                            paddingLeft: 15,
                                            paddingBottom:0,
                                            borderBottomWidth:0,
                                            marginTop: 5}]}
                            >
                                <Text>
                                    {phrase}
                                </Text>
                            </CardSection>
                            <CardSection style={[{ backgroundColor : colors.white, 
                                            borderBottomLeftRadius:25, 
                                            borderBottomRightRadius:25, 
                                            paddingTop:0,
                                            paddingLeft: 15}]}
                            >
                                <Text>
                                    {description}
                                </Text>
                            </CardSection>
                            {this.renderError()}
                            <CardSection style={{padding:0}}>           
                            </CardSection>
                        </Card>
                </ScrollView>
                </View>
                
                <View style={{flex:1, flexDirection:'column', justifyContent:'space-between'}}>
                    <TTSPlayer style={{justifyContent:'space-between', alignItems:'stretch', width:'100%', backgroundColor:colors.playBGColor}} phrase={phrase}/>        
                </View> 
                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    {this.renderButton()}
                    <TouchableOpacity style={styles.buttonStyle} onPress={ () => Actions.pop() }>
                        <Text style={{color:colors.white}}>CLOSE</Text>
                    </TouchableOpacity>
                </View>

            </View>

        )
    }
}


const styles = {
    TouchableText: {
        //backgroundColor: '#DDDDDD',
        padding: 2,
        alignItems:'stretch'
        //borderRadius:15
    },
    titleStyle: {
      fontSize: 15,
      //fontWeight: "bold",
      color: colors.white,
      paddingLeft: 15,
      alignItems:'stretch'
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20
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
    }
  };

const mapStateToProps = ({myDictionary}) => { //{ auth, myDictionary }) => {
    //const {email, password, error, loading} = state.auth;
    const { phrase, error, loading } = myDictionary;
    return { error, loading, phrase };
}

export default connect(mapStateToProps, { editToMyWord })(MyPhrasePlay);