import React, {Component} from 'react';
import { ListView, Text, Button, ScrollView, View, Image, TouchableOpacity  } from 'react-native';
import {Header, CardSection, Card} from './common';
//import { MediaItem } from './MediaItem';
import { Actions } from 'react-native-router-flux';
import colors from '../styles/colors'

import { connect } from 'react-redux';
import { menuTo, classAllFetchActions } from '../actions';


class SideMenu extends Component {
    constructor(props) {
        super(props);  
      }

    onSelectHome()
    {  
        //this.props.goHome();
        Actions.auth();
        //Actions.classItem2({oClass: this.props.oClass});
    }
    onSelectSort()
    {
        Actions.mainContainer();
        //Actions.classItem2({oClass: this.props.oClass});
    }
    onSelectDictionary()
    {
        Actions.modal();
    }

    onSelectMyBookmark()
    {
        Actions.MyBookmark();
    }

    onSelectFilter()
    {
        Actions.mainContainer();
        //Actions.classItem2({oClass: this.props.oClass});
    }

    onSelectSignOut()
    {
        Actions.signOut();
    }

    onSelectUserProfile()
    {
        Actions.profileSettings();
    }

    onSelectMyLanguages(){
        //Actions.mySettings();
        Actions.myLanguageList();
    }

    onSelectMySettings(){
        //Actions.mySettings();
        Actions.myPlanHistory();
    }

    onSelectGroupBy()
    {
        //this.props.classAllFetchActions(['className', 'institution', 'instructor']);
        Actions.classList();
        //Actions.classListSection({groupBy: ['className', 'institution', 'instructor']});
        //Actions.classItem2({oClass: this.props.oClass});
    }

    onLogOut()
    {
        Actions.signOutFormModal();
    }

    render(){

        return (
            // <ScrollView bounces={true}>
            <View style={[styles.cardStyle, {height: '100%'}]}>
            <Card style={styles.cardStyle}>
            <Header>Filter or Sort</Header>
                <CardSection style={styles.cardStyle}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.onSelectHome() }>
                        <Image style={styles.buttonLeft} source={require('../img/button_home.png')}></Image>
                        <Text style={styles.titleStyle}>Home</Text>
                    </TouchableOpacity>
                </CardSection>
                <CardSection style={styles.cardStyle}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.onSelectSort() }>
                        <Image style={styles.buttonLeft} source={require('../img/button_class.png')}></Image>
                        <Text style={styles.titleStyle}>Class</Text>
                    </TouchableOpacity>
                </CardSection>
                <CardSection style={styles.cardStyle}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.onSelectDictionary() }>
                        <Image style={styles.buttonLeft} source={require('../img/library.png')}></Image>
                        <Text style={styles.titleStyle}>Lab</Text>
                    </TouchableOpacity>
                </CardSection>
                <CardSection style={styles.cardStyle}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.onSelectUserProfile() }>
                        <Image style={styles.buttonLeft} source={require('../img/profile.png')}></Image>
                        <Text style={styles.titleStyle}>Profile</Text>
                    </TouchableOpacity>
                </CardSection>
                <CardSection style={styles.cardStyle}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.onSelectMyLanguages() }>
                        <Image style={styles.buttonLeft} source={require('../img/button_language.png')}></Image>
                        <Text style={styles.titleStyle}>My Languages</Text>
                    </TouchableOpacity>
                </CardSection>
                <CardSection style={styles.cardStyle}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.onSelectMySettings() }>
                        <Image style={styles.buttonLeft} source={require('../img/myplan.png')}></Image>
                        <Text style={styles.titleStyle}>My Plan</Text>
                    </TouchableOpacity>
                </CardSection>
                <CardSection style={styles.cardStyle}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.onLogOut() }>
                        <Image style={styles.buttonLeft} source={require('../img/logout.png')}></Image>
                        <Text style={styles.titleStyle}>Logout</Text>
                    </TouchableOpacity>
                </CardSection>
            </Card>
            </View>
            //</ScrollView>

        );
    }

}

const styles = {
    buttonContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    titleStyle: {
      fontSize: 13,
      textTransform: 'uppercase',
      fontFamily: 'GillSans-Light',
      //fontWeight: "bold",
      color: colors.white,
      paddingLeft: 15
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20,
    },
    buttonLeft: {
    width: 22,
    height: 22,
    marginLeft: 10,
    },
    cardStyle: {
    backgroundColor:'#18204D',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingBottom: 40
    }
  };

//export default SideMenu;

const mapStateToProps = (state) => {
    const {oClass} = state.sideMenu;
    return { oClass };
}

export default connect(mapStateToProps, { menuTo, classAllFetchActions })(SideMenu);
