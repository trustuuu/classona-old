import TrackPlayer from 'react-native-track-player';
import firebase from '@firebase/app';
require("firebase/storage");
import { UPDATE_LIBRARY, LIBRARY_STATUS, PLAYBACK_INIT, PLAYBACK_STATE, 
        PLAYBACK_TRACK, NAVIGATE_TO, UPDATE_POSITION, BLOCK_START_POSITION, BLOCK_END_POSITION,
        TRACK_PLAY_LOADING } from './types';
import { convertSecToDate } from '../helpers/utils';

function libraryStatus(fetching, error) {
    return {
        type: LIBRARY_STATUS,
        fetching: fetching,
        error: error
    };
}

export const fillUpMediaUrlOld = async (oItems) => {

    let items = [...oItems];

    for(let i = 0; i < items.length; i++) {
        //let item = items[i];
        
        try{
            const storageRef = await firebase.storage().ref(`${items[i].instructor}/${items[i].media}`);
            const url = await storageRef.getDownloadURL();
            //item.mediaUrl = url; 
            //items[i] = item;

            items[i].mediaUrl = url;
        }catch(err)
        {
            console.log('err', err);
        }
    }
    return items;
}

export const fillUpMediaUrl = async (oItems) => {

    let items = [];

    for(let i = 0; i < oItems.length; i++) {
        //let item = items[i];
        
        try{
            const storageRef = await firebase.storage().ref(`${oItems[i].instructor}/${oItems[i].media}`);
            const url = await storageRef.getDownloadURL();
            //item.mediaUrl = url; 
            //items[i] = item;
            items = [...items, {...oItems[i], mediaUrl: url}];
        }catch(err)
        {
            console.log('err', err);
        }
    }
    return items;
}


// const fillUpMediaUrl = (oItems) => new Promise(
//     function (resolve, reject)
//     {
//         let items = {...oItems};
//         for(let i = 0; i < items.length; i++) {
//             let item = items[i];
            
//             try{
//             var storageRef = firebase.storage().ref(`${item.instructor}/${item.media}`);
//             }catch(err)
//             {
//                 console.log('err', err);
//             }
//             var url = storageRef.getDownloadURL();
//             item.mediaUrl = url; 
//             items[i] = item;
//         }
//         resolve(items);
//     }
// )


export function fetchLibrary(oItems) {
    
    return async (dispatch, getState) => {
        dispatch({ type: TRACK_PLAY_LOADING, payload: true });

        let state = getState();

        // if(state.player && (state.player.fetching || state.player.tracks)) {
        //     console.log('getState return', state);
        //     //dispatch({ type: UPDATE_LIBRARY, payload: [...state.player.tracks] });
        //     // Already fetching or fetched
        //     return;
        // }

        dispatch(libraryStatus(true));

        //let tracks = []
        fillUpMediaUrl(oItems)
        .then((items) => {
            Promise.all(
                items.sort((item1, item2) => item1.seq - item2.seq).map( item => {
                const classNameArrary = item.media.split('_');
                const classDate = convertSecToDate(classNameArrary[4]).toLocaleString();
                return {
                    id: item.media,                
                    url: item.mediaUrl, // Load media from the network                
                    title: `${item.className} by ${item.instructor} in ${item.institution}(${item.seq}`,
                    artist: item.instructor,
                    album: `${item.className}-${item.seq}`,
                    genre: item.institution,
                    date: classDate, //'2014-05-20T07:00:00+00:00', // RFC 3339
                    customData: item
                    } 
                })
            )
            .then(newTracks => {
                dispatch({ type: UPDATE_LIBRARY, payload: newTracks });
                })

            // tracks.push( {
            //         id: item.media,                
            //         url: item.mediaUrl, // Load media from the network                
            //         title: `${item.className} by ${item.instructor} in ${item.institution}(${item.seq}`,
            //         artist: item.instructor,
            //         album: `${item.className}-${item.seq}`,
            //         genre: item.institution,
            //         date: classDate, //'2014-05-20T07:00:00+00:00', // RFC 3339
            //         customData: item
            //     } );


        }, (error) => {
            dispatch(libraryStatus(false, error));
        });

    };
}

export function initializePlayback() {//TODO
    return async (dispatch, getState) => {
        await TrackPlayer.setupPlayer({
            maxCacheSize: 1024 * 5 // 5 mb
        });
        await TrackPlayer.updateOptions({
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                //TrackPlayer.CAPABILITY_SEEK_TO,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_PLAY_FROM_SEARCH,
                TrackPlayer.CAPABILITY_SKIP,
            ]
        });
        dispatch({
            type: PLAYBACK_INIT
        });
    };
}

export function playbackState(state) {
    return {
        type: PLAYBACK_STATE,
        payload: state
    };
}

export function updatePosition(position) {
    return {
        type: UPDATE_POSITION,
        payload: position
    };
    // return async (dispatch, getState) => {
    //     dispatch({
    //         type: UPDATE_POSITION,
    //         payload: position
    //     });
    // };
    
}

export function playbackTrack(track) {
    return {
        type: PLAYBACK_TRACK,
        payload: track
    };
}

export function setBlockStart(position) {
    return {
        type: BLOCK_START_POSITION,
        payload: position
    };
}
export function setBlockEnd(position) {
    return {
        type: BLOCK_END_POSITION,
        payload: position
    };
}

export function updatePlayback() {
    return async (dispatch, getState) => {
        try {
            dispatch(playbackState(await TrackPlayer.getState()));
            dispatch(playbackTrack(await TrackPlayer.getCurrentTrack()));
        } catch(e) {
            // The player is probably not yet initialized
            // which means we don't have to update anything
        }
    };
}

export function navigateTo(screenName) {
    return {
        type: NAVIGATE_TO,
        payload: screenName
    };
}
