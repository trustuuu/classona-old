import firebase from 'firebase';
//require("firebase/firestore");

import { PROFILE_FETCH, PROFILE_UPDATE,
         PROFILE_DOING, PROFILE_SUCCESS,
         PROFILE_ERROR, PROFILE_TEXT_CHANGE } from './types';
import { Actions } from 'react-native-router-flux';


export const getProfile = () => {
    return (dispatch) => {

        dispatch({type: PROFILE_DOING});
        
        const user = firebase.auth().currentUser;

        user.reload().then(() => {
            const refreshUser = firebase.auth().currentUser;
            dispatch({type: PROFILE_FETCH, payload:refreshUser});
            // do your stuff here
            //dispatch({type: PROFILE_SUCCESS, payload:refreshUser});
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('getting profile error', error, errorCode, errorMessage);
            dispatch({type: PROFILE_ERROR, payload:errorMessage});
        })
    };
};

export const updateProfile = (newUser) => {
    return (dispatch) => {

        dispatch({type: PROFILE_DOING});
        
        const user = firebase.auth().currentUser;
        user.reload().then(() => {
            const refreshUser = firebase.auth().currentUser;
            refreshUser.updateProfile({
                displayName: newUser.displayName, // some displayName,
                photoURL: newUser.photoURL,// some photo url
                //phoneNumber: newUser.phoneNumber
            })
            .then((s)=> {
                Actions.pop();
                dispatch({type: PROFILE_UPDATE, payload:refreshUser});
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('UPDATE profile error', error, errorCode, errorMessage);
                dispatch({type: PROFILE_ERROR, payload:errorMessage});
            })
            // do your stuff here
            //dispatch({type: PROFILE_SUCCESS, payload:refreshUser});
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('getting profile error', error, errorCode, errorMessage);
            dispatch({type: PROFILE_ERROR, payload:errorMessage});
        })
        
    };
};

export const textChange = (event) => {
    return (dispatch) => {
    dispatch ({
        type: PROFILE_TEXT_CHANGE,
        payload: event
    })
    }
};