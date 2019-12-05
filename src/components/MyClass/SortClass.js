import React, {Component} from 'react';
import { ListView, Text, Button, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import {Header, CardSection, Card, ToggleSwitch} from '../common';
//import { MediaItem } from './MediaItem';
import { Actions } from 'react-native-router-flux';
import colors from '../../styles/colors'

import { connect } from 'react-redux';
import { classAllFetchActions } from '../../actions';

class SortClass extends Component {
    constructor(props) {
        super(props);  
        this.state = {
            switchDateValue: false,
            switchClassValue: false,
            switchInstitutionValue: false,
            switchInstructorValue: false,
        }
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

    onClickOk = async () =>
    {
        //console.log(['className', 'institution', 'instructor', 'instructorDisplayName']);
        let groupBy = this.state.switchClassValue ? ['className'] : [];
        groupBy = this.state.switchInstitutionValue ? [...groupBy, 'institution'] : groupBy;
        groupBy = this.state.switchInstructorValue ? [...groupBy, 'instructor', 'instructorDisplayName'] : groupBy;
        
        let sortBy = this.state.switchDateValue ? 'Date' : '';

        if (sortBy == '')
        {
            console.log('groupBy', groupBy);
            await this.props.classAllFetchActions(groupBy);
        }
        else{
            await this.props.classAllFetchActions(null);
            Actions.mainContainer();
        }
        
    }

    toggleSwitchDate = (value) => {
        this.setState({switchDateValue: value, switchClassValue: false, switchInstitutionValue: false, switchInstructorValue: false})
     }

     toggleSwitchClass = (value) => {
        this.setState({switchClassValue: value, switchDateValue: false})
     }

     toggleSwitchInstitution = (value) => {
        this.setState({switchInstitutionValue: value, switchDateValue: false})
     }

     toggleSwitchInstructor= (value) => {
        this.setState({switchInstructorValue: value, switchDateValue: false})
     }


    render(){
        //const {className, instructor, institution, media} = this.props.oClass;

        return (

        <View style={{flex:1, flexDirection:'column', justifyContent: 'space-between', alignItems:'stretch'}}>
            <View style={{backgroundColor:'#405CE5', paddingTop: 30}}>
                <Header viewStyle={{backgroundColor:'#405CE5'}}
                        textStyle={{fontSize:14, fontFamily: 'GillSans-SemiBold', textTransform: 'uppercase', color: colors.white}}
                        headerText="Filter or Sort" />
            </View>

            <View>
                <Card containerStyle={{borderWidth: 0, paddingLeft:10, paddingRight:10}}>

                    <Header viewStyle={{justifyContent: 'flex-start', alignItems: 'flex-start', borderWidth: 0, height:40, marginTop:20}}
                        textStyle={{fontSize:14, fontFamily: 'GillSans-SemiBold'}}
                        headerText="Sort By" />

                    <CardSection  style={{borderRadius: 25}}>
                        <ToggleSwitch label='Date'
                                toggleSwitch = {this.toggleSwitchDate}
                                switchValue = {this.state.switchDateValue}
                        />
                    </CardSection>

                    <Header viewStyle={{justifyContent: 'flex-start', alignItems: 'flex-start', borderWidth: 0, height:40, marginTop:20}}
                        textStyle={{fontSize:14, fontFamily: 'GillSans-SemiBold'}}
                        headerText="Group By" />

                    <View style={{borderRadius: 25, backgroundColor: colors.white}}>
                        <CardSection style={styles.cardSectionStyle}>
                            {/* <Button style={styles.titleStyle} title="Class / Instutition / Instructor" onPress={ async () => this.onSelectGroupBy(['className', 'institution', 'instructor', 'instructorDisplayName']) }>                            
                        </Button> */}
                        <ToggleSwitch label='Class'
                                    toggleSwitch = {this.toggleSwitchClass}
                                    switchValue = {this.state.switchClassValue}
                            />
                        </CardSection>
                        <CardSection style={styles.cardSectionStyle}>
                            <ToggleSwitch label='Institution'
                                    toggleSwitch = {this.toggleSwitchInstitution}
                                    switchValue = {this.state.switchInstitutionValue}
                            />
                        </CardSection>
                        <CardSection style={styles.cardSectionStyle}>
                            <ToggleSwitch label='Instructor'
                                    toggleSwitch = {this.toggleSwitchInstructor}
                                    switchValue = {this.state.switchInstructorValue}
                            />
                        </CardSection>
                    </View>
                </Card>
            </View>

            <View style={{flex:1, flexDirection: 'row', justifyContent:'center', alignItems:'flex-end'}}>
                <TouchableOpacity style={styles.buttonStyle} onPress={async () => { console.log('click onClose');  await this.onClickOk() } }>
                    <Text style={{textAlign: 'center', color:'white'}}>Ok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonStyle} onPress={()=> {Actions.pop()}}>
                    <Text style={{textAlign: 'center', color:'white'}}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>

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
    buttonStyle: {
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 40, 
        backgroundColor: '#405CE5',
        borderRadius: 25, 
        height: 48, 
        width: 150, 
        margin:5
    },
    cardSectionStyle: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    }
  };

//export default SideMenu;

const mapStateToProps = (state) => {
    const {oClass} = state.sideMenu;
    return { oClass };
}

export default connect(mapStateToProps, { classAllFetchActions })(SortClass);