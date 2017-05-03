'use strict';

import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import MapView from 'react-native-maps';
import TownStyle from './TownStyles';

import React, {Component} from 'react';

const mapStyle = [
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#856d5a"
      },
      {
        "visibility": "on"
      },
      {
        "weight": 2
      }
    ]
  }
];
export default class CustomMapView extends Component {

  //
  constructor(props){
    super(props);


  }

  // Renders a MapView component, with initial region
  render(){
    return(
      <MapView  style={TownStyle.map}
        initialRegion={this.props.initialRegion}
        onLongPress={this.props.onLongPressHandler}
        onPress={this.props.onPressHandler}
        showsUserLocation	={true}
        showsMyLocationButton	= {true}
        customMapStyle={mapStyle}
        followsUserLocation	={true}
      >
      {this.props.renderMarkers(this.props.markersList)}
      </MapView>
    );
  }

}

AppRegistry.registerComponent('CustomMapView', () => CustomMapView);
