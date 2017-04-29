'use strict';
import React, {
  StyleSheet
} from 'react-native';

var ButtonStyle = StyleSheet.create({
  RadioButtonOuter:{
      height: 30,
      width: 30,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: '#FF00FF',
      alignItems: 'center',
      justifyContent: 'center',
    },

  RadioButtonInner:{
      height: 20,
      width: 20,
      borderRadius: 10,
      backgroundColor: '#FF00FF',
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
    color: 'blue',
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
    color: 'blue',
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
      borderColor: '#FF00FF',
      alignItems: 'center',
      justifyContent: 'center',
    },

  CheckButtonInner:{
      height: 12,
      width: 12,
      borderRadius: 3,
      backgroundColor: '#FF00FF',
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
    borderRadius: 10,
    elevation: 5,

  },

  ClickButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white'
  },

});


export default ButtonStyle
