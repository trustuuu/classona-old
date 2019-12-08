import { PLAYBACK_STATE, PLAYBACK_INIT, PLAYBACK_TRACK, NAVIGATE_TO, 
        LIBRARY_STATUS, UPDATE_LIBRARY, UPDATE_POSITION, BLOCK_START_POSITION,
        BLOCK_END_POSITION, TRACK_PLAY_LOADING, CLEAR_PLAY_TRACK } from '../actions/types';

const INITIAL_STATE = { 
    fetching: '',
    tracks: null,
    currentTrackId: null,
    currentPosition: 0,
    blockStart: 0,
    blockEnd: 0,
    state: '',
    error: '',
    loading: false
 };

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case TRACK_PLAY_LOADING:
            return {...state, loading:action.payload}
        case UPDATE_LIBRARY:
            //const currentTrackId = action.payload[0].id; 
            return { ...state, loading:false, tracks: action.payload} //, currentTrackId: currentTrackId }
        case PLAYBACK_INIT:
            return {...state }
        case PLAYBACK_STATE:
            return {...state, state: action.payload }
        case PLAYBACK_TRACK:
            const currentTrackId = action.payload;
            const track = currentTrackId !== null ? (state.tracks ? state.tracks.find((t) => t.id == currentTrackId) : null) : null;
            return {...state, currentTrackId: action.payload, track:track }
        case NAVIGATE_TO:
            return {...state, currentScreen: action.payload}
        case UPDATE_POSITION:
            return {...state, currentPosition: action.payload}
        case BLOCK_START_POSITION:
            return {...state, blockStart: action.payload}
        case BLOCK_END_POSITION:
            return {...state, blockEnd: action.payload}
        case CLEAR_PLAY_TRACK:
            return {...state, currentTrackId:null, currentPosition:0, blockStart:0, blockEnd:0}
        default:
            return state;
    }
}
