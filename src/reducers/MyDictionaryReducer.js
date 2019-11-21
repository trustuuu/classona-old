import { MY_WORD, WORD_CHANGE, DESCRIPTION_CHANGE, ADD_WORD_TO_DICTIONARY, 
    GET_ALL_MY_PHRASES, DELETE_MY_PHRASES,
    SUCCESS_MY_PHRASES, MY_DICTIONARY_SETTING_SUCCESS,
    MY_DICTIONARY_VOICE_CHANGE, MY_DICTIONARY_LANGUAGE_CHANGE,
    GET_ALL_MY_DICTIONARY_SETTING, MY_DICTIONARY_FIRST_VOICE_CHANGE,
    MY_DICTIONARY_FIRST_LANGUAGE_CHANGE, TEXT_CHANGE, EDIT_MY_PHRASES,
    CHANGE_MY_PHRASES_BOOKMARK, GET_BOOKMARK_MY_PHRASES } from '../actions/types';

const INITIAL_STATE = { 
    //phrase: '',
    // description: '',
    // media: '',
    // startSecs: 0,
    // bookmark: false,
    // phraseKey: '',
    
    phrase: null,

    phrases: null,
    phrasesBookmark: null,
    sharedWords: null,
    error: null, 
    loading: null,

    language: '',
    voice: '', 
    firstLanguage: '',
    firstLanguageVoice: '',
    myClass: '',
    interval: '3',
    play: 'phrase'
 };

export default (state = INITIAL_STATE, action) => {
    let newPhrases = [];
    let newPhrasesBookmark = [];
    let phraseIndex = -1;
    let oPhrase = {};        
    
    switch (action.type) {
        case MY_WORD:
            return { ...state, phrase: action.payload } 

        case ADD_WORD_TO_DICTIONARY:
            return { ...state, phrase: action.payload }
        
        case DELETE_MY_PHRASES:
            return {...state, phrases: state.phrases.filter(p => p.phraseKey != action.payload)}

        case SUCCESS_MY_PHRASES:
            return {...state, ...INITIAL_STATE, phrase: action.payload}

        case GET_ALL_MY_PHRASES:
            return { ...state, phrases: action.payload }

        case GET_BOOKMARK_MY_PHRASES:
            return { ...state, phrasesBookmark: action.payload }

        case WORD_CHANGE:
            oPhrase = {...state.phrase};
            oPhrase.phrase = action.payload;
            return { ...state, phrase: oPhrase }

        case TEXT_CHANGE:
            const key = Object.keys(action.payload)[0];
            return { ...state, [key]: action.payload[key]}

        case DESCRIPTION_CHANGE:
            oPhrase = {...state.phrase};
            oPhrase.description = action.payload;
            return { ...state, phrase: oPhrase }
        
        case EDIT_MY_PHRASES:
            //const foo = Object.assign({}, this.state.foo, { bar: 'further value' });
            newPhrases = [...state.phrases];
            phraseIndex = newPhrases.findIndex(i=> i.phraseKey === action.payload.phraseKey);
            newPhrases[phraseIndex] = action.payload;
            // newPhrases = [
            //                     state.phrases.slice(0, phraseIndex),
            //                     action.payload,
            //                     state.phrases.slice(phraseIndex + 1)
            //                     ]
            //newPhrases = Object.assign({}, state.phrases.slice(0, phraseIndex), action.payload, state.phrases.slice(phraseIndex + 1));
            return { ...state, phrase:action.payload, phrases: newPhrases}

        case CHANGE_MY_PHRASES_BOOKMARK:
            
            newPhrases = [...state.phrases];
            
            phraseIndex = newPhrases.findIndex(i=> i.phraseKey === action.payload.phraseKey);
            newPhrases[phraseIndex].bookmark = action.payload.bookmark;

            if (state.phrasesBookmark) newPhrasesBookmark = [...state.phrasesBookmark];
            if (action.payload.bookmark) {
                newPhrasesBookmark.push(newPhrases[phraseIndex]);
            }else{
                newPhrasesBookmark = newPhrasesBookmark.filter(p => p.phraseKey != action.payload.phraseKey);
            }
            return { ...state, phrase: newPhrases[phraseIndex], phrases: newPhrases, phrasesBookmark: newPhrasesBookmark}

        case GET_ALL_MY_DICTIONARY_SETTING:
            return { ...state, 
            firstLanguage: action.payload.firstLanguage, firstLanguageVoice: action.payload.firstLanguageVoice,
            language: action.payload.language, voice: action.payload.voice, interval: action.payload.interval, 
            play: action.payload.play}

        case MY_DICTIONARY_FIRST_LANGUAGE_CHANGE:
            return { ...state, firstLanguage: action.payload}

        case MY_DICTIONARY_FIRST_VOICE_CHANGE:
            return { ...state, firstLanguageVoice: action.payload}

        case MY_DICTIONARY_LANGUAGE_CHANGE:
            return { ...state, language: action.payload}

        case MY_DICTIONARY_VOICE_CHANGE:
            return { ...state, voice: action.payload}

        case MY_DICTIONARY_SETTING_SUCCESS:
            return { ...state}

        default:
            return state;
    }
}
