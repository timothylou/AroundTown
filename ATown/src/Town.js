// Component imports
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  AsyncStorage,
  TextInput,
  Modal,
  Button,
  Slider,
  DrawerLayoutAndroid,
  Dimensions,
  Animated,
  Image,
} from 'react-native';

// Custom Utils import
import Firebase from './Firebase';

// Custom Components
import CustomMapView from './CustomMapView';
import CustomMarker from './CustomMarker';
import TopBar from './TopBar';
import SideButton from './SideButton';
import CheckButton from './CheckButton';
import RadioButton from './RadioButton';
import ClickButton from './ClickButton';
// Pages imports
import Preferences from './Preferences';
import About from './About';
import Login from './Login';
import Signup from './Signup';

// Style imports
import Style from './Style';
import ButtonStyle from './ButtonStyles';
import PinInputStyle from './PinInputStyles';
import TownStyle from './TownStyles';
// Packages
import MapView from 'react-native-maps';
import Prompt from 'react-native-prompt';
import OneSignal from 'react-native-onesignal';


var buttonsCatTest = [
  { label: "Free Food",
  id: "freefood",
  index: 0,
  selected: true,},

  {label: "Broken Facility",
  id: "brokenfacility",
  index: 1,
  selected: true,},

  {label: "Recruiting",
  id: "recruiting",
  index: 2,
  selected: true,},

  {label: "Study Break",
  id: "studybreak",
  index: 3,
  selected: true,},

  {label: "Movie Screening",
  id: "movie",
  index: 4,
  selected: true,},

  {label: "Busy",
  id: "busy",
  index: 5,
  selected: true,},

  {label: "Fire Safety",
  id: "firesafety",
  index: 6,
  selected: true,},

];



// dimensions used for animations
let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height

// Main App container
export default class Town extends Component{

  // Constructor
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(windowWidth)
    this.state = {checked1:false, // Checkbox flag
                  checked2:false,
                  markersList: [], // Local list of markers
                  user: '',
                  name: 'BLAH',
                  timer: 60,
                  test: '',
                  netid: '',
                  selectedCategory: null,

                  categories: [], // Future list of categories
                  incMarker: [], // list to store co-ordinates of onLongPress event

                  aboutVisible: false,


                  markerInputVisible: false,
                  inputTitle: "", // temp Var for title of pin. Always "" when not making new pin
                  inputDesc: "",

                  markerInfoVisbile: false, // modalVisibility flag
                  markerInfo: "", // temp var for description of pin. Always "" when not making new pin

                  filterVisible: false, // variable for filters being displayed or not
                  filterPicked: buttonsCatTest,

                };



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
    this._radioButtonPressed = this._radioButtonPressed.bind(this);
    this._onCalloutPress = this._onCalloutPress.bind(this);
    this._setDrawer = this._setDrawer.bind(this);
    this._onPressPrefsButton = this._onPressPrefsButton.bind(this);
    this._onPressLogoutButton = this._onPressLogoutButton.bind(this);
    this._openAbout = this._openAbout.bind(this);
    this._closeAbout = this._closeAbout.bind(this);
    this._showFilters = this._showFilters.bind(this);
    this._hideFilters = this._hideFilters.bind(this);
    this._viewButtonPressed = this._viewButtonPressed.bind(this);


    // Set timer for refreshing
    this.timerId = setInterval(() => {
      // Fetch from backend url
      fetch('https://herokuflask0.herokuapp.com/get/allactive', {
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
      <View style={TownStyle.rootContainer}>
        <DrawerLayoutAndroid
          drawerWidth={300}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}
          ref={'DRAWER'}>
          <TopBar
            title={'Town View'}
            navigator={this.props.navigator}
            sidebarRef={()=>this._setDrawer()}/>
          <View style={TownStyle.mapContainer}>
            <CustomMapView
              initialRegion={this.defaultLocation}
              onPressHandler = {this._showFilters}
              onLongPressHandler={this._handleMarkerPress}
              markersList={this.state.markersList}
              renderMarkers={this._renderCustomMarkers}
            />
            <Modal
              animationType = {'slide'}
              onRequestClose = {this._handleCancelMarker}
              visible = {this.state.markerInputVisible}
            >
              <ScrollView contentContainerStyle={PinInputStyle.MainContainer}>
                <View style={PinInputStyle.TitleInputContainer}>
                  <Text style={PinInputStyle.TitleInputTitle}>Enter title here!</Text>
                  <TextInput
                    placeholder= {"Enter pin title here!"}
                    onChangeText={(text) => this.setState({inputTitle: text})}
                  />
                </View>

                <View style={PinInputStyle.DescriptionInputContainer}>
                  <Text style = {PinInputStyle.DescriptionInputTitle}>Enter description here!</Text>
                  <TextInput
                    value={this.state.descInput}
                    placeholder= {"Enter pin description here!"}
                    onChangeText={(text) => this.setState({inputDesc: text})}

                    multiline = {true}
                    numberOfLines = {8}
                    textAlignVertical = "top"
                  />
                </View>


                <View style={PinInputStyle.TimerBarContainer}>
                  <Text style = {PinInputStyle.TimerText}>{Math.floor(this.state.timer/60).toString()+ " hrs " + (this.state.timer%60).toString()+"mins"}</Text>
                  <Slider
                    maximumValue={180}
                    minimumValue={0}
                    onValueChange={(time)=> this.setState({timer: time})}
                    step={1}
                    value={this.state.timer}
                    >
                  </Slider>
                </View>
                <View style={PinInputStyle.RadioButtonListContainer}>
                  {this._renderRadioButtons(buttonsCatTest, this._radioButtonPressed)}
                </View>
                <View style={PinInputStyle.ConfirmationButtonsContainer}>
                  <View style={ButtonStyle.HorizontalButtonListContainer}>
                    <ClickButton
                      onPress={this._handleNewMarker}
                      label="Submit"
                      color="#2196F3"
                    />
                    <ClickButton
                      onPress={this._handleCancelMarker}
                      label="Cancel"
                      color="#FF5722"
                    />
                  </View>
                </View>
              </ScrollView>
            </Modal>
            <Modal
              animationType = {'slide'}
              onRequestClose = {this._handleCancelMarker}
              visible = {this.state.markerInfoVisbile}
              >
              <View>
                  <Button
                    onPress={this._handleCancelMarker}
                    title="Cancel"
                    color="#FF5722"
                    accessibilityLabel="Learn more about this purple button"
                    />
                    <Text>{this.state.markerInfo.title}</Text>
                    <Text>{this.state.markerInfo.description}</Text>
                    <Text>{this.state.user.uid==this.state.markerInfo.owner? 'you own this!!': 'this aint your pin'}</Text>
              </View>
            </Modal>
            <Animated.View
              style={{
                transform: [{ translateX: this.animatedValue }],
                marginTop: 0,
                backgroundColor: '#696969',
                position: 'absolute',
                left:0,
                top:100,
                bottom: 100,
                width: 70,
                flexDirection: 'column'
              }}>
              <ScrollView contentContainerStyle={PinInputStyle.ViewButtonListContainer}>
                {this._renderFilterButtons(this.state.filterPicked, this._viewButtonPressed)}
              </ScrollView>
            </Animated.View>
          </View>
        </DrawerLayoutAndroid>
      </View>
    );
  }

  _showFilters() {
    if (this.state.filterVisible) return;

    this.setState({filterVisible: true});
    Animated.timing(
      this.animatedValue,
      {
        toValue: windowWidth - 70,
        duration: 500
      }
    ).start(this._hideFilters());
  }

  _hideFilters() {
    setTimeout(() => {
      this.setState({ filterVisible: false })
      Animated.timing(
      this.animatedValue,
      {
        toValue: windowWidth,
        duration: 500
      }).start()
    }, 5000)
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

  _radioButtonPressed(buttonId){
    this.setState({selectedCategory: buttonId});
  }

  _viewButtonPressed(buttonIdx){

    var currentPicked = this.state.filterPicked;
    currentPicked[buttonIdx].selected = ! currentPicked[buttonIdx].selected
    this.setState({filterPicked: currentPicked});

  }

  _renderRadioButtons(buttonsList, onPress){
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
      currIndex = buttonsList[b].index;
      currId = buttonsList[b].id;
      currSelected = currIndex == this.state.selectedCategory ? true:false;
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

  // Renders custom markers from a list of markers.
  _renderCustomMarkers(markersList){
        // List of <MarkerView>s
        let markers = [];
        if(markersList == null){
          markersList = [];
        }

        for(var m = 0; m < markersList.length; m++){

          marker = markersList[m];
          // console.log(marker.category);

          if (this.state.filterPicked[parseInt(marker.category)].selected){
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
                title: marker.title,
                description: marker.description,
                owner: marker.ownerid,



              },

            };

            markers.push(

                        <CustomMarker marker={markerprop}
                          key={m}
                          onCalloutPressed={this._onCalloutPress}
                        />

            );
          }

        }
        // console.log(" ----------------------------------------------");
        //
        // console.log(" rendering " + JSON.stringify(markersList));
        // console.log(" ----------------------------------------------");

        return markers;
  }


    _renderFilterButtons(buttonsList, onPress){
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
          <CheckButton
            label = {currLabel}
            selected = {currSelected}
            onPress = {curronPress}
            index = {currIndex}
            key = {currId}/>
        );
      }

      return buttons;

    }

  _onCalloutPress(markerDescription){
    this.setState({markerInfoVisbile: true,
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
    this.setState({markerInputVisible: true});
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
        'cat': this.state.selectedCategory.toString(),
        'oid': this.state.user.uid,
        'netid': this.state.netid,
        'stime': new Date().getTime(),
        'dur': this.state.timer};

      // Add new marker to newMarkersList
      // eventdict = {'lat': 0.0, 'lon': 1.1, 'title': 'birthday party', 'desc': 'its lit', 'cat': 9, 'oid': uid_tim, 'netid': 'tlou', 'stime': '00:54', 'dur': 60}
      var ret = await fetch('https://herokuflask0.herokuapp.com/post/newevent/',
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
      this.setState({markerInputVisible: false});

    }
  }

  // Handles cancelled request
  _handleCancelMarker(){
    // set to null and remove Modal from view
    this.setState({inputTitle: "", inputDesc: "", timer: 60});
    this.setState({markerInputVisible: false});
    this.setState({markerInfoVisbile: false});
  }


  async componentWillMount(){

    console.log("From Town!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.props.deviceInfo);
    // OneSignal.addEventListener('ids',this.onIds);


    var fetchedMarkersList = await fetch('https://herokuflask0.herokuapp.com/get/allactive', {
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
    // var ttext = await fetch('https://herokuflask0.herokuapp.com/user/hrishikesh');

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

  componentWillUnmount() {
    clearInterval(this.timerId);

  }


  async componentDidMount(){
    console.log(" ---------------------------starting to fetch -------------\n \n \n \n -------------");

    var fetchedMarkersList = await fetch('https://herokuflask0.herokuapp.com/get/allactive', {
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
    // var ttext = await fetch('https://herokuflask0.herokuapp.com/user/hrishikesh');

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
