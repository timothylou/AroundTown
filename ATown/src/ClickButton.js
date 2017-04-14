'use strict';

import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import React, {Component} from 'react';

export default class ClickButton extends Component {
  render(){
    return(
      <View>
        <TouchableHighlight underlayColor={this.props.buttonUnderlayColor}
          onPress={this.props.onPress}
          style={this.props.buttonStyle}>
          <View>
            <Text style={this.props.buttonTextStyle}
            >{this.props.buttonText}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

AppRegistry.registerComponent('ClickButton', () => ClickButton);
