'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Picker,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import SignupStyle from './SignupStyles';
import TextInputBox from './TextInputBox';
import Login from './Login';
import Town from './Town';
import Preferences from './Preferences';
import Tutorial from './Tutorial';
import Firebase from './Firebase';
import React, {Component} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Colors from './Colors';

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

    if(false){

    }
    else{
      // Make a call to firebase to create a new user.
      Firebase.auth().createUserWithEmailAndPassword(
        this.state.email,
        this.state.password).then((userData) => {
          // then and catch are methods that we call on the Promise returned from
          // createUserWithEmailAndPassword
          // Firebase.auth().currentUser.then((userData) => const user = userData;).done();
          let userMobilePath = "/users/" + userData.uid + "/details";

          Firebase.database().ref(userMobilePath).set({
            fname: this.state.fname,
            lname: this.state.lname,
            cyear: this.state.cyear,
            netid: this.state.netid,
            uid: userData.uid

          }).catch( (error)=> console.log("Done with fetching from Firebase        " + error.message));
          var setPreferences = {
            "category" : {
              "brokenfacility" : "false",
              "busy" : "false",
              "firesafety" : "false",
              "freefood" : "false",
              "movie" : "false",
              "recruiting" : "false",
              "studybreak" : "false"
            },
            "location" : {
              "butler" : "false",
              "forbes" : "false",
              "mathey" : "false",
              "rocky" : "false",
              "whitman" : "false",
              "wilson" : "false"
            }
          };
          var fireBasePayload = {
            userid: userData.uid,
            // deviceid: this.props.deviceInfo.userId,
            tags: setPreferences,
          };

          Firebase.database().ref(userMobilePath +"/prefs").set(fireBasePayload);

          console.log("done with firebase");

          fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/newuser/', {
              method: 'POST',
              headers: {
              },
              body: JSON.stringify({
                email: this.state.email,
                fname: this.state.fname,
                lname: this.state.lname,
                cyear: this.state.cyear,
                netid: this.state.netid,
                uid: userData.uid
                // fname: "karen",
                // lname: "zhang",
                // cyear: 2019,
                // netid: 'kz7',
                // uid: '4m8124kOXAcN5qCpFYY9dtHIrpH2'
              })
            }).then().catch( (error)=> console.log("Done with fetching from tim       " + error.message));


          var payload = {
            userid: userData.uid,
            deviceid: this.props.deviceInfo.userId,
            tags: setPreferences,
          };
          console.log("done with firebase");


          fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/prefs/', {
            method: 'POST',
            headers: {
                      },
              body: JSON.stringify(payload),
          }).then().catch( (error)=> console.log("BACKEND POST ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  " + error.message));
          console.log("Done with fetching from tim");

          alert('Your account was created!');


          // Firebase.child("users").child(userData.uid).set({
          //   provider: userData.provider,
          //   name: this.state.name,
          // });

          Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password
          ).then((userData) =>
            {
              this.setState({
                loading: false
              });
              this.props.navigator.replace({
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
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <View style = {SignupStyle.container}>
          <TextInputBox
            title = {" Email"}
            onChangeText={(text) => this.setState({email: text})}
            value={this.state.email}
            placeholder={" example@princeton.edu"}
            secure = {false}/>

          <TextInputBox
            title = {" Password"}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            placeholder={" Enter a password"}
            secure = {true}/>

          <TextInputBox
            title = {" First Name"}
            onChangeText={(text) => this.setState({fname: text})}
            value={this.state.fname}
            placeholder={" Your first name"}
            secure = {false}/>

          <TextInputBox
            title = {" Last Name"}
            onChangeText={(text) => this.setState({lname: text})}
            value={this.state.lname}
            placeholder={" Your last name"}
            secure = {false}/>

          <TextInputBox
            title = {" Net ID"}
            onChangeText={(text) => this.setState({netid: text})}
            value={this.state.netid}
            placeholder={" Your net ID"}
            secure = {false}/>

          <Text style = {SignupStyle.textField}> Class Year</Text>
          <Picker
            selectedValue = {this.state.cyear}
            onValueChange = {(value) => this.setState({cyear: value})} >
            <Picker.Item label = "2020" value = "2020" />
            <Picker.Item label = "2019" value = "2019" />
            <Picker.Item label = "2018" value = "2018" />
            <Picker.Item label = "2017" value = "2017" />
            <Picker.Item label = "Graduate" value = "grad" />
          </Picker>
          <TouchableHighlight onPress={this.signup.bind(this)} style={SignupStyle.primaryButton}
          underlayColor= {Colors.UNDERLAY_GREY}>
            <Text style={SignupStyle.primaryButtonText}>Signup</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.goToLogin.bind(this)} style={SignupStyle.transparentButton}
          underlayColor = {"white"}>
            <Text style={SignupStyle.transparentButtonText}>Go to Login</Text>
          </TouchableHighlight>
      </View>

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

  goToLogin(){
    this.props.navigator.replace({
      component: Login
    });
  }
}

AppRegistry.registerComponent('Signup', () => Signup);
