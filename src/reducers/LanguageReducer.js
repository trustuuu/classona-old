import { LANGUAGE_FETCH, LANGUAGE_MY_FETCH, LANGUAGE_UPDATE, LANGUAGE_DELETE, LANGUAGE_ADD,
    LANGUAGE_DOING, LANGUAGE_SUCCESS, LANGUAGE_ERROR } from '../actions/types';

const INITIAL_STATE = { 
    language: null,
    languages: [],
    myLanguages:null,
    error: null, 
    loading: null
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LANGUAGE_FETCH:
            return { ...state, languages: action.payload } 

        case LANGUAGE_MY_FETCH:
            return { ...state, myLanguages: action.payload }

        case LANGUAGE_ADD:
            const newLanguages = [...state.myLanguages, action.payload];
            console.log('LANGUAGE_ADD', newLanguages);
            return { ...state, mylanguages: newLanguages}

        case LANGUAGE_DELETE:
            return {...state, myLanguages: state.myLanguages.filter(p => p.languageId != action.payload)}

        default:
            return state;
        }
    }
    