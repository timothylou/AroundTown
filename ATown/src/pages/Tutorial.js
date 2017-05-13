'use strict';

// Component imports
import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ToolbarAndroid,
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
  Alert,
  StyleSheet
} from 'react-native';
import React, {Component} from 'react';

// Custom Component imports
import TopBar from '../components/TopBar';
import SideButton from '../components/SideButton';
import CategoryButtonsNoSlide from '../components/CategoryButtonsNoSlide';

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

import AppIntro from 'react-native-app-intro';

// Categories
import buttonCategories from '../utils/ButtonCategories'

let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height

const limegreen = '#a4b602';
//
// var buttonCategories1 = [
//   { label: 'Free Food',
//   id: 'freefood',
//   index: 0,
//   selected: false,
//   icon: 'food',
//   },
//
//   {label: 'Broken Printer',
//   id: 'brokenfacility',
//   index: 1,
//   selected: false,
//   icon: 'printer-alert',
//   },
//
//   {label: 'Recruiting',
//   id: 'recruiting',
//   index: 2,
//   selected: false,
//   icon: 'account-multiple',
//   },
//
//   {label: 'Study Break',
//   id: 'studybreak',
//   index: 3,
//   selected: false,
//   icon: 'pencil-off',
//   },
//
//   {label: 'Performance',
//   id: 'movie',
//   index: 4,
//   selected: false,
//   icon: 'filmstrip',
//   },
//
//   {label: 'Crowded ',
//   id: 'busy',
//   index: 5,
//   selected: false,
//   icon: 'do-not-disturb',
//   },
//
//   {label: 'Fire Safety',
//   id: 'firesafety',
//   index: 6,
//   selected: false,
//   icon: 'fire',
//   },
// ];

export default class Tutorial extends Component{

  render() {
    const pageArray = [{
      title: 'Page 1',
      description: 'Description 1',
      img: require('../icons/tutorial-map.png'),
      imgStyle: {
        resizeMode: 'contain',
        height: windowHeight*0.4,
        width: windowWidth*0.7,
      },
      backgroundColor: Colors.PRIMARY_DARK,
      fontColor: '#fff',
      level: 10,
    }, {
      title: 'Page 2',
      description: 'Description 2',
      img: require('../icons/hootclear.png'),
      imgStyle: {
        height: 93 * 2.5,
        width: 103 * 2.5,
      },
      backgroundColor: Colors.PRIMARY_DARK,
      fontColor: '#fff',
      level: 10,
    }];


    return (
      <AppIntro
        showSkipButton = {false}
        nextBtnLabel = {' '}
      >
        <View style={[styles.slide,{ backgroundColor: Colors.PRIMARY_DARK }]}>
          <View level={0}>
            <View style = {styles.slide}>
            <Image
              style = {{
                resizeMode: 'contain',
                height: windowHeight*0.3,
                width: windowWidth*0.3,
              }}
              source = {require('../icons/hootclear.png')} />
              <Text style={styles.textTitle}>Welcome to Owl!</Text>
              <Text style={styles.textSubTitle}>Here are some tips and tricks to help you get started.</Text>
              <Text style={styles.textSubTitleBold}>{'Let\'s get hooting! ›'}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.slide, { backgroundColor: Colors.PRIMARY_DARK}]}>
          <View level={5} style = {styles.pageContent}>
            <View style = {styles.pageContenttouch}>
            <Text style = {styles.textSubTitleBold}>Tap and hold to drop a new pin</Text>
            <Image
              source = {require('../icons/tutorial-map.png')}
              style = {{
                resizeMode: 'contain',
                height: windowHeight*0.4,
                width: windowWidth*0.6
              }}
            />
            </View>
          </View>
        </View>



        <View style={[styles.slide,{ backgroundColor: Colors.PRIMARY_DARK }]}>
          <View level={8}>
            <Text style={styles.textTitle}>Page 3</Text>
          </View>
          <View level={0}>
            <Text style={styles.textSubTitle}>Page 3</Text>
          </View>
          <View level={-10}>
            <Text style={styles.textSubTitle}>Page 3</Text>
          </View>
        </View>

        <View style={[styles.slide, { backgroundColor: Colors.PRIMARY_DARK }]}>
          <View level={5}>
            <Text style={styles.textTitle}>Page 4</Text>
          </View>
          <View level={10}>
            <Text style={styles.textSubTitle}>Page 4</Text>
          </View>
          <View level={15}>
            <Text style={styles.textSubTitle}>Page 4</Text>
          </View>
        </View>

      </AppIntro>
    );
  }

  _renderCategoryButtons(buttonsList){

    let buttons = [];
    if (buttonsList == null){
      buttonsList = [];
    }
    var currLabel = null;
    var currId = null;
    var currIcon = null;
    for (var b = 0; b < buttonsList.length; b++){

      currLabel = buttonsList[b].label;
      currId = buttonsList[b].id;
      currIcon = buttonsList[b].icon;

      buttons.push(
        <CategoryButtonsNoSlide
          label = {currLabel}
          icon = {currIcon}
          key = {currId}/>
      );
    }

    return buttons;

  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: windowWidth*0.05,

  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: windowWidth*0.05,
    paddingBottom: windowHeight*0.15,

  },
  textTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
  },

  textSubTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '200',
    textAlign: 'center',
  },

  textSubTitleBold: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },

  pageHeader: {
    flex:1,
    alignItems: 'flex-start',
    paddingHorizontal:windowWidth*0.05,
    paddingVertical: windowHeight*0.01,
  },

  pageContent: {
    flex: 1,
  },
  pageContenttouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageContentmarker: {
    flex: 2,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingBottom: windowHeight*0.1,
  },

  catContent: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',

  },
});

AppRegistry.registerComponent('Tutorial', () => Tutorial);

// <View level={5} style = {styles.pageContent}>
//   <View style = {styles.pageContentmarker}>
//   <Text style = {styles.textSubTitle}>Choose a category for the event</Text>
//     <View style = {{flex: 1}}>
//         {this._renderCategoryButtons(buttonCategories1)}
//     </View>
//   </View>
// </View>
// </View>
