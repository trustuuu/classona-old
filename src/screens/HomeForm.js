//http://www.igoodworks.com/images/logo.png
import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Easing
} from 'react-native';
import {connect} from 'react-redux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import countryImages from '../img/countryImg';

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
const homeBg = require('../img/homeBg.jpg');
const homeImg = require('../img/click.png');
const loadingImg = require('../img/loading.gif');
const teacherImg = require('../img/teacher.png');
const MAX_POINTS = 100;

class HomeForm extends Component {
  // componentWillMount() {
  //   this.props.getLoginTiles();
  // }


  componentDidMount(){
    this.props.getLoginTiles();
    this.circularProgress.animate(100, 3000, Easing.linear);
  
    // this.intervalId = setInterval(
    //   () => this.circularProgress.reAnimate(0,100, 3000,Easing.linear),
    //   30000
    // );
  }
  
  componentWillUnmount() {
    clearInterval(this.intervalId);
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


  makeCircleButton = () => {
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

    console.log('oStudentTiles =>', oStudentTiles, 'this.props.titles', this.props.titles);
    //initial form
    if (this.props.tiles.length == 0) {
      console.log('make progress circle');
      return (
        <TouchableOpacity onPress={() => this.props.getLoginTiles()}>
          {/* <Image source={homeImg} style={styles.homeImg} /> */}
          <AnimatedCircularProgress
              size={100}
              width={15}
              fill={100}

              //size={60}
              style={styles.progressIndicator}
              //width={1}
              ref={(ref) => this.circularProgress = ref}
              //fill={0}
              tintColor="#00e0ff"
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#3d5875"
            >
            {
              (fill) => (
                <Text style={styles.points}>{Math.round((MAX_POINTS * fill) / 100)} %</Text>
              )
            }
        </AnimatedCircularProgress>
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
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
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
          <Image source={countryImages[item.language].img} style={styles.countryStyle}/>
          </TouchableOpacity>
          <Text style={{color: 'white', fontSize: 20}}>{countryImages[item.language].title}</Text>
          </View>
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
        // <View style={styles.welcomeWrapper}>
        //   <ImageBackground source={homeBg}
        //     style={{resizeMode: 'cover', width:'100%', height:'100%', alignItems: 'center', justifyContent: 'center'}}>
        //       <Image source={classonaLetterLogo} style={styles.logo} />
        //       {this.makeTeacherButton()}
        //       {this.makeCircleButton()}
        //   </ImageBackground>
        // </View>

        <ImageBackground
        source={homeBg}
        style={[styles.container, {resizeMode: 'cover', height:'100%'}]}>
            <View style={styles.overlay}>
              <Image source= {classonaLetterLogo}
                    style={styles.avatarStyle}/>
              <View style={{flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',}}>
                {this.makeTeacherButton()}
                {this.makeCircleButton()}
              </View>
            </View>
        </ImageBackground>


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

