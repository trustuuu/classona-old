import React, {Component} from 'react';
import { ListView, Text, Button, Image, ScrollView, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';

import {CardSection, Card} from '../common';
import { deleteClassActions, deleteClassInstructorActions, selectClassActions, getClass, addClassBookmark, removeClassBookmark } from '../../actions';

import colors from '../../styles/colors';
import global from '../../helpers/global.js';
const bookmarkImg = require('../../img/bookmark.png');

class ListItem extends Component {

    constructor(props) {
        super(props);  
        this.onPress = this.onSelect.bind(this);
    }

    onSelect()
    {
        try{
            if (!this.props.oClass.className) return;
            if (this.props.oClass.items.lenght < 1) return;
            if (this.props.oClass.items[0].scripts.length < 1) return;

            this.props.selectClassActions(this.props.oClass);
        } catch(err) {
            console.log(err);
        }
    }

    renderBookmarkIcon = () => {
        if (this.props.oClass.bookmark)
        {
            return (
                <View style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        flexDirection: 'column',
                        alignSelf: 'flex-end',
                    }}
                >
                <Image style={{width:20, height:20}} source={bookmarkImg} />
                </View>
            )
        }
        else{return;}
    }

    renderClass()
    {
        const {className, instructor, instructorDisplayName, institution, media, classDate, bookmark} = this.props.oClass;

        const bookmarkButton = {
            text: 'Bookmark',
            backgroundColor: '#00cec9',
            underlayColor: '#dfe6e9',
            onPress: () => { 
                this.props.addClassBookmark(this.props.oClass.classId, null, global.userType, global.class, this.props.oClass.items[0], 0, "class");
                }
        }

        const unBookmarkButton = {
            text: 'Unbookmark',
            backgroundColor: '#ffbe76',
            underlayColor: '#ffbe76',
            onPress: () => {
                this.props.removeClassBookmark(this.props.oClass.classId, null, global.userType);
                }
        }

        const deleteButton = {
                text: 'Delete',
                backgroundColor: '#d63031',
                underlayColor: '#dfe6e9',
                onPress: () => {
                    
                    if (global.userType == 'student'){
                        this.props.deleteClassActions(this.props.oClass);
                    }
                    else if (global.userType == 'instructor'){
                        this.props.deleteClassInstructorActions(this.props.oClass);
                    }
                }
            }
        
        const editButton = {
            text: 'Edit',
            backgroundColor: '#00cec9',
            underlayColor: '#dfe6e9',
            onPress: () => { 
                this.props.addClassBookmark(this.props.oClass.classId, null, global.userType, global.class, this.props.oClass.items[0], 0, "class");
                }
        }

        let swipeBtns = bookmark ? [unBookmarkButton] : [bookmarkButton];
        
        let swipeInstructorBtns = global.userType == 'instructor' ? [editButton] : [];

        swipeBtns.push(deleteButton);

        return (
            <Card style={{borderRadius:15}}>
                <Swipeout right={swipeBtns} left={swipeInstructorBtns}
                    autoClose={true}
                    backgroundColor='transparent'
                >
                    <TouchableHighlight
                        underlayColor='#0984e3'
                    >
                        <View>
                        <CardSection style={{backgroundColor: global.backgroundColor, borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
                            <TouchableOpacity style={styles.titleStyle} title={className} onPress={ () => this.onSelect() }>
                                    <Text style={styles.titleStyle}>{className.replace('privateClass', 'Personal Recording')} </Text>
                            </TouchableOpacity>
                            { this.renderBookmarkIcon() }
                        </CardSection>
                        <CardSection>
                            <Text style={styles.descStyle}>Instructor: {instructorDisplayName} from {institution.replace('privateInstitution', 'myself')}</Text>
                        </CardSection>
                        <CardSection style={{backgroundColor: global.backgroundColor, borderBottomLeftRadius: 15, borderBottomRightRadius: 15}}>
                            <Text style={styles.descStyle}>Date: {classDate}</Text>
                        </CardSection>
                        </View>
                    </TouchableHighlight>
                </Swipeout>
            </Card>
        );
    }
    
    renderClassGroupBy()
    {
        const {className, instructor, instructorDisplayName, institution, media, classDate, bookmark} = this.props.oClass;

        const bookmarkButton = {
            text: 'Bookmark',
            backgroundColor: '#00cec9',
            underlayColor: '#dfe6e9',
            onPress: () => { 
                this.props.addClassBookmark(this.props.oClass.classId, null, global.userType, global.class, this.props.oClass.items[0], 0, "class");
                }
        }

        const unBookmarkButton = {
            text: 'Unbookmark',
            backgroundColor: '#ffbe76',
            underlayColor: '#ffbe76',
            onPress: () => {
                this.props.removeClassBookmark(this.props.oClass.classId, null, global.userType);
            }
        }

        const deleteButton = {
                text: 'Delete',
                backgroundColor: '#d63031',
                underlayColor: '#dfe6e9',
                onPress: () => {
                    console.log('deleteButton', this.props.oClass);
                    if (global.userType == 'student'){
                        this.props.deleteClassActions(this.props.oClass);
                    }
                    else if (global.userType == 'instructor'){
                        this.props.deleteClassInstructorActions(this.props.oClass);
                    }
                    
                }
            }
        
        let swipeBtns = bookmark ? [unBookmarkButton] : [bookmarkButton];
        swipeBtns.push(deleteButton);

        return (
            
            <Card>
             <Swipeout right={swipeBtns}
            autoClose={true}
            backgroundColor='transparent'
            >
                <TouchableHighlight
                underlayColor='#0984e3'
                >
                <View>

                <CardSection  style={{backgroundColor: global.backgroundColor}}>
                    <TouchableOpacity style={styles.titleStyle} title={classDate} onPress={ () => this.onSelect() }>
                                    <Text style={styles.titleStyle}>{classDate} [ {instructorDisplayName} ]</Text>
                    </TouchableOpacity>
                    { this.renderBookmarkIcon() }
                </CardSection>
                </View></TouchableHighlight>
                </Swipeout>
            </Card>
            

        );
    }

    render(){
        
        if (this.props.groupBy === null)
        {
            return this.renderClass();
        }
        else
        {
            return this.renderClassGroupBy();
        }
    }

}


const styles = {
    titleStyle: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.green01,
      paddingLeft: 15
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20
      }
  };


const MapStateToProps = ({oClass}) =>
{
    const { classes, groupBy, bookmarks, loading, error } = oClass; 
    return {bookmarks, loading, error};
}


export default ListItemSwipable = connect(MapStateToProps, {deleteClassActions, deleteClassInstructorActions, selectClassActions, getClass, addClassBookmark, removeClassBookmark})(ListItem);
