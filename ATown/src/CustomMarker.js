'use strict';

import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import { Marker, Callout} from 'react-native-maps';
import Style from './Style';

import React, {Component} from 'react';

export default class CustomMarker extends Component {
  constructor(props){
    super(props);


  }


  render(){
    return(
      <Marker
      coordinate={
        this.props.marker.coordinate
      }
      title={this.props.marker.view.title}
      >
        <Callout
          onPress={() => this.props.onCalloutPressed(this.props.marker.modal.description)}>
          <View >          
            <Text >{this.props.marker.view.title}</Text>
          </View>
        </Callout>
      </Marker>
    );
  }
}

AppRegistry.registerComponent('CustomMarker', () => CustomMarker);
