'use strict';

import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  Image
} from 'react-native';
import { Marker, Callout} from 'react-native-maps';
import Style from './Style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import React, {Component} from 'react';

const markerCircle = '#E91E63';
const markerIcon = 'white';
export default class CustomMarker extends Component {

  constructor(props){
    super(props);
    this.state= {icon: null}
  }

//   componentWillMount() {
//         Icon.getImageSource(this.props.marker.icon, 32, '#d32f2f').then((source) => this.setState({ icon: source}));
// }

  render(){

    var content =  this.state.icon ? null: (
      <Marker
      coordinate={
        this.props.marker.coordinate
      }
      key = {this.props.marker.key}
      title={this.props.marker.view.title}
      >
      <View style={{height: 26, width: 26, borderRadius: 13, backgroundColor: markerCircle , alignItems: 'center', justifyContent: 'center'}}>
        <Icon name={this.props.marker.icon} size={18} color={markerIcon} />

      </View>
        <Callout
          onPress={() => this.props.onCalloutPressed(this.props.marker.modal)}>
          <View >
            <Text >{this.props.marker.view.title}</Text>
          </View>
        </Callout>
      </Marker>
    );

    return(content);
  }
}

AppRegistry.registerComponent('CustomMarker', () => CustomMarker);
