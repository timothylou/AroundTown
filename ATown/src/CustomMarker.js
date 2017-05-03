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


// var buttonsCatTest = [
//   { label: "Free Food",
//   id: "freefood",
//   index: 0,
//   selected: true,
//   icon: null,
// },
//
//   {label: "Broken Facility",
//   id: "brokenfacility",
//   index: 1,
//   selected: true,
//   icon: null,
// },
//
//   {label: "Recruiting",
//   id: "recruiting",
//   index: 2,
//   selected: true,
//   icon: null,
// },
//
//   {label: "Study Break",
//   id: "studybreak",
//   index: 3,
//   selected: true,
//   icon: null,
// },
//
//   {label: "Movie Screening",
//   id: "movie",
//   index: 4,
//   selected: true,
//   icon: null,
// },
//
//   {label: "Busy",
//   id: "busy",
//   index: 5,
//   selected: true,
//   icon: null,
// },
//
//   {label: "Fire Safety",
//   id: "firesafety",
//   index: 6,
//   selected: true,
//   icon: null,
// },
//
// ];

export default class CustomMarker extends Component {

  constructor(props){
    super(props);
    this.state= {icon: null}
  }

  componentWillMount() {
        Icon.getImageSource(this.props.marker.icon, 32, '#d32f2f').then((source) => this.setState({ icon: source }));
}

  render(){

    var content =  !this.state.icon ? null: (
      <Marker
      coordinate={
        this.props.marker.coordinate
      }
      image = {this.state.icon}
      title={this.props.marker.view.title}
      >
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
