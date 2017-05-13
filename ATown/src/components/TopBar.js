'use strict';

import React, { Component } from 'react';
import {
StyleSheet,
View,
Text,
Image,

} from 'react-native';
import {ToolbarAndroid} from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../styles/Colors';


export default class TopBar extends Component{
render() {
  var navigator = this.props.navigator;
   return (
    <ToolbarAndroid
     title={this.props.title}
     style = {styles.toolbar}
     logoName	= {this.props.logoName}
     navIconName='menu'
     titleColor={Colors.SECONDARY}
     onIconClicked={this.props.sidebarRef}/>
    );
 }
}

const styles = StyleSheet.create({
  toolbar: {
    padding: 5,
    flexDirection: 'row',
    height: 55,
    backgroundColor: Colors.PRIMARY,
    elevation:10
  }
});
