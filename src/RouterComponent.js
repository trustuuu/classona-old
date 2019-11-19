import React from 'react';
import {Image, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Router, Scene, Actions, Drawer } from 'react-native-router-flux';
import HomeTest from './screens/HomeTest';
import HomeForm from './screens/HomeForm';
import LoginForm from './components/login/LoginForm';
import SignUpForm from './components/login/SignUpForm';


const RouterComponent = () => {
    return (
        <Router>
            <Scene key="root" hideNavBar>
                    <Scene key="home" hideNavBar component={HomeForm} title="Home"  initial/>
                    <Scene key="login" component={LoginForm} title="Please Login" />
                    <Scene key="signup" component={SignUpForm} title="Sign Up"  />
            </Scene>
        </Router>
    );
};

const TabIcon = ({ selected, title }) => {
  return (
    <Text style={{color: selected ? 'white' :'#464646'}}>{title}</Text>
  );
}

const styles = StyleSheet.create({
   
   buttonLeft: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
   buttonRight: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  tabBar: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
});
export default RouterComponent;
