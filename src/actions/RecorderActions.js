import firebase from 'firebase';
import { Buffer } from 'buffer'
const RNFS = require('react-native-fs');
import {
    ADD_NEW_RECORD,
    ADD_NEW_FILE,
    DELETE_RECORD,
    DELETE_ALL_RECORD,
    UPLOAD_FILE,
    FINISH_UPLOAD,
    UPDATE_DURATION,
    UPLOAD_STATE,
    UPLOAD_PROGRESS,
    ERROR,
} from '../actions/types';

const upload = async (fileName, filePath, dispatch) => {
    if (filePath) {
        const fileFullPath = 'file://' + filePath;
        const data = await RNFS.readFile(fileFullPath, 'base64');
        const baseName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
        const blob = new Blob([data], {type: 'base64'});
        return new Promise((resolve, reject) =>  {
            const unsubscribe = firebase.storage()
                        .ref(`/temp/${baseName}`)
                        .put(blob)
                        .on('state_changed', snapshot => {
                            dispatch({
                                type: UPLOAD_FILE,
                                payload: {
                                    filePath,
                                    progress: ((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                                },
                            });
                        }, err => {
                            reject(err);
                            //Error
                            unsubscribe();
                        }, async (uploadedFile) => {
                            try {
                                const result = await RNFS.exists(fileFullPath);
                                if (result) {
                                    await RNFS.unlink(fileFullPath);
                                    dispatch({
                                        type: FINISH_UPLOAD,
                                        payload: {
                                            filePath,
                                            fileName,
                                        },
                                    });
                                    resolve();
                                }
                            } catch (err) {
                                reject(err);
                            }
                            //Success
                            unsubscribe();
                        });
        });
    }
}

export const uploadMyPrivateClass = (fileName, files) => {
    const { currentUser } = firebase.auth();
    console.log('uploadMyPrivateClass', fileName, files);
    return async (dispatch, getState) => { 
        for (const file of files) {
            try {
                await upload(fileName, file, dispatch);
            } catch (err) {
                console.error(err);
                dispatch({
                    type: ERROR,
                    payload: err
                });
            }
        }
    };
};

export const addNewRecord = (fileInfo) => {
    return (dispatch) => {
        dispatch({
            type: ADD_NEW_RECORD,
            payload: fileInfo,
        })
    }
};

export const addNewFile = (fileInfo) => {
    return (dispatch) => {
        dispatch({
            type: ADD_NEW_FILE,
            payload: fileInfo,
        })
    }
};

export const updateDuration = (info) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_DURATION,
            payload: info,
        })
    }
};

export const deleteRecord = (fileName, files) => {
    return (dispatch) => {
        Promise.all(files.map((filePath) => {
            const fileFullPath = 'file://' + filePath;
            return RNFS.exists(fileFullPath);
        })).then((results) => {
            return Promise.all(files.map((filePath, index) => {
                const fileFullPath = 'file://' + filePath;
                if (results[index])
                    return RNFS.unlink(fileFullPath);
            }));
        }).then(() => {
            dispatch({
                type: DELETE_RECORD,
                payload: fileName,
            });
        }).catch((err) => {
            dispatch({
                type: ERROR,
                payload: err
            });
            console.error(err);
        });
    };
};

export const deleteAllRecord = () => {
    return (dispatch, getState) => {
        let records = getState().records; 
        Promise.all(records.map((record) => {
            return new Promise((resolve, conflict) => {
                fs.unlink(record, (err) => {
                    if (err) {
                        reject(err); 
                    }
                    resolve();
                });
            });
        })).then(() => {
            return dispatch({
                type: DELETE_ALL_RECORD,
            });
        }).catch((err) => {
            return dispatch({
                type: ERROR,
                payload: err,
            });
            console.error(err);
        });
        return;
    }
};
