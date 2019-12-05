import React from 'react';
import { View, ScrollView } from 'react-native';

const Card = (props) => {
  return (
    <View>
      <View style={[styles.containerStyle, props.containerStyle]}>
        {props.children}
      </View>
    </View>
  );
};

const styles = {
  containerStyle: {
    borderWidth: 0,
    borderRadius: 2,
    borderColor: '#dddd',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    // shadowColor: '#0000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  }
};

export { Card };
