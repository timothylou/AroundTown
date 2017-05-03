'use strict';
import React, {
  StyleSheet
} from 'react-native';
const background = 'white';
const primary = '#00897b';

var SignupStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: background,
    alignItems: 'stretch',
    flex: 1
  },

  loginContainer: {
    paddingHorizontal: 20,
    paddingVertical: 200,
    backgroundColor: background,
    alignItems: 'stretch',
    flex: 1
  },

  containerScrollView:{
    height: '100%',

    backgroundColor: background,
  },

  contentView: {
      alignItems: 'stretch',
  },

  body: {
    flex: 9,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#F5FCFF',
  },

  textField: {
    fontSize: 14,
    flex:1,
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

});

export default SignupStyle
