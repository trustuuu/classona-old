import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ClassReducer from './ClassReducer';
import SignUpReducer from './SignUpReducer';
import TrackPlayReducer from './TrackPlayReducer';
import SideMenuReducer from './SideMenuReducer';
import MyDictionaryReducer from './MyDictionaryReducer';
import RecorderReducer from './RecorderReducer';
import ProfileReducer from './ProfileReducer';
import LanguageReducer from './LanguageReducer';

export default combineReducers({
     auth: AuthReducer,
     signup: SignUpReducer,
     oClass: ClassReducer,
     player: TrackPlayReducer,
     sideMenu: SideMenuReducer,
     myDictionary: MyDictionaryReducer,
     recorder: RecorderReducer,
     profile: ProfileReducer,
     myLanguage: LanguageReducer,
});
