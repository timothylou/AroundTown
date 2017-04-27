'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  DrawerLayoutAndroid,
  Modal,
  Button
} from 'react-native';
import BaseStyle from './BaseStyles.js';
import Style from './Style'
import Login from './Login';
import Town from './Town';
import CheckButton from './CheckButton';
import RadioButton from './RadioButton';
import Firebase from './Firebase';
import React, {Component} from 'react';
import SideButton from './SideButton';
import About from './About';
import CheckButtonList from './CheckButtonList';
import TopBar from './TopBar'
// OneSignal import
import OneSignal from 'react-native-onesignal';

// defaultState


const buttonsLocationTest = [
  { label: "Rocky",
  id: "rocky",
  index: 0,
  selected: true,},
  {label: "Mathey",
  id: "mathey",
  index: 1,
  selected: false},
  {label: "Wilson",
  id: "wilson",
  index: 2,
  selected: false},
  {label: "Butler",
  id: "butler",
  index: 3,
  selected: false},
  {label: "Whitman",
  id: "whitman",
  index: 4,
  selected: false},
  {label: "Forbes",
  id: "forbes",
  index: 5,
  selected: false},

];

const buttonsCatTest = [
  { label: "Free Food",
  id: "freeFood",
  index: 0,
  selected: false,},

  {label: "Broken Facility",
  id: "brokenFacility",
  index: 1,
  selected: false,},

  {label: "Recruiting",
  id: "recruiting",
  index: 2,
  selected: false,},

  {label: "Study Break",
  id: "studyBreak",
  index: 3,
  selected: false,},

  {label: "Movie Screening",
  id: "movie",
  index: 4,
  selected: false,},

  {label: "Busy",
  id: "busy",
  index: 5,
  selected: false,},

  {label: "Fire Safety",
  id: "fireSafety",
  index: 6,
  selected: false,},

];
//
// const initialState = {
//   loading: false,
//
//   locations: buttonsLocationTest,
//
//   categories: buttonsCatTest,
//
//   userData: null,
// };

// Main App container
export default class Preferences extends Component{

  constructor(props) {
    super(props);
    this.state = {
      aboutVisible: false,
      loading:true,
      locations: buttonsLocationTest,
      categories: buttonsCatTest,
      userData: null,
      name:null,
    };
    this.defaultState = this.state;
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleHomeLocationChange = this.handleHomeLocationChange.bind(this);
    this.convertBoolToText = this.convertBoolToText.bind(this);
    this._setDrawer = this._setDrawer.bind(this);
    this._onPressTownButton = this._onPressTownButton.bind(this);
    this._onPressLogoutButton = this._onPressLogoutButton.bind(this);
    this._openAbout = this._openAbout.bind(this);
    this._closeAbout = this._closeAbout.bind(this);
  }


  // A method to passs the username and password to firebase and make a new user account
  async componentWillMount(){
    var currentUser = await Firebase.auth().currentUser;
    const snapshot = await Firebase.database().ref('/users/' + currentUser.uid+ '/details').once('value');
    var userName = snapshot.val().fname;
    this.setState({userData: currentUser});
    this.setState({loading: false});
    this.setState({name: userName});
  }

  async setPreferences() {
    this.setState({
      // When waiting for the firebase server show the loading indicator.
      loading: true
    });

    var currUser = this.state.userData
    let userMobilePath = "/users/" + currUser.uid + "/details/prefs";
    var locationPrefs = {};
    var setLocations = this.state.locations;
    var currLocation = null;
    for(var l = 0; l< setLocations.length ; l++){
      currLocation = setLocations[l];
      locationPrefs[currLocation.label] = currLocation.selected.toString();
    }

    var categoriesPrefs = {};
    var setCategories = this.state.categories;
    var currCategory = null;
    for(var c = 0; c < setCategories.length ; c++){
      currCategory = setCategories[c];
      categoriesPrefs[currCategory.label] = currCategory.selected.toString();
    }

    var setPreferences = {
      location: locationPrefs,
      categories: categoriesPrefs,
    };

    var userDatabase = await Firebase.database().ref(userMobilePath);
    userDatabase.set({Hello : "hello"});
    console.log("done with firebase");
    //
    // await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/prefs/', {
    //   method: 'POST',
    //   headers: {
    //             },
    //     body: JSON.stringify({
    //       deviceid: this.props.deviceInfo.userId,
    //       preferences: setPreferences,
    //     })
    // }).then().catch( (error)=> console.log("BACKEND POST ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  " + error.message));

    console.log("Done with posting to tim");

    alert('Your preferences have been set!');

    // reset states and navigate to Town screen
    this.setState({
      loading: false
    });

    this.setState({userData: null, locations: buttonsLocationTest, categories: buttonsCatTest, loading: false});
    this.props.navigator.push({
      component: Town
    });

  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.

    var navigationView = (
      <View style={Style.sideDrawer}>
        <View style = {Style.drawerHeader}>
          <Text style = {Style.drawerHeaderText}>{'Hi, ' + this.state.name + '!'}</Text>
        </View>
        <View style = {Style.sideButtonContainer}>
          <SideButton
            onPress = {this._onPressTownButton}
            buttonText = {'Town View'}
          />
          <SideButton
            onPress = {this._onPressLogoutButton}
            buttonText = {'Logout'}
          />
          <SideButton
            onPress = {this._openAbout}
            buttonText = {'About Us'}
          />
        </View>
        <Modal
          animationType = {'slide'}
          onRequestClose = {this._closeAbout}
          visible = {this.state.aboutVisible}
          >
          <View>
            <About/>
            <Button
              onPress={this._closeAbout}
              title="Back to Preferences"
              color="#FF5722"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </Modal>
      </View>
    );

    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <ScrollView>
        <Text style = {Style.genericText}>Select one or more home bases</Text>
        <View>
          {this._renderCheckButtons(this.state.locations, this.handleHomeLocationChange)}
        </View>
        <Text style = {Style.genericText}>Which type of event would you like to receive notifications for?</Text>
        <View>
          {this._renderCheckButtons(this.state.categories, this.handleCategoryChange)}
        </View>
        <TouchableHighlight onPress={this.setPreferences.bind(this)} style={BaseStyle.primaryButton}>
          <Text style={BaseStyle.primaryButtonText}>Set Preferences</Text>
        </TouchableHighlight>
      </ScrollView>;


    // A simple UI with a toolbar, and content below it.
        return (
        <View style={Style.rootContainer}>
          <DrawerLayoutAndroid
            drawerWidth={300}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => navigationView}
            ref={'DRAWER'}>

            <TopBar
              title={'Set Preferences'}
              navigator={this.props.navigator}
              sidebarRef={()=>this._setDrawer()}/>

          <View style={Style.prefsContainer}>
            {content}
          </View>
          </DrawerLayoutAndroid>
        </View>
    );
  }

  _renderCheckButtons(buttonsList, onPress){
    let buttons = [];
    if (buttonsList == null){
      buttonsList = [];
    }
    var currLabel = null;
    var currSelected = null;
    var currId = null;
    var currIndex = null;
    var curronPress = null;
    for (var b = 0; b < buttonsList.length; b++){

      currLabel = buttonsList[b].label;
      currSelected = buttonsList[b].selected;
      currId = buttonsList[b].id;
      currIndex = buttonsList[b].index;
      curronPress = onPress.bind(null,currIndex);

      buttons.push(
        <RadioButton
          label = {currLabel}
          selected = {currSelected}
          onPress = {curronPress}
          index = {currIndex}
          key = {currId}/>
      );
    }

    return buttons;

  }

  _setDrawer() {
    this.refs['DRAWER'].openDrawer();
  }

  _openAbout() {
    this.setState({aboutVisible: true})
  }

  _closeAbout() {
    this.setState({aboutVisible: false});
  }

  _onPressLogoutButton() {
    clearInterval(this.timerId);
    Firebase.auth().signOut().then(() => {
      this.props.navigator.push({
        component: Login
      });
    }).catch((error)=> console.log("Done with fetching from tim" + error.message));
  }

  _onPressTownButton() {
    this.props.navigator.push({
      component: Town
    });
  }

  // on category checked box
  handleCategoryChange(currIndex){
    var currentCategories = this.state.categories;
    currentCategories[currIndex].selected = ! currentCategories[currIndex].selected
    this.setState({categories: currentCategories});

  }

  // on location checked box
  handleHomeLocationChange(currIndex) {
    var currentLocations = this.state.locations;
    currentLocations[currIndex].selected = ! currentLocations[currIndex].selected
    this.setState({locations: currentLocations});
}
  // change true to yes and false to no
  convertBoolToText(bool) {
    const text = bool ? 'yes' : 'no';
    return text;
  }

}

AppRegistry.registerComponent('Preferences', () => Preferences);