import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Style from '../styles/Style';
import Colors from '../styles/Colors';

import ButtonStyle from '../styles/ButtonStyles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class FilterButton extends Component{

  render(){
    return(
      <View style={ButtonStyle.RadioButtonContainer}>
        <TouchableWithoutFeedback style={ButtonStyle.CheckButtonTouchable}
          onPress={this.props.onPress}>

            {
              this.props.selected ?
              <Icon name={this.props.icon} size={30} color={Colors.SECONDARY} />
              : <Icon style = {{opacity: 0.35}} name={this.props.icon} size={28} color={Colors.PRIMARY} />
            }

        </TouchableWithoutFeedback>

      </View>
    );
  }
}
