import React from 'react';
import {Image, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Router, Scene, Actions, Drawer } from 'react-native-router-flux';
import HomeTest from './screens/HomeTest';
import HomeForm from './screens/HomeForm';
import LoginForm from './components/login/LoginForm';
import SignUpForm from './components/login/SignUpForm';
import SignOutForm from './components//login/SignOutForm';

import ClassList from './components/MyClass/ClassList';
import MediaList from './components/MyClass/MediaList';
import ClassPlayer from './components/MyClass/ClassPlayer';
import ClassNoteList from './components/MyClass/ClassNoteList';
import ClassNoteEdit from './components/MyClass/ClassNoteEdit';


import SideMenu from './components/SideMenu';
import SortClass from './components/SortClass';
import MyWord from './components/MyWord';

import MyPhraseEdit from './components/MyPhrase/MyPhraseEdit';
import MyPhrasePlay from './components/MyPhrase/MyPhrasePlay';
import PhraseList from './components/MyPhrase/PhraseList';

import MyPlanHistory from './components/MyPlan/MyPlanHistory';
import MyPlanList from './components/MyPlan/MyPlanList';
import MyBookmarkList from './components/MyBookmark/MyBookmarkList';
import ClassRecorder from './components/ClassRecorder';
import LabSettings from './components/Settings/LabSettings';


const RouterComponent = () => {
    return (
        <Router>
            <Scene key="root" hideNavBar>
                <Scene key="auth">
                    <Scene key="home" hideNavBar component={HomeForm} title="Home"  initial/>
                    <Scene key="login" component={LoginForm} title="Please Login" />
                    <Scene key="signup" component={SignUpForm} title="Sign Up"  />
                </Scene>

                <Scene key="mainContainer">
                    <Drawer
                        initial
                        key="main"
                        drawer
                        contentComponent={SideMenu}
                        drawerPosition='left'
                        hideNavBar
                        >

                        <Scene key="classModal" modal direction="vertical" drawerIcon={() => <Image style={{width:40, height:40}} source={require('./img/hamburger.png')}></Image>}
                            hideNavBar>
                            
                            <Scene key="classTabBar" tabs>
                                <Scene 
                                    initial                    
                                    key="classList" 
                                    component={ClassList} 
                                    title="Class List"
                                    icon={() => <Image style={styles.tabBar} source={require('./img/Class.png')}></Image>} 

                                    renderRightButton={
                                        <TouchableOpacity onPress={ () => Actions.ClassSort() }>
                                            <Image style={styles.buttonRight} source={require('./img/button_filter.png')}></Image>
                                        </TouchableOpacity>
                                    }
                                />

                                {/* <Scene icon={() => <Image style={styles.tabBar} source={require('./img/Calendar.png')}></Image>} key="mySchedule" component={MyWord} title="Schedule" hideNavBar/> 
                                <Scene icon={() => <Image style={styles.tabBar} source={require('./img/Bulletin.png')}></Image>} key="myBulletin" component={MyWord} title="Bulletin" hideNavBar/>  */}
                                <Scene icon={() => <Image style={styles.tabBar} source={require('./img/bookmark.png')}></Image>} key="MyBookmark" direction="vertical" component={MyBookmarkList} title='Bookmarks' />

                            </Scene>
                        </Scene> 
                    </Drawer>

                    <Scene key="classItem" title="Class" component={ClassPlayer}
                        renderRightButton={
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <TouchableOpacity onPress={ () => Actions.MediaList() }>
                                    <Image style={styles.buttonRight} source={require('./img/tracks.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ () => Actions.ClassNoteList() }>
                                    <Image style={styles.buttonRight} source={require('./img/Bulletin.png')}></Image>
                                </TouchableOpacity>

                            </View>
                        }
                    />
                    <Scene key="ClassNoteList" title='Class Information' component={ClassNoteList}/>
                    <Scene key="ClassNoteEdit" title='Class Note' component={ClassNoteEdit}/>

                    <Scene key="ClassRecorder" title="Private Class" component={ClassRecorder}
                    />
                </Scene>

                <Scene key="ClassSort" modal direction="vertical" 
                        component={SortClass}
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
                <Scene key="myPlanHistory" direction="vertical" component={MyPlanHistory} title='My Plan' />
                <Scene key="myPlanList" direction="vertical" component={MyPlanList} title='Plan' />
                
                {/* <Scene key="MyBookmark" direction="vertical" component={MyBookmarkList} title='Bookmark List' /> */}
                

                <Scene key="modal" modal direction="vertical" 
                        renderLeftButton={
                            <TouchableOpacity onPress={ () => Actions.pop() }>
                                <Image style={styles.buttonLeft} source={require('./img/hamburger.png')}></Image>
                            </TouchableOpacity>
                        }
                        renderRightButton={
                            <TouchableOpacity onPress={ () => Actions.myPhraseEdit({phraseSource: 'manualWord'}) }>
                                <Image style={styles.buttonRight} source={require('./img/plus.png')}></Image>
                            </TouchableOpacity>
                        } >
                    <Scene key="tabBar" tabs>
                        <Scene bookmark={false} icon={() => <Image style={styles.tabBar} source={require('./img/MyWord.png')}></Image>} key="myPhrase" component={PhraseList} title="My Phrase" hideNavBar onEnter={()=> {Actions.refresh({enterTime:new Date()})}} />
                        <Scene bookmark={true} icon={() => <Image style={styles.tabBar} source={require('./img/MyBookmark.png')}></Image>} key="LabBookmark" component={PhraseList} title="Bookmark" hideNavBar onEnter={()=> {Actions.refresh({enterTime:new Date()})}} /> 
                        {/* <Scene icon={() => <Image style={styles.tabBar} source={require('./img/MyNotebook.png')}></Image>} key="MyNotebook" component={MyWord} title="Notebook" hideNavBar/>
                        <Scene icon={() => <Image style={styles.tabBar} source={require('./img/MySharing.png')}></Image>} key="MySharing" component={MyWord} title="Sharing" hideNavBar />
                        <Scene icon={() => <Image style={styles.tabBar} source={require('./img/MyAdvice.png')}></Image>} key="MyAdvice" component={MyWord} title="Advice" hideNavBar /> */}
                        <Scene icon={() => <Image style={styles.tabBar} source={require('./img/MyDictionarySetting.png')}></Image>} key="MyDictionarySetting" component={LabSettings} title="Setting" hideNavBar />
                    </Scene>
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
