'use strict';

import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  Image,
  ActivityIndicator,
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
    var landing = ( <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                      <ActivityIndicator size="large"/>
                    </View>);
    var content =  !this.props.regionSet ? (landing):(<MapView  style={TownStyle.map}
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

    return content;
  }

}

AppRegistry.registerComponent('CustomMapView', () => CustomMapView);
