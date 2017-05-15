'use strict';

// Generic Component
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
  Dimensions
} from 'react-native';
import React, {Component} from 'react';

// External Components
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Custom Components
import TextInputBox from '../components/TextInputBox';

// Pages
import Login from './Login';
import Town from './Town';
import Preferences from './Preferences';
import Verify from './Verify';
// Styles
import SignupStyle from '../styles/SignupStyles';

// Firebase utils
import Firebase from '../utils/Firebase';

// Colors!!
import Colors from '../styles/Colors';

// Backend
import backendUrl from '../utils/Config';


// Screen size
let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loading = ActivityIndicator
      loading: false,
      // entered credentials
      email: '',
      password: '',
      fname: '',
      lname: '',
      netid: '',
      cyear: '2020',
      uid: null
    }
  }

  // A method to passs the username and password to firebase and make a new user account
  async signup() {
    this.setState({
      // When waiting for the firebase server show the loading indicator.
      loading: true
    });
    if(!(/\S/.test(this.state.fname) && this.state.fname)){
      alert("Please enter valid a first name!");
      this.setState({
        loading: false,
      });
    }
    else if (!(/\S/.test(this.state.lname) && this.state.lname)){
      alert("Please enter valid a last name!");
      this.setState({
        loading: false,
      });
    }
    else if (!(/\S/.test(this.state.netid) && this.state.netid)){
      alert("Please enter a valid Net ID");
      this.setState({
        loading: false,
      });
    }
    else{
      // New user
      await Firebase.auth().createUserWithEmailAndPassword(
        this.state.email,
        this.state.password).then((userData) => {
          userData.updateProfile({
            displayName: this.state.fname,
            email: this.state.email,
          }).then(() =>{} ).catch(
            (error) => console.log("User details update error: " + error.message)
          );
          let userMobilePath = '/users/' + userData.uid + '/details';

          // Store user details on Firebase
          Firebase.database().ref(userMobilePath).set({
            fname: this.state.fname.trim(),
            lname: this.state.lname,
            cyear: this.state.cyear,
            netid: this.state.netid,
            uid: userData.uid

          }).catch( (error)=> console.log('Firebase post error: User details failed: ' + error.message));

          // Set to default Preferences
          var setPreferences = {
            'category' : {
              'brokenfacility' : 'false',
              'busy' : 'false',
              'firesafety' : 'false',
              'freefood' : 'false',
              'movie' : 'false',
              'recruiting' : 'false',
              'studybreak' : 'false'
            },
            'location' : {
              'butler' : 'false',
              'forbes' : 'false',
              'mathey' : 'false',
              'rocky' : 'false',
              'whitman' : 'false',
              'wilson' : 'false'
            }
          };

          var fireBasePayload = {
            userid: userData.uid,
            tags: setPreferences,
          };
          // Store prefs to Firebase
          Firebase.database().ref(userMobilePath +'/prefs').set(fireBasePayload);
          // console.log('done with firebase');

          fetch(backendUrl+'post/newuser/', {
              method: 'POST',
              headers: {
              },
              body: JSON.stringify({
                email: this.state.email,
                fname: this.state.fname.trim(),
                lname: this.state.lname,
                cyear: this.state.cyear,
                netid: this.state.netid,
                uid: userData.uid

              })
            }).then().catch( (error)=> console.log('Backend post error: User details failed: ' + error.message));


          var payload = {
            userid: userData.uid,
            deviceid: this.props.deviceInfo.userId,
            tags: setPreferences,
          };


          fetch(backendUrl+'post/prefs/', {
            method: 'POST',
            headers: {
                      },
              body: JSON.stringify(payload),
          }).then().catch( (error)=> console.log('Backend post error: User preferences failed: ' + error.message));
          // console.log('Done with backend');

          Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password
          ).then((userData) =>
            {
              this.setState({
                loading: false
              });
              userData.sendEmailVerification().then(() => alert("Your account was created. Welcome to Owl! Check your email to verify yourself!")).catch((error) => console.log("Oops, there was an error " + error.message));
              this.props.navigator.replace({
                component: Verify
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
        alert("Oops, your account wasn't created: " + error.message );
      });
    }
  }

  render() {
    // If loading then ActivityIndicator..
    const content = this.state.loading ?
      <View style = {{height: windowHeight, width: windowWidth, justifyContent: 'center', alignItems: 'stretch'}}>
        <ActivityIndicator size='large'/>
      </View> :
      <View style = {SignupStyle.container}>
          <TextInputBox
            title = {' Email'}
            maxLength = {40}
            onChangeText={(text) => this.setState({email: text.trim()})}
            value={this.state.email}
            placeholder={' example@princeton.edu'}
            secure = {false}/>

          <TextInputBox
            title = {' Password (must be at least 6 characters)'}
            maxLength={50}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            placeholder={' Enter a password'}
            secure = {true}/>

          <TextInputBox
            title = {' First Name'}
            maxLength={20}
            onChangeText={(text) => this.setState({fname: text})}
            value={this.state.fname}
            placeholder={' Your first name'}
            secure = {false}/>

          <TextInputBox
            title = {' Last Name'}
            maxLength={20}
            onChangeText={(text) => this.setState({lname: text.trim()})}
            value={this.state.lname}
            placeholder={' Your last name'}
            secure = {false}/>

          <TextInputBox
            title = {' Net ID'}
            maxLength ={20}
            onChangeText={(text) => this.setState({netid: text.trim()})}
            value={this.state.netid}
            placeholder={' Your net ID'}
            secure = {false}/>

          <Text style = {SignupStyle.textField}> Class Year</Text>
          <Picker
            selectedValue = {this.state.cyear}
            onValueChange = {(value) => this.setState({cyear: value})} >
            <Picker.Item label = '2020' value = '2020' />
            <Picker.Item label = '2019' value = '2019' />
            <Picker.Item label = '2018' value = '2018' />
            <Picker.Item label = '2017' value = '2017' />
            <Picker.Item label = 'Graduate' value = 'grad' />
            <Picker.Item label = 'Faculty' value = 'faculty' />
          </Picker>
          <TouchableHighlight onPress={this.signup.bind(this)} style={SignupStyle.primaryButton}
          underlayColor= {Colors.PRIMARY_DARK}>
            <Text style={SignupStyle.primaryButtonText}>Signup</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.goToLogin.bind(this)} style={SignupStyle.transparentButton}
          underlayColor = {'white'}>
            <Text style={SignupStyle.transparentButtonText}>Go to Login</Text>
          </TouchableHighlight>
      </View>

    // A simple UI with a toolbar, and content below it.
        return (
          <KeyboardAwareScrollView style={SignupStyle.containerScrollView}
          contentContainerStyle = {SignupStyle.contentView}
            showsVerticalScrollIndicator = {false}
            keyboardShouldPersistTaps="always"
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
