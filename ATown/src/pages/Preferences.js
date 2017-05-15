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
  AsyncStorage,
} from 'react-native';
import React, {Component} from 'react';


// Untils imports
import Firebase from '../utils/Firebase';

// Custom Component imports
import CheckButton from '../components/CheckButton';
import RadioButton from '../components/RadioButton';
import TopBar from '../components/TopBar';
import SideButton from '../components/SideButton';
import CategoryButton from '../components/CategoryButton';
import LocationButton from '../components/LocationButton';
import SideSwitch from '../components/SideSwitch';


// Pages import
import About from './About';
import Login from './Login';
import Town from './Town';
import UserDetails from './UserDetails'

// Style imports
import BaseStyle from '../styles/BaseStyles';
import Style from '../styles/Style'
import Colors from '../styles/Colors';
import PinInputStyle from '../styles/PinInputStyles';

// Packages imports
import OneSignal from 'react-native-onesignal';
import Modal from 'react-native-modalbox';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Categories
import buttonCategories from '../utils/ButtonCategories';

// Backend
import backendUrl from '../utils/Config';


// defaultState
var buttonsLocationTest = [
  { label: 'Rocky',
  id: 'rocky',
  index: 0,
  selected: false,
  icon: require('../icons/rescollege_rocky.png'),
},

  {label: 'Mathey',
  id: 'mathey',
  index: 1,
  selected: false,
  icon: require('../icons/rescollege_mathey.png'),
},

  {label: 'Wilson',
  id: 'wilson',
  index: 2,
  selected: false,
  icon: require('../icons/rescollege_wilson.png'),
},

  {label: 'Butler',
  id: 'butler',
  index: 3,
  selected: false,
  icon: require('../icons/rescollege_butler.png'),
},

  {label: 'Whitman',
  id: 'whitman',
  index: 4,
  selected: false,
  icon: require('../icons/rescollege_whitman.png'),
},

  {label: 'Forbes',
  id: 'forbes',
  index: 5,
  selected: false,
  icon: require('../icons/rescollege_forbes.png'),
},

  {label: 'Upperclass Housing',
  id: 'upperclass',
  index: 6,
  selected: false,
  icon: require('../icons/upperclass.png'),
  },

  {label: 'Graduate College',
  id: 'graduate',
  index: 7,
  selected: false,
  icon: require('../icons/graduate.png'),
  },

];

const helpTextHome = {
  title: "Home bases",
  description: "Home bases let you pick locations on campus to always receive notification from.\n\n\
This means that whenever a pin is dropped at one of your selected Home bases, you will always get a notification, \
no matter where you are on campus!"
}

const helpTextCategories = {
  title: "Category subscriptions",
  description: "Subscribing to categories lets you always receive notifications for pins dropped across campus.\n\n\
This means that regardless of where you are on campus, you will always receive notifications from all your category subscriptions!"
}


let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height


// Main App container
export default class Preferences extends Component{

  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      locations: buttonsLocationTest,
      categories: JSON.parse(JSON.stringify(buttonCategories)),
      userData: null,
      aboutVisible: false,
      name: null,

      infoModalVisible: false,
      infoModalContent: null,
      mute: false,
    };
    this.defaultState = this.state;
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleHomeLocationChange = this.handleHomeLocationChange.bind(this);
    this._setDrawer = this._setDrawer.bind(this);
    this._onPressTownButton = this._onPressTownButton.bind(this);
    this._onPressPrefsButton = this._onPressPrefsButton.bind(this);
    this._onPressUserButton = this._onPressUserButton.bind(this);
    this._onPressLogoutButton = this._onPressLogoutButton.bind(this);
    this._openAbout = this._openAbout.bind(this);
    this._closeAbout = this._closeAbout.bind(this);
    this._renderCategoryButtons = this._renderCategoryButtons.bind(this);
    this._renderLocationButtons = this._renderLocationButtons.bind(this);
    this._mute = this._mute.bind(this);

  }


  // A method to passs the username and password to firebase and make a new user account
  async componentWillMount(){
    const currentUser = await Firebase.auth().currentUser;
    const detsnapshot = await Firebase.database().ref('/users/' + currentUser.uid+ '/details').once('value');
    var userName = detsnapshot.val().fname;

    const prefsnap = await Firebase.database().ref('/users/' + currentUser.uid+ '/details/prefs/tags').once('value');
    if(prefsnap.val() != null){
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
    }

    this.setState({userData: currentUser});
    this.setState({name: userName});
    this.setState({loading: false});
    AsyncStorage.getItem('mute').then((value) => {
      if (value != null){
        var val = (value== "true" ? true: false);
        this.setState({mute: val });
        var muteurl = backendUrl;
        if(val){
          muteurl = muteurl+ 'muteall/';
        }
        else{
          muteurl = muteurl + 'unmuteall/';
        }

        console.log(JSON.stringify({deviceid: this.props.deviceInfo.userId}));

        fetch(muteurl,
          {
            method: 'POST',

            headers:{
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },

            body: JSON.stringify({deviceid: this.props.deviceInfo.userId})
          }
        ).catch((error) => console.log(error));
      }

    });
  }

  async setPreferences() {
    this.setState({
      // When waiting for the firebase server show the loading indicator.
      loading: true
    });

    var currUser = this.state.userData
    let userMobilePath = '/users/' + currUser.uid + '/details/prefs';
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
    // console.log(fireBasePayload);
    userDatabase.set(fireBasePayload);

    var payload = {
      userid: currUser.uid,
      deviceid: this.props.deviceInfo.userId,
      tags: setPreferences,
    };
    console.log('done with firebase');


    await fetch(backendUrl+'post/prefs/', {
      method: 'POST',
      headers: {
                },
        body: JSON.stringify(payload),
    }).then().catch( (error)=> console.log('BACKEND POST ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  ' + error.message));

    console.log('Done with posting tobackend');

    alert('Your preferences have been set!');

    // reset states and navigate to Town screen
    this.setState({
      loading: false
    });

    this.setState({userData: null, loading: false});
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
          <TouchableWithoutFeedback onPress={() => alert('Hoooot!')}>
            <Image
              source={require('../icons/hootclear.png')}
              style={{width: 90, height: 90, padding: 10}}
            />
          </TouchableWithoutFeedback>
          <Text style = {Style.drawerHeaderText}>{'Hi, ' + this.state.name + '!'}</Text>
        </View>
        <View style = {Style.sideButtonContainer}>
          <SideButton
            icon={'map'}
            onPress = {this._onPressTownButton}
            buttonText = {'Town View'}
          />
          <SideButton
            icon= {'settings'}
            onPress = {this._onPressPrefsButton}
            buttonText = {'Preferences'}
          />
          <SideButton
            icon= {'account-settings-variant'}
            onPress = {this._onPressUserButton}
            buttonText = {'User Details'}
          />
          <SideSwitch
            icon= {'bell'}
            onSwitch = {this._mute}
            buttonText = {'Mute Notifications'}
            selected = {this.state.mute}
          />
          <SideButton
            icon= {'information'}
            onPress = {this._openAbout}
            buttonText = {'About Us'}
          />
          <SideButton
            icon= {'logout'}
            onPress = {this._onPressLogoutButton}
            buttonText = {'Logout'}
          />
        </View>
      </View>

    );



    const content = this.state.loading ? <ActivityIndicator size='large'/> :
      (<ScrollView>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex:9, justifyContent: 'center'}}>
            <Text style = {Style.genericText }>Subscribe to one or more home bases:</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => this.setState({infoModalVisible: true, infoModalContent: helpTextHome})} style={{ alignItems: 'center', justifyContent:'center', flex:2}}>
            <View style={{ alignItems: 'center', justifyContent:'center', flex:1}}>
              <Icon name='help-circle' size={20} color={Colors.WHITE}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style = {{padding: 20}}>
          {this._renderLocationButtons(this.state.locations, this.handleHomeLocationChange)}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex:9, justifyContent: 'center'}}>
            <Text style = {Style.genericText}>Subscribe to categories of events:</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => this.setState({infoModalVisible: true, infoModalContent: helpTextCategories})} style={{ alignItems: 'center', justifyContent:'center', flex:2}}>
            <View style={{ alignItems: 'center', justifyContent:'center', flex:1}}>
              <Icon name='help-circle' size={20} color={Colors.WHITE}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
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
            logoName = {'settings'}
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
              backgroundColor: Colors.PRIMARY,
            }}
            onClosed = {() => this._closeAbout()}
            isOpen = {this.state.aboutVisible}
            >
            <View>
              <About/>
            </View>
          </Modal>
          <Modal
            animationType = {'slide'}
            swipeToClose = {true}
            swipeThreshold = {100}
            backButtonClose = {true}
            backdropPressToClose = {true}
            style={{
              justifyContent: 'center',
              alignItems: 'stretch',
              height: windowHeight*0.60,
              width: windowWidth*0.8,
              borderRadius : 5,
              backgroundColor: Colors.PRIMARY,
              elevation: 5,
            }}
            onClosed = {() => {this.setState({infoModalVisible: false, infoModalContent: null});}}
            isOpen = {this.state.infoModalVisible}
          >
            <View style={PinInputStyle.MainContainer}>
              <View style={PinInputStyle.topBar}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex:1, paddingRight: 5}}>
                  <Icon size={25} color={Colors.PRIMARY_DARK} name="information" />
                </View>
                <Text style={PinInputStyle.topBarText}>{this.state.infoModalContent? this.state.infoModalContent.title: ""}</Text>
                <TouchableWithoutFeedback onPress={() => {this.setState({infoModalVisible: false, infoModalContent: null});}}>
                  <View style={{alignItems: 'center', justifyContent: 'center', flex:1, paddingRight: 5}}>
                    <Icon size={20} color={Colors.PRIMARY_DARK} name="close" />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={{flex: 9, paddingTop: 20, }}>
                <Text style= {{color: Colors.WHITE, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20, fontSize: 18, textAlign: "center" }}>{this.state.infoModalContent? this.state.infoModalContent.description: ""}</Text>
              </View>
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

  // async _onPressTownButton() {
  //   await this.setPreferences();
  //
  // }

  _onPressTownButton() {
    this.setState({userData: null, loading: false});
    this.props.navigator.replace({
      component: Town
    });

  }

  _onPressUserButton() {
    this.setState({userData: null, loading: false});
    this.props.navigator.replace({
      component: UserDetails
    });

  }

  _mute(){
    var muteurl = backendUrl;
    if(this.state.mute){
      muteurl = muteurl+ 'unmuteall/';
    }
    else{
      muteurl = muteurl + 'muteall/';
    }

    // console.log(JSON.stringify({deviceid: this.props.deviceInfo.userId}));

    // console.log(muteurl);
    fetch(muteurl,
      {
        method: 'POST',

        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({deviceid: this.props.deviceInfo.userId})
      }
    ).catch((error) => console.log(error));
    newMute = !this.state.mute;

    AsyncStorage.setItem("mute", newMute.toString());

    this.setState({mute: !this.state.mute});
  }


  // on category checked box
  handleCategoryChange(currIndex){

    var currentCategories = this.state.categories;
    currentCategories[currIndex].selected = ! currentCategories[currIndex].selected;
    this.setState({categories: currentCategories});
//alert('category change!' + currIndex + currentCategories[currIndex].selected);
  }

  // on location checked box
  handleHomeLocationChange(currIndex) {
    var currentLocations = this.state.locations;
    currentLocations[currIndex].selected = ! currentLocations[currIndex].selected;
    this.setState({locations: currentLocations});
  }

}

AppRegistry.registerComponent('Preferences', () => Preferences);
