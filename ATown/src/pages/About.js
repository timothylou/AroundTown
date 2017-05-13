'use strict';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

import React, {Component} from 'react';
import Colors from '../styles/Colors';

export default class About extends Component {

  render() {
    return (
      <View style={{backgroundColor: Colors.PRIMARY}}>
      <Image
        style={{width: 250, height: 250, alignSelf: 'center'}}
        source={require("../icons/team.jpg")}
      />
      <Text style = {styles.aboutText}>{'Thank you for using Owl! \n Made with \u2764 by Hrishi, Tim and Karen \n Visit us at https://tinyurl.com/hootapp 	😎'}</Text>
      </View>
    );
  }

  _setDrawer() {
    this.refs['DRAWER'].openDrawer();
  }
r
}

const styles = StyleSheet.create({
  aboutText: {
    fontSize: 20,
    color: Colors.SECONDARY,
    textAlign: 'center',
    textAlignVertical: 'center',
  }
})
