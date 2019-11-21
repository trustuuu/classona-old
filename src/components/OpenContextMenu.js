import React, { Component } from 'react';
import { ActionSheetIOS } from 'react-native';

const OpenContextMenu = (event, word, callback) => {
  ActionSheetIOS.showActionSheetWithOptions({
    options: ['Add to dictionary', 'Add to bookmark', 'Add to favorites', 'Replay', 'Cancel'],
    cancelButtonIndex: 4,
    title: 'Actions',
    //message : 'What do you want to do now?'
  }, (buttonIndexThatSelected) => {
    // Do something with result
    //console.log('buttonIndexThatSelected=>', buttonIndexThatSelected);
    if (buttonIndexThatSelected !== 4){
      if(callback && typeof callback === 'function') callback();
    }

  });

};

export default OpenContextMenu;
