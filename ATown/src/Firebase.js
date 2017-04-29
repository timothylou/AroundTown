// Firebase Utils
import * as firebase from 'firebase';


// Config for firebaseApp
var firebaseConfig = {
  apiKey: "AIzaSyDeX_9Y3OPvz8xD9kTReYDEpFWNiWbz9gw",
  authDomain: "aroundtown-deead.firebaseapp.com",
  databaseURL: "https://aroundtown-deead.firebaseio.com",
  projectId: "aroundtown-deead",
  storageBucket: "aroundtown-deead.appspot.com",
  messagingSenderId: "532018067815"
};
const Firebase = firebase.initializeApp(firebaseConfig);


module.exports = Firebase;
