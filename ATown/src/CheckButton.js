import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import Style from './Style';

import ButtonStyle from './ButtonStyles.js';

export default class CheckButton extends Component{

  render(){
    return(
      <View style={ButtonStyle.CheckButtonContainer}>
        <TouchableWithoutFeedback style={ButtonStyle.CheckButtonTouchable}
          onPress={this.props.onPress}>
          <View style={ButtonStyle.CheckButtonOuter}>

            {
              this.props.selected ?
              <View style={ButtonStyle.CheckButtonInner}/>
              : null
            }

          </View>
        </TouchableWithoutFeedback>
        <View style={ButtonStyle.CheckButtonTitleContainer}>
          <Text style={ButtonStyle.CheckButtonTitle}>{this.props.label}</Text>
        </View>
      </View>
    );
  }
}
