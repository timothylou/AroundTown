import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Style from './Style';

import ButtonStyle from './ButtonStyles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class FilterButton extends Component{

  render(){
    return(
      <View style={ButtonStyle.CheckButtonContainer}>
        <TouchableWithoutFeedback style={ButtonStyle.CheckButtonTouchable}
          onPress={this.props.onPress}>

            {
              this.props.selected ?
              <Icon name={this.props.icon} size={35} color="#3F51B5" />
              : <Icon style = {{opacity: 0.35}} name={this.props.icon} size={32} color="#3F51B5" />
            }

        </TouchableWithoutFeedback>

      </View>
    );
  }
}
