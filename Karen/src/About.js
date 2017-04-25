'use strict';
import {
  AppRegistry,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  ToolbarAndroid,
  StyleSheet,
  Button
} from 'react-native';
import Style from './Style'
import Town from './Town';
import React, {Component} from 'react';

export default class About extends Component {
  render() {
    return (
      <View>
        <Text style = {styles.aboutText}>Thank you for using AroundTown!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  aboutText: {
    fontSize: 20,
    color: 'dimgrey',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 60
  }
})

AppRegistry.registerComponent('About', () => About);
