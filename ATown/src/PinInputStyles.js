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
    flex:2,
  },
  DescriptionInputTitle:{
    flex:1,
    fontSize: 20,
    color: '#000000'
  },
  DecriptionInputTextBox:{},

  InputTitleText:{},

  TimerBarContainer:{
    flex:1.5,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  TimerText:{
    fontSize: 15,
    color: '#000000',
  },

  TimerSlider:{},

  CategoryButtonListContainer:{
    flex:5,
  },

  RadioButtonListContainer:{
    flex: 1.3,
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
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PinInputStyle
