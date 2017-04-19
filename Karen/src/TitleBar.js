'use strict';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {Component} from 'react';

import GiftedSpinner from 'react-native-gifted-spinner';

export default class TitleBar extends Component {

  render(){
    return(
      <View style={titleStyle.header}>
        <View style={titleStyle.headerTitle}>
          <Text style={titleStyle.headerText}>{this.props.title}</Text>
        </View>
        <View style={titleStyle.headerLoader}>
          {this.props.loading && <GiftedSpinner/>}
        </View>
      </View>
    );

  }
}

const titleStyle = StyleSheet.create({
    header:{
      padding: 10,
      alignItems: 'center',
      flexDirection: 'row',
      flex : 1
    },

    headerTitle:{
      padding: 5,
      flex: 9,
    },

    headerLoader:{
      padding: 5,
      flex: 1,
    },

    headerText:{
      fontSize: 18,
      color: 'black' //Black!
    },

});
