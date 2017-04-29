'use strict';

import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import MapView from 'react-native-maps';
import Style from './Style';

import React, {Component} from 'react';

export default class NewMarkerInputModal extends Component {

  // Constructor!
  constructor(props){
    super(props);
  }

  // Renders a MapView component, with initial region
  render(){
    return(

      <Modal
        animationType = {'slide'}
        onRequestClose = {this.props.cancelledMarkerHandler}
        visible = {this.props.isMarkerInputVisible}
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

      <MapView  style={Style.map} initialRegion={this.props.initialRegion}
                                  onLongPress={this.props.onLongPressHandler}
                                  showsUserLocation	={true}
                                  showsMyLocationButton	= {true}
      >
      {this.props.renderMarkers(this.props.markersList)}
      </MapView>
    );
  }

}

AppRegistry.registerComponent('CustomMapView', () => CustomMapView);

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
