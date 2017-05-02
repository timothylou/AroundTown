'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import React, {Component} from 'react';
import Signup from './Signup';
import Town from './Town';
import Preferences from './Preferences';

import BaseStyle from './BaseStyles';
import Firebase from './Firebase';
import SignupStyle from './SignupStyles';
import TextInputBox from './TextInputBox';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <View style = {SignupStyle.loginContainer}>
        <TextInputBox
          title = {" Email"}
          onChangeText={(text) => this.setState({email: text})}
          value={this.state.email}
          placeholder={" Your email"}
          secure = {false} />
        <TextInputBox
          title = {" Password"}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder={" Your password"}
          secure = {true} />

        <TouchableHighlight onPress={this.login.bind(this)} style={SignupStyle.primaryButton}
        underlayColor= {"#00695c"}>
          <Text style={SignupStyle.primaryButtonText}>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.goToSignup.bind(this)} style={SignupStyle.transparentButton}
        underlayColor = {"white"}>
          <Text style={SignupStyle.transparentButtonText}>New here?</Text>
        </TouchableHighlight>
      </View>;

    // A simple UI with a toolbar, and content below it.
  	return (
      <KeyboardAwareScrollView style={SignupStyle.containerScrollView}
      contentContainerStyle = {SignupStyle.contentView}
        showsVerticalScrollIndicator = {false}
      >
        {content}
      </KeyboardAwareScrollView>
		);
  }

  async login(){
    this.setState({
      loading: true
    });
    // Log in and display an alert to tell the user what happened.
    await Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password
    ).then((userData) => {
      var currUser = userData;

      let userMobilePath = "/users/" + currUser.uid + "/details/prefs";
      Firebase.database().ref(userMobilePath).once('value').then((snapshot) =>{
        var prefs = snapshot.val();

        prefs['deviceid'] = this.props.deviceInfo.userId;


        fetch('https://herokuflask0.herokuapp.com/post/prefs/', {
          method: 'POST',
          headers: {
                    },
            body: JSON.stringify(prefs),
        }).then().catch( (error)=> console.log("BACKEND POST ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  " + error.message));
        }
      ).catch((error)=> console.log(error.message));

      this.setState({
        loading: false
      });

      alert("Welcome! " + currUser.uid);
      this.props.navigator.push({
        component: Town
      });
    }).catch((error) =>
    	{
	      this.setState({
	        loading: false
	      });
        alert('Login Failed. Please try again' + error.message);
    });


  }

  // Go to the signup page
  goToSignup(){
    this.props.navigator.push({
      component: Signup
    });
  }
}

AppRegistry.registerComponent('Login', () => Login);
