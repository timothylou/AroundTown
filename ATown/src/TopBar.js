'use strict';

import React, { Component } from 'react';
import {
StyleSheet,
View,
Text,
ToolbarAndroid,
Image
} from 'react-native';

var Icon = require('react-native-vector-icons/MaterialCommunityIcons');

export default class TopBar extends Component{
render() {
  var navigator = this.props.navigator;
   return (
    <ToolbarAndroid
     title={this.props.title}
     navIcon = {require('./icons/ic_menu_white_18dp.png')}
     style = {styles.toolbar}
     titleColor={'white'}
     onIconClicked={this.props.sidebarRef}/>
    );
 }
}

const styles = StyleSheet.create({
  toolbar: {
    padding: 10,

    flexDirection: 'row',
    height: 55,
    backgroundColor: "#2196F3",
    elevation:10
  }
});
