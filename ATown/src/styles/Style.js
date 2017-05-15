import { StyleSheet } from 'react-native';

import Colors from './Colors';

var Style = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: Colors.PRIMARY
        // flexDirection: 'row'
    },

    prefsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: Colors.PRIMARY_DARK,
    },

    usersContainer: {
      flex: 1,
      backgroundColor: Colors.PRIMARY_DARK,
    },


    mapContainer: {
      flex:20,
      // position: 'absolute',
      // top: 0,
      // left: 0,
      // right: 0,
      // bottom: 0,
      // justifyContent: 'flex-end',
      // alignItems: 'center',
    },
    map: {
      // flex:1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    checkBoxContainer: {
      flex:2,
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: '#91AA9D'

    },
    genericText: {
      fontSize: 18,
      color: Colors.WHITE,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },

    displayContainer: {
        flex: 8,
        backgroundColor: '#193441'
    },

    inputContainer: {
        flex: 15,
        backgroundColor: '#3E606F'
    },

    inputButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: '#000000',
      borderWidth: 0.5,
      borderColor: '#91AA9D'
    },

    inputButtonText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white'
    },

    inputRow: {
      flex:1,
      flexDirection: 'row'
    },

    sideDrawer: {
      flex: 1,
      backgroundColor: Colors.PRIMARY,
    },

    drawerHeader: {
      backgroundColor: Colors.PRIMARY_DARK,
      flex: 0.2,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 15,
      paddingBottom: 10,
      paddingTop: 10,
      elevation:8,
    },

    drawerHeaderText: {
      fontSize: 26,
      color: Colors.WHITE,
      textAlign: 'left',
      textAlignVertical: 'center',
      padding: 15
    },

    sideButtonContainer: {
      flex: 0.8,
      backgroundColor: Colors.PRIMARY,
    }
});

export default Style;
