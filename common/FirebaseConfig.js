import * as firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyCGec2ZqvMz9-6KWPiSw_Ej2sfbCMP10hs",
    authDomain: "gps-gsm-luan-van-tot-nghiep.firebaseapp.com",
    databaseURL: "https://gps-gsm-luan-van-tot-nghiep.firebaseio.com",
    projectId: "gps-gsm-luan-van-tot-nghiep",
    storageBucket: "gps-gsm-luan-van-tot-nghiep.appspot.com",
    messagingSenderId: "739160251700",
    appId: "1:739160251700:web:20ed75e37a821321"
  };
  // Initialize Firebase
export const firebaseApp=   firebase.initializeApp(firebaseConfig);