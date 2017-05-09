'use strict';
import React, {
  StyleSheet,
  Dimensions,
} from 'react-native';
import Colors from './Colors';

const background = 'white';
const primary = Colors.PRIMARY;
let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height


var SignupStyle = StyleSheet.create({
  container: {
    paddingHorizontal: windowWidth*0.05,
    paddingVertical: windowHeight*0.05,
    backgroundColor: background,
    alignItems: 'stretch',
    flex: 1
  },

  loginContainer: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 100,
    backgroundColor: background,
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1
  },

  containerScrollView:{
    height: '100%',
    backgroundColor: background,
  },

  contentView: {
    backgroundColor: background,
    alignItems: 'stretch',
    justifyContent: 'center',
  },

  body: {
    flex: 9,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#F5FCFF',
  },

  textField: {
    fontSize: 16,
    fontWeight: '200',
    flex:1,
    color: '#212121',
  },

  textInput: {
    flex: 1,
    //height: 30,
    fontSize: 18,
    //width: 200,
    borderWidth: 0,
  },

  transparentButton: {
    flex: 1,
    marginTop: 10,
    padding: 15
  },

  transparentButtonText: {
    color: primary,
    textAlign: 'center',
    fontSize: 16
  },

  primaryButton: {
    margin: 10,
    padding: 15,
    flex: 1,
    backgroundColor: primary,
    elevation: 2,
    borderRadius: 4,

  },

  primaryButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
  },

  logoFont:{
    color: Colors.PRIMARY,
    fontFamily: 'Calibri',
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: '400' ,
    elevation: 20
  },

  logo:{
    width: 90,
    height: 90,
    alignSelf: 'center',
    padding: 10
  },

});

export default SignupStyle
