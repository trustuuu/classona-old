import React from 'react';
import { TextInput, View, Text, Image } from 'react-native';

const Input = (props) => {
  const { label, value, multiline, onSubmitEditing, onChangeText, placeholder, secureTextEntry } = props;
  const { inputInnerStyle, labelInnerStyle, containerInnerStyle } = styles;

  if (label)
  {
    return (
      <View style={[containerInnerStyle, props.containerStyle]}>
        <Text style={[labelInnerStyle, props.labelStyle]}>{label}</Text>
        <TextInput
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          autoCorrect={false}
          multiline={multiline}
          style={[inputInnerStyle, props.inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    );
  }
  else
  {
    return (
      <View style={[containerInnerStyle, props.containerStyle]}>
        {props.type == 'search' ? <Image style={{marginLeft:10, width:20, height:20}} source={require('../../img/search.png')}></Image>  : <View></View>}
        <TextInput
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          autoCorrect={false}
          multiline={multiline}
          style={[inputInnerStyle, props.inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    );
  }
};

const styles = {
  inputInnerStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 14,
    lineHeight: 23,
    flex: 2,
    //borderRadius: 25,
    backgroundColor: '#FFFFFF',
    width: 311,
    height: 50,

  },
  labelInnerStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1
  },
  containerInnerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
};

export { Input };
