import React, {Component} from 'react';
import { ListView, Text, Button, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import {Header, CardSection, Card} from './common';
//import { MediaItem } from './MediaItem';
import { Actions } from 'react-native-router-flux';
import colors from '../styles/colors'

import { connect } from 'react-redux';
import { classAllFetchActions } from '../actions';

class SortClass extends Component {
    constructor(props) {
        super(props);  
      }



    async onSelectSort()
    {
        await this.props.classAllFetchActions(null);
        Actions.mainContainer();
    }
    
    onSelectFilter()
    {
        Actions.mainContainer();
        //Actions.classItem2({oClass: this.props.oClass});
    }

    async onSelectGroupBy(groupBy)
    {
        await this.props.classAllFetchActions(groupBy);
    }

    render(){
        //const {className, instructor, institution, media} = this.props.oClass;

        return (
            // <ScrollView bounces={true}>
            
            <Card>
            <Header>Filter or Sort</Header>
                <CardSection>
                    <Text style={styles.titleStyle}>Sort By</Text>
                </CardSection>
                <CardSection>
                    <Button style={styles.titleStyle} title="Date" onPress={ async () => this.onSelectSort() }>                            
                   </Button>
                </CardSection>

            <Header>Filter or Sort</Header>
                <CardSection>
                    <Text style={styles.titleStyle}>Group By</Text>
                </CardSection>
                <CardSection>
                    <Button style={styles.titleStyle} title="Class / Instutition / Instructor" onPress={ async () => this.onSelectGroupBy(['className', 'institution', 'instructor', 'instructorDisplayName']) }>                            
                   </Button>
                </CardSection>

            <Header>Filter or Sort</Header>
                <CardSection>
                    <Text style={styles.titleStyle}>Group By</Text>
                </CardSection>
                <CardSection>
                    <Button style={styles.titleStyle} title="Class" onPress={ () => this.onSelectGroupBy(['className', 'institution']) }>                            
                   </Button>
                </CardSection>

                <CardSection style={{flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={[{flexDirection: 'column', justifyContent: 'center'}]} onPress={()=> Actions.pop()}>
                        <Image style={styles.button} source={require('../img/save.png')}></Image>
                        <Text style={{textAlign: 'center'}}>Close</Text>
                    </TouchableOpacity>
                </CardSection>
            </Card>

            //</ScrollView>

        );
    }

}

const styles = {
    titleStyle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.green01,
      paddingLeft: 15
    },
    descStyle: {
        fontSize: 10,
        paddingLeft: 20
    },
    button: {
        width: 50,
        height: 50,
        //marginLeft: 100,
    }
  };

//export default SideMenu;

const mapStateToProps = (state) => {
    const {oClass} = state.sideMenu;
    return { oClass };
}

export default connect(mapStateToProps, { classAllFetchActions })(SortClass);