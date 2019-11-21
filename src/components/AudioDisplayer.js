import React from 'react';
import { View, Dimensions } from 'react-native';
import colors from '../styles/colors';

const AudioDisplayer = ({data, height, width, max, multiplyer}) => {
    const boxHeights = data.map((oneBoxHeight) => (height + (oneBoxHeight * multiplyer)));
    const numOfBoxes = Dimensions.get('window').width/width;
    return (
        <View key={boxHeights.toString()} style={{
            flexDirection: 'row',
            height: height,
            alignItems : 'flex-end',
            justifyContent: 'flex-end',
        }}>
        {
            boxHeights.slice(-1 * (numOfBoxes)).map((boxHeight, index) => {
                return (
                    <View key={index} style={{height: boxHeight, width: width, marginRight: 1, backgroundColor: colors.green01 }}/> 
                );
            })
        }
        </View>
    );
}

export default AudioDisplayer;
