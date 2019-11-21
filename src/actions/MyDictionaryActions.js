import firebase from 'firebase';
//import '@firebase/auth';
import { MY_WORD, 
    WORD_CHANGE, 
    DESCRIPTION_CHANGE, 
    GET_ALL_MY_PHRASES, 
    DELETE_MY_PHRASES, 
    SUCCESS_MY_PHRASES,
    MY_DICTIONARY_SETTING_SUCCESS,
    GET_ALL_MY_DICTIONARY_SETTING,
    MY_DICTIONARY_FIRST_LANGUAGE_CHANGE,
    MY_DICTIONARY_FIRST_VOICE_CHANGE,
    MY_DICTIONARY_VOICE_CHANGE,
    MY_DICTIONARY_LANGUAGE_CHANGE,
    TEXT_CHANGE, EDIT_MY_PHRASES,
    CHANGE_MY_PHRASES_BOOKMARK, GET_BOOKMARK_MY_PHRASES } from './types';

import { Actions } from 'react-native-router-flux';
import {accountPath} from '../helpers/utils';
import global from '../helpers/global.js';

// const accountPath = () => {
//     const {currentUser} = firebase.auth();
//     return `/users/${currentUser.email}`;
// }

export const copyToMyWord = (phrase) => { //(media, startSecs, phrase, description, bookmark) => {
    return (dispatch) => {
        dispatch ({
            type: MY_WORD,
            payload: phrase,
            //payload: {media, startSecs, phrase, description, bookmark}
        })
        Actions.myPhraseEdit();
    }
};

export const editToMyWord = (phrase) => { //(media, startSecs, phrase, description, bookmark) => {
    console.log('editToMyWord', phrase);
    return (dispatch) => {
        dispatch ({
            type: MY_WORD,
            payload: phrase
            //payload: {media, startSecs, phrase, description, bookmark}
        })
        Actions.myPhraseEdit({phraseSource: 'editToMyWord'}) ;
    }
};

export const goToMyPhrasePlay = (phrase) => { //(media, startSecs, phrase, description, bookmark) => {
    return (dispatch) => {
    dispatch ({
        type: MY_WORD,
        payload: phrase
        //payload: {media, startSecs, phrase, description, bookmark}
    })
    Actions.myPhrasePlay();
    }
};

export const textChangeAction = (event) => {
    return (dispatch) => {
    dispatch ({
        type: TEXT_CHANGE,
        payload: event
    })
    }
};

export const wordChangeAction = (phrase) => {
    return (dispatch) => {
    dispatch ({
        type: WORD_CHANGE,
        payload: phrase
    })
    }
};

export const descriptionChangeAction = (description) => {
    return (dispatch) => {
    dispatch ({
        type: DESCRIPTION_CHANGE,
        payload: description
    })
    }
};


export const addMyPhraseToDictionary = (phrase, description, media) => {
    
    return (dispatch) => {
        var db = firebase.firestore();
        const phraseKey = Date.now();
        const oPhrase = {phraseKey, phrase, description, media, startSecs: 0, bookmark:false}
        console.log('phraseKey', phraseKey);
        db.doc(`${accountPath()}/dictionary/phrase/${global.class}/${phraseKey}`).set({
            phrase: phrase,
            description: description,
            media: media,
            bookmark: false
        })
        .then(
        () => {
            dispatch({type: SUCCESS_MY_PHRASES, payload: oPhrase})
            Actions.pop();
        },
        (error) => {
                console.error("error", error);
            }
        )
    }
}

export const addWordToDictionary = (oPhrase) => { //(media, startSecs, phrase, description) => {
    console.log('addWordToDictionary', oPhrase);
    return (dispatch) => {
        var db = firebase.firestore();
        const {phrase, description, startSecs, media, bookmark} = oPhrase;
        const phraseKey = `${accountPath()}/dictionary/phrase/${global.class}/${media}-${startSecs}`;

        oPhrase.phraseKey = phraseKey;

        db.doc(phraseKey).set({
            phrase: phrase,
            description: description,
            startSecs: startSecs,
            media: media,
            bookmark: false
        })
        .then(
        () => {
            dispatch({type: SUCCESS_MY_PHRASES, payload: oPhrase})
            Actions.pop();
        },
        (error) => {
                console.error("error", error);
            }
        )
    }
}

export const editMyPhrase = (oPhrase) => {
    const {phraseKey, phrase, description, media, bookmark} = oPhrase;
    return (dispatch) => {
        var db = firebase.firestore();
        const path = `${accountPath()}/dictionary/phrase/${global.class}/${phraseKey}`;
        console.log('editMyPhrase path', path, oPhrase);
        db.doc(path).update({
            phrase: phrase,
            description: description,
            media: media,
            bookmark: bookmark
        })
        .then(
        () => {
            dispatch({type: EDIT_MY_PHRASES, payload: oPhrase}); //{id: phraseKey, media: media, phrase: phrase, description: description, bookmark: bookmark}});
            Actions.pop();
        },
        (error) => {
                console.error("error", error);
            }
        )
    }
}

export const setMyPhraseBookmark = (phraseKey, bookmark) => {
    
    return (dispatch) => {
        var db = firebase.firestore();
        db.doc(`${accountPath()}/dictionary/phrase/${global.class}/${phraseKey}`).update({
            bookmark: bookmark
        })
        .then(
        () => {
            dispatch({type: CHANGE_MY_PHRASES_BOOKMARK, payload: {phraseKey: phraseKey, bookmark:bookmark}});
            //Actions.pop();
        },
        (error) => {
                console.error("error", error);
            }
        )
    }
}


export const getAllMyPhrases = () => {

    return(dispatch) => {
        let db = firebase.firestore();
        let phrases = [];
        // Valid options for source are 'server', 'cache', or
        // 'default'. See https://firebase.google.com/docs/reference/js/firebase.firestore.GetOptions
        // for more information.
        let getOptions = {
            source: 'server'
        };

        //db.doc(`${accountPath()}/dictionary/phrase`).collection(global.class).doc(phraseKey).set({
        db.collection(`${accountPath()}/dictionary/phrase/${global.class}`).get()
        .then(
            (querySnapshotPhrases) => {
                querySnapshotPhrases.forEach((docPhrase) =>{

                    let phrase = docPhrase.data();
                    const media = docPhrase.id.split('-')[0];
                    const startSecs = docPhrase.id.split('-')[1];
                    phrases.push({phraseKey: docPhrase.id, media: media, startSecs: parseFloat(startSecs), phrase: phrase.phrase, description: phrase.description, bookmark: phrase.bookmark});
                }
            );

            dispatch({type: GET_ALL_MY_PHRASES, payload: phrases});

        },
        (error) => {
            console.error("error", error);
        }
    );
    };

};

export const getMyPhrasesBookmark = () => {
console.log('getMyPhrasesBookmark');
    return(dispatch) => {
        let db = firebase.firestore();
        let phrases = [];
        // Valid options for source are 'server', 'cache', or
        // 'default'. See https://firebase.google.com/docs/reference/js/firebase.firestore.GetOptions
        // for more information.
        var getOptions = {
            source: 'server'
        };

        let myPhrases = db.collection(`${accountPath()}/dictionary/phrase/${global.class}`);
        let query = myPhrases.where("bookmark", "==", true);
        query.get()
        .then(
            (querySnapshotPhrases) => {
                querySnapshotPhrases.forEach((docPhrase) =>{

                    let phrase = docPhrase.data();
                    const media = docPhrase.id.split('-')[0];
                    const startSecs = docPhrase.id.split('-')[1];
                    phrases.push({phraseKey: docPhrase.id, media: media, startSecs: parseFloat(startSecs), phrase: phrase.phrase, description: phrase.description, bookmark: phrase.bookmark});
                }
            );
            
            dispatch({type: GET_BOOKMARK_MY_PHRASES, payload: phrases});

        },
        (error) => {
                    console.error("error", error);
        }
    );
    };

};

export const deleteMyPhrase = (phraseKey) => {
    return(dispatch) => {

        var db = firebase.firestore();
        //console.log('phraseKey', phraseKey);
        db.collection(`${accountPath()}/dictionary/phrase/${global.class}`).doc(phraseKey).delete()
        .then(function() {
            console.log("Document successfully deleted!");
            dispatch({type: DELETE_MY_PHRASES, payload: phraseKey});
        })
        .catch(function(error) {
            console.error("Error removing document: ", error);
        });

    }

}

export const switchVoice = (voice) => {
    console.log('switchVoice ->', voice);
    return (dispatch) => {
        dispatch({type: MY_DICTIONARY_VOICE_CHANGE, payload: voice});
    }
}

export const switchFirstLanguageVoice = (voice) => {
    console.log('switchVoice ->', voice);
    return (dispatch) => {
        dispatch({type: MY_DICTIONARY_FIRST_VOICE_CHANGE, payload: voice});
    }
}

export const switchLanguage = (lang) => {
    console.log('switchLanguage ->', lang);
    return (dispatch) => {
        dispatch({type: MY_DICTIONARY_LANGUAGE_CHANGE, payload: lang});
    }
}

export const switchFirstLanguage = (lang) => {
    console.log('switchVoice ->', lang);
    return (dispatch) => {
        dispatch({type: MY_DICTIONARY_FIRST_LANGUAGE_CHANGE, payload: lang});
    }
}


export const getTTSSetting = () => {
    const {currentUser} = firebase.auth();

    return(dispatch) => {
        var db = firebase.firestore();
        // Valid options for source are 'server', 'cache', or
        // 'default'. See https://firebase.google.com/docs/reference/js/firebase.firestore.GetOptions
        // for more information.
        var getOptions = {
            source: 'server'
        };
        let languages = [];
        //console.log('getTTSSetting');

        const docRef = db.collection("users").doc(`${currentUser.email}`)
        docRef.get().then(
            (emailSnapshot) => {
                const userSetting = emailSnapshot.data();
                console.log('doc', emailSnapshot, userSetting);
                const firstLanguage = userSetting.firstLanguage;
                const firstLanguageVoice = userSetting.firstLanguageVoice;

                db.collection(`${accountPath()}/languages`).doc(global.class).get()
                .then(
                    (querySnapshot) => {
                        //querySnapshot.forEach((doc) =>{
                        //    languages.push({id: doc.voice, language: doc.language});                    
                        //});
                        const languageDoc = querySnapshot.data();
                        dispatch({type: GET_ALL_MY_DICTIONARY_SETTING, 
                        payload: {'firstLanguage': firstLanguage, 'firstLanguageVoice': firstLanguageVoice
                        , 'language': languageDoc.language, 'voice': languageDoc.voice,
                        'interval': languageDoc.interval == undefined ? "3" : languageDoc.interval, 'play': languageDoc.play == undefined ? 'phrase':languageDoc.play}});

                    },
                    (error) => {console.error("error", error)}
                );

            },
            (error) => { console.error("error", error)}
        )

    };
}

export const saveTTSSetting = (TTS) => {
    console.log('saveTTS', TTS);

    const {firstLanguage, firstLanguageVoice, language, voice, myClass, interval, play} = TTS;

    return (dispatch) => {
        var db = firebase.firestore();
        db.doc(`${accountPath()}/languages/${myClass}`).set({
            "voice": voice,
            "language": language,
            'interval': interval == undefined ? "3" : interval,
            'play': play })
        .then(
            () => {
            db.doc(`${accountPath()}`).set({
                "firstLanguage": firstLanguage, "firstLanguageVoice": firstLanguageVoice})
            .then(
            () => {
                dispatch({type: MY_DICTIONARY_SETTING_SUCCESS})
                Actions.pop();
            },
            (error) => {
                    console.error("error", error);
                }
            )
        },
        (error) => {
                console.error("error", error);
            }
        )
    }
}
