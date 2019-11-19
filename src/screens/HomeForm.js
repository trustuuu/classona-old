//http://www.igoodworks.com/images/logo.png
import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Icon,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';;
import {Card, CardSection, Input, Button, Spinner} from '../components/common';
import {
  checkLoginUser,
  goTeacherScreen,
  getLoginTiles,
  classAllFetchActions,
} from '../actions';
import styles from './styles/Home';
import global from '../helpers/global.js';

import colors from '../styles/colors';

//const classonaLetterLogo = {uri: 'http://www.igoodworks.com/images/logo.png'};
const classonaLetterLogo = require('../img/classonaLetter.png');
const homeImg = require('../img/click.png');
const loadingImg = require('../img/loading.gif');
const teacherImg = require('../img/teacher.png');

class HomeForm extends Component {
  componentWillMount() {
    this.props.getLoginTiles();
  }

  makeTeacherButton = text => {
    let findIndex = this.props.tiles.findIndex(t => t.type == 'instructor');

    if (findIndex < 0) {return;}
    const item = this.props.tiles[findIndex];
    return (
      <TouchableOpacity
        onPress={() => {
          global.class = item.path;
          global.userType = item.type;
          global.backgroundColor = colors.green02;
          //console.log('backgroudColor tea', global.backgroundColor);
          this.props.classAllFetchActions();
          this.props.goTeacherScreen();
        }}>
        <Image source={teacherImg} style={styles.homeImg} />

            </TouchableOpacity>
    );;
  };

  makeCircleButton = onPress => {
    let btnArrary = [];
    let btnColors = [
      '#f6e58d',
      '#f0932b',
      '#686de0',
      '#badc58',
      '#7ed6df',
      '#f9ca24',
    ];
    const oStudentTiles = this.props.tiles.filter(t => t.type == 'student');
    //initial form
    if (this.props.tiles.length == 0) {
      return (
        <TouchableOpacity onPress={() => this.props.getLoginTiles()}>
          <Image source={homeImg} style={styles.homeImg} />
        </TouchableOpacity>
      );;
    }

    //if only one student tile exist and not teacher, go to class instantly
    if (this.props.tiles.length == 1) {
      global.class = this.props.tiles[0].path;
      global.userType = this.props.tiles[0].type;
      global.backgroundColor =
        global.userType == 'instructor' ? colors.green02 : 'white';

      console.log('global.class => ', this.props.tiles, global.class);
      this.props.checkLoginUser();
      return;
    }

    oStudentTiles.forEach((item, index) => {
      btnArrary.push(
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            backgroundColor: `${btnColors[index]}`,
            borderRadius: 100,
          }}
          onPress={async () => {
            const oldGlobalClass = global.class;
            global.class = item.path;
            global.userType = item.type;
            global.backgroundColor = 'white';
            //console.log('backgroudColor ste', global.backgroundColor);

            if (oldGlobalClass != item.path) {
              console.log(
                'global.class, item.path',
                oldGlobalClass,
                global.class,
                item.path,
              );
              await this.props.classAllFetchActions();
            }
            this.props.checkLoginUser();
          }}

                key = {index}
                >
          <Text style={{color: 'black', fontSize: 50}}>{item.language}</Text>
        </TouchableOpacity>,
      );
    });

    return btnArrary;

    // return (
    //     <TouchableOpacity
    //         style={{
    //             borderWidth:1,
    //             borderColor:'rgba(0,0,0,0.2)',
    //             alignItems:'center',
    //             justifyContent:'center',
    //             width:100,
    //             height:100,
    //             backgroundColor:'#fff',
    //             borderRadius:100,
    //             }}
    //         onPress = {onPress}
    //         >
    //         <Text style={{color: 'black', fontSize: 50}}>{text}</Text>
    //     </TouchableOpacity>
    // );
  };

  checkLogin = () => this.props.checkLoginUser();

  render() {
    return (
        <View style={styles.welcomeWrapper}>
          <Image source={classonaLetterLogo} style={styles.logo} />
          {this.makeTeacherButton()}
          {this.makeCircleButton()}
        </View>
    );
  }
}

const mapStateToProps = ({auth}) => {
  const {user, tiles, loading} = auth;
  return {user, tiles, loading};
};;

export default connect(
  mapStateToProps,
  {checkLoginUser, goTeacherScreen, getLoginTiles, classAllFetchActions},
)(HomeForm);

