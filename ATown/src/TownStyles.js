'use strict';
import React, {
  StyleSheet
} from 'react-native';

var TownStyle = StyleSheet.create({
  checkBoxContainer:{
    position: 'absolute',
    top:0,
    bottom:500,
    left: 0,
    right:0,
  },
  rootContainer: {
      flex: 1,
      // flexDirection: 'row'
  },
  mapContainer: {
    flex:20,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },

  map: {
    // flex:1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
});

  export default TownStyle
