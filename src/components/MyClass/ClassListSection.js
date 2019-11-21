import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, FlatList, SectionList, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { classAllFetchActions, menuTo } from '../../actions';
import { ListItemSectionSwipable} from './ListItemSwipable';
import { Input, Card, CardSection } from '../common';
import colors from '../../styles/colors';

const button_review = require('../../img/button_review.png');
const button_dic = require('../../img/button_dic.png');
const button_learn = require('../../img/button_learn.png');
const button_refresh = require('../../img/button_refresh.png');
class ClassListSection extends Component {

    componentDidMount()
    {
        //this.props.classAllFetchActions();
        //this.onButtonRefresh();
    }

    async onButtonRefresh()
    {
        await this.props.classAllFetchActions(['className', 'institution', 'instructor']);
    }

    renderHeader = () => {
        return <Input placeholder="Type Here..." lightTheme round />;
     };

    render()
    {
        if ((!this.props.classes) || (!this.props.classes[0].data)) return (<View></View>);
        
        return (
            <View style={styles.wapper}>
                    <SectionList
                        //ListHeaderComponent={this.renderHeader}
                        sections={this.props.classes}
                        renderItem={
                            ({item}) =>  
                            {
                                return (
                                <ListItemSectionSwipable
                                    oClass={item}
                                />
                            );
                            }
                        }
                        
                        renderSectionHeader={
                            ({section}) => {
                                return (
                                        <CardSection style={{backgroundColor:colors.listHeaderColor, padding: 8, fontWeight: "bold"}}>
                                            <Text>{section.className} by {section.instructor} at {section.institution}</Text>
                                        </CardSection>
                                )
                            }
                        }
                    
                        //keyExtractor={oClass => oClass.classId}
                    />

            </View>
        );
    }
}


const MapStateToProps = (state) =>
{
    const { classes } = state.oClass; 
    
    return {classes};
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
});

export default connect(MapStateToProps, {classAllFetchActions})(ClassListSection);
