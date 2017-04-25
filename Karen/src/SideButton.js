'use strict';

import React, { Component } from 'react';
import {
StyleSheet,
View,
Text,
TouchableHighlight,
} from 'react-native';

export default class SideButton extends Component{
render() {
   return (
     <View>
      <TouchableHighlight
        underlayColor = 'dimgrey'
        onPress={this.props.onPress}>
          <View>
            <Text style = {styles.drawerButton}>{this.props.buttonText}</Text>
          </View>
        </TouchableHighlight>
     </View>
    );
 }
}

const styles = StyleSheet.create({
  drawerButton: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  }
});
