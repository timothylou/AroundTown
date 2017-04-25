import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  DrawerLayoutAndroid,
  ScrollView,
  ToolbarAndroid
} from 'react-native';

import TopBar from './TopBar';

export default class SideDrawer extends Component{
 render() {
   var navigationView = (
     <View style={{flex: 1, backgroundColor: '#fff'}}>
       <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I am in the Drawer!</Text>
     </View>
   );

return (
  <DrawerLayoutAndroid
    drawerWidth={300}
    drawerPosition={DrawerLayoutAndroid.positions.Left}
    renderNavigationView={() => navigationView}
    ref={'DRAWER'}>
    <TopBar
        title={'Town View'}
        navigator={this.props.navigator}
        sidebarRef={()=>this._setDrawer()}/>
  </DrawerLayoutAndroid>
);
}

 _setDrawer() {
   this.refs['DRAWER'].openDrawer();
  }
 }

 const styles = StyleSheet.create({
   //your own style implementation
 });
