import React, { Component } from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'

const ToggleSwitch = (props) => {
   return (
      <View style = {[styles.container, props.containerStyle]}>
          { props.label ? <Text style={[styles.label, props.labelStyle]}>{props.label}</Text> : <View></View> }
         <Switch
            onValueChange = {props.toggleSwitch}
            value = {props.switchValue}
            trackColor={{true: '#405CE5'}}
         />
      </View>
   )
}
const styles = StyleSheet.create ({
   container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 20,
      marginRight: 20,
      //marginTop: 100
   },
   label: {
      fontFamily: 'GillSans-Light',
      fontSize: 18,
      color: '#AFB1C1',
      //width: 100
   }
})



export { ToggleSwitch };
