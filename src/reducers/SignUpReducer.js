import { EMAIL_CHANGED, PASSWORD_CHANGED, PASSWORD_CONFIRM_CHANGED,
         SIGNUP_USER_SUCCESS, SIGNUP_USER_FAIL, SIGNUP_USER,
         SETUP_USER, DISPLAY_NAME_CHANGED } from '../actions/types';

const INITIAL_STATE = { 
    email: '',
    password: '',
    passwordconfirm: '',
    displayName:'',
    user: null,
    signupUser: {motherLanguage:'ko-KR', motherLanguageVoiceCode:'ko', language:'en-US', voiceCode:'en', classMeta: 'classes'},
    error: '',
    loading: false
 };

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case EMAIL_CHANGED:
            return { ...state, email: action.payload }
        case DISPLAY_NAME_CHANGED:
            return { ...state, displayName: action.payload }
        case PASSWORD_CHANGED:
            return {...state, password: action.payload }
        case PASSWORD_CONFIRM_CHANGED:
            return {...state, passwordconfirm: action.payload }
        case SIGNUP_USER_SUCCESS:
            return {...state, ...INITIAL_STATE, user: action.payload }
        case SIGNUP_USER_FAIL:
            return {...state, loading: false, error: 'Sign Up Failed.'}
        case SIGNUP_USER:
            return {...state, loading: true, error: ''}
        case SETUP_USER:
            const User = {...state.signupUser, ...action.payload }
            return {...state, signupUser: User }
        default:
            return state;
    }
}
