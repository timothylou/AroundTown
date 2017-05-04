'use strict';

// Component imports
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ToolbarAndroid,
  ActivityIndicator,
  DrawerLayoutAndroid,
  Button,
  Dimensions,
  Image,
} from 'react-native';
import React, {Component} from 'react';


// Untils imports
import Firebase from './Firebase';

// Custom Component imports
import CheckButton from './CheckButton';
import RadioButton from './RadioButton';
import TopBar from './TopBar';
import SideButton from './SideButton';
import CategoryButton from './CategoryButton';
import LocationButton from './LocationButton';
import Colors from './Colors';
// Pages import
import About from './About';
import Login from './Login';
import Town from './Town';

// Style imports
import BaseStyle from './BaseStyles.js';
import Style from './Style'

// Packages imports
import OneSignal from 'react-native-onesignal';
import Modal from 'react-native-modalbox';


// defaultState
var buttonsLocationTest = [
  { label: "Rocky",
  id: "rocky",
  index: 0,
  selected: false,
  icon: require('./icons/rescollege_rocky.png'),
},

  {label: "Mathey",
  id: "mathey",
  index: 1,
  selected: false,
  icon: require('./icons/rescollege_mathey.png'),
},

  {label: "Wilson",
  id: "wilson",
  index: 2,
  selected: false,
  icon: require('./icons/rescollege_wilson.png'),
},

  {label: "Butler",
  id: "butler",
  index: 3,
  selected: false,
  icon: require('./icons/rescollege_butler.png'),
},

  {label: "Whitman",
  id: "whitman",
  index: 4,
  selected: false,
  icon: require('./icons/rescollege_whitman.png'),
},

  {label: "Forbes",
  id: "forbes",
  index: 5,
  selected: false,
  icon: require('./icons/rescollege_forbes.png'),
},

];

var buttonsCatTest = [
  { label: "Free Food",
  id: "freefood",
  index: 0,
  selected: false,
  icon: 'food',
  },

  {label: "Broken Facility",
  id: "brokenfacility",
  index: 1,
  selected: false,
  icon: 'vlc',
  },

  {label: "Recruiting",
  id: "recruiting",
  index: 2,
  selected: false,
  icon: 'account-multiple',
  },

  {label: "Study Break",
  id: "studybreak",
  index: 3,
  selected: false,
  icon: 'pencil-off',
  },

  {label: "Movie Screening",
  id: "movie",
  index: 4,
  selected: false,
  icon: 'filmstrip',
  },

  {label: "Busy",
  id: "busy",
  index: 5,
  selected: false,
  icon: 'do-not-disturb',
  },

  {label: "Fire Safety",
  id: "firesafety",
  index: 6,
  selected: false,
  icon: 'alert',
  },
];

let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height
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
      loading:true,
      locations: buttonsLocationTest,
      categories: buttonsCatTest,
      userData: null,
      aboutVisible: false,
      name: null,
    };
    this.defaultState = this.state;
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleHomeLocationChange = this.handleHomeLocationChange.bind(this);
    this._setDrawer = this._setDrawer.bind(this);
    this._onPressTownButton = this._onPressTownButton.bind(this);
    this._onPressPrefsButton = this._onPressPrefsButton.bind(this);
    this._onPressLogoutButton = this._onPressLogoutButton.bind(this);
    this._openAbout = this._openAbout.bind(this);
    this._closeAbout = this._closeAbout.bind(this);
    this._renderCategoryButtons = this._renderCategoryButtons.bind(this);
    this._renderLocationButtons = this._renderLocationButtons.bind(this);

  }


  // A method to passs the username and password to firebase and make a new user account
  async componentWillMount(){
    const currentUser = await Firebase.auth().currentUser;
    const detsnapshot = await Firebase.database().ref('/users/' + currentUser.uid+ '/details').once('value');
    var userName = detsnapshot.val().fname;

    const prefsnap = await Firebase.database().ref('/users/' + currentUser.uid+ '/details/prefs/tags').once('value');
    var locs = prefsnap.val().location;
    var cats = prefsnap.val().category;

    var statelocs = this.state.locations;
    var statecats = this.state.categories;

    for (var c = 0; c < statecats.length; c++){

      statecats[c].selected = (cats[statecats[c].id] == 'true');
    }

    for (var l = 0; l < statelocs.length; l++){
      statelocs[l].selected = (locs[statelocs[l].id] == 'true');
    }

    this.setState({locations: statelocs, categories: statecats});
    this.setState({userData: currentUser});
    this.setState({name: userName});
    this.setState({loading: false});

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
      locationPrefs[currLocation.id] = currLocation.selected.toString();
    }

    var categoriesPrefs = {};
    var setCategories = this.state.categories;
    var currCategory = null;
    for(var c = 0; c < setCategories.length ; c++){
      currCategory = setCategories[c];
      categoriesPrefs[currCategory.id] = currCategory.selected.toString();
    }

    var setPreferences = {
      location: locationPrefs,
      category: categoriesPrefs,
    };


    var fireBasePayload = {
          userid: currUser.uid,
          // deviceid: this.props.deviceInfo.userId,
          tags: setPreferences,
        };
    var userDatabase = await Firebase.database().ref(userMobilePath);
    console.log(fireBasePayload);
    userDatabase.set(fireBasePayload);

    var payload = {
      userid: currUser.uid,
      deviceid: this.props.deviceInfo.userId,
      tags: setPreferences,
    };
    console.log("done with firebase");


    await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/prefs/', {
      method: 'POST',
      headers: {
                },
        body: JSON.stringify(payload),
    }).then().catch( (error)=> console.log("BACKEND POST ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  " + error.message));

    console.log("Done with posting to tim");

    alert("Your preferences have been set!");

    // reset states and navigate to Town screen
    this.setState({
      loading: false
    });

    this.setState({userData: null, locations: buttonsLocationTest, categories: buttonsCatTest, loading: false});
    this.props.navigator.replace({
      component: Town
    });

  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.

    var navigationView = (
      <View style={Style.sideDrawer}>
        <View style = {Style.drawerHeader}>
          <TouchableWithoutFeedback onPress={() => alert("Hoooot!")}>
            <Image
              source={require('./icons/hootclear.png')}
              style={{width: 90, height: 90, padding: 10}}
            />
          </TouchableWithoutFeedback>
          <Text style = {Style.drawerHeaderText}>{'Hi, ' + this.state.name + '!'}</Text>
        </View>
        <View style = {Style.sideButtonContainer}>
          <SideButton
            icon={"map-marker-radius"}
            onPress = {this._onPressTownButton}
            buttonText = {'Town View'}
          />
          <SideButton
            icon= {"settings"}
            onPress = {this._onPressPrefsButton}
            buttonText = {'Preferences'}
          />
          <SideButton
            icon= {"logout"}
            onPress = {this._onPressLogoutButton}
            buttonText = {'Logout'}
          />
          <SideButton
            icon= {"information"}
            onPress = {this._openAbout}
            buttonText = {'About Us'}
          />
        </View>
      </View>

    );



    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      (<ScrollView>
        <Text style = {Style.genericText}>Subscribe to one or more home bases:</Text>
        <View style = {{padding: 20}}>
          {this._renderLocationButtons(this.state.locations, this.handleHomeLocationChange)}
        </View>
        <Text style = {Style.genericText}>Subscribe to the types of event would you like to receive notifications for:</Text>
        <View style = {{padding: 20}}>
          {this._renderCategoryButtons(this.state.categories, this.handleCategoryChange)}
        </View>
        <TouchableHighlight onPress={this.setPreferences.bind(this)} style={BaseStyle.primaryButton} underlayColor = {Colors.PRIMARY_DARK}>
          <Text style={BaseStyle.primaryButtonText}>Set Preferences</Text>
        </TouchableHighlight>
      </ScrollView>);


    // A simple UI with a toolbar, and content below it.
    return (
      <View style={Style.rootContainer}>
        <DrawerLayoutAndroid
          drawerWidth={windowWidth*0.8}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}
          ref={'DRAWER'}>

          <TopBar
            title={'Set Preferences'}
            navigator={this.props.navigator}
            sidebarRef={()=>this._setDrawer()}/>

        <View style={Style.prefsContainer}>
          {content}
          <Modal
            animationType = {'slide'}
            style={{
              justifyContent: 'center',
              alignItems: 'stretch',
              height: windowHeight*0.8,
              width: windowWidth*0.9,
              padding: 5,
              borderRadius : 10,
              elevation: 5,
            }}
            onClosed = {() => this._closeAbout()}
            isOpen = {this.state.aboutVisible}
            >
            <View>
              <About/>
            </View>
          </Modal>
        </View>
        </DrawerLayoutAndroid>
      </View>
    );
  }

  _renderCategoryButtons(buttonsList, onSwitch){

    let buttons = [];
    if (buttonsList == null){
      buttonsList = [];
    }
    var currLabel = null;
    var currId = null;
    var currIcon = null;
    var currIndex = null;
    var currSelected = null;
    var currOnSwitch = null;
    for (var b = 0; b < buttonsList.length; b++){

      currLabel = buttonsList[b].label;
      currId = buttonsList[b].id;
      currIcon = buttonsList[b].icon;
      currIndex = buttonsList[b].index;
      currSelected = buttonsList[b].selected;
      currOnSwitch = onSwitch.bind(null,currIndex);

      buttons.push(
        <CategoryButton
          label = {currLabel}
          icon = {currIcon}
          index = {currIndex}
          selected = {currSelected}
          onSwitch = {currOnSwitch}
          key = {currId}/>
      );
    }

    return buttons;

  }

  _renderLocationButtons(buttonsList, onSwitch){
    let buttons = [];
    if (buttonsList == null){
      buttonsList = [];
    }
    var currLabel = null;
    var currId = null;
    var currIcon = null;
    var currIndex = null;
    var currSelected = null;
    var currOnSwitch = null;
    for (var b = 0; b < buttonsList.length; b++){

      currLabel = buttonsList[b].label;
      currId = buttonsList[b].id;
      currIcon = buttonsList[b].icon;
      currIndex = buttonsList[b].index;
      currSelected = buttonsList[b].selected;
      currOnSwitch = onSwitch.bind(null,currIndex);

      buttons.push(
        <LocationButton
          label = {currLabel}
          icon = {currIcon}
          index = {currIndex}
          selected = {currSelected}
          onSwitch = {currOnSwitch}
          key = {currId}/>
      );
    }

    return buttons;
  }

  _onPressPrefsButton() {
    this.refs['DRAWER'].closeDrawer();
  }

  _setDrawer() {
    this.refs['DRAWER'].openDrawer();
  }

  _openAbout() {
    this.refs['DRAWER'].closeDrawer();
    this.setState({aboutVisible: true})
  }


  _closeAbout() {
    this.setState({aboutVisible: false});
  }

  _onPressLogoutButton() {
    clearInterval(this.timerId);
    var ret = fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/logout/',
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
    }).catch((error)=> console.log("Done with fetching from tim" + error.message));
  }

  _onPressTownButton() {
    this.props.navigator.replace({
      component: Town
    });
  }



  // on category checked box
  handleCategoryChange(currIndex){

    var currentCategories = this.state.categories;
    currentCategories[currIndex].selected = ! currentCategories[currIndex].selected;
    this.setState({categories: currentCategories});
//alert("category change!" + currIndex + currentCategories[currIndex].selected);
  }

  // on location checked box
  handleHomeLocationChange(currIndex) {
    var currentLocations = this.state.locations;
    currentLocations[currIndex].selected = ! currentLocations[currIndex].selected;
    this.setState({locations: currentLocations});
  }

}

AppRegistry.registerComponent('Preferences', () => Preferences);
