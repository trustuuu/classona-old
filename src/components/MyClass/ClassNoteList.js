import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { View, Text, Button, FlatList, SectionList, ScrollView, StyleSheet, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { getClassNotes, noteChangeAction } from '../../actions';
import ClassNoteItem from './ClassNoteItem';
import { Input, CardSection, OptimizedFlatList, FlatListItem, Spinner } from '../common';
import colors from '../../styles/colors';
import global from '../../helpers/global.js';

const button_review = require('../../img/button_review.png');
const button_dic = require('../../img/button_dic.png');
const button_learn = require('../../img/button_learn.png');
const button_refresh = require('../../img/button_refresh.png');

class ClassNoteList extends Component {

    async componentDidMount()
    {
        this.props.getClassNotes(global.oClass);
    }

    showSpin = () => {
        if (this.props.loading){
            return <Spinner size="large" />
        }
    }
    renderHeader = () => {
        return <Input containerStyle={{marginLeft:10, marginRight:5, marginTop:5, marginBottom:5,
                                        borderRadius: 25, height:50, backgroundColor:'#FFFFFF' }}
                      inputStyle={{borderRadius: 25, paddingBottom:10, backgroundColor:'#FFFFFF' }}
                        type='search' placeholder="Search Here..." lightTheme round />;
     };


    renderAddButton = () => {
        if (global.userType == 'instructor')
        {
            return (
                <TouchableHighlight style={styles.floatingButton}
                                    onPress={() => {
                                                    this.props.noteChangeAction({
                                                                                note:'', description:'',
                                                                                classId:global.oClass.classId
                                                                                    }) 
                                                    Actions.ClassNoteEdit({noteAction:'addClassNote'})
                                                    }}
                >
                    <Text> + </Text>
                </TouchableHighlight>
            )
        }
        else return;
    }

    render()
    {
        console.log('class notes ->', this.props.notes);
        return (
            <View style={styles.wapper}>
                <View>
                    <OptimizedFlatList
                        ListHeaderComponent={this.renderHeader}
                        data={this.props.notes}
                        renderItem={({item}) => {
                            return (
                                <ClassNoteItem
                                    oNote={item}
                                />
                            );
                        }}
                        keyExtractor={oNote => oNote.noteId}
                    />

                {this.renderAddButton()}
                {this.showSpin()}
                </View>
                <View style={{marginBottom:30, alignItems:'center'}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={ () => Actions.pop() }>
                        <Text style={{color:colors.white}}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const MapStateToProps = ({oClass}) =>
{
    const { notes, error, loading } = oClass; 
    return { notes, error, loading };
}

const styles = StyleSheet.create({
    wapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'space-between',
        alignItems: 'stretch'
    },

    buttonContainer: {
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    buttonStyle: {
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 5, 
        backgroundColor: '#405CE5',
        borderRadius: 25, 
        height: 48, 
        width: 250, 
        //margin:5
    },
    floatingButton: {
        backgroundColor: colors.homeBlue,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 120,
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

export default connect(MapStateToProps, { getClassNotes, noteChangeAction })(ClassNoteList);
