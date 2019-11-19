import React, { PureComponent, PropTypes } from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';

class ImageButton extends PureComponent {

    render() {
        const {onPress, label, style, imageStyle, disabled, ...props} = this.props;

        return (
            <TouchableOpacity onPress={onPress}
                              style={[style, {borderWidth: 0, paddingLeft: 20,flexDirection: 'column', justifyContent: 'center'}]}
                              disabled={disabled}>
                <Image {...props} style={imageStyle}/>
                {label ? <Text style={{textAlign: 'center'}}>{label}</Text> : <View></View>}
            </TouchableOpacity>
        );
    }
}

module.exports =  ImageButton;
