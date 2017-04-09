import CheckBox from 'react-native-checkbox';
import React, { Component } from 'react';

export default class CheckButton extends Component{

  render(){
    return(
      <CheckBox
        label='Label'
        checked={this.props.checked}
        onChange={(checked) => this.props.onChange(checked)}
      />);

  }
}
