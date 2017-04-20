'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator
} from 'react-native';
import BaseStyle from './BaseStyles.js';
import Login from './Login';
import Town from './Town';
import Preferences from './Preferences';
import React, {Component} from 'react';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // used to display a progress indicator if waiting for a network response.
      loading: false,
      // entered credentials
      email: '',
      password: '',
      fname: '',
      lname: '',
      netid: '',
      cyear: null,
      uid: null
    }
  }

  // A method to passs the username and password to firebase and make a new user account
  signup() {
    this.setState({
      // When waiting for the firebase server show the loading indicator.
      loading: true
    });

    // Make a call to firebase to create a new user.
    this.props.firebaseApp.auth().createUserWithEmailAndPassword(
      this.state.email,
      this.state.password).then((userData) => {
        // then and catch are methods that we call on the Promise returned from
        // createUserWithEmailAndPassword
        // this.props.firebaseApp.auth().currentUser.then((userData) => const user = userData;).done();
        let userMobilePath = "/users/" + userData.uid + "/details";

        this.props.firebaseApp.database().ref(userMobilePath).set({
          fname: this.state.fname,
          lname: this.state.lname,
          cyear: parseInt(this.state.cyear),
          netid: this.state.netid

        }).catch( (error)=> console.log("Done with fetching from Firebase        " + error.message));

        console.log("done with firebase");

        fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/newuser/', {
            method: 'POST',
            headers: {
            },
            body: JSON.stringify({
              email: this.state.email,
              fname: this.state.fname,
              lname: this.state.lname,
              cyear: parseInt(this.state.cyear),
              netid: this.state.netid,
              uid: userData.uid
              // fname: "karen",
              // lname: "zhang",
              // cyear: 2019,
              // netid: 'kz7',
              // uid: '4m8124kOXAcN5qCpFYY9dtHIrpH2'
            })
          }).then().catch( (error)=> console.log("Done with fetching from tim       " + error.message));
        console.log("Done with fetching from tim");

        alert('Your account was created!' + userData.uid);


        // this.props.firebaseApp.child("users").child(userData.uid).set({
        //   provider: userData.provider,
        //   name: this.state.name,
        // });

        this.props.firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password
        ).then((userData) =>
          {
            this.setState({
              loading: false
            });
            this.props.navigator.push({
              component: Preferences
            });
          }
        ).catch((error) =>
          {
            this.setState({
              loading: false
            });
            alert('Login Failed. Please try again' + error.message);
        });

        this.setState({
          // Clear out the fields when the user logs in and hide the progress indicator.
          email: '',
          password: '',
          fname: '',
          lname: '',
          netid: '',
          cyear: null,
          uid: null,

          loading: false,

        });
    }).catch((error) => {
      // Leave the fields filled when an error occurs and hide the progress indicator.
      this.setState({
        loading: false
      });
      alert("Account creation failed: " + error.message );
    });
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <View>
        <TextInput
          style={BaseStyle.textInput}
          onChangeText={(text) => this.setState({email: text})}
          value={this.state.email}
          placeholder={"Email Address"} />
        <TextInput
          style={BaseStyle.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
          placeholder={"Password"} />
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => this.setState({fname: text})}
            value={this.state.name}
            placeholder={"First Name"} />
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => this.setState({lname: text})}
            value={this.state.name}
            placeholder={"Last Name"} />
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => this.setState({cyear: text})}
            value={this.state.name}
            placeholder={"class year"} />
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => this.setState({netid: text})}
            value={this.state.name}
            placeholder={"netid"} />
        <TouchableHighlight onPress={this.signup.bind(this)} style={BaseStyle.primaryButton}>
          <Text style={BaseStyle.primaryButtonText}>Signup</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.goToLogin.bind(this)} style={BaseStyle.transparentButton}>
          <Text style={BaseStyle.transparentButtonText}>Go to Login</Text>
        </TouchableHighlight>
      </View>;


    // A simple UI with a toolbar, and content below it.
        return (
                <View style={BaseStyle.container}>
                        <ToolbarAndroid
          style={BaseStyle.toolbar}
          title="Signup" />
        <View style={BaseStyle.body}>
          {content}
        </View>
      </View>
    );
  }

  goToLogin(){
    this.props.navigator.push({
      component: Login
    });
  }
}

AppRegistry.registerComponent('Signup', () => Signup);
