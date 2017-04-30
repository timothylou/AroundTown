'use strict';

import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import MapView from 'react-native-maps';
import Style from './Style';
import RadioButton from './RadioButton';
import React, {Component} from 'react';

export default class CheckButtonList extends Component {

  // Constructor
  constructor(props){
    super(props);
    this._renderCheckButtons = this._renderCheckButtons.bind(this);

  }


  // Renders a list of CheckButtons
  render(){
    return(
      <View>
        {this._renderCheckButtons(this.props.buttonsList)}
      </View>
    );
  }

  _renderCheckButtons(buttonsList){
    let buttons = [];
    if (buttonsList == null){
      buttonsList = [];
    }

    for (var b = 0; b < buttonsList.length; b++){
      var curronPress = this.props.onPress
      var currLabel = buttonsList[b].label;
      var currSelected = buttonsList[b].selected;
      var currId = buttonsList[b].id;
      var currIndex = buttonsList[b].index;

      buttons.push(
        <RadioButton
          label = {currLabel}
          selected = {currSelected}
          onPress = {curronPress}
          index = {currIndex}
          key = {currId}/>
      );
    }

    return buttons;

  }
}

AppRegistry.registerComponent('CheckButtonList', () => CheckButtonList);
