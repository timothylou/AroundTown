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
  Picker,
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
import UserDetailButton from '../components/UserDetailButton';
import TextInputBox from '../components/TextInputBox';
import ClickButton from '../components/ClickButton';
import SideSwitch from '../components/SideSwitch';

// Pages import
import About from './About';
import Login from './Login';
import Town from './Town';
import Preferences from './Preferences';

// Style imports
import BaseStyle from '../styles/BaseStyles.js';
import ButtonStyle from '../styles/ButtonStyles.js';
import Style from '../styles/Style'
import SignupStyle from '../styles/SignupStyles'
import Colors from '../styles/Colors';


// Packages imports
import OneSignal from 'react-native-onesignal';
import Modal from 'react-native-modalbox';


// Backend
import backendUrl from '../utils/Config';

let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height

export default class UserDetails extends Component{

  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      cyearModalVisible: false,
      aboutVisible: false,
      name: null,
      details: [
        {
          label: 'Email',
          value: null,
          ref: 'email',
        },
        {
          label: 'First Name',
          value: null,
          ref: 'fname',
        },
        {
          label: 'Last Name',
          value: null,
          ref: 'lname',
        },
        {
          label: 'Net Id',
          value: null,
          ref: 'netid',
        },
        {
          label: 'Class year!',
          value: null,
          ref: 'cyear',
        },
      ],
      uid: null,
      currentEditidx: null,
      input: null,
      fnameEditVisible: false,
      currUser: null,
      mute: false
    };
    this.defaultState = this.state;
    this._setDrawer = this._setDrawer.bind(this);
    this._onPressTownButton = this._onPressTownButton.bind(this);
    this._onPressPrefsButton = this._onPressPrefsButton.bind(this);
    this._onPressUserButton = this._onPressUserButton.bind(this);
    this._onPressLogoutButton = this._onPressLogoutButton.bind(this);
    this._openAbout = this._openAbout.bind(this);
    this._closeAbout = this._closeAbout.bind(this);

    this._onPressedok = this._onPressedok.bind(this);
    this._onPressEdit = this._onPressEdit.bind(this);

    this._updateCyear = this._updateCyear.bind(this);
    this._mute = this._mute.bind(this);
  }


  // A method to passs the username and password to firebase and make a new user account
  async componentWillMount(){
    const currentUser = await Firebase.auth().currentUser;
    var email = currentUser.email;
    const detsnapshot = await Firebase.database().ref('/users/' + currentUser.uid+ '/details').once('value');
    var uid = currentUser.uid;
    var fname = detsnapshot.val().fname;
    var lname = detsnapshot.val().lname;
    var netid = detsnapshot.val().netid;
    var cyear = detsnapshot.val().cyear;

    var details = this.state.details;
    details[0].value = email;
    details[1].value = fname;
    details[2].value = lname;
    details[3].value = netid;
    details[4].value = cyear;


    this.setState({loading: false, uid: uid, details: details, name: fname, currUser: currentUser});
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
      (<View style = {{flex:1}}>
        <Text style = {Style.genericText}>Update your user details here:</Text>
        <View style = {ButtonStyle.UserContainer}>
        <UserDetailButton
          label = 'Email'
          info = {this.state.details[0].value}
          editable = {false}
          onPressEdit = {this._onPressEdit}
        />
        <UserDetailButton
          label = 'First Name'
          info = {this.state.details[1].value}
          editable = {true}
          onPressEdit = {() => this._onPressEdit(1)}
        />
        <UserDetailButton
          label = 'Last Name'
          info = {this.state.details[2].value}
          editable = {true}
          onPressEdit = {() => this._onPressEdit(2)}
        />
        <UserDetailButton
          label = 'Net ID'
          info = {this.state.details[3].value}
          editable = {true}
          onPressEdit = {() => this._onPressEdit(3)}
        />
        <UserDetailButton
          label = 'Class Year'
          info = {this.state.details[4].value}
          editable = {true}
          onPressEdit = {() => this.setState({cyearModalVisible: true})}
        />

        <Modal
          style={{
            justifyContent: 'center',
            alignItems: 'stretch',
            height: windowHeight*0.2,
            width: windowWidth*0.8,
            borderRadius : 5,
            elevation: 5,
          }}
          animationType = {'slide'}
          isOpen = {this.state.editModalVisible}
          onClosed = {() => {this.setState({editModalVisible: false, input: null})}}>
          <View style = {{flex: 1}}>
            <TextInputBox title = {'Enter a new ' + this.state.currentLabel}
              onChangeText={(value) => this.setState({input: value})}
              value={this.state.input}
              placeholder={this.state.currentEdit}
              secure = {false}/>
              <ClickButton
                onPress={this._onPressedok}
                label='OK'
                color={Colors.PRIMARY}/>
          </View>
        </Modal>

        <Modal
          style={{
            justifyContent: 'center',
            alignItems: 'stretch',
            height: windowHeight*0.2,
            width: windowWidth*0.8,
            borderRadius : 5,
            elevation: 5,
          }}
          animationType = {'slide'}
          isOpen = {this.state.cyearModalVisible}
          onClosed = {() => {this.setState({cyearModalVisible: false, input: null})}}>
          <View style = {{flex:1, justifyContent: 'flex-start'}}>
          <Text style = {SignupStyle.textField}>Choose a new Class Year</Text>
          <Picker
            style = {{flex:1}}
            selectedValue = {this.state.input}
            onValueChange = {(value) => this.setState({input: value})} >
            <Picker.Item label = '2020' value = '2020' />
            <Picker.Item label = '2019' value = '2019' />
            <Picker.Item label = '2018' value = '2018' />
            <Picker.Item label = '2017' value = '2017' />
            <Picker.Item label = 'Graduate' value = 'grad' />
          </Picker>
          <ClickButton
            onPress={this._updateCyear}
            label='OK'
            color={Colors.PRIMARY}/>
          </View>
        </Modal>
      </View>
    </View>);


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
            logoName = {'account-settings-variant'}
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
              backgroundColor: Colors.PRIMARY
            }}
            onClosed = {() => {this._closeAbout()}}
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

  _updateCyear() {
    var uid = this.state.uid;
    Firebase.database().ref('/users/' + uid + '/details/cyear').set(this.state.input).catch( (error)=> alert(error.message));

    var currDetails = this.state.details;
    currDetails[4].value = this.state.input;
    this.setState({details: currDetails, cyearModalVisible: false});
  }

  _onPressEdit(idx){
    this.setState({currentEdit: this.state.details[idx].value, editModalVisible: true, currentEditidx: idx, currentLabel: this.state.details[idx].label});

  }
  _onPressPrefsButton() {
    this.props.navigator.replace({
      component: Preferences
    });

  }

  _onPressTownButton() {
    this.props.navigator.replace({
      component: Town
    });

  }

  _onPressedok() {
    if (/\S/.test(this.state.input) && this.state.input){

      var uid = this.state.uid;
      var ref = this.state.details[this.state.currentEditidx].ref;
      Firebase.database().ref('/users/' + uid + '/details/'+ref).set(this.state.input).catch( (error)=> alert(error.message));

      console.log('Done with fetching frombackend');
      var currDetails = this.state.details;
      currDetails[this.state.currentEditidx].value = this.state.input;
      if (this.state.currentEditidx == 1)
      {
        this.state.currUser.updateProfile({displayName: this.state.input}).then(() => {}).catch((error) => console.log("Firebase user profile update error: " + error.message));
        this.setState({name: this.state.input});
      }
      this.setState({details: currDetails});
    }

    this.setState({editModalVisible: false, input: null});

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

  _mute(){
    var muteurl = backendUrl;
    if(this.state.mute){
      muteurl = muteurl+ 'unmuteall/';
    }
    else{
      muteurl = muteurl + 'muteall/';
    }

    console.log(JSON.stringify({deviceid: this.props.deviceInfo.userId}));

    console.log(muteurl);
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
}

AppRegistry.registerComponent('UserDetails', () => UserDetails);
