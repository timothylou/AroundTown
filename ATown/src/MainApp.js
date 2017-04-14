'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  Text,
  View,
  ToolbarAndroid,
  ActivityIndicator
} from 'react-native';

// Pages
import Signup from './Signup';
import Login from './Login';
import Town from './Town';

// Firebase Utils
import * as firebase from 'firebase';

// Styles and titles
import Style from './Style'
import TitleBar from './TitleBar'

// Config for firebaseApp
var firebaseConfig = {
  apiKey: "AIzaSyDeX_9Y3OPvz8xD9kTReYDEpFWNiWbz9gw",
  authDomain: "aroundtown-deead.firebaseapp.com",
  databaseURL: "https://aroundtown-deead.firebaseio.com",
  projectId: "aroundtown-deead",
  storageBucket: "aroundtown-deead.appspot.com",
  messagingSenderId: "532018067815"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);


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
      loaded: false
    };
  }

  // Called before component is mounted.
  componentWillMount(){
    // Check if logged in, ...
    const unsubscribe = firebaseApp.auth().onAuthStateChanged((user) => {
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

  render() {
    // If the page has been selected go to appropriate page
    if (this.state.page){
      return (

        <Navigator
          initialRoute={{component: this.state.page}}
          configureScene={() => {
            // SceneConfigs + gesturs: {} to prevent swipe-to-go-back
            return {... Navigator.SceneConfigs.FloatFromRight, gestures: {}};
          }}
          renderScene={(route, navigator) => {
            if(route.component){
              // Pass the navigator to the component so it can navigate as well.
              // Pass firebaseApp so it can make calls to firebase.
              return React.createElement(route.component, { navigator, firebaseApp});
            }
        }} />
      );
    }
    // else go to a landing/loading view
    else{
      return(
        <View style={Style.rootContainer}>
          <TitleBar title={"PATIENCE"} loading={false}/>
          <View style={Style.inputContainer}>
            <ActivityIndicator size="large" />
          </View>
        </View>
      );
    }
  }
}

AppRegistry.registerComponent('ATown', () => ATown);
