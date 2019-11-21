import React, {Component} from 'react';
import {View, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

import { connect } from 'react-redux';
import {CardSection, Card} from '../common';
import Swipeout from 'react-native-swipeout';
import colors from '../../styles/colors';

import {deleteMyLanguage} from '../../actions'


class MyLanguageListItem extends Component {
    constructor(props){
        super(props);
    }

    onSelect()
    {
    }

    render(){
        const {languageId, language, description, classMeta} = this.props.language;
        console.log('this.props.language => ', this.props.language);

        let deleteButton = {
            text: 'Delete',
            backgroundColor: '#d63031',
            underlayColor: '#dfe6e9',
            onPress: () => {
                this.props.deleteMyLanguage(languageId); 
                }
        }

        let swipeBtns = [deleteButton];
        //let swipeBtns = bookmark ? [unBookmarkButton] : [bookmarkButton];
        //if (!this.props.bookmark) swipeBtns.push(deleteButton);
        if (classMeta == undefined){
            return(
                <Card>
                    <Swipeout right={swipeBtns}
                        autoClose={true}
                        backgroundColor= 'transparent'>
                        <TouchableHighlight underlayColor='#0984e3'>
                            <View>
                                <CardSection>
                                    <TouchableOpacity style={styles.titleStyle} title={language} onPress={ () => this.onSelect() }>
                                        <Text style={styles.titleStyle}>{language} </Text>
                                    </TouchableOpacity>
                                </CardSection>
                                
                                <CardSection>
                                    <Text style={styles.descStyle}>{languageId}</Text>
                                </CardSection>
                                <CardSection>
                                    <Text style={styles.descStyle}>{description}</Text>
                                </CardSection>
                            </View>
                        </TouchableHighlight>
                    </Swipeout>
                </Card>
            )
        }

        return(
            <Card>
                <Swipeout right={swipeBtns}
                    autoClose={true}
                    backgroundColor= 'transparent'>
                    <TouchableHighlight underlayColor='#0984e3'>
                        <View>
                            <CardSection>
                                <TouchableOpacity style={styles.titleStyle} title={language} onPress={ () => this.onSelect() }>
                                    <Text style={styles.titleStyle}>{language} </Text>
                                </TouchableOpacity>
                            </CardSection>
                            
                            <CardSection>
                                <Text style={styles.descStyle}>{description} </Text>
                            </CardSection>

                            <CardSection>
                                <Text style={styles.descStyle}>{languageId} [{classMeta}]</Text>
                            </CardSection>
                        </View>
                    </TouchableHighlight>
                </Swipeout>
            </Card>
        )
    }
}



const styles = {
    titleStyle: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.green01,
      paddingLeft: 5,
      textAlign: 'left'
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20
      }
  };



const MapStateToProps = (state) =>
{
    //console.log('org state', state);
    //const { classes } = state.oClass; 
    
    return {};
}


export default connect(MapStateToProps, {deleteMyLanguage})(MyLanguageListItem);