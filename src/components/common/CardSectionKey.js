import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

class CardSectionKey extends React.Component{

  render() {
    const {sectionKey} = this.props;

    return (
      <View key={sectionKey} style={[styles.containerStyle, this.props.style]}>
        {this.props.children}
      </View>
    );

  };

};

CardSectionKey.propTypes = {
  sectionKey: PropTypes.string,
};


const styles = {
  containerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  }
};

export default CardSectionKey;
