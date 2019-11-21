import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { updatePosition } from '../actions'
import { formatTime } from '../helpers/utils';

class ProgressBar extends ProgressComponent {

    componentWillUpdate()
    {
        TrackPlayer.getState()
        .then(currentState => {
            if (currentState == TrackPlayer.STATE_PLAYING) {
                this.props.dispatch(updatePosition(this.state.position + 1)); //> 5 ? this.state.position - 4 : this.state.position));
            }
        });
    }
    render() {

        const position = formatTime(Math.floor(this.state.position));
        const duration = formatTime(Math.floor(this.state.duration));
        const info = position + ' / ' + duration;

        let progress = this.getProgress() * 100;
        let buffered = this.getBufferedProgress() * 100;
        buffered -= progress;
        if(buffered < 0) buffered = 0;

        return (
            <View style={styles.view}>
                <Text style={styles.info}>{info}</Text>
                <TouchableWithoutFeedback>
                    <View style={styles.bar}>
                        <View style={[{width: progress + '%'}, styles.played]} />
                        <View style={[{width: buffered + '%'}, styles.buffered]} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        width: '100%'
    },
    info: {
        color: '#c0c0c0',
        fontSize: 16,
        fontWeight: '300',
        //margin: 10
    },
    bar: {
        backgroundColor: '#575757',
        height: 5,
        width: '100%',
        //margin: 10,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    played: {
        backgroundColor: '#03A9F4',
        height: 5
    },
    buffered: {
        backgroundColor: '#797979',
        height: 5
    }
});

export default connect(null)(ProgressBar)
//module.exports = ProgressBar;
