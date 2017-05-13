import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Switch,
  TouchableHighlight,
} from 'react-native';
import Style from '../styles/Style';
import Colors from '../styles/Colors';

import ButtonStyle from '../styles/ButtonStyles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class UserDetailButton extends Component{

  render(){
    return(
      <View style = {ButtonStyle.UserButton}>
        <Text style = {ButtonStyle.UserButtonText}>{this.props.label}</Text>
        <Text style = {ButtonStyle.UserInfoText} >{this.props.info}</Text>
        { this.props.editable ?
        <TouchableHighlight onPress={this.props.onPressEdit} underlayColor = {Colors.TRANSPARENTER_GREY}>
          <Icon name = 'pencil' size = {25} color = {Colors.LIGHT_GREY}/>
        </TouchableHighlight>  : <Icon name = 'pencil' size = {25} color = {Colors.TRANSPARENT}/>
        }
      </View>
    );
  }

}
