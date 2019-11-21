import React, {Component} from 'react';
import {Provider} from 'react-redux';
import * as firebase from 'firebase';
import 'firebase/firestore';

import RouterComponent from './RouterComponent';
import store from './Store';
import TrackPlayer from 'react-native-track-player';
import {AppState} from 'react-native';

import {updatePlayback} from './actions';

class App extends Component {

  componentWillMount() {
    const config = {
      apiKey: 'AIzaSyDoL-799FteCnz5m5cmnV10YmdA25UmwPM',
      authDomain: 'simplylearning-a27c2.firebaseapp.com',
      databaseURL: 'https://simplylearning-a27c2.firebaseio.com',
      projectId: 'simplylearning-a27c2',
      storageBucket: 'simplylearning-a27c2.appspot.com',
      messagingSenderId: '541110045029',
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    
    // Initialize Cloud Firestore through Firebase
    var db = firebase.firestore();

    // Disable deprecated features
    db.settings({
      //timestampsInSnapshots: true,
    });

    AppState.removeEventListener('change', this._handleStateChange);
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleStateChange);

    // TODO remove temp code
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        //TrackPlayer.CAPABILITY_SEEK_TO,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_PLAY_FROM_SEARCH,
        TrackPlayer.CAPABILITY_SKIP,
      ],
    });
  }

  _handleStateChange(appState) {
    if (appState == 'active') {
      // Updates the playback information when the app is back from background mode
      store.dispatch(updatePlayback());
    }
  }

  render() {
    return (
      <Provider store={store}>
        <RouterComponent />
      </Provider>
    );
  }
}

export default App;

module.exports = function(store) {
  //console.log("export store =>", store);
  //App.store = store;
  //console.log("export App.store =>", App, App.store);
  return App;
};
