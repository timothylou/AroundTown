'use strict';
import React, {
  StyleSheet
} from 'react-native';
import Colors from './Colors';

const checkButtonColor = Colors.PRIMARY_DARK;

var ButtonStyle = StyleSheet.create({
  RadioButtonOuter:{
      height: 30,
      width: 30,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: Colors.PRIMARY_DARK,
      alignItems: 'center',
      justifyContent: 'center',
    },

  RadioButtonInner:{
      height: 20,
      width: 20,
      borderRadius: 10,
      backgroundColor: Colors.PRIMARY_DARK,
    },

  RadioButtonListContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  RadioButtonTitleContainer:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  RadioButtonTitle:{
    fontSize: 8,
    color: Colors.PRIMARY_DARK,
    textAlign:'center',
  },

  RadioButtonTouchable:{
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  RadioButtonContainer:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  // CheckButton styles for CheckButton.js
  CheckButtonListContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  CheckButtonContainer:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },


  CheckButtonTitleContainer:{
    flex:5,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  CheckButtonTitle:{
    fontSize: 15,
    color: Colors.PRIMARY_DARK,
  },

  CheckButtonTouchable:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  CheckButtonOuter:{
      height: 30,
      width: 30,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: checkButtonColor,
      alignItems: 'center',
      justifyContent: 'center',
    },

  FilterButtonOuter:{
      height: 34,
      width: 34,
      borderRadius: 4,
      borderWidth: 0,
      borderColor: checkButtonColor,
      alignItems: 'center',
      justifyContent: 'center',
    },

  CheckButtonInner:{
      height: 20,
      width: 20,
      borderRadius: 3,
      backgroundColor: checkButtonColor,
    },


  HorizontalButtonListContainer:{
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },

  ClickButtonTouchable:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 5,
    elevation: 2,

  },

  ClickButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white'
  },

  CategoryButton: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 8,
  },

  CategoryButtonText : {
    flex: 1,
    fontSize: 18,
    color: Colors.BLACK,
    justifyContent: 'center',
    alignContent: 'center',
    paddingLeft: 10,
    paddingTop: 10,
  },

  UserButton: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 8,
  },

  UserButtonText : {
    flex: 1,
    flexDirection: 'row',
    fontSize: 18,
    color: Colors.BLACK,
    justifyContent: 'center',
    alignContent: 'center',
    paddingLeft: 10,
    paddingTop: 8,
  },

  UserInfoText : {
    flex: 2,
    flexDirection: 'row',
    fontSize: 18,
    color: Colors.LIGHT_GREY,
    justifyContent: 'flex-start',
    textAlign: 'left',
    paddingTop: 8,
  },

});


export default ButtonStyle
