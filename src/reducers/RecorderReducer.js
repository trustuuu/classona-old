const fs = require('react-native-fs');
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

const INITIAL_STATE = {
    records: [],
    uploadings: [],
    progress: 0,
    err: '',
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_NEW_RECORD: {
            return {...state, records: [...state.records, action.payload ]};  
        }

        case ADD_NEW_FILE:
            return {...state, records: state.records.map((record) => {
                if (record.fileName === action.payload.fileName) {
                    return Object.assign({}, record, { files: [ ...record.files, action.payload.filePath]});
                } else
                    return record;
            })};

        case DELETE_RECORD: 
            return { ...state, records: state.records.filter(record => (record.fileName !== action.payload))};

        
        case FINISH_UPLOAD: {
            let nextRecordState = state.records.map(record => {
                if (record.fileName === action.payload.fileName) {
                    return Object.assign({}, record, { files: record.files.filter((filePath) => filePath !== action.payload.filePath)});
                } else
                    return record;
            });
            nextRecordState = nextRecordState.filter((record) => record.files.length !== 0);

            return {
                ...state,
                uploadings: state.uploadings.filter((uploading) => {uploading.filePath !== action.payload.filePath}),
                records: nextRecordState,
            };
        }

        case UPDATE_DURATION:
            return {...state, records: state.records.map((record) => {
                if (record.fileName === action.payload.fileName) {
                    return Object.assign({}, record, {duration: ++record.duration});
                } else 
                    return record;
            })};

        case DELETE_ALL_RECORD:
            return null;

        case UPLOAD_FILE:
            const exist = state.uploadings.findIndex((uploading) => {
                if (uploading.filePath === action.payload.filePath)
                    return true;
                else
                    return false;
            });
            if (exist === -1)
                return {
                    ...state, 
                    uploadings: [...state.uploadings, action.payload ]
                };
            else
                return { 
                    ...state,
                    uploadings: state.uploadings.map((uploading) => {
                        if (uploading.filePath !== action.payload.filePath){
                            return uploading;
                        } else {
                            return action.payload;
                        }
                    }),
                };

        case UPLOAD_STATE:
            return;
        case UPLOAD_PROGRESS:
            return;
        case ERROR:
            return {...state, err: action.payload};
        default:
            return state;
    }
}
