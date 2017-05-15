'use strict';

import React, { Component } from 'react';
import {
StyleSheet,
View,
Text,
TextInput,
} from 'react-native';

import SignupStyle from '../styles/SignupStyles';
import Colors from '../styles/Colors';

export default class TextInputBox extends Component{
render() {
   return (
     <View style = {styles.textbox}>
       <Text style = {SignupStyle.textField}> {this.props.title}</Text>
       <TextInput
         style={SignupStyle.textInput}
         selectionColor= {Colors.PRIMARY}
         underlineColorAndroid = {Colors.PRIMARY}
         placeholderTextColor = {Colors.DARK_GREY}
         onChangeText={this.props.onChangeText}
         value={this.props.value}
         placeholder={this.props.placeholder}
         secureTextEntry = {this.props.secure}
         maxLength = {this.props.maxLength}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textbox: {
    flex: 1,
    paddingBottom: 10,
  }

})
