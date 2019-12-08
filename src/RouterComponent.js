import React from 'react';
import {Image, View, Text, StyleSheet, TouchableOpacity, TouchableHighlight} from 'react-native';
import { Router, Scene, Actions, Drawer, Tabs } from 'react-native-router-flux';
import HomeTest from './screens/HomeTest';
import HomeForm from './screens/HomeForm';
import LoginForm from './components/login/LoginForm';

import SignUp1 from './components/SignUp/SignUp1';
import SignUp2 from './components/SignUp/SignUp2';
import SignUp3 from './components/SignUp/SignUp3';

import SignOutForm from './components//login/SignOutForm';

import ClassList from './components/MyClass/ClassList';
import MediaList from './components/MyClass/MediaList';
import ClassPlayer from './components/MyClass/ClassPlayer';
import ClassNoteList from './components/MyClass/ClassNoteList';
import ClassNoteEdit from './components/MyClass/ClassNoteEdit';


import SideMenu from './components/SideMenu';
import SortClass from './components/MyClass/SortClass';
import MyWord from './components/MyWord';

import MyPhraseEdit from './components/MyPhrase/MyPhraseEdit';
import MyPhrasePlay from './components/MyPhrase/MyPhrasePlay';
import PhraseList from './components/MyPhrase/PhraseList';

import ProfileSettings from './components/Settings/ProfileSettings';
import ProfileSettingsEdit from './components/Settings/ProfileSettingsEdit';


import MyPlanHistory from './components/MyPlan/MyPlanHistory';
import MyPlanList from './components/MyPlan/MyPlanList';

import MyLanguageList from './components/MyLanguage/MyLanguageList';

import MyBookmarkList from './components/MyBookmark/MyBookmarkList';
import ClassRecorder from './components/MyClassRecord/ClassRecorder';
import LabSettings from './components/Settings/LabSettings';

import colors from './styles/colors'

const RouterComponent = () => {
    return (
        <Router>
            <Scene key="root" hideNavBar>
                <Scene key="auth">
                    <Scene key="home" hideNavBar component={HomeForm} title="Home"  initial/>
                    <Scene key="login" hideNavBar component={LoginForm} title="Please Login" />
                    <Scene key="signUp1" hideNavBar component={SignUp1} title="Sign Up"  />
                    <Scene key="signUp2" hideNavBar component={SignUp2} title="Sign Up"  />
                    <Scene key="signUp3" hideNavBar component={SignUp3} title="Sign Up"  />
                </Scene>

                <Scene key="mainContainer">
                    <Drawer
                        initial
                        key="main"
                        //drawer
                        contentComponent={SideMenu}
                        drawerPosition='left'
                        drawerWidth={200}
                        hideNavBar
                        //navigationBarStyle = {{backgroundColor: '#405CE5'}}
                        >

                        <Scene key="classModal" //modal direction="vertical" 
                            drawerIcon={() => <Image style={{width:16, height:16}} source={require('./img/hamburger.png')}></Image>}
                            hideNavBar
                            >
                            
                            <Tabs key="classTabBar" //tabs
                                //hideTabBar
                                //swipeEnabled
                                tabBarStyle={{backgroundColor: colors.tabBGColor, height:50}} 
                                showLabel={false}

                                //inactiveBackgroundColor = {{backgroudColor: 'white'}}
                                //tabtyle = {{backgroudColor: '#405CE5'}}
                            >
                                <Scene 
                                    initial                    
                                    key="classList" 
                                    component={ClassList} 
                                    title="Class List"
                                    navigationBarStyle = {{backgroundColor: colors.homeBlue}}
                                    titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                                    icon={() => <Image style={styles.tabBar} source={require('./img/classTab.png')}></Image>} 
                                    renderRightButton={
                                        <TouchableOpacity onPress={ () => Actions.ClassSort() }>
                                            <Image style={styles.buttonRight} source={require('./img/button_filter.png')}></Image>
                                        </TouchableOpacity>
                                    }
                                />

                                {/* <Scene icon={() => <Image style={styles.tabBar} source={require('./img/Calendar.png')}></Image>} key="mySchedule" component={MyWord} title="Schedule" hideNavBar/> 
                                <Scene icon={() => <Image style={styles.tabBar} source={require('./img/Bulletin.png')}></Image>} key="myBulletin" component={MyWord} title="Bulletin" hideNavBar/>  */}
                                <Scene
                                    navigationBarStyle = {{backgroundColor: colors.homeBlue}}
                                    titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                                    icon={() => <Image style={styles.tabBar} source={require('./img/bookmarkTab.png')}></Image>} 
                                    key="MyBookmark" direction="vertical" component={MyBookmarkList} title='Bookmarks'
                                />

                            </Tabs>
                        </Scene> 
                    </Drawer>

                    <Scene key="classItem" title="Class" component={ClassPlayer}
                            navigationBarStyle = {{backgroundColor: colors.homeBlue}}
                            titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                            renderRightButton={
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <TouchableOpacity onPress={ () => Actions.MediaList() }>
                                    <Image style={styles.buttonRight} source={require('./img/tracks.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ () => Actions.ClassNoteList() }>
                                    <Image style={styles.buttonRight} source={require('./img/trackInfo.png')}></Image>
                                </TouchableOpacity>

                            </View>
                        }
                    />
                    <Scene key="ClassNoteList" title='Class Information' component={ClassNoteList}
                            navigationBarStyle = {{backgroundColor: colors.homeBlue}}
                            titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                            //leftButtonTextStyle={{color:colors.white}}
                            //navBarButtonColor={{color:colors.white}}
                    />
                    <Scene key="ClassNoteEdit" title='Class Note' component={ClassNoteEdit}
                            navigationBarStyle = {{backgroundColor: colors.homeBlue}}
                            titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                    />

                    <Scene key="myPlanHistory" component={MyPlanHistory} title='My Plan'
                            navigationBarStyle = {{backgroundColor: colors.homeBlue}}
                            titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                    />

                    <Scene key="myPlanList"  component={MyPlanList} title='New Plan'
                            navigationBarStyle = {{backgroundColor: colors.homeBlue}}
                            titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                    />
                    
                    <Scene key="myLanguageList"  component={MyLanguageList} title='My Language'
                            navigationBarStyle = {{backgroundColor: colors.homeBlue}}
                            titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                    />


                    <Scene key="ClassRecorder" title="Private Class" component={ClassRecorder}
                            navigationBarStyle = {{backgroundColor: colors.homeBlue}}
                            titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                    />
                </Scene>

                <Scene key="ClassSort" modal direction="vertical" 
                        component={SortClass}
                        title='Sorting / Filter'
                        //titleStyle={{fontFamily: 'GillSans-SemiBold'}}
                        renderLeftButton={
                        <TouchableOpacity onPress={ () => Actions.pop() }>
                            <Image style={styles.buttonLeft} source={require('./img/hamburger.png')}></Image>
                        </TouchableOpacity>
                    } 
                />

                <Scene key="signOutFormModal" component={SignOutForm} title="Sign Out" />
                <Scene key="myWordModal" direction="vertical" component={MyWord} title='My Word' />
                <Scene key="myPhraseEdit" direction="vertical" component={MyPhraseEdit} title='My Phrase' />
                <Scene key="myPhrasePlay" direction="vertical" component={MyPhrasePlay} title='My Phrase' />
                <Scene key="MediaList" direction="vertical" component={MediaList} title='Track List' />

                <Scene key="profileSettings" direction="vertical" component={ProfileSettings} title='My Profile' />
                <Scene key="profileSettingsEdit" direction="vertical" component={ProfileSettingsEdit} title='My Profile Edit' />

                {/* <Scene key="MyBookmark" direction="vertical" component={MyBookmarkList} title='Bookmark List' /> */}
                

                <Scene key="modal" navigationBarStyle = {{backgroundColor: '#405CE5'}} //modal direction="vertical" 
                        renderLeftButton={
                            <TouchableOpacity onPress={ () => Actions.pop() }>
                                <Image style={styles.buttonLeft} source={require('./img/hamburger.png')}></Image>
                            </TouchableOpacity>
                        }
                        renderRightButton={
                            <TouchableHighlight style={{borderRadius:25, borderWidth:2, height:25, width:25, borderColor:'white', marginRight:10, 
                                                        flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}
                                                        onPress={ () => Actions.myPhraseEdit({phraseSource: 'manualWord'}) }>
                                <Text style={{alignItems:'center', color:'white', fontWeight:'bold'}}>+</Text>
                               {/* <Image style={styles.buttonRight} source={require('./img/plus.png')}></Image> */}
                            </TouchableHighlight> }
                >

                    <Tabs key="tabBar" tabBarStyle={{backgroundColor: colors.tabBGColor, height:50}} 
                                showLabel={false} hideNavBar>

                        <Scene navigationBarStyle = {{backgroundColor: colors.navBarHeader}} bookmark={false}
                                titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                                icon={() => <Image style={styles.tabBar} source={require('./img/myPhrase.png')}></Image>}
                                key="myPhrase" component={PhraseList} title="My Phrase"  
                                onEnter={()=> {Actions.refresh({enterTime:new Date()})}} />

                        <Scene navigationBarStyle = {{backgroundColor: colors.navBarHeader}} bookmark={true}
                                titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                                icon={() => <Image style={styles.tabBar} source={require('./img/bookmarkTab.png')}></Image>}
                                key="LabBookmark" component={PhraseList} title="Bookmark"
                                onEnter={()=> {Actions.refresh({enterTime:new Date()})}} /> 

                        <Scene navigationBarStyle = {{backgroundColor: colors.navBarHeader}}
                                titleStyle={{ color: colors.white, textTransform: 'uppercase'}}
                                icon={() => <Image style={[styles.tabBar, {width:35}]} source={require('./img/MyDictionarySetting.png')}></Image>}
                                key="MyDictionarySetting" component={LabSettings} title="Setting"  />

                        {/* <Scene icon={() => <Image style={styles.tabBar} source={require('./img/MyNotebook.png')}></Image>} key="MyNotebook" component={MyWord} title="Notebook" hideNavBar/>
                        <Scene icon={() => <Image style={styles.tabBar} source={require('./img/MySharing.png')}></Image>} key="MySharing" component={MyWord} title="Sharing" hideNavBar />
                        <Scene icon={() => <Image style={styles.tabBar} source={require('./img/MyAdvice.png')}></Image>} key="MyAdvice" component={MyWord} title="Advice" hideNavBar /> */}

                    </Tabs>
                </Scene>
                
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
    width: 16,
    height: 16,
    marginLeft: 10,
  },
   buttonRight: {
    width: 23.78,
    height: 21.52,
    marginRight: 10,
  },
  tabBar: {
    width: 25,
    height: 35,
    marginTop: 10,
    //backgroundColor: colors.tabBGColor
  },
  tabBarBlue: {
    width: 25,
    height: 26,
    marginTop: 10,
    backgroundColor: colors.tabBGColor
  }
});
export default RouterComponent;
