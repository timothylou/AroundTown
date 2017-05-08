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
import Colors from './Colors';

import React, {Component} from 'react';

const markerCircle = Colors.PRIMARY;
const markerIcon = Colors.WHITE;
export default class CustomMarker extends Component {





  render(){

    var content = (
      <Marker
      coordinate={
        this.props.marker.coordinate
      }
      key = {this.props.marker.key}
      title={this.props.marker.view.title}
      >
      <View style={{height: 24, width: 24, borderRadius: 12, backgroundColor: markerCircle , alignItems: 'center', justifyContent: 'center', elevation: 5}}>
        <Icon name={this.props.marker.icon} size={16} color={markerIcon} />
      </View>
        <Callout
          style={{width: (this.props.marker.view.title.length*10 > 70 ? this.props.marker.view.title.length*10  : 70)}}
          onPress={() => this.props.onCalloutPressed(this.props.marker.modal)}>
          <View >
            <Text style={{textAlign: 'center', fontSize: 16,}} >{this.props.marker.view.title}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Icon name="timer" size={12} color={Colors.BLACK}/>
              <Text style={{fontSize: 10, textAlign: 'left', }}>{" " + (Math.floor(this.props.marker.modal.timeremaining/60) > 0 ? Math.floor(this.props.marker.modal.timeremaining/60).toString() + "h " : "") + (this.props.marker.modal.timeremaining%60).toString()+"m left"}</Text>

            </View>
          </View>
        </Callout>
      </Marker>
    );

    return(content);
  }
}

AppRegistry.registerComponent('CustomMarker', () => CustomMarker);
