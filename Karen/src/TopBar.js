'use strict';

import React, { Component } from 'react';
import {
StyleSheet,
View,
Text,
ToolbarAndroid
} from 'react-native';

export default class TopBar extends Component{
render() {
  var navigator = this.props.navigator;
   return (
    <ToolbarAndroid
     title={this.props.title}
     navIcon={require('./icons/ic_menu_white_24dp.png')}
     style = {styles.toolbar}
     titleColor={'white'}
     onIconClicked={this.props.sidebarRef}/>
    );
 }
}

const styles = StyleSheet.create({
  toolbar: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    flex : 1
  }
});
