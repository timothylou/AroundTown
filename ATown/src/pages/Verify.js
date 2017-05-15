'use strict';

// Generic Components
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  AsyncStorage,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';

import React, {Component} from 'react';

// External components
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Custom Conponents
import TextInputBox from '../components/TextInputBox';

// Pages
import Signup from './Signup';
import Town from './Town';
import Preferences from './Preferences';
import Login from './Login';

// Firebase utils
import Firebase from '../utils/Firebase';

// Utils
import backendUrl from '../utils/Config';
// Styles
import SignupStyle from '../styles/SignupStyles';
import BaseStyle from '../styles/BaseStyles';


// Colors!!
import Colors from '../styles/Colors';

// Screen size
let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height


// Component for the login page.
export default class Verify extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: ''
    }
  }

  render() {
    // If loading then ActivityIndicator else
    const content = this.state.loading ?
    <View style = {{height: windowHeight, width: windowWidth, justifyContent: 'center', alignItems: 'stretch'}}>
      <ActivityIndicator size='large'/>
    </View> :
      <View style = {SignupStyle.loginContainer}>
        <Image
          source={require('../icons/hoot2.png')}
          style={SignupStyle.logo}
        />
        <Text style={SignupStyle.logoFont}>Owl</Text>
        <Text style={{fontSize: 18, color: Colors.PRIMARY, textAlign: 'center', padding: 10,}}>{"Please verify your email! This let's Owl know that you are a real bird 🐦"}</Text>
        <TouchableHighlight onPress={this.sendEmail.bind(this)} style={SignupStyle.primaryButton}
        underlayColor= {Colors.PRIMARY_DARK}>
          <Text style={SignupStyle.primaryButtonText}>Send email again</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.verify.bind(this)} style={SignupStyle.primaryButton}
        underlayColor= {Colors.PRIMARY_DARK}>
          <Text style={SignupStyle.primaryButtonText}>Verify</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.logout.bind(this)} style={SignupStyle.primaryButton}
        underlayColor= {Colors.PRIMARY_DARK}>
          <Text style={SignupStyle.primaryButtonText}>Logout</Text>
        </TouchableHighlight>
      </View>;

    // Toolbar + main View
  	return (
      <KeyboardAwareScrollView style={SignupStyle.containerScrollView}
      contentContainerStyle = {SignupStyle.contentView}
        showsVerticalScrollIndicator = {false}
        scrollEnabled = {true}
        keyboardShouldPersistTaps = "always"
      >
        {content}
      </KeyboardAwareScrollView>
		);
  }

  // Send Email!
  async sendEmail(){
    this.setState({
      loading: true
    });
    var currUser = await Firebase.auth().currentUser;
    var displayMessage = "";
    if(currUser.displayName == null){
      displayMessage = "We just sent you an email!";
    }
    else{
      displayMessage = currUser.displayName + ", we just sent you an email!";
    }
    currUser.sendEmailVerification().then(() => alert(displayMessage)).catch((error) => alert("Oops, there was an error " + error.message));
    this.setState({
      loading: false,
    });

  }

  async verify(){
    this.setState
    this.setState({
      loading: true
    });
    // Log in and display an alert to tell the user what happened.
    var currUser = await Firebase.auth().currentUser;
    currUser.reload();
    if(currUser.emailVerified){
      this.setState({
        loading: false,
      });
      this.props.navigator.replace({
        component: Preferences
      });
    }
    else{
      this.setState({
        loading: false,
      });
      alert("Seems like you aren't verified yet! Please try again.")
    }

  }

  // Go to the signup page
  logout(){
    var ret = fetch(backendUrl+'logout/',
      {
        method: 'POST',

        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({deviceid: this.props.deviceInfo.userId })
      });

    Firebase.auth().signOut().then(() => {
      this.props.navigator.replace({
        component: Login
      });
    }).catch((error)=> console.log('Done with fetching frombackend' + error.message));
  }
}

AppRegistry.registerComponent('Verify', () => Verify);
