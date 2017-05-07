import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Switch
} from 'react-native';
import Style from './Style';
import Colors from './Colors';

import ButtonStyle from './ButtonStyles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CategoryButton extends Component{


  render(){
    return(
      <View style = {ButtonStyle.CategoryButton}>
        <Image style = {{width: 40, height: 40}} source = {this.props.icon}/>
        <Text style = {ButtonStyle.CategoryButtonText}>{this.props.label}</Text>
        <Switch
        onValueChange={this.props.onSwitch}
          style={{marginBottom: 10}}
          onTintColor={Colors.SECONDARY_DARK}
          thumbTintColor={Colors.SECONDARY}
          tintColor={Colors.PRIMARY_LIGHT}
          value={this.props.selected}

        />
      </View>
    );
  }

}
