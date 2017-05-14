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
  DrawerLayoutAndroid,
  Dimensions,
  Animated,
  Slider,
  Image,
  TouchableWithoutFeedback,

} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Custom Utils import
import Firebase from '../utils/Firebase';

// Custom Components
import CustomMapView from '../components/CustomMapView';
import CustomMarker from '../components/CustomMarker';
import TopBar from '../components/TopBar';
import SideButton from '../components/SideButton';
import SideSwitch from '../components/SideSwitch';
import CheckButton from '../components/CheckButton';
import RadioButton from '../components/RadioButton';
import ClickButton from '../components/ClickButton';
import FilterButton from '../components/FilterButton';
import PinCategoryButton from '../components/PinCategoryButton';

// Pages imports
import Preferences from './Preferences';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import UserDetails from './UserDetails';

// Style imports
import Style from '../styles/Style';
import ButtonStyle from '../styles/ButtonStyles';
import PinInputStyle from '../styles/PinInputStyles';
import TownStyle from '../styles/TownStyles';
import SignupStyle from '../styles/SignupStyles';
import Colors from '../styles/Colors';


// Packages
import MapView from 'react-native-maps';
import Prompt from 'react-native-prompt';
import OneSignal from 'react-native-onesignal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Categories
import buttonCategories from '../utils/ButtonCategories';

// Backend
import backendUrl from '../utils/Config';

//
// const buttonCategories = [
//   { label: 'Free Food',
//   id: 'freefood',
//   index: 0,
//   selected: true,
//   icon: 'food',
// },
//
//   {label: 'Broken Printer',
//   id: 'brokenfacility',
//   index: 1,
//   selected: true,
//   icon: 'printer-alert',
// },
//
//   {label: 'Recruiting',
//   id: 'recruiting',
//   index: 2,
//   selected: true,
//   icon: 'account-multiple',
// },
//
//   {label: 'Study Break',
//   id: 'studybreak',
//   index: 3,
//   selected: true,
//   icon: 'pencil-off',
// },
//
//   {label: 'Performance',
//   id: 'movie',
//   index: 4,
//   selected: true,
//   icon: 'filmstrip',
// },
//
//   {label: 'Crowded',
//   id: 'busy',
//   index: 5,
//   selected: true,
//   icon: 'do-not-disturb',
// },
//
//   {label: 'Fire Safety',
//   id: 'firesafety',
//   index: 6,
//   selected: true,
//   icon: 'fire',
// },
//
// ];

const filterTime = 4000;
const filterDuration = 550;


const markerCircle = Colors.ACCENT;
const markerIcon = Colors.WHITE;

// dimensions used for animations
let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height
const currentCategories = JSON.parse(JSON.stringify(buttonCategories));

// Main App container
export default class Town extends Component{

  // Constructor
  constructor(props) {
    super(props);
    console.log('Constructor called!');
    this.animatedValue = new Animated.Value(windowWidth);
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
                  inputTitle: '', // temp Var for title of pin. Always '' when not making new pin
                  inputDesc: '',

                  markerInfoVisbile: false, // modalVisibility flag
                  markerInfo: {
                    icon: 'owl',
                  }, // temp var for description of pin. Always '' when not making new pin

                  filterVisible: false, // variable for filters being displayed or not
                  filterPicked: currentCategories,

                  currRegion: {
                    latitude: 40.3503,
                    longitude: - 74.6526,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021,
                  },
                  vote: '0',
                  regionSet: false,

                  mute: false,
                };



    // Princeton's co-ordinates
    this.defaultLocation = {
      latitude: 40.3503,
      longitude: - 74.6526,
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0021,
    };
    console.log('------------------------------ Constructor called ------------------------------');

    // Bindings
    this._handleMarkerPress = this._handleMarkerPress.bind(this);
    this._handleNewMarker = this._handleNewMarker.bind(this);
    this._handleCancelMarker = this._handleCancelMarker.bind(this);
    this._renderCustomMarkers = this._renderCustomMarkers.bind(this);
    this._radioButtonPressed = this._radioButtonPressed.bind(this);
    this._onCalloutPress = this._onCalloutPress.bind(this);
    this._setDrawer = this._setDrawer.bind(this);
    this._onPressTownButton = this._onPressTownButton.bind(this);
    this._onPressPrefsButton = this._onPressPrefsButton.bind(this);
    this._onPressUserButton = this._onPressUserButton.bind(this);
    this._onPressLogoutButton = this._onPressLogoutButton.bind(this);
    this._openAbout = this._openAbout.bind(this);
    this._closeAbout = this._closeAbout.bind(this);
    this._showFilters = this._showFilters.bind(this);
    this._hideFilters = this._hideFilters.bind(this);
    this._viewButtonPressed = this._viewButtonPressed.bind(this);
    this._getDistanceFromLatLonInKm = this._getDistanceFromLatLonInKm.bind(this);
    this._deg2rad = this._deg2rad.bind(this);
    this._deletePin = this._deletePin.bind(this);
    this._getSelectedLabel = this._getSelectedLabel.bind(this);
    this._mute = this._mute.bind(this);


    // Set timer for refreshing
    this.timerId = setInterval(() => {
      // Fetch from backend url
      fetch(backendUrl+'get/allactive', {
        method: 'GET'
      }).then((fetchedMarkersList) => {

        var tempmarkersList = JSON.parse(fetchedMarkersList._bodyText);
        this.setState({markersList: tempmarkersList});
        console.log('Fetched list of events from backed');
        // console.log(tempmarkersList);

      }).catch( (error)=> console.log('Error while fetching from backend: ' + error.message));

    }, 5000);

    this.locTimerId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            currRegion:{
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0022,
              longitudeDelta: 0.0021,
            },

            regionSet: true,
          });
        },
        (error) => {},
      );
    }, 60000);

    this.filterTimeout = null;

  }
  // Renders the main view
  render() {

    // var xButton = <Button onPress={() => {this.setState({markerInputVisible: false}); this._handleCancelMarker();}} style={[ButtonStyle.xButton, ButtonStyle.xButtonModal]}>X</Button>;

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
            buttonText = {'Town'}
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


    return(
      <View style={TownStyle.rootContainer}>
        <DrawerLayoutAndroid
          drawerWidth={windowWidth*0.8}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}
          ref={'DRAWER'}>
          <TopBar
            title={' Town'}
            logoName = {'map'}
            navigator={this.props.navigator}
            sidebarRef={()=>this._setDrawer()}/>
          <View style={TownStyle.mapContainer}>
            <CustomMapView
              regionSet={this.state.regionSet}
              initialRegion={this.state.currRegion}
              onPressHandler = {this._showFilters}
              onLongPressHandler={this._handleMarkerPress}
              markersList={this.state.markersList}
              renderMarkers={this._renderCustomMarkers}
            />
            <Modal
              animationType = {'slide'}
              swipeToClose = {true}
              swipeThreshold = {150}
              backButtonClose = {true}
              backdropPressToClose = {false}
              style={{
                justifyContent: 'center',
                alignItems: 'stretch',
                height: windowHeight*0.60,
                width: windowWidth*0.8,
                borderRadius : 5,
                backgroundColor: Colors.PRIMARY,
                elevation: 5,
              }}
              onClosed = {() => {this.setState({markerInputVisible: false}); this._handleCancelMarker();}}
              isOpen = {this.state.markerInputVisible}
            >
              <KeyboardAwareScrollView contentContainerStyle={PinInputStyle.MainContainer}>
                <View style={PinInputStyle.topBar}>
                  <Text style={PinInputStyle.topBarText}> Create new event</Text>
                  <TouchableWithoutFeedback onPress={() => {this.setState({markerInputVisible: false}); this._handleCancelMarker();}}>
                    <View style={{alignItems: 'center', justifyContent: 'center', flex:1, paddingRight: 5}}>
                      <Icon size={20} color={Colors.PRIMARY_DARK} name="close" />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={PinInputStyle.inputContainer}>
                  <View style={PinInputStyle.TitleInputContainer}>
                    <TextInput
                      selectionColor= {Colors.PRIMARY}
                      underlineColorAndroid = {Colors.PRIMARY_LIGHT}
                      placeholderTextColor = {Colors.DARK_GREY}
                      selectionColor = {Colors.SECONDARY_DARK}
                      maxLength = {30}
                      style={{flex:1, color: Colors.WHITE}}

                      placeholder= {'Enter pin title here!'}
                      onChangeText={(text) => this.setState({inputTitle: text})}
                    />
                  </View>

                  <View style={PinInputStyle.DescriptionInputContainer}>
                    <TextInput
                      selectionColor= {Colors.PRIMARY}
                      underlineColorAndroid = {Colors.PRIMARY_LIGHT}
                      placeholderTextColor = {Colors.DARK_GREY}
                      selectionColor = {Colors.SECONDARY_DARK}
                      value={this.state.descInput}
                      style={{color: Colors.WHITE}}
                      placeholder= {'Enter pin description here!'}
                      onChangeText={(text) => this.setState({inputDesc: text})}
                      multiline = {true}
                      maxLength= {60}
                      numberOfLines = {4}
                      textAlignVertical = 'top'
                    />
                  </View>

                  <View style={PinInputStyle.TimerBarContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon name='timer' size={18} color={Colors.WHITE}/>
                    <Text style={{fontSize: 14, textAlign: 'left', color: Colors.WHITE }}>{' ' + (Math.floor(this.state.timer/60) > 0 ? Math.floor(this.state.timer/60).toString() + 'h ' : '') + (this.state.timer%60).toString() + 'm'}</Text>
                  </View>
                  <Slider
                      maximumTrackTintColor={Colors.SECONDARY}
                      thumbTintColor = {Colors.SECONDARY}
                      minimumTrackTintColor={Colors.SECONDARY_DARK}
                      maximumValue={180}
                      minimumValue={10}
                      onValueChange={(time)=> this.setState({timer: time})}
                      step={10}
                      value={this.state.timer}
                      >
                    </Slider>
                  </View>
                  <Text style = {{color: Colors.LIGHTER_GREY, flex:0.5}}>{'Pick a Category: ' + this._getSelectedLabel(buttonCategories)}</Text>
                  <View style={PinInputStyle.RadioButtonListContainer}>
                    {this._renderRadioButtons(buttonCategories, this._radioButtonPressed)}
                  </View>
                  <View style={PinInputStyle.ConfirmationButtonsContainer}>
                    <View style={ButtonStyle.HorizontalButtonListContainer}>

                      <ClickButton
                        onPress={this._handleNewMarker}
                        label='Submit'
                        color={Colors.PRIMARY_LIGHT}
                        textcolor={Colors.SECONDARY}

                      />
                    </View>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </Modal>
            <Modal
              backButtonClose = {true}
              style={{
                justifyContent: 'center',
                alignItems: 'stretch',
                height: windowHeight*0.5,
                width: windowWidth*0.8,
                borderRadius : 10,
                elevation: 5,
              }}
              animationType = {'slide'}
              onClosed = {() => this.setState({markerInfoVisbile: false})}
              isOpen = {this.state.markerInfoVisbile}
              >

                <View style={PinInputStyle.MainContainer}>

                  <View style={PinInputStyle.displayContainer}>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',backgroundColor: Colors.SECONDARY_DARK, padding: 10}}>
                      <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: Colors.PRIMARY, alignItems: 'center', justifyContent: 'center', padding:10, elevation: 10}}>
                        <Icon name={this.state.markerInfo.icon} size={30} color={Colors.WHITE} />
                      </View>
                      <View style={{paddingLeft:10, alignItems: 'stretch', justifyContent:'center', flex: 4,}}>
                        <Text style={{flex:1, textAlignVertical: 'center', fontSize: 25, fontWeight: '300', color:Colors.WHITE}}>{this.state.markerInfo.title}</Text>
                      </View>
                    </View>
                    <View style={{padding: 10, flex:4, alignItems: 'stretch', justifyContent: 'center', padding: 10, backgroundColor: Colors.PRIMARY}}>
                      <Text style={{flex:1, fontSize: 20, fontWeight: '100', color: Colors.LIGHTER_GREY}}>{this.state.markerInfo.description}</Text>
                      <View style={{flexDirection: 'row', justifyContent: 'flex-start', flex:1, alignItems: 'center'}}>
                        <Icon name='timer' size={20} color={Colors.WHITE}/>
                        <Text style={{fontSize: 18, textAlign: 'left', color: Colors.WHITE}} >{' ' + (Math.floor(this.state.markerInfo.timeago/60) > 0 ? Math.floor(this.state.markerInfo.timeago/60).toString() + 'h ' : '') + (this.state.markerInfo.timeago%60).toString()+'m ago, '}</Text>
                        <Text style={{fontSize: 18, textAlign: 'right', color: Colors.WHITE}} >{' ' + (Math.floor(this.state.markerInfo.timeremaining/60) > 0 ? Math.floor(this.state.markerInfo.timeremaining/60).toString() + 'h ' : '') + (this.state.markerInfo.timeremaining%60).toString()+'m left'}</Text>
                      </View>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={ButtonStyle.RadioButtonContainer}>
                          <Text style={{color: Colors.SECONDARY}}>{this.state.markerInfo.up}</Text>
                          <TouchableWithoutFeedback style={ButtonStyle.CheckButtonTouchable}
                            onPress={() => this._upvotePressed(this.state.markerInfo.eventid)}>
                            <Icon name={'thumb-up'} size={30} color={(this.state.vote == '1' ? Colors.SECONDARY: Colors.LIGHT_GREY)} />
                          </TouchableWithoutFeedback>
                        </View>
                        <View style={ButtonStyle.RadioButtonContainer}>
                          <Text style={{color: Colors.RED}}>{this.state.markerInfo.down}</Text>
                          <TouchableWithoutFeedback style={ButtonStyle.CheckButtonTouchable}
                            onPress={()=> this._downvotePressed(this.state.markerInfo.eventid)}>
                            <Icon name={'thumb-down'} size={30} color={(this.state.vote == '-1' ? Colors.RED: Colors.LIGHT_GREY)} />
                          </TouchableWithoutFeedback>
                        </View>
                      </View>

                      {this.state.markerInfo.owner != this.state.user.uid ?
                      (<View>
                        <Text style={{color: Colors.LIGHTER_GREY}}>{'Dropped by ' + this.state.markerInfo.netid}</Text>
                      </View>) :
                      (
                        <View style={{flex:1}}>
                          <Text style={{flex:1, color: Colors.LIGHTER_GREY}}>{'Do you want to delete this pin?'}</Text>
                          <ClickButton
                            style={{flex:2}}
                            onPress={() => this._deletePin(this.state.markerInfo.eventid)}
                            label='Delete marker'
                            color={Colors.PRIMARY_LIGHT}
                            textcolor = {Colors.RED}
                          />
                        </View>)}
                    </View>
                  </View>
                </View>
            </Modal>
            <Animated.View
              style={{
                transform: [{ translateX: this.animatedValue }],
                marginTop: 0,
                position: 'absolute',
                left:0,
                top:windowHeight*0.15,
                bottom: windowHeight*0.15,
                width: windowWidth*0.15,
                flexDirection: 'column'
              }}>
              <ScrollView contentContainerStyle={PinInputStyle.ViewButtonListContainer}>
                {this._renderFilterButtons(this.state.filterPicked, this._viewButtonPressed)}
              </ScrollView>
            </Animated.View>
            <Modal
              animationType = {'slide'}
              style={{
                justifyContent: 'center',
                alignItems: 'stretch',
                height: windowHeight*0.8,
                width: windowWidth*0.9,
                padding: 5,
                borderRadius : 3,
                backgroundColor :Colors.PRIMARY,
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

  _showFilters() {
    if (this.state.filterVisible) {

      clearTimeout(this.filterTimeout);
      this.setState({ filterVisible: false })
      Animated.timing( this.animatedValue,
                      {
                        toValue: windowWidth,
                        duration: filterDuration,
                      }
                    ).start();
      return;
    }
    else{
      this.setState({filterVisible: true});
      Animated.timing(
        this.animatedValue,
        {
          toValue: windowWidth*0.85,
          duration: filterDuration,
        }
      ).start(this._hideFilters());
      return;
    }
  }

  _hideFilters() {

    this.filterTimeout= setTimeout(() => {
      this.setState({ filterVisible: false })
      Animated.timing( this.animatedValue,
                      {
                        toValue: windowWidth,
                        duration: filterDuration,
                      }
                    ).start()}, filterTime);


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


  async _deletePin(deleventid){

    await fetch(backendUrl+'post/deleteevent/',
      {
        method: 'POST',

        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({eventid: deleventid})
      });

      alert('Deleted your event!');
      this.setState({markerInfoVisbile: false});


  }
  _openAbout() {
    this.refs['DRAWER'].closeDrawer();
    this.setState({aboutVisible: true})
  }

  _closeAbout() {
    this.setState({aboutVisible: false});
  }

  async _onPressLogoutButton() {
    clearInterval(this.timerId);
    clearInterval(this.locTimerId);
    // console.log(buttonCategories);
    this.setState({filterPicked : JSON.parse(JSON.stringify(buttonCategories))});
    var voted = '';
    // await AsyncStorage.getItem('eventsVoted').then((eventVoted) => voted = eventVoted);
    // voted = voted.split(',');
    AsyncStorage.clear();
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
      clearTimeout(this.filterTimeout);
      this.props.navigator.replace({
        component: Login
      });
    }).catch((error)=> console.log('Done with fetching from tim' + error.message));
  }

  _onPressTownButton() {
    this.refs['DRAWER'].closeDrawer();
  }

  _onPressPrefsButton() {
    clearTimeout(this.filterTimeout);
    this.props.navigator.replace({
      component: Preferences
    });
  }

  _onPressUserButton() {
    clearTimeout(this.filterTimeout);
    this.props.navigator.replace({
      component: UserDetails
    });
  }

  _setDrawer() {
    this.refs['DRAWER'].openDrawer();
    clearTimeout(this.filterTimeout);
    this.setState({ filterVisible: false })
    Animated.timing( this.animatedValue,
                    {
                      toValue: windowWidth,
                      duration: filterDuration,
                    }
                  ).start();
    return;

  }


  _radioButtonPressed(buttonId){
    this.setState({selectedCategory: buttonId});
  }

  _viewButtonPressed(buttonIdx){

    clearTimeout(this.filterTimeout);

    this.filterTimeout = setTimeout(() => {
      this.setState({ filterVisible: false })
      Animated.timing( this.animatedValue,
                      {
                        toValue: windowWidth,
                        duration: filterDuration,
                      }
                    ).start()}, filterTime);
    var currentPicked = this.state.filterPicked.slice();
    currentPicked[buttonIdx].selected = ! currentPicked[buttonIdx].selected
    console.log(' Current filters');
    // console.log(this.state.filterPicked);
    // console.log(buttonCategories);

    this.setState({filterPicked: currentPicked});

  }

  _getSelectedLabel(buttonsList) {
    if (this.state.selectedCategory === null){
      return ' ';
    }
    return buttonCategories[this.state.selectedCategory].label;
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
    var currIcon = null;
    for (var b = 0; b < buttonsList.length; b++){

      currLabel = buttonsList[b].label;
      currIndex = buttonsList[b].index;
      currSelected = currIndex == this.state.selectedCategory ? true:false;
      currId = buttonsList[b].id;
      currIcon = buttonsList[b].icon;
      curronPress = onPress.bind(null,currIndex);

      buttons.push(
        <PinCategoryButton
          label = {currLabel}
          selected = {currSelected}
          onPress = {curronPress}
          index = {currIndex}
          icon = {currIcon}
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
                netid: marker.netid,
                title: marker.title,
                description: marker.description,
                owner: marker.ownerid,
                icon: buttonCategories[parseInt(marker.category)].icon,
                eventid: marker.eventid,
                up: marker.upvotes,
                down: marker.downvotes,
                timeago: marker.timeago,
                timeremaining: marker.timeremaining,
              },

              icon: buttonCategories[parseInt(marker.category)].icon,
              key: marker.eventid,
            };

            markers.push(

                        <CustomMarker marker={markerprop}
                          key={marker.eventid}
                          type={parseInt(marker.category)}
                          onCalloutPressed={this._onCalloutPress}
                        />

            );
          }

        }

        console.log('Rendered markers : ', markersList.length);
        // console.log(' ----------------------------------------------');
        //
        // console.log(' rendering ' + JSON.stringify(markersList));
        // console.log(' ----------------------------------------------');

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
      var currIcon = null;
      for (var b = 0; b < buttonsList.length; b++){

        currLabel = buttonsList[b].label;
        currSelected = buttonsList[b].selected;
        currId = buttonsList[b].id;
        currIndex = buttonsList[b].index;
        currIcon = buttonsList[b].icon;
        curronPress = onPress.bind(null,currIndex);

        buttons.push(
          <FilterButton
            label = {currLabel}
            selected = {currSelected}
            onPress = {curronPress}
            index = {currIndex}
            icon = {currIcon}
            key = {currId}/>
        );
      }

      return buttons;

    }



  async _upvotePressed(eventId){
    var upvotes = this.state.markerInfo.up;
    var downvotes = this.state.markerInfo.down;
    var marker = this.state.markerInfo;
    if(this.state.vote == '1'){
      AsyncStorage.setItem(eventId,'0');
      marker.up = (upvotes-1);
      this.setState({vote: '0', markerInfo: {...marker, up: (upvotes - 1)}});
      var ret = await fetch(backendUrl+'vote/',
        {
          method: 'POST',

          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify(
                  { eventid: eventId,
                    upvotechange: -1,
                    downvotechange: 0,
                  }
                )
        });
      return;
    }

    if(this.state.vote == '0'){
      AsyncStorage.setItem(eventId,'1');
      this.setState({vote: '1', markerInfo: {...marker, up: (upvotes + 1)}});
      var ret = await fetch(backendUrl+'vote/',
        {
          method: 'POST',

          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify(
                  { eventid: eventId,
                    upvotechange: 1,
                    downvotechange: 0,
                  }
                )
        });
      return;
    }

    if(this.state.vote == '-1'){
      AsyncStorage.setItem(eventId,'1');
      this.setState({vote: '1', markerInfo: {...marker, up: (upvotes+1), down: (downvotes - 1)}});
      var ret = await fetch(backendUrl+'vote/',
        {
          method: 'POST',

          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify(
                  { eventid: eventId,
                    upvotechange: 1,
                    downvotechange: -1,
                  }
                )
        });
      return;
    }

  }

  async _downvotePressed(eventId){
    var upvotes = this.state.markerInfo.up;
    var downvotes = this.state.markerInfo.down;
    var marker = this.state.markerInfo;
    if(this.state.vote == '-1'){
      AsyncStorage.setItem(eventId,'0');
      this.setState({vote: '0', markerInfo:{...marker, down: (downvotes-1)}});
      var ret = await fetch(backendUrl+'vote/',
        {
          method: 'POST',

          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify(
                  { eventid: eventId,
                    upvotechange: 0,
                    downvotechange: -1,
                  }
                )
        });
      return;
    }

    if(this.state.vote == '0'){
      AsyncStorage.setItem(eventId,'-1');
      this.setState({vote: '-1', markerInfo:{...marker, down: (downvotes+1)}});
      var ret = await fetch(backendUrl+'vote/',
        {
          method: 'POST',

          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify(
                  { eventid: eventId,
                    upvotechange: 0,
                    downvotechange: 1,
                  }
                )
        });
      return;
    }

    if(this.state.vote == '1'){
      AsyncStorage.setItem(eventId,'-1');
      this.setState({vote: '-1', markerInfo:{...marker, up: (upvotes-1),down:(downvotes+1)}});
      var ret = await fetch(backendUrl+'vote/',
        {
          method: 'POST',

          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify(
                  { eventid: eventId,
                    upvotechange: -1,
                    downvotechange: 1,
                  }
                )
        });
      return;
    }

  }

  async _onCalloutPress(markerDescription){

    var eventid = markerDescription.eventid;
    clearTimeout(this.filterTimeout);
    this.setState({ filterVisible: false })
    Animated.timing( this.animatedValue,
                    {
                      toValue: windowWidth,
                      duration: filterDuration,
                    }
                  ).start();
    var vote = '';
    // await AsyncStorage.getItem(eventid).then((eventVote)=> vote = eventVote).catch((error) => alert(error.message));
    // console.log('wtf',vote);
    // if(vote == null){
    //   vote = '0';
    // }
    // this.setState({vote: vote});
    // AsyncStorage.setItem(eventid, vote);
    // var votes = '';
    // // await AsyncStorage.getItem('eventsVoted').then((eventsVoted) => votes = eventsVoted).catch((error) => alert(error.message));
    // console.log(votes);
    // votes = votes + eventid + ',';
    // // AsyncStorage.setItem('eventsVoted',votes);
    // console.log(votes);

    this.setState({markerInfoVisbile: true,
      markerInfo: markerDescription})
  };
  // Handles a onLongPress event
  // Saves co-ordinates in state variable incMarker
  _handleMarkerPress(e){
    clearTimeout(this.filterTimeout);
    this.setState({ filterVisible: false })
    Animated.timing( this.animatedValue,
                    {
                      toValue: windowWidth,
                      duration: filterDuration,
                    }
                  ).start();

    // await navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     this.setState({
    //       currRegion:{
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //         latitudeDelta: 0.0022,
    //         longitudeDelta: 0.0021,
    //       }
    //     });
    //   },
    //   (error) => {console.log(error.message)},
    //   { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    // );

    if (this._getDistanceFromLatLonInKm(this.state.currRegion.latitude,
                                        this.state.currRegion.longitude,
                                        e.nativeEvent.coordinate.latitude,
                                        e.nativeEvent.coordinate.longitude) > 0.2)
    {
      alert('Sorry, you are too far away from that location to drop a pin there!')
      return;
    }

    this.setState({ incMarker: {
                    coordinate: e.nativeEvent.coordinate,
                    title: 'blahblah',
                    description: 'Haha'
                  }});

    // Make modal visible for user input.
    this.setState({markerInputVisible: true});
  }

  _getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this._deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this._deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  _deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  // Evaluates inputted values on Modal
  async _handleNewMarker(){

    if (!this.state.inputTitle){
      alert('Please enter a title!')
      return;
    }

    else if (this.state.selectedCategory === null){
      alert('Please pick a category!')
    }
    // If valid inputs then ...
    else{
      var description = this.state.inputDesc;
      if (!this.state.inputDesc){
        description = 'Happening now!';
      }


      var newMarker = {
        'latitude': this.state.incMarker.coordinate.latitude,
        'longitude': this.state.incMarker.coordinate.longitude,
        'title': this.state.inputTitle,
        'description': description,
        'cat': this.state.selectedCategory.toString(),
        'catname': buttonCategories[this.state.selectedCategory].id,
        'catdisplayname': buttonCategories[this.state.selectedCategory].label,
        'oid': this.state.user.uid,
        'netid': this.state.netid,
        'stime': new Date().getTime(),
        'dur': this.state.timer};

      // Add new marker to newMarkersList
      // eventdict = {'lat': 0.0, 'lon': 1.1, 'title': 'birthday party', 'desc': 'its lit', 'cat': 9, 'oid': uid_tim, 'netid': 'tlou', 'stime': '00:54', 'dur': 60}
      var ret = await fetch(backendUrl+'post/newevent/',
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
      // await AsyncStorage.setItem('markersList', JSON.stringify(newMarkersList));
      console.log('posted!');
      // Remove modal from view
      this.setState({inputTitle: '', inputDesc: '', selectedCategory: null, timer: 60});
      this.setState({incMarker: []});
      this.setState({markerInputVisible: false});

    }
  }

  // Handles cancelled request
  _handleCancelMarker(){
    // set to null and remove Modal from view
    this.setState({inputTitle: '', inputDesc: '', selectedCategory: null, timer: 60});
    this.setState({markerInputVisible: false});
    this.setState({markerInfoVisbile: false});
  }


  _mute(){
    muteurl = backendUrl;
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
  async componentWillMount(){

    // console.log('From Town!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', this.props.deviceInfo);
    // OneSignal.addEventListener('ids',this.onIds);


    var fetchedMarkersList = await fetch(backendUrl+'get/allactive', {
      method: 'GET'
    });
    AsyncStorage.getItem('mute').then((value) => {
      if (value != null){
        var val = (value== "true" ? true: false);
        this.setState({mute: val });
        muteurl = backendUrl;
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
    // console.log(fetchedMarkersList);
    var tempmarkersList = JSON.parse(fetchedMarkersList._bodyText);
    this.setState({markersList: tempmarkersList});
    // console.log(' ---------------------------fetched Data -------------\n \n \n \n -------------');
    // await AsyncStorage.getItem('markersList').then((value) => {if(value !== null){this.setState({markersList: JSON.parse(value)}); console.log('VALUE!!');console.log(value)}}).done();
    const userData = await Firebase.auth().currentUser;
    const snapshot = await Firebase.database().ref('/users/' + userData.uid+ '/details').once('value');
    var userName = snapshot.val().fname;
    var netid = snapshot.val().netid;
    // var ttext = await fetch(backendUrl+'user/hrishikesh');

    // this.setState({test: ttext});
    // alert(ttext._bodyText);
    // alert(userName);
    this.setState({netid: netid});
    this.setState({name: userName});
    this.setState({uid: userData.uid})
    this.setState({
      user: userData,
    });

    await navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          currRegion:{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
          }});
      },
      (error) => {alert('Please turn on your location!')},
    );
    this.setState({regionSet: true});
    console.log(this.state.currRegion)

    // var userId = firebaseApp.auth().currentUser.uid;

    // alert(JSON.stringify(this.state.user));
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
    clearInterval(this.locTimerId);

  }

  //
  // async componentDidMount(){
  //   console.log(' ---------------------------starting to fetch -------------\n \n \n \n -------------');
  //
  //   var fetchedMarkersList = await fetch(backendUrl+'get/allactive', {
  //     method: 'GET'
  //   });
  //   // console.log(fetchedMarkersList);
  //   var tempmarkersList = JSON.parse(fetchedMarkersList._bodyText);
  //   this.setState({markersList: tempmarkersList});
  //   console.log(' ---------------------------fetched Data -------------\n \n \n \n -------------');
  //   // await AsyncStorage.getItem('markersList').then((value) => {if(value !== null){this.setState({markersList: JSON.parse(value)}); console.log('VALUE!!');console.log(value)}}).done();
  //   const userData = await Firebase.auth().currentUser;
  //   const snapshot = await Firebase.database().ref('/users/' + userData.uid+ '/details').once('value');
  //   var userName = snapshot.val().fname;
  //   var netid = snapshot.val().netid;
  //   // var ttext = await fetch(backendUrl+'user/hrishikesh');
  //
  //   // this.setState({test: ttext});
  //   // alert(ttext._bodyText);
  //   // alert(userName);
  //   this.setState({netid: netid});
  //   this.setState({name: userName});
  //   this.setState({uid: userData.uid})
  //   this.setState({
  //     user: userData,
  //   });
  //   // var userId = firebaseApp.auth().currentUser.uid;
  //
  //   // alert(JSON.stringify(this.state.user));
  // }
}

// Dont forget to register main App!!
AppRegistry.registerComponent('Town', () => Town);