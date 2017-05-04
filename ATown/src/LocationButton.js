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
  constructor(props)
  {
    super(props);
    this.state = {selected: false};
    this.switchChange = this.switchChange.bind(this);
  }

  render(){
    return(
      <View style = {ButtonStyle.CategoryButton}>
        <Image style = {{width: 40, height: 40}} source = {this.props.icon}/>
        <Text style = {ButtonStyle.CategoryButtonText}>{this.props.label}</Text>
        <Switch
        onValueChange={(value) => this.switchChange(value)}
          style={{marginBottom: 10}}
          value={this.state.selected}
        />
      </View>
    );
  }

  switchChange(value) {
    this.setState({selected: value});
    this.props.onSwitch();
  }
}
