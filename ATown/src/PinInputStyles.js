'use strict';
import React, {
  StyleSheet
} from 'react-native';

import Colors from './Colors';

var PinInputStyle = StyleSheet.create({
  MainContainer:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 10,
  },

  topBar:{
    flex:1,
    justifyContent: 'center',
    borderRadius: 10,
  },

  inputContainer:{
    paddingHorizontal: 10,
    flex:9,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  displayContainer:{
    flex:6,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  topBarText:{
    flex:1,
    fontSize: 18,
    fontWeight: "400",
    backgroundColor: Colors.PRIMARY_DARK,
    color: Colors.SECONDARY,
    textAlignVertical: 'center',

  },


  disptopBarText:{
    flex:1,
    fontSize: 20,
    fontWeight: "400",
    backgroundColor: Colors.PRIMARY_DARK,
    color: Colors.SECONDARY,
    textAlignVertical: 'center',

  },

  TitleInputContainer:{
    flex:1,
  },

  TitleInputTitle:{
    flex:1,
    fontSize: 20,
    color: Colors.BLACK,
  },
  TitleInputTextBox:{},

  DescriptionInputContainer:{
    flex:2,
  },
  DescriptionInputTitle:{
    flex:1,
    fontSize: 20,
    color: Colors.BLACK,
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
    color: Colors.LIGHTER_GREY,
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
    backgroundColor: Colors.TRANSPARENT_GREY,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PinInputStyle
