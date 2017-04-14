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
  Slider
} from 'react-native';
import Style from './Style';
import Login from './Login';
import Signup from './Signup';
import MapView from 'react-native-maps';
import CheckButton from './CheckButton';
import Prompt from 'react-native-prompt';


// Main App container
export default class Town extends Component{

  // Constructor
  constructor() {
    super();
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
                  modalVisible: false, // modalVisibility flag
                  inputTitle: "", // temp Var for title of pin. Always "" when not making new pin
                  inputDesc: ""}; // temp var for description of pin. Always "" when not making new pin

    console.log("------------------------------ Constructor called ------------------------------");

    // Binding
    this._handleMarkerPress = this._handleMarkerPress.bind(this);
    this._handleNewMarker = this._handleNewMarker.bind(this);
    this._handleCancelMarker = this._handleCancelMarker.bind(this);

    setInterval(() => {
      fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/get/allactive', {
        method: "GET"
      }).then((fetchedMarkersList) => {
        var tempmarkersList = JSON.parse(fetchedMarkersList._bodyText);
        this.setState({markersList: tempmarkersList});
      }).done();
      console.log(" FETCHED FROM CONSTRUCTOR -------------------------");
    }, 5000);

  }


  // Renders a
  render() {
    return(
      <View style={Style.rootContainer}>
        <View style={Style.mapContainer}>
          <MapView  style={Style.map} initialRegion={{latitude: 40.3474,
                                                      longitude: - 74.6617,
                                                      latitudeDelta: 0.0022,
                                                      longitudeDelta: 0.0021,
                                                    }}
                                      onLongPress={this._handleMarkerPress}
          >
          {this._renderCustomMarkers(this.state.markersList)}
          </MapView>
          <CheckButton onChange={this._onChange.bind(this)}
          checked={this.state.checked1}
          label={this.state.test}/>
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
                minimumValue={15}
                onValueChange={(time)=> this.setState({timer: time})}
                step={15}
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

        </View>
      </View>
    );
  }

  // Checkbutton
  async _onChange(checked){
    newmarkersList = [];
    this.setState({markersList: newmarkersList});
    // await AsyncStorage.setItem("markersList", JSON.stringify(newmarkersList));
    if (checked){
      this.setState({checked:false})
    }
    else{
      this.setState({checked:true})
    }

    // var ret = await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/newuser/', {
    //     method: 'POST',
    //
    //     headers:{
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json',
    //     },
    //
    //     body: JSON.stringify({
    //       'fname': 'Jasmine',
    //       'lname': 'Lou',
    //       'cyear': 2019,
    //       'netid': 'jlou',
    //     })
    //   });
    //
    // var ret = await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/newevent/', {
    //     method: 'POST',
    //
    //     headers:{
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json',
    //     },
    //
    //     body: JSON.stringify({'lat': 0.0, 'lon': 1.1, 'title': 'birthday party', 'desc': 'its lit', 'cat': 9, 'oid': '7675vEYu8aSOSYwbbPVc0PQjV5H3', 'netid': 'tlou', 'stime': '00:54', 'dur': 60})
    //   });
      alert(new Date().getTime());


      // alert("Fetch was sent!");
  }

  _logout() {
    // logout, once that is complete, return the user to the login screen.
    this.props.firebaseApp.auth().signOut().then(() => {
      this.props.navigator.push({
        component: Login
      });
    });
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
          markers.push(
            <MapView.Marker
            coordinate={
              {latitude: marker.latitude,
              longitude: marker.longitude}}
            title={marker.title}
            description={marker.description}
            />
          );
        }
        console.log(" ----------------------------------------------");

        console.log(" rendering " + JSON.stringify(markersList));
        console.log(" ----------------------------------------------");

        return markers;
  }

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
  }


  // Before mounting, load markers list from AsyncStorage
  async componentWillMount(){

    var fetchedMarkersList = await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/get/allactive', {
      method: "GET"
    });
    console.log(fetchedMarkersList);
    var tempmarkersList = JSON.parse(fetchedMarkersList._bodyText);
    this.setState({markersList: tempmarkersList});
    console.log(" ---------------------------fetched Data -------------\n \n \n \n -------------");
    // await AsyncStorage.getItem("markersList").then((value) => {if(value !== null){this.setState({markersList: JSON.parse(value)}); console.log("VALUE!!");console.log(value)}}).done();
    const userData = await this.props.firebaseApp.auth().currentUser;
    const snapshot = await this.props.firebaseApp.database().ref('/users/' + userData.uid+ '/details').once('value');
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
    console.log(fetchedMarkersList);
    var tempmarkersList = JSON.parse(fetchedMarkersList._bodyText);
    this.setState({markersList: tempmarkersList});
    console.log(" ---------------------------fetched Data -------------\n \n \n \n -------------");
    // await AsyncStorage.getItem("markersList").then((value) => {if(value !== null){this.setState({markersList: JSON.parse(value)}); console.log("VALUE!!");console.log(value)}}).done();
    const userData = await this.props.firebaseApp.auth().currentUser;
    const snapshot = await this.props.firebaseApp.database().ref('/users/' + userData.uid+ '/details').once('value');
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
