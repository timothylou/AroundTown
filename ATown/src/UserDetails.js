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
import UserDetailButton from './UserDetailButton';
// Pages import
import About from './About';
import Login from './Login';
import Town from './Town';
import Preferences from './Preferences';

// Style imports
import BaseStyle from './BaseStyles.js';
import Style from './Style'

// Packages imports
import OneSignal from 'react-native-onesignal';
import Modal from 'react-native-modalbox';

let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height

export default class UserDetails extends Component{

  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      userData: null,
      aboutVisible: false,
      fname: null,
      lname: null,
      netid: null,
      cyear: null,

    };
    this.defaultState = this.state;
    this._setDrawer = this._setDrawer.bind(this);
    this._onPressTownButton = this._onPressTownButton.bind(this);
    this._onPressPrefsButton = this._onPressPrefsButton.bind(this);
    this._onPressUserButton = this._onPressUserButton.bind(this);
    this._onPressLogoutButton = this._onPressLogoutButton.bind(this);
    this._openAbout = this._openAbout.bind(this);
    this._closeAbout = this._closeAbout.bind(this);
    this._editFname = this._editFname.bind(this);
    this._editLname = this._editLname.bind(this);
    this._editNetid = this._editNetid.bind(this);
    this._editCyear = this._editCyear.bind(this);

  }


  // A method to passs the username and password to firebase and make a new user account
  async componentWillMount(){
    const currentUser = await Firebase.auth().currentUser;
    const detsnapshot = await Firebase.database().ref('/users/' + currentUser.uid+ '/details').once('value');
    var fname = detsnapshot.val().fname;
    var lname = detsnapshot.val().lname;
    var netid = detsnapshot.val().netid;
    var cyear = detsnapshot.val().cyear;

    this.setState({userData: currentUser});
    this.setState({fname: fname});
    this.setState({lname: lname});
    this.setState({netid: netid});
    this.setState({cyear: cyear});

    this.setState({loading: false});

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
            icon= {"account-settings-variant"}
            onPress = {this._onPressUserButton}
            buttonText = {'User Details'}
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
        <Text style = {Style.genericText}>Update your user details here:</Text>
        <UserDetailButton
          label = "First Name"
          info = {this.state.fname}
          editable = {true}
          hidden = {false}
          onPress = {this._editFname}
        />
        <UserDetailButton
          label = "Last Name"
          info = {this.state.lname}
          editable = {true}
          hidden = {false}
          onPress = {this._editLname}
        />
        <UserDetailButton
          label = "Net ID"
          info = {this.state.netid}
          editable = {true}
          hidden = {false}
          onPress = {this._editNetid}
        />
        <UserDetailButton
          label = "Class Year"
          info = {this.state.cyear}
          editable = {true}
          hidden = {false}
          onPress = {this._editCyear}
        />
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
            title={'User Details'}
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

  _editFname() {
    alert("edit fname");
  }

  _editLname() {
    alert("edit lname");
  }

  _editNetid() {
    alert("edit netid");
  }

  _editCyear() {
    alert("edit cyear");
  }

  _onPressPrefsButton() {
    this.setState({userData: null, loading: false});
    this.props.navigator.replace({
      component: Preferences
    });

  }

  _onPressTownButton() {
    this.setState({userData: null, loading: false});
    this.props.navigator.replace({
      component: Town
    });

  }

  _onPressUserButton() {
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
}

AppRegistry.registerComponent('UserDetails', () => UserDetails);
