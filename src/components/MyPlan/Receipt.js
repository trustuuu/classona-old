import React, { Component } from 'react';
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  View, style
} from 'react-native';

import * as RNIap from 'react-native-iap';
import { Actions } from 'react-native-router-flux';

// import NativeButton from 'apsl-react-native-button';
// import EStyleSheet from 'react-native-extended-stylesheet';


class Receipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchViewVisible: false,
    };
  }

  handleBack = () => {
    Actions.pop();
  };

  onNaverLogout = () => {
    Actions.signOutFormModal();
  };

  renderFinishTransaction() {
    if (Platform.OS === 'android') return null;
    
    return (
      <TouchableOpacity title='FinishTransaction' onPress={ () => this.finishTransaction() }>
          <Text>Finish Transaction</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Navbar showBack={true} handleBack={this.handleBack}>
            Receipt
          </Navbar>
        </View>
        <View style={styles.content}>
          <ScrollView style={{ alignSelf: 'stretch' }}>
            <Text style={styles.txtResult}>
              {this.props.receipt}
            </Text>
            {this.renderFinishTransaction()}
            <NativeButton
              onPress={this.onNaverLogout}
              activeOpacity={0.5}
              style={styles.btnNaverLogin}
              textStyle={styles.txtNaverLogin}
            >
              LOGOUT
            </NativeButton>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : '$statusSize',
    paddingTop: Platform.OS === 'ios' ? '$statusPaddingSize' : 0,
    backgroundColor: 'white',
  },
  header: {
    flex: 8.8,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 87.5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  txtResult: {
    fontSize: '$fontSize',
    padding: '$8',
  },
  btnNaverLogin: {
    height: '$48',
    width: '240 * $ratio',
    alignSelf: 'center',
    backgroundColor: '#00c40f',
    borderRadius: 0,
    borderWidth: 0,
  },
  txtNaverLogin: {
    fontSize: '$fontSize',
    color: 'white',
  },
};

export default Receipt;