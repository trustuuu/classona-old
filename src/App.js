import React, { Component } from "react";
import { Provider } from "react-redux";
import * as firebase from "firebase";
import "firebase/firestore";

import RouterComponent from "./RouterComponent";
import store from "./Store";
import TrackPlayer from "react-native-track-player";
import { AppState } from "react-native";

import { updatePlayback } from "./actions";

class App extends Component {
  componentWillMount() {
    const config = {
      apiKey: Process.eve.apiKey,
      authDomain: Process.eve.authDomain,
      databaseURL: Process.eve.databaseURL,
      projectId: Process.eve.projectId,
      storageBucket: Process.eve.storageBucket,
      messagingSenderId: Process.eve.messagingSenderId,
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

    AppState.removeEventListener("change", this._handleStateChange);
  }

  async componentDidMount() {
    AppState.addEventListener("change", this._handleStateChange);

    // TODO remove temp code
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      jumpInterval: 0,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        //TrackPlayer.CAPABILITY_SEEK_TO,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_PLAY_FROM_SEARCH,
        TrackPlayer.CAPABILITY_PLAY_FROM_ID,
        TrackPlayer.CAPABILITY_JUMP_FORWARD,
        TrackPlayer.CAPABILITY_JUMP_BACKWARD,
        TrackPlayer.CAPABILITY_SEEK_TO,
        TrackPlayer.CAPABILITY_SKIP,
      ],
    });
  }

  _handleStateChange(appState) {
    if (appState == "active") {
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
