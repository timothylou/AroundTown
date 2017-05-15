'use strict';
import React, {
  StyleSheet
} from 'react-native';
import Colors from './Colors';

var BaseStyle = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1
  },
  body: {
    flex: 9,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: Colors.WHITE,
  },
  toolbar: {
        height: 56,
    backgroundColor: Colors.LIGHT_GREY,
  },
  textInput: {
    flex: 1,
    fontSize: 8,
    borderWidth: 0
  },
  transparentButton: {
    marginTop: 10,
    padding: 15
  },
  transparentButtonText: {
    color: Colors.TRANSP_BUTTON_TEXT,
    textAlign: 'center',
    fontSize: 16
  },
  primaryButton: {
    margin: 10,
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 4,
  },
  primaryButtonText: {
    color: Colors.SECONDARY,
    textAlign: 'center',
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100
  }
});

export default BaseStyle
