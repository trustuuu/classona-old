/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);


import {AppRegistry} from 'react-native';
import App from './src/App';
//import App from './App';
import {name as appName} from './app.json';
import store from './src/Store';
import TrackPlayer from 'react-native-track-player';

import createEventHandler from './src/actions/event-handler';

import {decode, encode} from 'base-64';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

AppRegistry.registerComponent(appName, () => App());
//createEventHandler(store);
TrackPlayer.registerEventHandler(createEventHandler(store));

