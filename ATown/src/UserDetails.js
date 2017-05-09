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
import TextInputBox from './TextInputBox';
import ClickButton from './ClickButton';
// Pages import
import About from './About';
import Login from './Login';
import Town from './Town';
import Preferences from './Preferences';

// Style imports
import BaseStyle from './BaseStyles.js';
import ButtonStyle from './ButtonStyles.js';
import Style from './Style'
import SignupStyle from './SignupStyles'

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
      cyearModalVisible: false,
      aboutVisible: false,
      name: null,
      details: [
        {
          label: "Email",
          value: null,
          ref: "email",
        },
        {
          label: "First Name",
          value: null,
          ref: "fname",
        },
        {
          label: "Last Name",
          value: null,
          ref: "lname",
        },
        {
          label: "Net Id",
          value: null,
          ref: "netid",
        },
        {
          label: "Class year!",
          value: null,
          ref: "cyear",
        },
      ],
      uid: null,
      currentEditidx: null,
      input: null,
      fnameEditVisible: false,
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


    this.setState({loading: false, uid: uid, details: details, name: fname});

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
            icon={"map"}
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
      (<View style = {{flex:1}}>
        <Text style = {Style.genericText}>Update your user details here:</Text>
        <View style = {ButtonStyle.UserContainer}>
        <UserDetailButton
          label = "Email"
          info = {this.state.details[0].value}
          editable = {false}
          onPressEdit = {this._onPressEdit}
        />
        <UserDetailButton
          label = "First Name"
          info = {this.state.details[1].value}
          editable = {true}
          onPressEdit = {() => this._onPressEdit(1)}
        />
        <UserDetailButton
          label = "Last Name"
          info = {this.state.details[2].value}
          editable = {true}
          onPressEdit = {() => this._onPressEdit(2)}
        />
        <UserDetailButton
          label = "Net ID"
          info = {this.state.details[3].value}
          editable = {true}
          onPressEdit = {() => this._onPressEdit(3)}
        />
        <UserDetailButton
          label = "Class Year"
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
            <TextInputBox title = {"Enter a new " + this.state.currentLabel}
              onChangeText={(value) => this.setState({input: value})}
              value={this.state.input}
              placeholder={this.state.currentEdit}
              secure = {false}/>
              <ClickButton
                onPress={this._onPressedok}
                label="OK"
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
            <Picker.Item label = "2020" value = "2020" />
            <Picker.Item label = "2019" value = "2019" />
            <Picker.Item label = "2018" value = "2018" />
            <Picker.Item label = "2017" value = "2017" />
            <Picker.Item label = "Graduate" value = "grad" />
          </Picker>
          <ClickButton
            onPress={this._updateCyear}
            label="OK"
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
              backgroundColor: Colors.PRIMARY,
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
    if (/\S/.test(this.state.input)){

      var uid = this.state.uid;
      var ref = this.state.details[this.state.currentEditidx].ref;
      Firebase.database().ref('/users/' + uid + '/details/'+ref).set(this.state.input).catch( (error)=> alert(error.message));
      //
      // fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/newuser/', {
      //     method: 'POST',
      //     headers: {
      //     },
      //     body: JSON.stringify({
      //       fname: this.state.fname,
      //       lname: this.state.lname,
      //       cyear: this.state.cyear,
      //       netid: this.state.netid,
      //     })
      //   }).then().catch( (error)=> console.log("Done with fetching from tim       " + error.message));
      console.log("Done with fetching from tim");
      var currDetails = this.state.details;
      currDetails[this.state.currentEditidx].value = this.state.input;
      if (this.state.currentEditidx == 1)
      {
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
