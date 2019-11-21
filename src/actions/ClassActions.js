//import firebase from '@firebase/app';
import firebase from 'firebase';

import { Actions } from 'react-native-router-flux';
import { CLASS_ALL_FETCH, CALL_ALL_FETCH_SUCCESS, REMOVE_CLASS, 
ADD_MY_CLASS_BOOKMARK, GET_MY_CLASS_BOOKMARKS,
REMOVE_MY_CLASS_BOOKMARK, CLASS_ERROR, CLASS_DOING, SELECTED_CLASS,
CHANGE_SCRIPTS, UPDATE_SCRIPTS, UPDATE_POSITION, REMOVE_MY_CLASS_NOTE,
ADD_MY_CLASS_NOTE, GET_MY_CLASS_NOTES, NOTE_TEXT_CHANGE, UPDATE_CLASS_NOTE } from './types';
import { convertSecToDate, getMediaDetail } from '../helpers/utils';
import global from '../helpers/global.js';
import {accountPath, instructorPath} from '../helpers/utils';

require('firebase/functions');

export const deleteClassActions = (oClass) => {

    return(dispatch) => {

    console.log('deleteClassActions =>', oClass);

    const {currentUser} = firebase.auth();

    //console.log('deleteClassActions=>', oClass);
    getClassAsync(oClass.classId, currentUser.email, 'student', global.class)
    .then(userClass => {
            
            getClassAsync(oClass.classId, userClass.instructor, 'instructor', global.class)
            .then( instructorClass => {
                //userClass.items.forEach(item => console.log('item.filePath', item.filePath));
                var deleteFn = firebase.functions().httpsCallable('recursiveDelete');

                let path = `${accountPath()}/${global.class}/${oClass.classId}`;
                deleteFn({ path: path, currentUsers: currentUser.uid })
                    .then(function(result) {
                        console.log('Delete success: ' + JSON.stringify(result));

                        userClass.items.forEach(item => deleteStorageFile(item.filePath));

                        if (oClass.classId.indexOf('privateClass_') > -1)
                        {           
                            path = `${instructorPath()}/${global.class}/${oClass.classId}`;
                            //console.log('instructors', path);
                            deleteFn({ path: path, currentUsers: currentUser.uid })
                            .then((resule) => {
                                console.log('Delete success: ' + JSON.stringify(result));
                                dispatch({type: REMOVE_CLASS, payload: oClass});
                            });
                        }
                        else
                        {
                            if (instructorClass == null) {
                                dispatch({type: REMOVE_CLASS, payload: oClass});
                                return;
                            }
                            
                            let hasAttendant = true;
                            if (instructorClass.attendants)
                            {
                                const leftAttendants = instructorClass.attendants.filter(a => a.student.toLowerCase() != currentUser.email.toLowerCase());
                                console.log("leftAttendants", leftAttendants, 'instructorClass.attendants', instructorClass.attendants);
                                hasAttendant = (leftAttendants.length > 0) ? true : false;
                            }
                            else
                            {
                                hasAttendant = false;
                            }

                            if (!hasAttendant)
                            {
                                path = `${instructorPath(userClass.instructor)}/${global.class}/${oClass.classId}`;
                                console.log('instructors delete ', path);
                                deleteFn({ path: path, currentUsers: currentUser.uid })
                                .then((result) => {
                                    console.log('Delete success: ' + JSON.stringify(result));
                                    instructorClass.items.forEach(item => {
                                        deleteStorageFile(item.filePath);
                                        
                                        const classMediaPath = item.media.split('_').slice(1).join('_');
                                        deleteStorageFile(`${oClass.className}/${classMediaPath}`);
                                    });

                                    dispatch({type: REMOVE_CLASS, payload: oClass});
                                });
                            }
                            
                        }
                    })
                    .catch(function(err) {
                        console.log('Delete failed, see console,');
                        //console.warn(err);
                    });

            }) 
        })
        .catch(function(error) {
            console.log("Error: ", JSON.stringify(error));
            dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        });


    }
}

export const deleteClassInstructorActions = (oClass) => {

    return(dispatch) => {
    console.log('deleteClassInstructorActions =>', oClass);

    const {currentUser} = firebase.auth();
    //console.log('deleteClassActions=>', oClass);
        getClassAsync(oClass.classId, oClass.instructor, 'instructor', global.class)
        .then( instructorClass => {
            //userClass.items.forEach(item => console.log('item.filePath', item.filePath));
            var deleteFn = firebase.functions().httpsCallable('recursiveDelete');

            if (instructorClass == null) {
                dispatch({type: REMOVE_CLASS, payload: oClass});
                return;
            }
            
            let hasAttendant = true;
            if (instructorClass.attendants)
            {
                const leftAttendants = instructorClass.attendants.filter(a => a.student.toLowerCase() != currentUser.email.toLowerCase());
                //console.log("leftAttendants", leftAttendants, 'instructorClass.attendants', instructorClass.attendants);
                hasAttendant = (leftAttendants.length > 0) ? true : false;
                console.log('hasAttendant=>', hasAttendant);
            }
            else
            {
                hasAttendant = false;
            }

            if (!hasAttendant)
            {
                path = `${instructorPath(instructorClass.instructor)}/${global.class}/${oClass.classId}`;
                //console.log('instructors delete ', path);
                deleteFn({ path: path, currentUsers: currentUser.uid })
                .then((result) => {
                    console.log('Delete success: ' + JSON.stringify(result));
                    instructorClass.items.forEach(item => {
                        deleteStorageFile(item.filePath);
                        
                        const classMediaPath = item.media.split('_').slice(1).join('_');
                        deleteStorageFile(`${oClass.className}/${classMediaPath}`);
                    });

                    dispatch({type: REMOVE_CLASS, payload: oClass});
                });
            }

        })
        .catch(function(error) {
            console.log("Error: ", JSON.stringify(error));
            dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        });

    }
}

export const addClassBookmark = (classId, user, userType, classMeta, item, startSecs, category) => { 

    return async (dispatch, getState) => {
        dispatch({type:CLASS_DOING});
        const myUser = user == null ? firebase.auth().currentUser.email : user; 
        const myClassMeta = classMeta == undefined ? global.class : classMeta;
        const myClassId = typeof classId == 'object' ? classId.classId : classId;
        const myUserType = userType == undefined ? global.userType : userType;
        let oItem = {};

        const state = getState();
        if (state.oClass.bookmarks.filter(b => b.bookmarkId == classId).length > 0){
            const error = 'already bookmarked';
            dispatch({type:CLASS_ERROR, payload: error});
        }
        

        if (item == null)
        {
            const oItems = await getClassFilesAsync(classId, myUser, myUserType, classMeta);
            oItem = oItems[0];
        }
        else{
            oItem = item;
        }
        console.log('oItem', oItem);
        //`${myUser}/bookmarks/${classId}`

        addClassBookmarkAsync(myClassId, myUser, myUserType, myClassMeta, oItem, startSecs, category)
        .then((bookmark) => {
            dispatch({type: ADD_MY_CLASS_BOOKMARK, payload: bookmark})
            //Actions.pop();
        },
        (error) => {
                console.log("error", error);
                dispatch({type:CLASS_ERROR, payload: error});
            }
        )
        // .catch(function(error) {
        //     console.log("Error: ", error);
        //     console.log("Error2: ", JSON.stringify(error));
        //     dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        // });
    }
}

export const removeClassBookmark = (classId, user, userType) => { 

    return (dispatch) => {
        console.log('bookmark id=>', classId);
        dispatch({type:CLASS_DOING});
        const {currentUser} = firebase.auth();
        const myUser = user == null ? currentUser.email : user; 
        const path = (userType == 'instructor') ? instructorPath(myUser) : accountPath(myUser);
        const bookmarkPath = `${path}/bookmarks/${classId}`;
        let deleteFn = firebase.functions().httpsCallable('recursiveDelete');

        deleteFn({ path: bookmarkPath, currentUsers: currentUser.uid })
            .then(function(result) {
                dispatch({type: REMOVE_MY_CLASS_BOOKMARK, payload: classId})
            })
            .catch(function(error) {
                console.log("Error: ", JSON.stringify(error));
                dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        });
    }
}

export const getClassBookmarks = (user, userType, classMeta) => { 
    
    return (dispatch) => {
        dispatch({type:CLASS_DOING});
        const myUser = user == null ? firebase.auth().currentUser.email : user; 
        const myClassMeta = classMeta == undefined ? global.class : classMeta;

        getClassBookmarksAsync(myUser, userType, myClassMeta)
        .then(
        (bookmarks) => {
            dispatch({type: GET_MY_CLASS_BOOKMARKS, payload: bookmarks})
            //Actions.pop();
        },
        (error) => {
                console.log("error", error);
            }
        )
        .catch(function(error) {
            console.log("Error: ", JSON.stringify(error));
            dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        });
    }
}

const deleteStorageFile = async (filePath) => {
        try{
            const deleteRef = await firebase.storage().ref(filePath);
            await deleteRef.delete();
            console.log('storage file has been deleted', filePath);
        }
        catch(error)
        {
            console.log('delete files error', filePath, error);
        }
};

/*
classId : class id
userEmail: user email
userType: 'student' or 'instructor'
classMeta: current class language metabase for class.   example) english class created under 'classes' collection
*/
const getClassAsync = (classId, userEmail, userType, classMeta, bookmarks) => new Promise (
        function(resolve, reject) {
        let oClass = {};
        const myClassMeta = classMeta == undefined ? global.class : classMeta;

        getClassShallowAsync(classId, userEmail, userType, myClassMeta)
        .then( newClass => {
            if (newClass == null) {console.log('newClass null', newClass); resolve(newClass)};

            oClass = newClass;
            if (bookmarks !== undefined){
                const isBookmarked = bookmarks.filter(b => ((b.bookmarkId == oClass.classId) && (b.category == 'class'))).length > 0 ? true : false ;
                oClass.bookmark = isBookmarked;
            }
            console.log('getClassAsync=>', oClass, 'newClass', newClass);
            return getClassFilesAsync(oClass, userEmail, userType, classMeta, bookmarks);
        })
        .then (items => {
            console.log('script items', items);
            return getClassScriptsAsync(classId, oClass.instructor, classMeta, items, bookmarks)
        })
        .then( itemsWithScripts => {
            oClass.items = itemsWithScripts;
            //const instructorEmail = userType == "instructor" ? usreEmail : oClass.instructor;
            return getClassAttendantAsync(oClass.classId, oClass.instructor, classMeta);
        })
        .then( newAttendants => { 
                oClass.attendants = newAttendants;
                resolve(oClass);
                //return getClassScriptsAsync(oClass.classId, oClass.instructor, classMeta, oClass.items);
        })
        // .then( items => {
        //         oClass.items = items;
        //         console.log('oClass', oClass)
        //         resolve(oClass);
        // })
    }
)

/*
classId : class id
user: user email
userType: 'student' or 'instructor'
classMeta: current class language metabase for class.   example) english class created under 'classes' collection
*/
const getClassInfomationAsync = (classId, user, userType, classMeta, bookmarks) => new Promise(
    function (resolve, reject) {
        let path = (userType == 'instructor') ? instructorPath(user) : accountPath(user);
        const myClassMeta = classMeta == undefined ? global.class : classMeta;

        var db = firebase.firestore();
        let oClass = {};
        const docRef  = db.collection(`${path}/${myClassMeta}`).doc(classId);

        docRef.get()
        .then(
                (classSnapshot) => {
                    const docClass = classSnapshot.data();

                    const classSec = classSnapshot.id.split('_')[1];
                    const classDate = convertSecToDate(classSec).toLocaleString();
                    const className = docClass.className;
                    
                    oClass = {
                        key: classSnapshot.id,
                        classId: classSnapshot.id, 
                        className: docClass.className,
                        classSec: classSec,
                        classDate: classDate,
                        instructor: docClass.instructor,
                        instructorDisplayName: docClass.instructorDisplayName ? docClass.instructorDisplayName : docClass.instructor.split('@')[0],
                        institution: docClass.institution,
                    }

                    const items = [];
                    docRef.collection(`files`).get()
                    .then((querySnapshotFiles) => {
                        querySnapshotFiles.forEach((doc) => {
                            let item = doc.data();
                            let itemSeq = item.media.split('_')[item.media.split('_').length-1].split('.')[0];
                            if (isNaN(itemSeq)) itemSeq = item.media.split('_')[item.media.split('_').length-2].split('.')[0];

                            items.push({
                                seq: itemSeq,
                                        fileId: doc.id,
                                        className: docClass.className,
                                        classDate: classDate,
                                        classSec: classSec,
                                        instructor: docClass.instructor,
                                        instructorDisplayName: docClass.instructorDisplayName ? docClass.instructorDisplayName : docClass.instructor.split('@')[0],
                                        institution: docClass.institution,
                                        media: item.media,
                                        mediaUrl: null,
                                        filePath: `${user}/${doc.id}`
                            });
                        })
                        oClass = Object.assign({}, oClass, {items: items});
                        resolve(oClass);  
                    })
                    //,error => {console.log('error', error); reject(error)};
                    .catch(function(error) {
                        console.log("Error: ", error);
                        reject(error);
                    });
                }
        )
        .catch(function(error) {
            console.log("Error2: ", error);
            reject(error);
        });
    }
)

//db.collection(`/users/${currentUser.email}/classes`)
const getClassesShallowAsync = (user, bookmarks) => new Promise(
    function(resolve, reject){
        var db = firebase.firestore();

        const classMeta = global.class;
        const userType = global.userType; //'student';
        let myUser = user == undefined ? firebase.auth().currentUser.email : user;
        myUser = (userType == 'instructor') ? instructorPath(myUser) : accountPath(myUser);

        let classItems = [];
        const docRef = db.collection(`${myUser}/${classMeta}`);
        docRef.get()
        .then((querySnapshotClasses) => {
                querySnapshotClasses.forEach((docClass) =>{

                    let classItem = docClass.data();
                    const classSec = docClass.id.split('_')[1];
                    const classDate = convertSecToDate(classSec).toLocaleString();

                    let oClass = {
                            key: docClass.id,
                            classId: docClass.id, 
                            className: classItem.className,
                            classSec: classSec,
                            classDate: classDate,
                            instructorDisplayName: classItem.displayName ? classItem.displayName : classItem.instructor.split('@')[0] ,
                            instructor: classItem.instructor,
                            institution: classItem.institution,
                            bookmark: null,
                            items: []
                    }

                    if (bookmarks !== undefined){
                        const isBookmarked = bookmarks.filter(b => ((b.bookmarkId == oClass.classId) && (b.category == 'class'))).length > 0 ? true : false ;
                        oClass.bookmark = isBookmarked;
                    }

                    classItems.push(oClass);
            })
            resolve(classItems);
        })
        .catch(function(error) {
            console.log("Getting class shallow information error: ", error);
            reject(error);
        });
    }
)

const getClassShallowAsync = (classId, user, userType, classMeta) => new Promise(
    function(resolve, reject){

        if (typeof classId == 'object') resolve(classId);

        var db = firebase.firestore();

        const myClassMeta = classMeta == undefined ? global.class : classMeta;
        const myUserType = userType == undefined ? global.userType : userType; //'student';
        let myUser = user == undefined ? firebase.auth().currentUser.email : user;
        myUser = (myUserType == 'instructor') ? instructorPath(myUser) : accountPath(myUser);

        const docRef  = db.collection(`${myUser}/${myClassMeta}`).doc(classId);
        console.log('getClassShallowAsync docRef', `${myUser}/${myClassMeta}`, classId, myUserType, global.userType);
        docRef.get()
        .then((docClass) => {
            if (docClass.exists) {
                let classItem = docClass.data();
                const classSec = docClass.id.split('_')[1];
                const classDate = convertSecToDate(classSec).toLocaleString();
                console.log('classItem in getClassShallowAsync', classItem, docClass);
                const oClass = {
                        key: docClass.id,
                        classId: docClass.id, 
                        className: classItem.className,
                        classSec: classSec,
                        classDate: classDate,
                        instructorDisplayName: classItem.displayName ? classItem.displayName : classItem.instructor.split('@')[0] ,
                        instructor: classItem.instructor,
                        institution: classItem.institution,
                        bookmark: false,
                        items: []
                };
                resolve(oClass);
            }
            else{
                resolve(null);
            }
            
        })
        .catch(function(error) {
            console.log("Getting class shallow information error: ", error);
            reject(error);
        });
    }
)

const getClassFilesAsync = (classId, user, userType, classMeta, bookmark) => new Promise(
    function (resolve, reject) {
        const db = firebase.firestore();
        const myUserType = userType == undefined ? global.userType : userType;
        let path = (userType == 'instructor') ? instructorPath(user) : accountPath(user);
        const myClassMeta = classMeta == undefined ? global.class : classMeta;
        const myClassId = typeof classId === 'object' ? classId.classId : classId;

        let files = [];
        const docRef  = db.collection(`${path}/${myClassMeta}/${myClassId}/files`);
        docRef.get()
        .then((querySnapshotAttendants) => {
            querySnapshotAttendants.forEach((doc) => {
                const item = doc.data()
                //const itemSeq = item.media.split('_')[item.media.split('_').length-1].split('.')[0];
                const mediaInfo = getMediaDetail(item.media);

                if (typeof classId === 'object'){
                    const classSec = myClassId.split('_')[1];
                    const classDate = convertSecToDate(classSec).toLocaleString();

                    files.push({
                        seq: mediaInfo.itemSeq,
                        fileId: item.media,
                        media: item.media,
                        filePath: `${user}/${doc.id}`,
                        className: classId.className,
                        classDate: classDate,
                        classSec: classSec,
                        instructor: classId.instructor,
                        instructorDisplayName: classId.instructorDisplayName ? classId.instructorDisplayName : classId.instructor.split('@')[0],
                        institution: classId.institution,
                        mediaUrl: null,
                    });
                }
                else {
                    files.push({
                        seq: mediaInfo.itemSeq,
                        fileId: item.media,
                        media: item.media,
                        filePath: `${user}/${doc.id}`
                    });
                }
            })
            resolve(files);  
        })
        .catch(function(error) {
            console.log("Error: ", error);
            reject(error);
        });
    }
)

const getClassBookmarksAsync = (user, userType, classMeta) => new Promise(
    function (resolve, reject) {
        const db = firebase.firestore();
        let path = (userType == 'instructor') ? instructorPath(user) : accountPath(user);
        const myClassMeta = classMeta == undefined ? global.class : classMeta;

        let bookmarks = [];
        console.log('user getClassBookmarksAsync', path);
        const docRef  = db.collection(`${path}/bookmarks`).where("classMeta", "==", myClassMeta);
        docRef.get()
        .then((querySnapshotAttendants) => {
            querySnapshotAttendants.forEach((doc) => {
                const item = doc.data()
                bookmarks.push({
                    bookmarkId: doc.id,
                    classMeta: classMeta,
                    media: item.media,
                    className: item.className,
                    filePath: `${user}/${doc.id}`,
                    startSecs: item.startSecs,
                    category: item.category
                });
            })
            resolve(bookmarks);  
        })
        .catch(function(error) {
            console.log("Error: ", error);
            reject(error);
        });
    }
)

const addClassBookmarkAsync = (classId, user, userType, classMeta, item, startSecs, category) => new Promise(
    function (resolve, reject) {
        var db = firebase.firestore();
        let myUser = (userType == 'instructor') ? instructorPath(user) : accountPath(user);
        const myClassMeta = classMeta == undefined ? global.class : classMeta;

        const bookmarkId = `${myUser}/bookmarks/${classId}`;
        const bookmark = {
                    classMeta: myClassMeta,
                    media: item.media,
                    className: item.className,
                    filePath: `${user}/${classId}`,
                    startSecs: startSecs,
                    category: category //category: 'class', 'script'
                    }
        //console.log('bookmarkId', bookmarkId, bookmark);
        db.doc(bookmarkId).set(bookmark)
        .then(
        (docRef) => {
            //console.log("Bookmark Added:", docRef);
            const newBookmark = {...bookmark, bookmarkId: classId}
            resolve(newBookmark); 
        })
        .catch(function(error) {
            console.log("Bookmark Adding Error: ", error);
            reject(error);
        });
    }
)

/*
classId : class id
instructorEmail: instructor email
classMeta: current class language metabase for class.   example) english class created under 'classes' collection
*/
const getClassAttendantAsync = (classId, instructorEmail, classMeta) => new Promise(
    function (resolve, reject) {
        const myClassMeta = classMeta == undefined ? global.class : classMeta;
        const db = firebase.firestore();
        let attendants = [];
        const docRef  = db.collection(`${instructorPath(instructorEmail)}/${myClassMeta}/${classId}/attendants`);
        docRef.get()
        .then((querySnapshotAttendants) => {
            querySnapshotAttendants.forEach((doc) => {
                attendants.push({
                    student: doc.id
                });
            })
            resolve(attendants);  
        })
        .catch(function(error) {
            console.log("Error: ", error);
            reject(error);
        });
    }
)

const getClassScriptsAsync = (classId, instructorEmail, classMeta, items, bookmarks) => new Promise(
    function (resolve, reject) {
        const db = firebase.firestore();
        const myClassMeta = classMeta == undefined ? global.class : classMeta;
        const myClassId = typeof classId == 'object' ? classId.classId : classId;

        const newItems = items.map((item) => {
                const path = `${instructorPath(instructorEmail)}/${myClassMeta}/${myClassId}/files/${item.media}/scripts`;
                console.log('script path', path);
                return new Promise (
                    function (resolve, reject) {
                        db.collection(path).get()               
                        .then((querySnapshot) => {
                            let scripts = [];
                            querySnapshot.forEach((doc) => {
                                    const script = doc.data();
                                    const scriptId = `${item.media}_${parseFloat(script.startSecs)}`;
                                    let oScript = {scriptId:scriptId, startSecs: parseFloat(script.startSecs), word: script.word, endSecs: parseFloat(script.endSecs), speakerTag: script.speakerTag};
                                    if (bookmarks !== undefined){
                                        const isScriptBookmarked = bookmarks.filter(a => 
                                                            (a.bookmarkId == scriptId) && (a.category == 'script') 
                                                            //&& (   (a.startSecs >= parseFloat(itemS.startSecs)) && (a.startSecs <= parseFloat(itemS.endSecs))   )
                                                            ).length > 0 ? true : false ;
                                        oScript.bookmark = isScriptBookmarked;
                                    }
                                    scripts.push( oScript );
                                });

                            const itemIdx = items.findIndex(i => i.seq == item.seq); 
                            resolve({...item, scripts:scripts});
                        });
                    }
                )
                .then(newItem => newItem)
        });

        Promise.all(newItems).then(completed => resolve(completed) );
    }
)

export const selectClassActions = (oClass, media, startSecs, triggerSource) => {
    return(dispatch) => {
        if (typeof oClass !== 'object'){
            console.log('selectClass ID', oClass);
            const userEmail = firebase.auth().currentUser.email; 
             getClassAsync(oClass, userEmail, global.userType, global.class)
            .then( (newClass) => {
                dispatch({type: UPDATE_POSITION, payload: startSecs});
                dispatch({type: SELECTED_CLASS, payload: newClass});
                Actions.classItem({oClass:newClass, media:media, startSecs:startSecs, triggerSource});
            } )
        }
        else
        {
            console.log('selectClass', oClass);
            dispatch({type: SELECTED_CLASS, payload: oClass});
            Actions.classItem({oClass:oClass, media:media, startSecs:startSecs, triggerSource});
        }
    }
}

export const classAllFetchActionsLowPerform= (groupBy) => {
    return (dispatch) => {
        dispatch({type:CLASS_DOING});

        try{
            const {currentUser} = firebase.auth();
            const classMeta = global.class;
            const userType = global.userType; //'student';
            const user = currentUser.email;
            console.log('class path', global.class, global.userType);

            // Valid options for source are 'server', 'cache', or
            // 'default'. See https://firebase.google.com/docs/reference/js/firebase.firestore.GetOptions
            // for more information.
            var getOptions = {
                source: 'server'
            };
            
            let classItems = [];
            let bookmarks = [];
            getClassBookmarksAsync(user, userType, classMeta)
            .then( oBookmarks => {
                bookmarks = oBookmarks;
                return getClassesShallowAsync(user);
            })
            .then (oClasses => {

                new Promise (
                    function (resolve, reject) {
                        let tempClasses = [];
                        oClasses.forEach(oClass => {
                            console.log('oClass', oClass);
                            getClassAsync(oClass, user, userType, classMeta, bookmarks)
                            .then(newClass => {
                                console.log('newClass', newClass);
                                tempClasses.push(newClass);
                            })
                        })
                        console.log('tempClasses', tempClasses);
                        resolve(tempClasses);
                    }
                )
                .then(completed => {
                    console.log('completed', completed);
                    classItems = completed

                    //console.log('classItems', classItems);
                    if (groupBy) 
                    {
                        classItems = classItems.groupBy(groupBy);
                        dispatch({type: CALL_ALL_FETCH_SUCCESS, payload: {'classItems': classItems, 'groupBy': groupBy, bookmarks:bookmarks}});
                        //Actions.classListSection();
                        Actions.classList();
                    }
                    else{
                        dispatch({type: CALL_ALL_FETCH_SUCCESS, payload: {'classItems': classItems, 'groupBy': null, bookmarks:bookmarks}})
                    }
                 })
            })
        
            
            
        }
        catch(error) {
            console.log("Error: ", JSON.stringify(error));
            dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        };
    };
};

export const classAllFetchShelloActions= (groupBy) => {
    return (dispatch) => {
        dispatch({type:CLASS_DOING});

        try{
            const {currentUser} = firebase.auth();
            const classMeta = global.class;
            const userType = global.userType; //'student';
            const user = currentUser.email;
            console.log('class path', global.class, global.userType);

            // Valid options for source are 'server', 'cache', or
            // 'default'. See https://firebase.google.com/docs/reference/js/firebase.firestore.GetOptions
            // for more information.
            var getOptions = {
                source: 'server'
            };
            
            let classItems = [];
            let bookmarks = [];
            getClassBookmarksAsync(user, userType, classMeta)
            .then( oBookmarks => {
                bookmarks = oBookmarks;
                return getClassesShallowAsync(user, bookmarks);
            })
            .then (oClasses => {

                    classItems = oClasses;

                    //console.log('classItems', classItems);
                    if (groupBy) 
                    {
                        classItems = classItems.groupBy(groupBy);
                        dispatch({type: CALL_ALL_FETCH_SUCCESS, payload: {'classItems': classItems, 'groupBy': groupBy, bookmarks:bookmarks}});
                        //Actions.classListSection();
                        Actions.classList();
                    }
                    else{
                        dispatch({type: CALL_ALL_FETCH_SUCCESS, payload: {'classItems': classItems, 'groupBy': null, bookmarks:bookmarks}})
                    }
            })
        
            
            
        }
        catch(error) {
            console.log("Error: ", JSON.stringify(error));
            dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        };
    };
};

export const classAllFetchActionsNew = (groupBy) => {
    return async (dispatch) => {
        dispatch({type:CLASS_DOING});
        const {currentUser} = firebase.auth();
        const classMeta = global.class;
        const userType = global.userType;
        const user = currentUser.email;
        let myUser = (userType == 'instructor') ? instructorPath(user) : accountPath(user);

        var db = firebase.firestore();
        let classItems = [];
        // Valid options for source are 'server', 'cache', or
        // 'default'. See https://firebase.google.com/docs/reference/js/firebase.firestore.GetOptions
        // for more information.
        var getOptions = {
            source: 'server'
        };
        
        await getClassBookmarksAsync(user, userType, classMeta)
        .then(async (bookmarks) => {
            console.log('bookmarks in fetch class', bookmarks);
            await db.collection(`${myUser}/${classMeta}`).get()
            .then(
                async (querySnapshotClasses) => {
                    console.log('querySnapshotClasses', querySnapshotClasses);
                    querySnapshotClasses.forEach(async (docClass) =>{
                        let classItem = docClass.data();
                        const classSec = docClass.id.split('_')[1];
                        const classDate = convertSecToDate(classSec).toLocaleString();

                        let items = [];
                        await db.collection(`${myUser}/${classMeta}/${docClass.id}/files`).get()
                            .then(async (querySnapshotFiles) => {

                                querySnapshotFiles.forEach(async (doc) => {
                                    let item = doc.data();

                                    let scripts = [];
                                    await db.collection(`${instructorPath(classItem.instructor)}/${classMeta}/${docClass.id}/files/${item.media}/scripts`).get()               
                                    .then(async (querySnapshotS) => {
                                        querySnapshotS.forEach(async (docS) => {
                                            let itemS = docS.data();
                                            const scriptId = `${item.media}_${parseFloat(itemS.startSecs)}`;
                                            const isScriptBookmarked = bookmarks.filter(a => 
                                                                (a.bookmarkId == scriptId) && (a.category == 'script') 
                                                                //&& (   (a.startSecs >= parseFloat(itemS.startSecs)) && (a.startSecs <= parseFloat(itemS.endSecs))   )
                                                                ).length > 0 ? true : false ;
                                            scripts.push({scriptId:scriptId, startSecsOrg: itemS.startSecs, startSecs: parseFloat(itemS.startSecs), word: itemS.word, endSecs: parseFloat(itemS.endSecs), speakerTag: itemS.speakerTag, bookmark: isScriptBookmarked });
                                            });

                                        }
                                        ,
                                        (error) => {
                                                console.log("error", error);
                                        }
                                    );
                                    let itemSeq = item.media.split('_')[item.media.split('_').length-1].split('.')[0];
                                    if (isNaN(itemSeq)) itemSeq = item.media.split('_')[item.media.split('_').length-2].split('.')[0];

                                    items.push({
                                        seq: itemSeq,
                                        fileId: doc.id,
                                        className: classItem.className,
                                        classDate: classDate,
                                        classSec: classSec,
                                        instructorDisplayName: classItem.displayName ? classItem.displayName : classItem.instructor.split('@')[0] ,
                                        instructor: classItem.instructor,
                                        institution: classItem.institution,
                                        media: item.media,
                                        mediaUrl: null,
                                        scripts: scripts,
                                        filePath: `${currentUser.email}/${doc.id}`
                                    });
                                });       
                            },
                            (error) => {
                                    console.log("error", error);
                                }
                            );
                        //
                        const isBookmarked = bookmarks.filter(b => ((b.bookmarkId == docClass.id) && (b.category == 'class'))).length > 0 ? true : false ;
                        classItems.push({
                            key: docClass.id,
                            classId: docClass.id, 
                            className: classItem.className,
                            classSec: classSec,
                            classDate: classDate,
                            instructorDisplayName: classItem.displayName ? classItem.displayName : classItem.instructor.split('@')[0] ,
                            instructor: classItem.instructor,
                            institution: classItem.institution,
                            bookmark: isBookmarked,
                            items: items
                        });
                    });
                    console.log('classItems result', classItems);
                    if (groupBy) 
                    {
                        classItems = classItems.groupBy(groupBy);
                        console.log('classItems result groupBy', classItems);

                        dispatch({type: CALL_ALL_FETCH_SUCCESS, payload: {'classItems': classItems, 'groupBy': groupBy, bookmarks:bookmarks}});
                        //Actions.classListSection();
                        Actions.classList();
                    }
                    else{
                        console.log('classItems result no groupBy', classItems);
                        dispatch({type: CALL_ALL_FETCH_SUCCESS, payload: {'classItems': classItems, 'groupBy': null, bookmarks:bookmarks}})
                    }
                    
                }
                ,
                (error) => {
                        console.log("error", error);
                }
            )
            .catch(function(error) {
                console.log("Error: ", error);
                dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
            });
        })
        .catch(function(error) {
            console.log("Error: ", JSON.stringify(error));
            dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        });
    };
};

export const classAllFetchActions = (groupBy) => {
    return(dispatch) => {
        dispatch({type:CLASS_DOING, payload:true});
        const {currentUser} = firebase.auth();
        const classMeta = global.class;
        const userType = global.userType;
        const user = currentUser.email;
        let myUser = (userType == 'instructor') ? instructorPath(user) : accountPath(user);

        var db = firebase.firestore();
        let classItems = [];
        // Valid options for source are 'server', 'cache', or
        // 'default'. See https://firebase.google.com/docs/reference/js/firebase.firestore.GetOptions
        // for more information.
        var getOptions = {
            source: 'server'
        };
        console.log('user, userType, classMeta', user, userType, classMeta)
        getClassBookmarksAsync(user, userType, classMeta)
        .then((bookmarks) => {
            console.log('bookmarks in fetch class, classAllFetchActions', bookmarks);
            db.collection(`${myUser}/${classMeta}`).get()
            .then(
                (querySnapshotClasses) => {
                    console.log('querySnapshotClasses', querySnapshotClasses);
                    querySnapshotClasses.forEach((docClass) =>{
                        let classItem = docClass.data();
                        const classSec = docClass.id.split('_')[1];
                        const classDate = convertSecToDate(classSec).toLocaleString();

                        let items = [];
                        db.collection(`${myUser}/${classMeta}/${docClass.id}/files`).get()
                            .then((querySnapshotFiles) => {

                                querySnapshotFiles.forEach((doc) => {
                                    let item = doc.data();

                                    let scripts = [];
                                    db.collection(`${instructorPath(classItem.instructor)}/${classMeta}/${docClass.id}/files/${item.media}/scripts`).get()               
                                    .then((querySnapshotS) => {
                                        querySnapshotS.forEach((docS) => {
                                            let itemS = docS.data();
                                            const scriptId = `${item.media}_${parseFloat(itemS.startSecs)}`;
                                            const isScriptBookmarked = bookmarks.filter(a => 
                                                                (a.bookmarkId == scriptId) && (a.category == 'script') 
                                                                //&& (   (a.startSecs >= parseFloat(itemS.startSecs)) && (a.startSecs <= parseFloat(itemS.endSecs))   )
                                                                ).length > 0 ? true : false ;
                                            scripts.push({scriptId:scriptId, startSecsOrg: itemS.startSecs, startSecs: parseFloat(itemS.startSecs), word: itemS.word, endSecs: parseFloat(itemS.endSecs), speakerTag: itemS.speakerTag, bookmark: isScriptBookmarked });
                                            });

                                        }
                                        ,
                                        (error) => {
                                                console.log("error", error);
                                        }
                                    );
                                    let itemSeq = item.media.split('_')[item.media.split('_').length-1].split('.')[0];
                                    if (isNaN(itemSeq)) itemSeq = item.media.split('_')[item.media.split('_').length-2].split('.')[0];

                                    items.push({
                                        seq: itemSeq,
                                        fileId: doc.id,
                                        className: classItem.className,
                                        classDate: classDate,
                                        classSec: classSec,
                                        instructorDisplayName: classItem.displayName ? classItem.displayName : classItem.instructor.split('@')[0] ,
                                        instructor: classItem.instructor,
                                        institution: classItem.institution,
                                        media: item.media,
                                        mediaUrl: null,
                                        scripts: scripts,
                                        filePath: `${currentUser.email}/${doc.id}`
                                    });
                                });       
                            },
                            (error) => {
                                    console.log("error", error);
                                }
                            );
                        //
                        const isBookmarked = bookmarks.filter(b => ((b.bookmarkId == docClass.id) && (b.category == 'class'))).length > 0 ? true : false ;
                        classItems.push({
                            key: docClass.id,
                            classId: docClass.id, 
                            className: classItem.className,
                            classSec: classSec,
                            classDate: classDate,
                            instructorDisplayName: classItem.displayName ? classItem.displayName : classItem.instructor.split('@')[0] ,
                            instructor: classItem.instructor,
                            institution: classItem.institution,
                            bookmark: isBookmarked,
                            items: items
                        });
                    });
                    console.log('classItems result', classItems);
                    if (groupBy) 
                    {
                        classItems = classItems.groupBy(groupBy);
                        dispatch({type: CALL_ALL_FETCH_SUCCESS, payload: {'classItems': classItems, 'groupBy': groupBy, bookmarks:bookmarks}});
                        //Actions.classListSection();
                        Actions.classList();
                    }
                    else{
                        dispatch({type: CALL_ALL_FETCH_SUCCESS, payload: {'classItems': classItems, 'groupBy': null, bookmarks:bookmarks}})
                    }
                    
                }
                ,
                (error) => {
                        console.log("error", error);
                }
            )
            .catch(function(error) {
                console.log("Error: ", error);
                dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
            });
        })
        .catch(function(error) {
            console.log("Error: ", JSON.stringify(error));
            dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        });
    };
};

export const changeScript = (script) => {
    console.log('changeScript script', script);
    return {
        type: CHANGE_SCRIPTS,
        payload: script
    };
}

export const updateScript = (item, script) => {

    const classMeta = global.class;
    const userType = global.userType;
    console.log('item script', item, script);

    return (dispatch) => {
        const db = firebase.firestore();
        const path = `${instructorPath()}/${classMeta}/${item.className}_${item.classSec}/files/${item.media}/scripts/${script.startSecsOrg}`;
        db.doc(path).update({
            word: script.word
        })
        .then(
        () => {
            dispatch({type: UPDATE_SCRIPTS, payload: {item, script}});
            //Actions.pop();
        },
        (error) => {
                console.error("error", error);
            }
        )
    }

}

export const removeClassNote = (note) => { 

    return (dispatch) => {

        dispatch({type:CLASS_DOING});
        const classMeta = global.class;
        const path = `${instructorPath(note.instructor)}/${classMeta}/${note.classId}/notes/${note.noteId}`;
        console.log('remoteClassNote path', path);
        let deleteFn = firebase.functions().httpsCallable('recursiveDelete');

        deleteFn({ path: path, currentUsers: firebase.auth().currentUser.uid })
            .then(function(result) {
                dispatch({type: REMOVE_MY_CLASS_NOTE, payload: note.noteId})
            })
            .catch(function(error) {
                console.log("Error: ", JSON.stringify(error));
                dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        });
    }
}

export const addClassNote = (note) => { 

    return async (dispatch, getState) => {
        dispatch({type:CLASS_DOING});
        const user = firebase.auth().currentUser.email; 
        const classMeta = global.class;
        const userType = global.userType;
        let oItem = {};

        addClassNoteAsync(note.classId, user, userType, classMeta, note)
        .then((note) => {
            dispatch({type: ADD_MY_CLASS_NOTE, payload: {...note, instructor:user}})
            Actions.pop();
        },
        (error) => {
                console.log("error", error);
                dispatch({type:CLASS_ERROR, payload: error});
            }
        )
        // .catch(function(error) {
        //     console.log("Error: ", error);
        //     console.log("Error2: ", JSON.stringify(error));
        //     dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        // });
    }
}

export const getClassNotes = (classId, user, userType, classMeta) => { 
    
    return (dispatch) => {
        dispatch({type:CLASS_DOING});
        //const myUser = user == null ? firebase.auth().currentUser.email : user; 
        const myClassMeta = classMeta == undefined ? global.classMeta : classMeta;

        console.log('getClassNotes notes', classId);
        getClassNotesAsync(classId, user, userType, myClassMeta)
        .then(
        (notes) => {
            console.log('after getClassNotesAsync notes', notes);
            dispatch({type: GET_MY_CLASS_NOTES, payload: notes})
            //Actions.pop();
        },
        (error) => {
                console.log("error", error);
            }
        )
        .catch(function(error) {
            console.log("Error: ", JSON.stringify(error));
            dispatch({type:CLASS_ERROR, payload: JSON.stringify(error)});
        });
    }
}

export const updateClassNote = (note) => {

    const classMeta = global.class;
    const userType = global.userType;
    //console.log('item script', item, script);

    return (dispatch) => {
        const db = firebase.firestore();
        const path = `${instructorPath(note.instructor)}/${classMeta}/${note.classId}/notes/${note.noteId}`;
        db.doc(path).update({
            note: note.note,
            description: note.description
        })
        .then(
        () => {
            dispatch({type: UPDATE_CLASS_NOTE, payload: note});
            Actions.pop();
        },
        (error) => {
                console.error("error", error);
            }
        )
    }

}

export const noteChangeAction = (note) => {
    return {
        type: NOTE_TEXT_CHANGE,
        payload: note
    };
}

const addClassNoteAsync = (classId, user, userType, classMeta, note) => new Promise(
    function (resolve, reject) {
        var db = firebase.firestore();
        //let myUser = (userType == 'instructor') ? instructorPath(user) : accountPath(user);
        const noteKey = `${classId}_${Date.now()}`;
        const myClassMeta = classMeta == undefined ? global.class : classMeta;
        const path = `${instructorPath(user)}/${myClassMeta}/${classId}/notes/${noteKey}`;

        const noteItem = {
                    // classId: classId,
                    // noteId: noteKey,
                    note: note.note,
                    description: note.description
                    }
        console.log('noteItem', path, noteItem);
        db.doc(path).set(noteItem)
        .then(
        (docRef) => {
            console.log("noteItem Added:", docRef);
            resolve({...noteItem, noteId:noteKey, classId:note.classId}); 
        })
        .catch(function(error) {
            console.log("noteItem Adding Error: ", error);
            reject(error);
        });
    }
)

const getClassNotesAsync = (classId, user, userType, classMeta) => new Promise(
    function (resolve, reject) {
        const db = firebase.firestore();
        const myClassMeta = classMeta == undefined ? global.class : classMeta;

        let notes = [];
        
        getClassShallowAsync(classId, user, userType, myClassMeta)
        .then( oClass => {
            const path = `${instructorPath(oClass.instructor)}/${myClassMeta}/${oClass.classId}/notes/`;
            
            const docRef  = db.collection(path);
            docRef.get()
            .then((querySnapshotNotes) => {
                querySnapshotNotes.forEach((doc) => {
                    const item = doc.data()
                    //console.log('doc, item', doc.id, item, item.id);
                    notes.push({
                        classId: oClass.classId,
                        instructor: oClass.instructor,
                        instructorDisplayName: oClass.instructorDisplayName ? oClass.instructorDisplayName : oClass.instructor.split('@')[0],
                        noteId: doc.id,
                        note: item.note,
                        description: item.description
                    });
                    
                })
                resolve(notes);  
            })
            .catch(function(error) {
                console.log("Error: ", error);
                reject(error);
            });
        })
        
    }
)


Array.prototype.groupBy = function(filter) {
  return this.reduce(function(groups, item) {
    
    let group = {};

    //const val = item[prop]
    //console.log('ini groups',groups, groups.length);
    if (groups.length == 0) {
        //let temp = {};
        filter.forEach(prop => {
            group[prop] = item[prop];
        });
        group['data'] = [];
        groups.push(group);    
        
    }

    //let tempGroup = groups.find(x => x[prop] == val);
    
    let tmpGroup = groups.filter(function(oItem) {
        for (let i = 0; i <  filter.length; ++i) {
            const prop = filter[i];
            //console.log('oItem[prop]',oItem, prop, oItem[prop], item[prop]);
            if (oItem[prop] === undefined || oItem[prop] != item[prop])
            return false;
        }
        return true;
    });
    //console.log('tmpGroup', tmpGroup);

    if (tmpGroup.length > 0) group = tmpGroup[0];

    if (group[filter[0]])
    {
        //console.log('group found', group);
        group.data.push(item);
    }
    else
    {
        filter.forEach(prop => {
            group[prop] = item[prop];
        });
        group['data'] = [item];
        //group = {[prop]:val, data:[item]};
        //console.log('group found no', group);
        groups.push(group);
    }
    
    //console.log('aft groups', groups);

    return groups
  }, [])
}
