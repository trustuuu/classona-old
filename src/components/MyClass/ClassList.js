import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { View, Text, Button, FlatList, SectionList, ScrollView, StyleSheet, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { classAllFetchActions, menuTo, classAllFetchShelloActions } from '../../actions';
import ListItemSwipable from './ListItemSwipable';
import { ListItemSectionSwipable} from './ListItemSwipable';
import { Input, CardSection, OptimizedFlatList, FlatListItem, Spinner } from '../common';
import colors from '../../styles/colors';
import global from '../../helpers/global.js';
//import console = require('console');

const button_review = require('../../img/button_review.png');
const button_dic = require('../../img/button_dic.png');
const button_learn = require('../../img/button_learn.png');
const button_refresh = require('../../img/button_refresh.png');

class ClassListComponent extends Component {


    constructor(props) {
        super(props);

        this.state = {
            classes: null
            };
    }


    async componentDidMount()
    {
        if (this.props.classes === null)  {
            await this.props.classAllFetchActions();
        }
        //this.onButtonRefresh();
    }


    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.classes !== prevState.classes){
            return { classes: nextProps.classes };
        }
        // if(nextProps.tracks !== prevState.tracks){
        //     return { tracks: nextProps.tracks };
        // }
        else{
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.classes!==this.props.classes){
            this.setState({classes: this.props.classes});
        }
    }

    // async onButtonRefresh()
    // {
    //     //this.props.menuTo({test:"hello"});
    //     await this.props.classAllFetchShelloActions();
    // }

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

    renderPrivateButton = () => {
        
        if (global.userType == 'instructor') return;

        return (
            <TouchableHighlight style={styles.floatingButton} onPress={() => Actions.ClassRecorder()} >
                <Image style={{width:80, height:80}} source={require('../../img/icon-create.png')}></Image>
            </TouchableHighlight>
        )
    }

    renderClass()
    {
        if (this.state.classes == null) return (<View></View>)
        
        return (
            <View style={styles.wapper}>
                    <OptimizedFlatList
                        ListHeaderComponent={this.renderHeader}
                        data={this.state.classes}
                        renderItem={({item}) => {
                            console.log('class => ', item);
                            return (
                                <ListItemSwipable
                                    oClass={item}  groupBy={this.props.groupBy}
                                />
                            );
                        }}
                        keyExtractor={oClass => oClass.classId}
                    />
                
                {this.renderPrivateButton()}
                {this.showSpin()}
            </View>
        );
    }

    renderClassByGroupBy()
    {
        // check execeptions for this.props.classes
        if ( (this.props.classes[0] == undefined) || (!this.props.classes) || (!this.props.classes[0].data)) return (<View></View>);
            return (
                <View style={styles.wapper}>
                    <SectionList
                        //ListHeaderComponent={this.renderHeader}
                        sections={this.props.classes}
                        renderItem={
                            ({item}) =>  
                            {
                                return (
                                <ListItemSwipable
                                    oClass={item} groupBy={this.props.groupBy}
                                />
                            );
                            }
                        }
                        
                        renderSectionHeader={
                            ({section}) => {

                                return (
                                    <CardSection style={{backgroundColor:'transparent', marginTop:30, paddingLeft: 20, paddingRight: 20, fontWeight: "bold"}}>
                                        { section.className ? <Text>{section.className.replace('privateClass', 'Personal Recording')}</Text> : <View></View>}
                                        { section.instructorDisplayName ? <Text> | {section.instructorDisplayName}</Text> : <View></View> }
                                        { section.institution ? <Text> | {section.institution.replace('privateInstitution', 'Self Recording')}</Text> : <View></View>}
                                    </CardSection>
                                )
                            }
                        }
                    
                        //keyExtractor={oClass => oClass.classId}
                    />
                    <TouchableHighlight style={styles.floatingButton} onPress={() => Actions.ClassRecorder()} >
                        <Image style={{width:80, height:80}} source={require('../../img/icon-create.png')}></Image>
                    </TouchableHighlight>
                {this.showSpin()}
                </View>
            );
    }

    render()
    {
        // if (this.props.loading){
        //     return <Spinner size="large" />;
        // }

        if (this.props.groupBy === null){
            return this.renderClass()    
        }
        else
        {
            return this.renderClassByGroupBy()
        }
    }
}


const MapStateToProps = ({oClass}) =>
{
    const {groupBy, bookmarks, loading } = oClass; 

    let classes = null;
    if ((oClass.classes != null) && (oClass.classes.length > 0))
    {
        classes = oClass.classes.sort((item1, item2) => item2.classSec - item1.classSec);
    }

    return { classes, groupBy, bookmarks, loading };
}

const styles = StyleSheet.create({
    wapper: {
        flex: 1,
        flexDirection: 'column',
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

    floatingButton: {
        //backgroundColor: colors.green02,
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

export default connect(MapStateToProps, {classAllFetchActions, menuTo, classAllFetchShelloActions})(ClassListComponent);
