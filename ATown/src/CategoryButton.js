import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Switch,
} from 'react-native';
import Style from './Style';
import Colors from './Colors';

import ButtonStyle from './ButtonStyles.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CategoryButton extends Component{


  render(){
    return(
      <View style = {ButtonStyle.CategoryButton}>
        <View style={{height: 40, width: 40, borderRadius: 20, backgroundColor: this.props.selected ? Colors.PRIMARY: Colors.PRIMARY, alignItems: 'center', justifyContent: 'center', elevation: 5}}>
          <Icon name={this.props.icon} size={25} color={this.props.selected ? Colors.SECONDARY: Colors.LIGHTER_GREY} />
        </View>
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

// <Switch
//   onValueChange={(value) => this.setState({selected: value})}
//   style={{marginBottom: 10}}
//   value={this.state.selected}
// />
