'use strict';
import React, {
  StyleSheet
} from 'react-native';

var PinInputStyle = StyleSheet.create({
  MainContainer:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  TitleInputContainer:{
    flex:1,
  },
  TitleInputTitle:{
    flex:1,
    fontSize: 20,
    color: '#000000'
  },
  TitleInputTextBox:{},

  DescriptionInputContainer:{
    flex:4,
  },
  DescriptionInputTitle:{
    flex:1,
    fontSize: 20,
    color: '#000000'
  },
  DecriptionInputTextBox:{},

  InputTitleText:{},

  TimerBarContainer:{
    flex:1,
  },

  TimerText:{
    flex:1,
    fontSize: 20,
    color: '#000000'
  },

  TimerSlider:{},

  CategoryButtonListContainer:{
    flex:5,
  },

  RadioButtonListContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },


  ConfirmationButtonsContainer:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  ViewButtonListContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PinInputStyle