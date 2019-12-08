import firebase from 'firebase';

import { EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER,
        SIGNOUT_USER_FAIL, SIGNOUT_USER_SUCCESS, LOGIN_USER_CHECK_FAIL, GET_ALL_MY_TILES } from './types';
import { Actions } from 'react-native-router-flux';
import {accountPath, instructorPath} from '../helpers/utils';
import global from '../helpers/global.js';

export const emailChangeAction = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChangeAction = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    }
};

export const signOutUser = () => {
    return (dispatch) => {
        firebase.auth().signOut()
        .then(() => signOutSuccess(dispatch))
        .catch((error) => {
            console.log(error);
            signOutFail(dispatch);
        })
    }
};

export const checkLoginUser = () => {
    return (dispatch) => {
        firebase.auth().onAuthStateChanged( (user ) => {
            if (user) {
                global.email = user.email.toLowerCase();
                console.log('checkLoginUser user => ', user, user.email.toLowerCase(), global.email);
                loginUserSuccess(dispatch, user)
            }else{
                console.log('loginUser failed');
                checkUserLoginFail(dispatch)
            }
        });
    }
};

export const getLoginTiles = () => {
    return (dispatch) => {
        firebase.auth().onAuthStateChanged( (user ) => {
            if (user) {
                global.email = user.email;
                console.log('getLoginTiles', user, global.email);
                const db = firebase.firestore();
                let tiles = [];
                let language = {};
                var getOptions = {
                    source: 'server'
                };

                db.collection(`${accountPath()}/languages`).get()
                .then(
                    (querySnapshot) => {
                        console.log('querySnapshot', querySnapshot, `${accountPath()}/languages`);
                        //if (querySnapshot !== undefined){
                            querySnapshot.forEach((doc) =>{

                                language = doc.data();
                                console.log('accountPath => ', language, doc);

                                if (language !== undefined){
                                    tiles.push({path: doc.id, language: language.language, type: 'student'});
                                }
                                else{
                                    tiles.push({path: 'blank', language: 'blank', type: 'blank'});
                                }
                            });
                        //}
                        console.log('tiles', tiles);
                    },
                    (error) => {
                        console.error("error", error);
                    }
                    
                )
                .then(() => {
                    const docRef = db.collection('instructors').doc(`${user.email}`)
                    docRef.get().then(
                        (doc) => {
                            language = doc.data();
                            console.log('teacher', language);
                            if (language !== undefined){
                                if (language.type == 'instructor') { tiles.push({path: language.classMeta, language: language.language, type: language.type})};

                            }
                            else{
                                tiles.push({path: 'blank', language: 'blank', type: 'blank'});
                            }

                            dispatch({type: GET_ALL_MY_TILES, payload: tiles});

                        },
                        (error) => {
                            console.error("error", error);
                        }
                    )
                })
                .catch((error) => {
                    console.log(error);
                    //firebase.auth().createUserWithEmailAndPassword(email, password)
                    //.then(user => loginUserSuccess(dispatch, user))
                    //loginUserFail(dispatch);
                })
            }else{
                checkUserLoginFail(dispatch)
            }
        });
    }
}

export const goTeacherScreen = () => {
    return (dispatch) => {
        firebase.auth().onAuthStateChanged( (user ) => {
            if (user) {
                loginUserSuccess(dispatch, user)
            }else{
                checkUserLoginFail(dispatch)
            }
        });
    }
};

export const loginUser = ( {email, password} ) => {
    return (dispatch) => {

        dispatch({type: LOGIN_USER});
        console.log('loginUser with', email, password);
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => {
            //global.user = email.toLowerCase();
            loginUserSuccess(dispatch, user)
        })
        .catch((error) => {
            console.log(error);
            //firebase.auth().createUserWithEmailAndPassword(email, password)
            //.then(user => loginUserSuccess(dispatch, user))
            loginUserFail(dispatch);
        })
    };
};


const checkUserLoginFail = (dispatch) => {
    dispatch ({
        type: LOGIN_USER_CHECK_FAIL
    })
    Actions.login();
}

const signOutFail = (dispatch) => {
    dispatch ({ type: SIGNOUT_USER_FAIL })
}

const signOutSuccess= (dispatch) => {
    dispatch ({ type: SIGNOUT_USER_SUCCESS})
    Actions.auth();
}

const loginUserFail = (dispatch) => {
    dispatch ({ type: LOGIN_USER_FAIL })
}

const loginUserSuccess = (dispatch, user) => {
    //console.log('loginUserSuccess', user, user.email);
    //global.user = user.email.toLowerCase();
    dispatch ({
        type: LOGIN_USER_SUCCESS,
        payload: user
    })

    Actions.mainContainer();
}
