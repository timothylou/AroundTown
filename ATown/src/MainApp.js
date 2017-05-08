'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  Text,
  View,
  ToolbarAndroid,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
} from 'react-native';

// Pages
import Signup from './Signup';
import Login from './Login';
import Town from './Town';
import UserDetails from './UserDetails';
import Preferences from './Preferences';
import Tutorial from './Tutorial'
import Colors from './Colors';

// Firebase utils
import Firebase from './Firebase';

// OneSignal import
import OneSignal from 'react-native-onesignal';

// Styles and titles
import Style from './Style'
import BaseStyle from './BaseStyles.js';

import TitleBar from './TitleBar'


/* ------------------------------------------------------------------------- */
/*  Main ATown Component
/* ------------------------------------------------------------------------- */


class ATown extends Component {

  constructor(props){
    super(props);
    this.state = {
      // Default page
      page: null,
      // Loaded?
      loaded: false,
      deviceInfo: null,
    };

    this.onIds = this.onIds.bind(this);
  }

  // push notifications
  async componentDidMount() {
    var device = await AsyncStorage.getItem('device');
    this.setState({deviceInfo: JSON.parse(device)})
    OneSignal.inFocusDisplaying(1);
  }

  // Called before component is mounted.
  componentWillMount(){
    // Check if logged in, ...
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(1);

    console.log('Added listener!!!');

    const unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
      // If logged in, then go to main app
      if (user != null) {
        this.setState({page: Town});

        return;
      }
      // else go to login page.
      this.setState({page: Login});
      // unsubscribe the onAuthStateChanged observer
      unsubscribe();
    });
  }

  componentWillUnmount() {
   OneSignal.removeEventListener('ids', this.onIds);
   console.log('RemovedEventListener!!');
  }

  async onIds(device) {
   console.log('Device info: ', device);
   await AsyncStorage.setItem('device', JSON.stringify(device));
   this.setState({deviceInfo: device});

  }

  render() {
    var deviceInfo = this.state.deviceInfo;
    // If the page has been selected go to appropriate page
    if (this.state.page){
      return (
        <View style={{flex:1}}>
          <StatusBar
            backgroundColor={Colors.PRIMARY_DARK}
            barStyle="light-content"
          />
          <Navigator
            initialRoute={{component: this.state.page}}
            configureScene={() => {
              // SceneConfigs + gesturs: {} to prevent swipe-to-go-back
              return {... Navigator.SceneConfigs.FloatFromRight, gestures: {}};
            }}
            renderScene={(route, navigator) => {
              if(route.component){
                // Pass the navigator to the component so it can navigate as well.
                return React.createElement(route.component, { navigator, deviceInfo,});
              }
          }} />
        </View>
      );
    }
    // else go to a landing/loading view
    else{
      return(
        <View style={BaseStyle.container}>
          <View style={BaseStyle.body}>
            <ActivityIndicator size="large"/>
          </View>
        </View>
      );
    }
  }
}

AppRegistry.registerComponent('ATown', () => ATown);
