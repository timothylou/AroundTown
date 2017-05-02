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


var buttonsCatTest = [
  { label: "Free Food",
  id: "freefood",
  index: 0,
  selected: true,
  icon: require('./icons/freefood.png'),
},

  {label: "Broken Facility",
  id: "brokenfacility",
  index: 1,
  selected: true,
  icon: require('./icons/brokenfacility.png'),
},

  {label: "Recruiting",
  id: "recruiting",
  index: 2,
  selected: true,
  icon: require('./icons/recruiting.png'),
},

  {label: "Study Break",
  id: "studybreak",
  index: 3,
  selected: true,
  icon: require('./icons/studybreak.png'),
},

  {label: "Movie Screening",
  id: "movie",
  index: 4,
  selected: true,
  icon: require('./icons/movie.png'),
},

  {label: "Busy",
  id: "busy",
  index: 5,
  selected: true,
  icon: require('./icons/busy.png'),
},

  {label: "Fire Safety",
  id: "firesafety",
  index: 6,
  selected: true,
  icon: require('./icons/firesafer.png'),
},

];

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
          onPress={() => this.props.onCalloutPressed(this.props.marker.modal)}>
          <View >
            <Text >{this.props.marker.view.title}</Text>
          </View>
        </Callout>
      </Marker>
    );
  }
}

AppRegistry.registerComponent('CustomMarker', () => CustomMarker);
