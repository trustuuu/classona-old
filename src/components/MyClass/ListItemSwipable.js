import React, {Component} from 'react';
import { ListView, Text, Button, Image, ScrollView, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';

import {CardSection, Card} from '../common';
import { deleteClassActions, deleteClassInstructorActions, selectClassActions, getClass, addClassBookmark, removeClassBookmark } from '../../actions';

import colors from '../../styles/colors';
import global from '../../helpers/global.js';
const bookmarkImg = require('../../img/bookmarkIcon.png');

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
                <Image style={{width:20, height:26}} source={bookmarkImg} />
                </View>
            )
        }
        else{return;}
    }

    renderClass()
    {
        const {className, instructor, instructorDisplayName, institution, media, classDate, bookmark} = this.props.oClass;

        const bookmarkButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImage} source={require('../../img/bookmark-white.png')} />
                  <Text style={styles.swipeOutText}>Bookmark</Text>
                </View>
              ),
            text: 'Bookmark',
            backgroundColor: '#FADA83',
            underlayColor: '#dfe6e9',
            onPress: () => { 
                this.props.addClassBookmark(this.props.oClass.classId, null, global.userType, global.class, this.props.oClass.items[0], 0, "class");
                }
        }

        const unBookmarkButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImage} source={require('../../img/bookmark-white.png')} />
                  <Text style={styles.swipeOutText}>Unbookmark</Text>
                </View>
              ),
            text: 'Unbookmark',
            backgroundColor: '#3A7FEF',
            underlayColor: '#ffbe76',
            onPress: () => {
                this.props.removeClassBookmark(this.props.oClass.classId, null, global.userType);
                }
        }

        const deleteButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImage} source={require('../../img/trash-white.png')} />
                  <Text style={styles.swipeOutText}>Delete</Text>
                </View>
              ),
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
                <Swipeout right={swipeBtns} left={swipeInstructorBtns}
                    autoClose={true}
                    backgroundColor='transparent'
                >
                        <View>
                    <TouchableHighlight underlayColor='#0984e3'>
                        <TouchableOpacity title={className} onPress={ () => this.onSelect() }>
                        <Card style={{borderRadius:15, borderBottomWidth: 0, borderTopWidth: 0}}>
                        <CardSection style={{backgroundColor: global.backgroundColor, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomWidth: 0, borderTopWidth: 0}}>
                                    <Text style={styles.titleStyle}>{className.replace('privateClass', 'Personal Recording')} </Text>
                            { this.renderBookmarkIcon() }
                        </CardSection>
                        <CardSection style={{borderBottomWidth: 0, borderTopWidth: 0}}>
                            <Text style={styles.descStyle}>Instructor: {instructorDisplayName} from {institution.replace('privateInstitution', 'myself')}</Text>
                        </CardSection>
                        <CardSection style={{backgroundColor: global.backgroundColor, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderBottomWidth: 0, borderTopWidth: 0}}>
                            <Text style={styles.descStyle}>Date: {classDate}</Text>
                        </CardSection>
                        </Card>
                        </TouchableOpacity>
                    </TouchableHighlight>
                    </View>
                </Swipeout>
        );
    }
    
    renderClassGroupBy()
    {
        const {className, instructor, instructorDisplayName, institution, media, classDate, bookmark} = this.props.oClass;

        const bookmarkButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImageSmall} source={require('../../img/bookmark-white.png')} />
                  <Text style={styles.swipeOutTextSmall}>Bookmark</Text>
                </View>
              ),
            text: 'Bookmark',
            backgroundColor: '#FADA83',
            underlayColor: '#dfe6e9',
            onPress: () => { 
                this.props.addClassBookmark(this.props.oClass.classId, null, global.userType, global.class, this.props.oClass.items[0], 0, "class");
                }
        }

        const unBookmarkButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImageSmall} source={require('../../img/bookmark-white.png')} />
                  <Text style={styles.swipeOutTextSmall}>Unbookmark</Text>
                </View>
              ),
            text: 'Unbookmark',
            backgroundColor: '#3A7FEF',
            underlayColor: '#ffbe76',
            onPress: () => {
                this.props.removeClassBookmark(this.props.oClass.classId, null, global.userType);
            }
        }

        const deleteButton = {
            component: (
                <View style={styles.swipeOutView}>
                  <Image style={styles.swipeOutImageSmall} source={require('../../img/trash-white.png')} />
                  <Text style={styles.swipeOutTextSmall}>Delete</Text>
                </View>
              ),
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
            
            <Swipeout right={swipeBtns}
                    autoClose={true}
                    backgroundColor='transparent'
                >
                        <View>
                    <TouchableHighlight underlayColor='#0984e3'>
                        <TouchableOpacity title={classDate} onPress={ () => this.onSelect() }>
                        <Card style={{borderBottomWidth: 0, borderTopWidth: 0}}>
                        <CardSection 
                            style={{flex:1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    backgroundColor: global.backgroundColor,
                                    paddingTop: 10,
                                    height: 40, 
                                    borderRadius: 15, 
                                    borderBottomWidth: 0, 
                                    borderTopWidth: 0}}
                            >
                            <Text style={styles.titleStyle}>Date: </Text>
                            <Text style={[styles.titleStyle, {fontFamily: 'GillSans-Light'}]}>{classDate} </Text>
                            { this.renderBookmarkIcon() }
                            <Text style={[styles.titleStyle]}>{instructorDisplayName} </Text>
                        </CardSection>
                        </Card>
                        </TouchableOpacity>
                    </TouchableHighlight>
                    </View>
                </Swipeout>
            

            // <Card style={{borderBottomWidth: 0, borderTopWidth: 0}}>
            //     <Swipeout right={swipeBtns}
            //     autoClose={true}
            //     backgroundColor='transparent' 
            //     >
            //         <TouchableHighlight
            //         underlayColor='#0984e3'
            //         >
            //         <TouchableOpacity style={styles.titleStyle} title={classDate} onPress={ () => this.onSelect() }>
            //         <View>
            //             <CardSection style={{backgroundColor: global.backgroundColor, borderBottomWidth: 0, borderTopWidth: 0}}>
            //                                 <Text style={styles.titleStyle}>{classDate} [ {instructorDisplayName} ]</Text>
            //                 { this.renderBookmarkIcon() }
            //             </CardSection>
            //         </View>
            //         </TouchableOpacity>
            //         </TouchableHighlight>
            //     </Swipeout>
            // </Card>

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
      //fontWeight: "bold",
      color: '#434667',
      paddingLeft: 20,
      textTransform: 'uppercase',
      fontFamily: 'GillSans-SemiBold',
      fontSize: 14
    },
    descStyle: {
        fontSize: 12,
        paddingLeft: 20
      },
    swipeOutView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    swipeOutImage: {
        width: 20,
        height: 26
    },
    swipeOutText: {
        paddingTop: 5,
        color: colors.white,
        fontFamily: 'GillSans-Light',
        fontSize: 14
    },
    swipeOutImageSmall: {
        width: 14,
        height: 20
    },
    swipeOutTextSmall: {
        paddingTop: 2,
        color: colors.white,
        fontFamily: 'GillSans-Light',
        fontSize: 14
    }
    
  };


const MapStateToProps = ({oClass}) =>
{
    const { classes, groupBy, bookmarks, loading, error } = oClass; 
    return {bookmarks, loading, error};
}


export default ListItemSwipable = connect(MapStateToProps, {deleteClassActions, deleteClassInstructorActions, selectClassActions, getClass, addClassBookmark, removeClassBookmark})(ListItem);
