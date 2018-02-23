import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBZ5WixG8C9muu1yiDflycoYTMosJCkgCs",
    authDomain: "poker-villains.firebaseapp.com",
    databaseURL: "https://poker-villains.firebaseio.com",
    projectId: "poker-villains",
    storageBucket: "poker-villains.appspot.com",
    messagingSenderId: "615154241822"
};

firebase.initializeApp(config);

export default firebase;
