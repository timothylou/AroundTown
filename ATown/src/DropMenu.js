import React, { Component } from 'react';
import {
  Picker,
  StyleSheet
} from 'react-native'

export default class PickerExample extends Component{
  render() {
   return (
      <Picker
        selectedValue = {this.props.value}
        onValueChange = {this.props.updateValue}>
         <Picker.Item label = "Java" value = "java" />
         <Picker.Item label = "JavaScript" value = "js" />
      </Picker>
   );
 }
}
