import { CLASS_ALL_FETCH, CALL_ALL_FETCH_SUCCESS, REMOVE_CLASS, 
SELECTED_CLASS, ADD_MY_CLASS_BOOKMARK, GET_MY_CLASS_BOOKMARKS,
REMOVE_MY_CLASS_BOOKMARK, CLASS_ERROR, CLASS_DOING, CHANGE_SCRIPTS,
UPDATE_SCRIPTS, REMOVE_MY_CLASS_NOTE, ADD_MY_CLASS_NOTE,
GET_MY_CLASS_NOTESš, NOTE_TEXT_CHANGE, GET_MY_CLASS_NOTES } from '../actions/types';

const INITIAL_STATE = {
    classes: null,
    item: null,
    groupBy: null,
    selectedClass: null,
    bookmarks: [],
    error: '', 
    loading: false,
    script: {word:''},
    notes:[],
    note: null
};

export default (state = INITIAL_STATE, action) => {
    let newItems = [];
    switch (action.type) {

        case CLASS_DOING:
            return {...state, error: '', loading:true}

        case CALL_ALL_FETCH_SUCCESS:
            
            return { ...state, classes: action.payload.classItems, groupBy: action.payload.groupBy, bookmarks: action.payload.bookmarks, error:'', loading:false }

        case CLASS_ERROR:
            return {...state, error: action.payload}

        case REMOVE_CLASS:
            return { ...state, classes: state.classes.filter( oClass => oClass.classId != action.payload.classId ), error:'', loading:false };

        case SELECTED_CLASS:
        
            return { ...state, selectedClass: action.payload, error:'', loading:false}
        
        case CHANGE_SCRIPTS:
            return { ...state, script: action.payload }

        case UPDATE_SCRIPTS:
            return { ...state, script: action.payload.script }

        case NOTE_TEXT_CHANGE:
            return { ...state, note: action.payload}

        case GET_MY_CLASS_BOOKMARKS:
            return {...state, bookmarks: action.payload, error:'', loading:false}

        case ADD_MY_CLASS_BOOKMARK:
            newItems = [...state.bookmarks, action.payload];
            //newItems.push(action.payload);
            return { ...state, bookmarks: newItems, error:'', loading:false}

        case REMOVE_MY_CLASS_BOOKMARK:
            newItems = state.bookmarks.filter(b => b.bookmarkId != action.payload)
            return { ...state, bookmarks:newItems, error:'', loading:false}

        case GET_MY_CLASS_NOTES:
            return {...state, notes: action.payload, error:'', loading:false}

        case ADD_MY_CLASS_NOTE:
            newItems = [...state.notes, action.payload];
            //newItems.push(action.payload);
            return { ...state, notes: newItems, error:'', loading:false}

        case REMOVE_MY_CLASS_NOTE:
            newItems = state.notes.filter(b => b.noteId != action.payload)
            return { ...state, notes:newItems, error:'', loading:false}

        default:
            return state;
    }
}