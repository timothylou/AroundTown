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
import TownStyle from '../styles/TownStyles';
import Colors from '../styles/Colors';

import React, {Component} from 'react';


const mapStyle = [
  {
    'featureType': 'landscape.man_made',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': Colors.MAP_COLOR
      },
      {
        'visibility': 'on'
      },
      {
        'weight': 2
      }
    ]
  }
];

export default class CustomMapView extends Component {

  // Renders a MapView component, with initial region
  render(){
    var landing = ( <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                      <ActivityIndicator size='large'/>
                    </View>);

    var content =  !this.props.regionSet ? (landing):
    (<MapView  style={TownStyle.map}
        initialRegion={this.props.initialRegion}
        onLongPress={this.props.onLongPressHandler}
        onPress={this.props.onPressHandler}
        showsUserLocation	={true}
        showsCompass ={true}
        pitchEnabled= {false}
        showsMyLocationButton	= {true}
        customMapStyle={mapStyle}
        toolbarEnabled={true}
        followsUserLocation	={true}
      >
      {this.props.renderMarkers(this.props.markersList)}
      </MapView>
    );

    return content;
  }


}

AppRegistry.registerComponent('CustomMapView', () => CustomMapView);
