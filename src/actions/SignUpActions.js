import firebase from 'firebase';

import { EMAIL_CHANGED, PASSWORD_CHANGED, SIGNUP_USER_SUCCESS, SIGNUP_USER_FAIL,
        SIGNUP_USER, PASSWORD_CONFIRM_CHANGED, SETUP_USER, DISPLAY_NAME_CHANGED } from './types';
import { Actions } from 'react-native-router-flux';
import {accountPath, instructorPath} from '../helpers/utils';

export const emailChangeSignUpAction = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const displayNameChangeSignUpAction = (text) => {
    return {
        type: DISPLAY_NAME_CHANGED,
        payload: text
    }
}

export const passwordChangeSignUpAction = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    }
};

export const passwordConfirmChangeSignUpAction = (text) => {
    return {
        type: PASSWORD_CONFIRM_CHANGED,
        payload: text
    }
};


export const setupUser = ( oUser ) => {
    return {
        type: SETUP_USER,
        payload: oUser
    }
};

export const signupUserAction = ( signupUser ) => {
    return (dispatch) => {

        dispatch({type: SIGNUP_USER});

        firebase.auth().createUserWithEmailAndPassword(signupUser.email, signupUser.password)
        .then(user => {

            const db = firebase.firestore();
            let userPath = '';
            let path = '';

            if (signupUser.userType == 'student') {
                userPath = accountPath(signupUser.email);
                path = `${userPath}/languages/${signupUser.classMeta}/`;
                

                db.doc(userPath).set( {firstLanguage: signupUser.motherLanguageVoiceCode, displayName:signupUser.displayName} )
                .then(
                    (docRef) => {
                        
                        db.doc(path).set({language:signupUser.voiceCode})
                        .then((langRef) => {
                                signupUserSuccess(dispatch, user)
                                user.sendEmailVerification();
                            })
                        .catch(function(error) {
                            console.log("language Adding Error: ", error);
                        });
                    }
                )
                .catch(function(error) {
                    console.log("user Adding Error: ", error);
                });
            }
            else {
                userPath = instructorPath(signupUser.email);
                path = `${userPath}/languages/${signupUser.classMeta}/`;

                db.doc(userPath).set({classMeta:signupUser.classMeta, type:signupUser.userType, displayName:signupUser.displayName})
                .then(
                    (docRef) => {
                        signupUserSuccess(dispatch, user)
                        user.sendEmailVerification();
                    })
                .catch(function(error) {
                    console.log("user Adding Error: ", error);
                });
            }

        })
        .catch((error) => {
            console.log(error);
            signupUserFail(dispatch);
        });
    };
};

// export const signupUserActionOld = ( {email, password} ) => {
//     return (dispatch) => {

//         dispatch({type: SIGNUP_USER});

//         firebase.auth().createUserWithEmailAndPassword(email, password)
//         .then(user => {
//                 signupUserSuccess(dispatch, user)
//                 user.sendEmailVerification();
//         })
//         .catch((error) => {
//             console.log(error);
//             signupUserFail(dispatch);
//         });
//     };
// };

const signupUserFail = (dispatch) => {
    dispatch ({ type: SIGNUP_USER_FAIL })
}
const signupUserSuccess = (dispatch, user) => {
    dispatch ({
        type: SIGNUP_USER_SUCCESS,
        payload: user
    })

    Actions.auth();
}