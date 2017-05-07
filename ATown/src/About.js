'use strict';
import {
  AppRegistry,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  ToolbarAndroid,
  StyleSheet,
  Button,
  DrawerLayoutAndroid,
  Image
} from 'react-native';
import Style from './Style'
import Town from './Town';
import Preferences from './Preferences'
import TopBar from './TopBar';
import SideButton from './SideButton';

import Firebase from './Firebase'
import React, {Component} from 'react';
import Colors from './Colors';

export default class About extends Component {

  render() {
    return (
      <View style={{backgroundColor: Colors.PRIMARY}}>
        <Text style = {styles.aboutText}>{"Thank you for using AroundTown! \n Made with \u2764 by Hrishi, Tim and Karen \n Visit us at https://tinyurl.com/hootapp 	😎"}</Text>
      </View>
    );
  }

  _setDrawer() {
    this.refs['DRAWER'].openDrawer();
  }

}

const styles = StyleSheet.create({
  aboutText: {
    fontSize: 20,
    color: Colors.SECONDARY,
    textAlign: 'center',
    textAlignVertical: 'center',
  }
})
