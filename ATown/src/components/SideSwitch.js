'use strict';

import React, { Component } from 'react';
import {
StyleSheet,
View,
Text,
Switch,
TouchableHighlight,
Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../styles/Colors';

let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height

export default class SideButton extends Component{
render() {
   return (
     <View style={{height : windowHeight*0.07, paddingHorizontal: 10, alignItems: 'center'}}>
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          <Icon name={this.props.icon} size={30} color={Colors.SECONDARY} style={{flex:1}} />
          <View style={{padding: 10,  flex:5,  borderBottomWidth: 1, borderColor: Colors.PRIMARY_LIGHT, flexDirection: 'row'}}>
            <Text style = {styles.drawerButton}>{this.props.buttonText}</Text>
            <Switch
              onValueChange={this.props.onSwitch}
              onTintColor={Colors.SECONDARY_DARK}
              thumbTintColor={Colors.SECONDARY}
              tintColor={Colors.PRIMARY_LIGHT}
              value={this.props.selected}
            />
          </View>
        </View>
     </View>
    );
 }
}

const styles = StyleSheet.create({
  drawerButton: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: Colors.SECONDARY,
  }
});

// export default class SideButton extends Component{
// render() {
//    return (
//      <View style={{height : windowHeight*0.07}}>
//       <TouchableHighlight
//         style={{paddingHorizontal:8, flex:1, alignItems: 'center', }}
//         underlayColor = {Colors.PRIMARY_DARK}
//         onPress={this.props.onPress}>
//           <View style={{flexDirection: 'row', flex:1, alignItems: 'center'}}>
//             <Icon name={this.props.icon} size={30} color={Colors.SECONDARY} style={{flex:1}} />
//             <View style={{padding: 10,  flex:5,     borderBottomWidth: 1, borderColor: Colors.SECONDARY_DARK}}>
//               <Text style = {styles.drawerButton}>{this.props.buttonText}</Text>
//             </View>
//           </View>
//         </TouchableHighlight>
//      </View>
//     );
//  }
// }
//
// const styles = StyleSheet.create({
//   drawerButton: {
//     flex: 1,
//     fontSize: 16,
//     textAlign: 'left',
//     textAlignVertical: 'center',
//     color: Colors.SECONDARY,
//   }
// });
