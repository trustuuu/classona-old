import { StyleSheet } from 'react-native';
import iPhoneSize from '../../helpers/utils';
import colors from '../../styles/colors';

let termsTextSize = 13;
let headingTextSize = 30;
if (iPhoneSize() === 'small') {
  termsTextSize = 12;
  headingTextSize = 26;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.homeBlue,
  },
  welcomeWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#405CE5CC'
  },
   logo: {
    width: 200,
    height: 150,
    marginTop: 150,
    marginBottom: 200,
    
  },
   homeImg: {
    width: 100,
    height: 100,
    //marginTop: 300,
  },
  progressIndicator: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  points: {
    textAlign: 'center',
    color: '#feca57',
    fontSize: 25,
    fontWeight: '100',
  },
  container: {

  },            
  overlay: {
      backgroundColor:'#405CE5CC',
      height: '100%'
  },
  countryStyle: {
    resizeMode: 'cover',
      width:80, 
      height: 80,
      //marginTop: 100,
      borderRadius: 50,
      alignSelf: 'center',
  },
  avatarStyle: {
    resizeMode: 'cover',
      // width:250, 
      // height: 100,
      marginTop: 100,
      //borderRadius: 50,
      alignSelf: 'center',
  },
  textStyle: {
      marginTop: 10,
      fontSize: 18,
      color: "#FFFFFF",
      fontWeight: 'bold',
      alignSelf: 'center',
  },
  balanceContainer:{
      padding:10,
  }
});


export default styles;
