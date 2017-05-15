'use strict';

import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  Image,
  StyleSheet,
} from 'react-native';
import { Marker, Callout} from 'react-native-maps';
import Style from '../styles/Style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../styles/Colors';

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
          tooltip={true}
          onPress={() => this.props.onCalloutPressed(this.props.marker.modal)}
          >
          <View style={styles.container}>
            <View style={{
              backgroundColor: Colors.WHITE,
              borderRadius: 6,
              borderColor: '#ccc',
              borderWidth: 0.5,
              padding: 5,
              width:(this.props.marker.view.title.length*10 > 100 ? this.props.marker.view.title.length*10  : 100)}}
            >
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                <View style={{flex:8}}>
                  <Text style={{textAlign: 'center', fontSize: 16, color: Colors.PRIMARY}} >{this.props.marker.view.title}</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Icon name='timer' size={12} color={Colors.BLACK}/>
                    <Text style={{fontSize: 10, textAlign: 'left', }}>{' ' + (Math.floor(this.props.marker.modal.timeago/60) > 0 ? Math.floor(this.props.marker.modal.timeago/60).toString() + 'h ' : '') + (this.props.marker.modal.timeago%60).toString()+'m ago'}</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', flex:2}}>
                  <Icon name='chevron-right' size={20} color={Colors.PRIMARY}/>
                </View>
              </View>
            </View>
            <View style={styles.arrow} />
          </View>
        </Callout>
      </Marker>
    );

    return(content);
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-end',

  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
  },


});

AppRegistry.registerComponent('CustomMarker', () => CustomMarker);
