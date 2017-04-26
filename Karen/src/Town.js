import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TextInput,
  Modal,
  Button,
  Slider,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  TouchableHighlight,
} from 'react-native';

// self made components and stylesheets
import Style from './Style';
import Login from './Login';
import Signup from './Signup';
import Preferences from './Preferences';
import About from './About'
import MapView from 'react-native-maps';
import CheckButton from './CheckButton';
import SideButton from './SideButton';
import TopBar from './TopBar';
import SideDrawer from './SideDrawer';
import CustomMapView from './CustomMapView';
import CustomMarker from './CustomMarker';
import Firebase from './Firebase';

// import packages
import Prompt from 'react-native-prompt';
import OneSignal from 'react-native-onesignal';




// Main App container
export default class Town extends Component{

  // Constructor
  constructor(props) {
    super(props);
    this.state = {checked1:false, // Checkbox flag
                  checked2:false,
                  markersList: [], // Local list of markers
                  user: '',
                  name: 'BLAH',
                  timer: 60,
                  test: '',
                  netid: '',

                  categories: [], // Future list of categories
                  incMarker: [], // list to store co-ordinates of onLongPress event
                  aboutVisible: false,
                  modalVisible: false,
                  hi: false, // modalVisibility flag
                  inputTitle: "", // temp Var for title of pin. Always "" when not making new pin
                  inputDesc: "",
                  markerInfo: ""}; // temp var for description of pin. Always "" when not making new pin

    // Princeton's co-ordinates
    this.defaultLocation = {
      latitude: 40.3474,
      longitude: - 74.6617,
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0021,
    };
    console.log("------------------------------ Constructor called ------------------------------");

    // Bindings
    this._handleMarkerPress = this._handleMarkerPress.bind(this);
    this._handleNewMarker = this._handleNewMarker.bind(this);
    this._handleCancelMarker = this._handleCancelMarker.bind(this);
    this._renderCustomMarkers = this._renderCustomMarkers.bind(this);
    this._onCalloutPress = this._onCalloutPress.bind(this);
    this._setDrawer = this._setDrawer.bind(this);
    this._onPressPrefsButton = this._onPressPrefsButton.bind(this);
    this._onPressLogoutButton = this._onPressLogoutButton.bind(this);
    this._openAbout = this._openAbout.bind(this);
    this._closeAbout = this._closeAbout.bind(this);

    // Set timer for refreshing
    this.timerId = setInterval(() => {
      // Fetch from backend url
      fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/get/allactive', {
        method: "GET"
      }).then((fetchedMarkersList) => {

        var tempmarkersList = JSON.parse(fetchedMarkersList._bodyText);
        this.setState({markersList: tempmarkersList});
        console.log("Fetched list of events from backed");
        console.log(tempmarkersList);

      }).catch( (error)=> console.log("Error while fetching from backend: " + error.message));

    }, 5000);

  }

  // Renders the main view
  render() {

    var navigationView = (
      <View style={Style.sideDrawer}>
        <View style = {Style.drawerHeader}>
          <Text style = {Style.drawerHeaderText}>{'Hi, ' + this.state.name + '!'}</Text>
        </View>
        <View style = {Style.sideButtonContainer}>
          <SideButton
            onPress = {this._onPressPrefsButton}
            buttonText = {'Preferences'}
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
              title="Back to Town"
              color="#FF5722"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </Modal>
      </View>
    );

    return(
      <View style={Style.rootContainer}>
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}
        ref={'DRAWER'}>

        <TopBar
            title={'Town View'}
            navigator={this.props.navigator}
            sidebarRef={()=>this._setDrawer()}/>

        <View style={Style.mapContainer}>

        <CustomMapView
          initialRegion={this.defaultLocation}
          onLongPressHandler={this._handleMarkerPress}
          markersList={this.state.markersList}
          renderMarkers={this._renderCustomMarkers}
        />

          <CheckButton onChange={this._onChange.bind(this)}
          checked={this.state.checked1}
          label={"Press to show time!!"}/>

          <CheckButton onChange={this._logout.bind(this)}
          checked={this.state.checked2}
          label={this.state.name + ' click here to log out'}/>

          <Modal
            animationType = {'slide'}
            onRequestClose = {this._handleCancelMarker}
            visible = {this.state.modalVisible}
          >
            <View>
              <Text style = {{fontSize: 20, color: '#000000'}}>Enter title here!</Text>
              <TextInput
                placeholder= {"Enter pin title here!"}
                onChangeText={(text) => this.setState({inputTitle: text})}
              />
              <Text style = {{fontSize: 20, color: '#000000'}}>Enter description here!</Text>
              <TextInput
                value={this.state.descInput}
                placeholder= {"Enter pin description here!"}
                onChangeText={(text) => this.setState({inputDesc: text})}

                multiline = {true}
                numberOfLines = {8}
                textAlignVertical = "top"
              />
              <Text style = {{fontSize: 20, color: '#000000'}}>{Math.floor(this.state.timer/60).toString()+ " hrs " + (this.state.timer%60).toString()+"mins"}</Text>
              <Slider
                maximumValue={180}
                minimumValue={0}
                onValueChange={(time)=> this.setState({timer: time})}
                step={1}
                value={this.state.timer}
                >

              </Slider>
              <Text style = {{fontSize: 20, color: '#000000'}}>{this.state.timer}</Text>

              <Button
                onPress={this._handleNewMarker}
                title="Submit"
                color="#2196F3"
                accessibilityLabel="Learn more about this purple button"
              />
              <Button
                onPress={this._handleCancelMarker}
                title="Cancel"
                color="#FF5722"
                accessibilityLabel="Learn more about this purple button"
              />
            </View>
          </Modal>
          <Modal
            animationType = {'slide'}
            onRequestClose = {this._handleCancelMarker}
            visible = {this.state.hi}
            >
            <View>
                <Button
                  onPress={this._handleCancelMarker}
                  title="Cancel"
                  color="#FF5722"
                  accessibilityLabel="Learn more about this purple button"
                  />
                  <Text>{this.state.markerInfo}</Text>
            </View>
          </Modal>
        </View>
        </DrawerLayoutAndroid>
      </View>
    );
  }

  // Checkbutton that shows time
  async _onChange(checked){

    if (checked){
      this.setState({checked:false})
    }
    else{
      this.setState({checked:true})
    }
      alert(new Date().getTime());
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

  _onPressPrefsButton() {
    this.props.navigator.push({
      component: Preferences
    });
  }

  _setDrawer() {
    this.refs['DRAWER'].openDrawer();
  }

  _logout() {
    // logout, once that is complete, return the user to the login screen.
    clearInterval(this.timerId);
    Firebase.auth().signOut().then(() => {
      this.props.navigator.push({
        component: Login
      });
    }).catch((error)=> console.log("Done with fetching from tim" + error.message));
  }

  // // Renders custom markers from a list of markers.
  _renderCustomMarkers(markersList){
        // List of <MarkerView>s
        let markers = [];
        if(markersList == null){
          markersList = [];
        }

        for(var m = 0; m < markersList.length; m++){
          marker = markersList[m];
          markerprop = {
            coordinate: { latitude: marker.latitude,
                          longitude: marker.longitude},
            view: {
              title: marker.title
            },

            callout: {
              description: marker.description
            },

            modal: {
              description: marker.description
            },

          };

          markers.push(

                      <CustomMarker marker={markerprop}
                        key={m}
                        onCalloutPressed={this._onCalloutPress}
                      />

          );
        }
        // console.log(" ----------------------------------------------");
        //
        // console.log(" rendering " + JSON.stringify(markersList));
        // console.log(" ----------------------------------------------");

        return markers;
  }

  _onCalloutPress(markerDescription){
    this.setState({hi: true,
      markerInfo: markerDescription})
  };
  // Handles a onLongPress event
  // Saves co-ordinates in state variable incMarker
  _handleMarkerPress(e){
    this.setState({ incMarker: {
                    coordinate: e.nativeEvent.coordinate,
                    title: "blahblah",
                    description: "Haha"
                  }});

    // Make modal visible for user input.
    this.setState({modalVisible: true});
  }

  // Evaluates inputted values on Modal
  async _handleNewMarker(){

    if (!this.state.inputTitle){
      alert("Please enter a title!")
      return;
    }

    else if (!this.state.inputDesc){
      alert("Please enter a Description!")
      return;
    }

    // If valid inputs then ...
    else{

      var newMarker = {
        'latitude': this.state.incMarker.coordinate.latitude,
        'longitude': this.state.incMarker.coordinate.longitude,
        'title': this.state.inputTitle,
        'description': this.state.inputDesc,
        'cat': 9,
        'oid': this.state.user.uid,
        'netid': this.state.netid,
        'stime': new Date().getTime(),
        'dur': this.state.timer};

      // Add new marker to newMarkersList
      // eventdict = {'lat': 0.0, 'lon': 1.1, 'title': 'birthday party', 'desc': 'its lit', 'cat': 9, 'oid': uid_tim, 'netid': 'tlou', 'stime': '00:54', 'dur': 60}
      var ret = await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/newevent/',
        {
          method: 'POST',

          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify(newMarker)
        });


      // Update state variable markersList
      // this.setState({markersList: newMarkersList});

      // Update AsyncStorage
      // await AsyncStorage.setItem("markersList", JSON.stringify(newMarkersList));
      console.log("posted!");
      // Remove modal from view
      this.setState({inputTitle: "", inputDesc: "", timer: 60});
      this.setState({incMarker: []});
      this.setState({modalVisible: false});

    }
  }

  // Handles cancelled request
  _handleCancelMarker(){
    // set to null and remove Modal from view
    this.setState({inputTitle: "", inputDesc: "", timer: 60});
    this.setState({modalVisible: false});
    this.setState({hi: false});
  }


  // Before mounting, load markers list from AsyncStorage
  // onIds(device){
  //   console.log(" FROM TOWN!!!!!!!!!!!!!!!")
  //   console.log("Device info " , device);
  //   console.log("Device id " , device.userId);
  // }

  async componentWillMount(){

    console.log("From Town!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.props.deviceInfo);
    // OneSignal.addEventListener('ids',this.onIds);


    var fetchedMarkersList = await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/get/allactive', {
      method: "GET"
    });
    // console.log(fetchedMarkersList);
    var tempmarkersList = JSON.parse(fetchedMarkersList._bodyText);
    this.setState({markersList: tempmarkersList});
    console.log(" ---------------------------fetched Data -------------\n \n \n \n -------------");
    // await AsyncStorage.getItem("markersList").then((value) => {if(value !== null){this.setState({markersList: JSON.parse(value)}); console.log("VALUE!!");console.log(value)}}).done();
    const userData = await Firebase.auth().currentUser;
    const snapshot = await Firebase.database().ref('/users/' + userData.uid+ '/details').once('value');
    var userName = snapshot.val().fname;
    var netid = snapshot.val().netid;
    // var ttext = await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/user/hrishikesh');

    // this.setState({test: ttext});
    // alert(ttext._bodyText);
    // alert(userName);
    this.setState({netid: netid});
    this.setState({name: userName});
    this.setState({uid: userData.uid})
    this.setState({
      user: userData,
    });

    // var userId = firebaseApp.auth().currentUser.uid;

    // alert(JSON.stringify(this.state.user));
  }



  async componentDidMount(){
    console.log(" ---------------------------starting to fetch -------------\n \n \n \n -------------");

    var fetchedMarkersList = await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/get/allactive', {
      method: "GET"
    });
    // console.log(fetchedMarkersList);
    var tempmarkersList = JSON.parse(fetchedMarkersList._bodyText);
    this.setState({markersList: tempmarkersList});
    console.log(" ---------------------------fetched Data -------------\n \n \n \n -------------");
    // await AsyncStorage.getItem("markersList").then((value) => {if(value !== null){this.setState({markersList: JSON.parse(value)}); console.log("VALUE!!");console.log(value)}}).done();
    const userData = await Firebase.auth().currentUser;
    const snapshot = await Firebase.database().ref('/users/' + userData.uid+ '/details').once('value');
    var userName = snapshot.val().fname;
    var netid = snapshot.val().netid;
    // var ttext = await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/user/hrishikesh');

    // this.setState({test: ttext});
    // alert(ttext._bodyText);
    // alert(userName);
    this.setState({netid: netid});
    this.setState({name: userName});
    this.setState({uid: userData.uid})
    this.setState({
      user: userData,
    });
    // var userId = firebaseApp.auth().currentUser.uid;

    // alert(JSON.stringify(this.state.user));
  }
}

// Dont forget to register main App!!
AppRegistry.registerComponent('Town', () => Town);
