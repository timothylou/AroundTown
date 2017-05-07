'use strict';

import React, { Component } from 'react';
import {
StyleSheet,
View,
Text,
TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from './Colors';

export default class SideButton extends Component{
render() {
   return (
     <View>
      <TouchableHighlight
        style={{paddingVertical:10}}
        underlayColor = {Colors.UNDERLAY_GREY}
        onPress={this.props.onPress}>
          <View style={{flexDirection: 'row'}}>
            <Icon name={this.props.icon} size={30} color={Colors.SECONDARY} />
            <Text style = {styles.drawerButton}>{this.props.buttonText}</Text>
          </View>
        </TouchableHighlight>
     </View>
    );
 }
}

const styles = StyleSheet.create({
  drawerButton: {
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: Colors.SECONDARY,
  }
});
