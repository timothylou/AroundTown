import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TextInput
} from 'react-native';
import Style from './Style';
import MapView from 'react-native-maps';
import CheckButton from './CheckButton';
import Prompt from 'react-native-prompt';
// import InputButton from './InputButton';


export default class ATown extends Component{


  constructor() {
    super();
    this.state = {checked:false,
                  markersList: [],
                  promptTitleVisible: false,
                  promptDescVisible: false,
                  promptTimeVisible: false,

                  inputMarkerInfo: 'Default!',
                  categories: [],
                  incMarker: []};
    console.log("BIG TEXT!!!");
    AsyncStorage.getItem("markersList").then((value) => {if(value !== null){this.setState({markersList: JSON.parse(value)}); console.log("VALUE!!");console.log(value)}}).done();



    //
    //   this.setState({markersList : [
    //                                 ... this.state.markersList,
    //                                 JSON.parse(value)
    //                               ]});

    this._handleMarkerPress = this._handleMarkerPress.bind(this);
  }

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
          <Prompt title="Whats this for?"
                  placeholder="Enter pin info here!"
                  visible={this.state.promptTitleVisible}
                  onCancel={() => this.setState({promptTitleVisible: false, incMarker: []})}
                  onSubmit={(value)=>this._handleNewMarkerTitle(value)}
          />
          <Prompt title="Enter a short description for the event!"
                  placeholder="Enter event description here!"
                  visible={this.state.promptDescVisible}
                  onCancel={() => this.setState({promptDescVisible: false, incMarker: []})}
                  onSubmit={(value)=>this._handleNewMarkerDesc(value)}
          />
          <Prompt title="How long is this gonna be on for?"
                  placeholder="Enter time here"
                  visible={this.state.promptTimeVisible}
                  onCancel={() => this.setState({promptTimeVisible: false, incMarker: []})}
                  onSubmit={(value)=>this._handleNewMarkerTime(value)}
          />
          <CheckButton onChange={this._onChange.bind(this)}
          checked={this.state.checked}/>
          <CheckButton onChange={this._onChange.bind(this)}
          checked={this.state.checked}/>
          <CheckButton onChange={this._onChange.bind(this)}
          checked={this.state.checked}/>
        </View>
      </View>
    )
  }

  _onChange(checked){
    newmarkersList = [];
    this.setState({markersList: newmarkersList});
    AsyncStorage.setItem("markersList", JSON.stringify(newmarkersList));
    if (checked){
      this.setState({checked:false})
    }
    else{
      this.setState({checked:true})
    }
  }
  _renderCustomMarkers(markersList){
        let markers = [];
        if(markersList == null){
          markersList = [];
        }

        for(var m = 0; m < markersList.length; m++){
          marker = markersList[m];
          markers.push(
            <MapView.Marker coordinate={marker.coordinate}
                            title={marker.title}
                            description={marker.description}
            />
          );
        }
        return markers;
  }

  _handleMarkerPress(e){
    this.setState({ incMarker: {
                    coordinate: e.nativeEvent.coordinate,
                    title: "blahblah",
                    description: "Haha"
                  }});
    this.setState({promptTitleVisible: true});

    // this.setState({markersList:[
    //   ...this.state.markersList,
    //   {
    //     coordinate: e.nativeEvent.coordinate,
    //     title: "blahblah",
    //     description: "Haha"
    //   }
    // ]})
  }
  _handleNewMarkerTitle(value){
    if (value == "")
    {value = "Generic Event";}
    this.setState({incMarker:{title: value}});
    this.setState({promptTitleVisible:false});
    this.setState({promptDescVisible:true});
  }

  _handleNewMarkerDesc(value){
    if (value == "")
    {value = "Generic Desc";}
    this.setState({incMarker:{description: value}});
    this.setState({promptDescVisible:false});
    this.setState({promptTimeVisible:true});
  }

  _handleNewMarkerTime(value){
    if( value == "")
    {value = " Generic Time";}
    this.setState({incMarker:{time: value}});
    newMarker= this.state.incMarker;
    newMarkersList = [
                      ...this.state.markersList,
                      {
                        coordinate: newMarker.coordinate,
                        title: newMarker.title,
                        description: newMarker.description
                      }
                    ];

    this.setState({markersList: newMarkersList});

    console.log(JSON.stringify(newMarkersList))

    AsyncStorage.setItem("markersList", JSON.stringify(newMarkersList));

    this.setState({promptTimeVisible: false});
    this.setState({incMarker: []});

  }
  // _handleNewMarker(value){
  //   if(value == ""){
  //     value = "Fun Stuff!"
  //   }
  //   newMarkersList = [
  //                     ...this.state.markersList,
  //                     {
  //                       coordinate: this.state.incMarker.coordinate,
  //                       title: value,
  //                       description: "Hahahahaha"
  //                     }
  //                   ]
  //   this.setState({markersList: newMarkersList});
  //   console.log(JSON.stringify(newMarkersList))
  //   AsyncStorage.setItem("markersList", JSON.stringify(newMarkersList));
  //   this.setState({promptTitleVisible: false});
  //   this.setState({incMarker: []});
  //
  // }
  componentDidMount(){
  }

  componentWillMount(){
  }
}
AppRegistry.registerComponent('ATown', () => ATown);
