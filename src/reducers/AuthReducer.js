import { EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCCESS,
            LOGIN_USER_FAIL, LOGIN_USER, LOGIN_USER_CHECK_FAIL, GET_ALL_MY_TILES } from '../actions/types';

const INITIAL_STATE = { 
    email: '',
    password: '',
    user: null,
    error: '',
    loading: false,
    tiles: []
 };

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case EMAIL_CHANGED:
            return { ...state, email: action.payload }
        case PASSWORD_CHANGED:
            return {...state, password: action.payload }
        case LOGIN_USER_SUCCESS:
            return {...state, ...INITIAL_STATE, user: action.payload }
        case LOGIN_USER_FAIL:
            return {...state, loading: false, error: 'Authentication Failed.'}
        case LOGIN_USER_CHECK_FAIL:
            return {...state, loading: false, error: ''}
        case LOGIN_USER:
            return {...state, loading: true, error: ''}
        case GET_ALL_MY_TILES:
            return {...state, tiles: action.payload, loading: true, error: ''}
        default:
            return state;
    }
}
