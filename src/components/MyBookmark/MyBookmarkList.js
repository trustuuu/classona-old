import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getClassBookmarks } from '../../actions';
import MyBookmarkListItem from './MyBookmarkListItem';
import { Input, OptimizedFlatList, FlatListItem } from '../common';

import ImageButton from '../common/ImageButton';
import colors from '../../styles/colors';

import iconArrow from '../../icons/arrow.png';
import iconPlay from '../../icons/play.png';
import iconPause from '../../icons/pause.png';
import iconPrevious from '../../icons/previous.png';
import iconNext from '../../icons/next.png';


class MyBookmarkList extends Component {
        constructor(props) {
        super(props);
        // this.state = {
        //         ttsStatus: 'stopped',
        //         enterTime: null,
        //     };
      }
    
    componentDidMount()
    {
    }

    omponentWillUnmount()
    {
    }

    onButtonRefresh()
    {
        
    }

    renderHeader = () => {
        return <Input containerStyle={{marginLeft:10, marginRight:5, marginTop:5, marginBottom:5,
            borderRadius: 25, height:50, backgroundColor:'#FFFFFF' }}
            inputStyle={{borderRadius: 25, paddingBottom:10, backgroundColor:'#FFFFFF' }}
            type='search' placeholder="Search Here..." lightTheme round />;
     };

    playing = () => {
    }

    readText = async () => {

    };

    render()
    {
        return (
            <View style={styles.wapper}>
                <View style={{flex: 1}}>
                    <ScrollView
                        bounces={true}
                    >
                    <OptimizedFlatList
                        ListHeaderComponent={this.renderHeader}
                        data={this.props.bookmarks}
                            renderItem={({item}) => {
                                return (
                                    <ListItemPhrase
                                        bookmark={item}
                                    />
                                );
                            }
                        }

                        keyExtractor={bookmark => bookmark.bookmarkId}
                    />
                    </ScrollView>
                </View>
            </View>
            
        );
    }
}


const MapStateToProps = ({oClass}) =>
{
    const {bookmarks} = oClass;
    return {bookmarks};
}


const styles = StyleSheet.create({
    wapper: {
    flex: 1,
    flexDirection: 'column',
    },

    buttonContainer: {
    //flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    },

   button: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: colors.green01,
    },
    controlIcon: {
        width: 40,
        height: 40
    },
    playPause: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ffffff',
        padding: 10,
        marginHorizontal: 15
    }
});

export default connect(MapStateToProps, {getClassBookmarks})(MyBookmarkList);
