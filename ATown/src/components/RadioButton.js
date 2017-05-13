import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import Style from '../styles/Style';

import ButtonStyle from '../styles/ButtonStyles.js';

export default class RadioButton extends Component{

  render(){
    return(
      <View style={ButtonStyle.RadioButtonContainer}>
        <View style={ButtonStyle.RadioButtonTitleContainer}>
          <Text style={ButtonStyle.RadioButtonTitle}>{this.props.label}</Text>
        </View>
        <TouchableWithoutFeedback style={ButtonStyle.RadioButtonTouchable}
          onPress={this.props.onPress}>
          <View style={ButtonStyle.RadioButtonOuter}>

            {
              this.props.selected ?
              <View style={ButtonStyle.RadioButtonInner}/>
              : null
            }

          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
