import React, {Component, Fragment} from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';

import Swipeout from 'react-native-swipeout';
import {CardSection, Card, OptimizedFlatList, RNPickerSelect} from '../common';
import MyLanguageListItem from './MyLanguageListItem';
import colors from '../../styles/colors';

import {getAllLanguages, getMyLanguages, addMyLanguage, deleteMyLanguage} from '../../actions'


class MyLanguageList extends Component{
    
    state = {
        modalVisible: false,
        selectLanguage: {languageId: 'en-US'},
    }
    

    componentWillMount(){
        this.props.getAllLanguages();
        this.props.getMyLanguages();
    }

    onLanguagePress = async lang => {
        try {
            const languages = this.props.languages.filter(item => item.languageId == lang)

            if (languages.length < 1) return;
            const selectLang = languages[0];
            this.setState({selectLanguage: selectLang})
            console.log('select language', selectLang, this.state.selectLanguage);
        } catch (err) {
            // My Samsung S9 has always this error: "Language is not supported"
            console.log(`setDefaultLanguage error `, err);
        }
      };

    showAddLanguageButton() {
        if (this.state.modalVisible) {
            return (<View></View>)
        }
        
        return (
            <View>
                    <TouchableHighlight style={styles.floatingButton}
                        onPress={
                            () => this.setState({modalVisible: true})
                        } >
                            <Text> + </Text>
                    </TouchableHighlight>
                </View>
        )
    }
    selectLanguageDisplay(){
        if (!this.state.modalVisible)
        {
            return (<View></View>)
        }
            return (
                <View style={styles.languageSelect}>
                    <View style={{backgroundColor: colors.green01, fontSize: '16px', padding: 10}}>
                        <Text>Select New Language</Text>
                    </View>
                    <View>
                            <View style={{padding: 20}}>
                                <RNPickerSelect
                                            placeholder={{
                                                label: 'Select a language...',
                                                value: null,
                                                color: '#9EA0A4',
                                            }}
                                            items={this.props.languages}
                                            onValueChange={(value) => {
                                                this.onLanguagePress(value);
                                                //this.setState({modalVisible: false});
                                            }}
                                            onUpArrow={() => {
                                                //this.inputRefs.name.focus();
                                            }}
                                            onDownArrow={() => {
                                                //this.inputRefs.picker2.togglePicker();
                                            }}
                                            style={{ ...pickerSelectStyles }}
                                            value={this.state.selectLanguage.languageId}
                                            ref={(el) => {
                                                //this.inputRefs.picker = el;
                                            }} 
                                />
                            </View>
                    </View>



                    <View style={[styles.buttonContainer]}>
                        <TouchableOpacity style={[{marginLeft: 10,flexDirection: 'column', justifyContent: 'center'}]}
                            onPress={ () => {
                                //this.props.deleteMyLanguage(this.state.selectLanguage);
                                this.setState({modalVisible: false})
                             } }>

                            <Image style={styles.buttonRight} source={require('../../img/cancel.png')}></Image>
                            <Text style={{textAlign: 'center'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{paddingLeft: 40,flexDirection: 'column', justifyContent: 'center'}]}
                            onPress={ () => {
                                this.props.addMyLanguage(this.state.selectLanguage);
                                this.props.getMyLanguages();
                                this.setState({modalVisible: false})
                             } }>

                            <Image style={styles.buttonLeft} source={require('../../img/save.png')}></Image>
                            <Text style={{textAlign: 'center'}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
    }

    render(){
        if (this.props.myLanguages == null) return(<View><Text>loading...</Text></View>)
        
        const myLanguages = this.props.myLanguages.map( (item) => {
            const fullItem = this.props.languages.filter( (lang) => lang.languageId == item.languageId)[0];
            return {...fullItem}
        })

        return(
            <View style={styles.wapper}>
    
                    <OptimizedFlatList
                        ListHeaderComponent={this.renderHeader}
                        data={myLanguages}
                        renderItem={({item}) => {
                            
                            return (
                                <MyLanguageListItem
                                    language={item}
                                />
                            );
                        }}
                        keyExtractor={language => language.languageId}
                    />
                
                {/* {this.showSpin()} */}
                { this.selectLanguageDisplay() }
                { this.showAddLanguageButton() }
                
            </View>


            // <View>
            //     <Card>
            //         <Swipeout right={swipeBtns}
            //             autoClose={true}
            //             backgroundColor= 'transparent'>
            //             <TouchableHighlight underlayColor='#0984e3'>
            //                 <View>
            //                     <CardSection>
            //                         <TouchableOpacity style={styles.titleStyle} title={phrase} onPress={ () => this.onSelect() }>
            //                             <Text style={styles.titleStyle}>{phrase} </Text>
            //                         </TouchableOpacity>
            //                         { this.renderBookmarkIcon() }
            //                     </CardSection>
                                
            //                     <CardSection>
            //                         <Text style={styles.descStyle}>{description} </Text>
            //                     </CardSection>
            //                 </View>
            //             </TouchableHighlight>
            //         </Swipeout>
            //     </Card>
            // </View>
            
        )
    }
}

const styles = StyleSheet.create({
    wapper: {
    flex: 1,
    flexDirection: 'column',
    },

   button: {
    width: 50,
    height: 50,
    marginRight: 10,
  },

  buttonContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    },
    buttonLeft: {
        width: 50,
        height: 50,
        //marginLeft: 100,
    },
    buttonRight: {
        width: 50,
        height: 50,
        //marginRight: 100,
    },

  controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: colors.green01,
    },
    controlIcon: {
        width: 40,
        height: 40
    },
    playPause: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ffffff',
        padding: 10,
        marginHorizontal: 15
    },
    cardSection: {
        backgroundColor: colors.lightRed,
        borderWidth: 0,
        borderBottomWidth: 0
    },
    languageSelect: {
        flex: 1,
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: colors.brown01,
        //bottom: 90,
        borderWidth: 1,
    },
    floatingButton: {
        backgroundColor: colors.green02,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 40,
        right: 50,
        height: 50,
        width: 50,
        shadowColor: '#000000',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0,
        }
    },
});


const pickerSelectStyles = StyleSheet.create({
    pickerTextStyle: {
        fontSize: 13,
        paddingLeft: 20
    },
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: colors.yellow,
        color: 'black',
        width: 330
    },
    inputAndroid: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 0,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: colors.yellow,
        color: 'black',
        width: 250
    },
});

const MapStateToProps = ({myLanguage}) => {
    const {languages, myLanguages} = myLanguage;
    console.log('MapStateToProps languages => ', languages, myLanguages);
    return {languages, myLanguages}
}

export default connect(MapStateToProps, {getAllLanguages, getMyLanguages, addMyLanguage, deleteMyLanguage})(MyLanguageList);