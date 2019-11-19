import React from 'react';
import PulseLoader from 'react-native-pulse-loader';

class App extends React.Component {
  render() {
    return (
      <PulseLoader
        avatar={'http://www.igoodworks.com/images/logo.png'}
      />
    );
  }
}