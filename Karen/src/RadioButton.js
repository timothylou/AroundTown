import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

export default class RadioButton extends Component{
  render(){
    return(
      <View>
        <Text>{this.props.label}</Text>
        <TouchableOpacity onPress={this.props.onPress}>
          <View style=
            {{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
            }}>

            {
              this.props.selected ?
              <View style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#000',
              }}/>
              : null
            }

          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
