import firebase from 'firebase';
//require("firebase/firestore");
import languageDLearn from '../components/common/languageLearn.json';

import { LANGUAGE_FETCH, LANGUAGE_MY_FETCH, LANGUAGE_UPDATE, LANGUAGE_DELETE, LANGUAGE_ADD,
         LANGUAGE_DOING, LANGUAGE_SUCCESS, LANGUAGE_ERROR } from './types';
import { Actions } from 'react-native-router-flux';
import {accountPath, instructorPath} from '../helpers/utils';

export const getAllLanguages = () => {
    const {currentUser} = firebase.auth();

    return (dispatch) => {
        const db = firebase.firestore();
        const getOptions = {
            source: 'server'
        }

        let languages = [];
        console.log('getAllLanguages');

        db.collection("languages").get()
        .then(
            (querySnapshotPhrases) => {
                querySnapshotPhrases.forEach((docLang) =>{

                    let lang = docLang.data();
                    const classMeta = lang.classMeta;
                    const language = lang.language;
                    const description = lang.description;
                    const voiceCode = lang.voiceCode;
                    const label = lang.label;

                    languages.push(
                        {languageId: docLang.id, 
                            code: docLang.id, 
                            value: docLang.id, 
                            classMeta: classMeta, 
                            language: language, 
                            description: description, 
                            label: label,
                            voiceCode: voiceCode
                        });
                })
                console.log('getAllLanguages => ', languages);
                dispatch({type: LANGUAGE_FETCH, payload: languages});
            },
            (error) => {console.error("error", error)}
        )
    }
}

export const getMyLanguages = () => {
    //const {currentUser} = firebase.auth();

    return (dispatch) => {
        
        const db = firebase.firestore();
        const getOptions = {
            source: 'server'
        }

        let languages = [];
        db.collection(`${accountPath()}/languages`).get()
        .then(
            (querySnapshotPhrases) => {
                querySnapshotPhrases.forEach((docLang) =>{

                    let lang = docLang.data();
                    languages.push({languageId: docLang.id, language: lang.language});
                })
                dispatch({type: LANGUAGE_MY_FETCH, payload: languages});
            },
            (error) => {console.error("error", error)}
        )
    }
}

export const addMyLanguage = (language) => { 
    return (dispatch) => {
        var db = firebase.firestore();
        
        const myLangKey = `${accountPath()}/languages/${language.classMeta}`;
        console.log('myLangKey =>', myLangKey, language);
        db.doc(myLangKey).set({
            language: language.voiceCode
        })
        .then(
        () => {
            dispatch({type: LANGUAGE_ADD, payload: {languageId: language.classMeta, language:language.voiceCode}})
        },
        (error) => {
                console.error("error", error);
            }
        )
    }
}

export const deleteMyLanguage = (languageKey) => {
    return(dispatch) => {

        console.log('language delete', languageKey, accountPath());

        var db = firebase.firestore();
        //const languageKey = language.classMeta;
        db.collection(`${accountPath()}/languages`).doc(languageKey).delete()
        .then(function() {
            console.log("language successfully deleted!");
            dispatch({type: LANGUAGE_DELETE, payload: languageKey});
        })
        .catch(function(error) {
            console.error("Error removing document: ", error);
        });

    }
}

