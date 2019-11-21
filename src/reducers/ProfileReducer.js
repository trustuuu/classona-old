import { PROFILE_FETCH, PROFILE_UPDATE,
         PROFILE_DOING, PROFILE_SUCCESS,
         PROFILE_ERROR, PROFILE_TEXT_CHANGE } from '../actions/types';

const INITIAL_STATE = { 
    user: null,
    error: '',
    loading: false,
 };

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case PROFILE_FETCH:
            return { ...state, error:'', loading:false, user: action.payload }
        case PROFILE_UPDATE:
            return {...state, password: action.payload }
        case PROFILE_DOING:
            return {...state, error: '', loading:true}
        case PROFILE_SUCCESS:
            return { ...state, error:'', loading:false }
        case PROFILE_ERROR:
            return {...state, error: action.payload, loading:false}
        case PROFILE_TEXT_CHANGE:
            
            const key = Object.keys(action.payload)[0];
            let newUser = {...state.user};
            newUser[key] = action.payload[key];
            return { ...state, user: newUser}
        default:
            return state;
    }
}
