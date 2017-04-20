'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator
} from 'react-native';
import BaseStyle from './BaseStyles.js';
import Style from './Style'
import Login from './Login';
import Town from './Town';
import CheckButton from './CheckButton'
import React, {Component} from 'react';

// OneSignal import
import OneSignal from 'react-native-onesignal';

// Main App container
export default class Preferences extends Component{

  constructor(props) {
    super(props);
    this.state = {
      // used to display a progress indicator if waiting for a network response.
      loading: false,

      // home locations
      locations: {
        rocky: false,
        mathey: false,
        whitman: false,
        wilson: false,
        butler: false,
        forbes: false,
      },

      // categories
      categories: {
        freeFood: true,
        brokenFacility: true,
        recruiting: true,
        studyBreak: true,
        movie: true,
        busy: true,
        fireSafety: true,
        other: true
      }
    }
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleHomeLocationChange = this.handleHomeLocationChange.bind(this)
    this.convertBoolToText = this.convertBoolToText.bind(this)
    this.onIds = this.onIds.bind(this)
  }

  // A method to passs the username and password to firebase and make a new user account
  async setPreferences() {
    this.setState({
      // When waiting for the firebase server show the loading indicator.
      loading: true
    });

    const userData = await this.props.firebaseApp.auth().currentUser;

    let userMobilePath = "/users/" + userData.uid + "/details/prefs";

    await this.props.firebaseApp.database().ref(userMobilePath).set({
      rocky: this.convertBoolToText(this.state.locations.rocky),
      mathey: this.convertBoolToText(this.state.locations.mathey),
      whitman: this.convertBoolToText(this.state.locations.whitman),
      wilson: this.convertBoolToText(this.state.locations.wilson),
      butler: this.convertBoolToText(this.state.locations.butler),
      forbes: this.convertBoolToText(this.state.locations.forbes),
      freeFood: this.convertBoolToText(this.state.categories.freeFood),
      brokenFacility: this.convertBoolToText(this.state.categories.brokenFacility),
      recruiting: this.convertBoolToText(this.state.categories.recruiting),
      studyBreak: this.convertBoolToText(this.state.categories.studyBreak),
      movie: this.convertBoolToText(this.state.categories.movie),
      busy: this.convertBoolToText(this.state.categories.busy),
      fireSafety: this.convertBoolToText(this.state.categories.fireSafety),
      other: this.convertBoolToText(this.state.categories.other),

    }).catch( (error)=> console.log("Done with fetching from Firebase        " + error.message));

    console.log("done with firebase");

    await fetch('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/prefs/', {
      method: 'POST',
      headers: {
                },
        body: JSON.stringify({
          deviceid: 'b75c8fc8-af9c-411c-b79d-f9059f158f31',
          tags: {
            rocky: this.convertBoolToText(this.state.locations.rocky),
            mathey: this.convertBoolToText(this.state.locations.mathey),
            whitman: this.convertBoolToText(this.state.locations.whitman),
            wilson: this.convertBoolToText(this.state.locations.wilson),
            butler: this.convertBoolToText(this.state.locations.butler),
            forbes: this.convertBoolToText(this.state.locations.forbes),
            freefood: this.convertBoolToText(this.state.categories.freeFood),
            brokenfacility: this.convertBoolToText(this.state.categories.brokenFacility),
            recruiting: this.convertBoolToText(this.state.categories.recruiting),
            studybreak: this.convertBoolToText(this.state.categories.studyBreak),
            movie: this.convertBoolToText(this.state.categories.movie),
            busy: this.convertBoolToText(this.state.categories.busy),
            firesafety: this.convertBoolToText(this.state.categories.fireSafety),
            other: this.convertBoolToText(this.state.categories.other),
          }
        })
    }).then().catch( (error)=> console.log("Done with fetching from tim       " + error.message));
    console.log("Done with fetching from tim");

    alert('Your preferences have been set!');

    // reset states and navigate to Town screen
    this.setState({
      loading: false
    });
    this.props.navigator.push({
      component: Town
    });

    this.setState({
      // Clear out the fields when the user logs in and hide the progress indicator.
      loading: false,

      locations: {
        rocky: false,
        mathey: false,
        whitman: false,
        wilson: false,
        butler: false,
        forbes: false,
      },

      categories: {
        freeFood: true,
        brokenFacility: true,
        recruiting: true,
        studyBreak: true,
        movie: true,
        busy: true,
        fireSafety: true,
        other: true
      }

    });
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <View>
        <Text>{this.state.deviceid.userid}</Text>
        <Text style = {Style.genericText}>Select one or more home bases</Text>

        <CheckButton onChange={() => this.handleHomeLocationChange('rocky')}
        checked={this.state.locations.rocky}
        label={"Rockefeller College"}/>

        <CheckButton onChange={() => this.handleHomeLocationChange('mathey')}
        checked={this.state.locations.mathey}
        label={"Mathey College"}/>

        <CheckButton onChange={() => this.handleHomeLocationChange('whitman')}
        checked={this.state.locations.whitman}
        label={"Whitman College"}/>

        <CheckButton onChange={() => this.handleHomeLocationChange('wilson')}
        checked={this.state.locations.wilson}
        label={"Wilson College"}/>

        <CheckButton onChange={() => this.handleHomeLocationChange('butler')}
        checked={this.state.locations.butler}
        label={"Butler College"}/>

        <CheckButton onChange={() => this.handleHomeLocationChange('forbes')}
        checked={this.state.locations.forbes}
        label={"Forbes College"}/>

        <Text style = {Style.genericText}>Which type of event would you like to receive notifications for?</Text>

        <CheckButton onChange={() => this.handleCategoryChange('freeFood')}
        checked={this.state.categories.freeFood}
        label={"Free Food"}/>

        <CheckButton onChange={() => this.handleCategoryChange('brokenFacility')}
        checked={this.state.categories.brokenFacility}
        label={"Broken Facility"}/>

        <CheckButton onChange={() => this.handleCategoryChange('recruiting')}
        checked={this.state.categories.recruiting}
        label={"Recruiting/career event"}/>

        <CheckButton onChange={() => this.handleCategoryChange('studyBreak')}
        checked={this.state.categories.studyBreak}
        label={"Study Break"}/>

        <CheckButton onChange={() => this.handleCategoryChange('movie')}
        checked={this.state.categories.movie}
        label={"Movie screening"}/>

        <CheckButton onChange={() => this.handleCategoryChange('busy')}
        checked={this.state.categories.busy}
        label={"Busy/crowded"}/>

        <CheckButton onChange={() => this.handleCategoryChange('fireSafety')}
        checked={this.state.categories.fireSafety}
        label={"Fire safety in area"}/>

        <CheckButton onChange={() => this.handleCategoryChange('other')}
        checked={this.state.categories.other}
        label={"Other"}/>

        <TouchableHighlight onPress={this.setPreferences.bind(this)} style={BaseStyle.primaryButton}>
          <Text style={BaseStyle.primaryButtonText}>Set Preferences</Text>
        </TouchableHighlight>
      </View>;


    // A simple UI with a toolbar, and content below it.
        return (
                <View style={BaseStyle.container}>
                        <ToolbarAndroid
          style={BaseStyle.toolbar}
          title="Set Preferences" />
        <View style={BaseStyle.body}>
          {content}
        </View>
      </View>
    );
  }

  // on category checked box
  handleCategoryChange(propertyName){
    const categories = this.state.categories;
    categories[propertyName] = !categories[propertyName];
    this.setState({categories: categories});

  }

  // on location checked box
  handleHomeLocationChange(propertyName) {
    const locations = this.state.locations;
    locations[propertyName] = !locations[propertyName];
    this.setState({locations : locations});
  }

  // change true to yes and false to no
  convertBoolToText(bool) {
    const text = bool ? 'yes' : 'no';
    return text;
  }

}

AppRegistry.registerComponent('Preferences', () => Preferences);
