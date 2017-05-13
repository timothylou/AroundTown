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

// Firebase utils
import Firebase from '../utils/Firebase';

//
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
export default class Login extends Component {

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
        <TextInputBox
          title = {' Email'}
          onChangeText={(text) => this.setState({email: text})}
          value={this.state.email}
          placeholder={' Your email'}
          secure = {false} />
        <TextInputBox
          title = {' Password'}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder={' Your password'}
          secure = {true} />

        <TouchableHighlight onPress={this.login.bind(this)} style={SignupStyle.primaryButton}
        underlayColor= {Colors.PRIMARY_DARK}>
          <Text style={SignupStyle.primaryButtonText}>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.goToSignup.bind(this)} style={SignupStyle.transparentButton}
        underlayColor = {'white'}>
          <Text style={SignupStyle.transparentButtonText}>New here?</Text>
        </TouchableHighlight>
      </View>;

    // Toolbar + main View
  	return (
      <KeyboardAwareScrollView style={SignupStyle.containerScrollView}
      contentContainerStyle = {SignupStyle.contentView}
        showsVerticalScrollIndicator = {false}
        scrollEnabled = {false}
        keyboardShouldPersistTaps = "always"
      >
        {content}
      </KeyboardAwareScrollView>
		);
  }

  // Login
  async login(){
    this.setState({
      loading: true
    });
    // Log in and display an alert to tell the user what happened.
    await Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password
    ).then((userData) => {
      var currUser = userData;

      // Load stored prefs from Firebase and post to backend (which will further post to OneSignal for notifs)
      let userMobilePath = '/users/' + currUser.uid + '/details/prefs';
      Firebase.database().ref(userMobilePath).once('value').then((snapshot) =>{
        var prefs = snapshot.val();

        // New deviceId!
        prefs['deviceid'] = this.props.deviceInfo.userId;

        // Backend post
        fetch(backendUrl+'post/prefs/', {
          method: 'POST',
          headers: {
                    },
            body: JSON.stringify(prefs),
        }).then().catch( (error)=> console.log('BACKEND POST ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  ' + error.message));
        }
      ).catch((error)=> console.log(error.message));


      // Custome alert!
      Firebase.database().ref('/users/' + currUser.uid + '/details').once('value').then((snapshot) =>{
        var fname = snapshot.val().fname;
        alert('Welcome back, ' + fname+ '!');
      }).catch((error)=> console.log(error.message));
      AsyncStorage.setItem('eventsVoted', ',');
      this.setState({
        loading: false
      });


      // Login was successful so go to Town!
      this.props.navigator.replace({
        component: Town
      });
    }).catch((error) =>
    	{
	      this.setState({
	        loading: false
	      });
        // Somethings wrong...
        alert('Sorry, but ' + error.message);
    });


  }

  // Go to the signup page
  goToSignup(){
    this.props.navigator.replace({
      component: Signup
    });
  }
}

AppRegistry.registerComponent('Login', () => Login);
