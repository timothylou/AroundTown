'use strict';

import React, { Component } from 'react';
import {
StyleSheet,
View,
Text,
TextInput,
} from 'react-native';

import SignupStyle from './SignupStyles';

export default class TextInputBox extends Component{
render() {
   return (
     <View style = {styles.textbox}>
       <Text style = {SignupStyle.textField}> {this.props.title}</Text>
       <TextInput
         style={SignupStyle.textInput}
         selectionColor= {"#00897b"}
         onChangeText={this.props.onChangeText}
         value={this.props.value}
         placeholder={this.props.placeholder}
         placeholderTextColor = {'#bdbdbd'}
         secureTextEntry = {this.props.secure}/>
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
