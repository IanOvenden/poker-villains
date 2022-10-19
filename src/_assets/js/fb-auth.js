import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get } from 'firebase/database';
import { decrypt, encrypt } from 'crypto-js/aes';
import { enc } from 'crypto-js';

const firebaseConfig = {
  apiKey: "AIzaSyBZ5WixG8C9muu1yiDflycoYTMosJCkgCs",
  authDomain: "poker-villains.firebaseapp.com",
  databaseURL: "https://poker-villains.firebaseio.com",
  projectId: "poker-villains",
  storageBucket: "poker-villains.appspot.com",
  messagingSenderId: "615154241822",
  appId: "1:615154241822:web:c45077c1994982732ff90f"
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase());

const username = document.getElementById("username");
const pwd = document.getElementById("password");
const submit = document.getElementById("register");

function authenticateUser() {

  get( child( dbRef, "users/" + username.value ) ).then( (snapshot) => {

    if( snapshot.exists() ){
      let dbPwd = decPwd( snapshot.val().password );
      if ( dbPwd === pwd.value ) {
        login( snapshot.val() );
      }
      else {
        alert("user does not exist");
      }
    }
  })
}

function decPwd( dbPwd ) {
  var decPwd = decrypt( dbPwd, pwd.value );
  return decPwd.toString( enc.Utf8 );
}

//login
function login( user ){
  let persistLogin = document.getElementById( 'persistentLogin' ).checked;

  if( !persistLogin ){
    sessionStorage.setItem( 'user', JSON.stringify( user ));
  }
  else {
    localStorage.setItem( 'persistLogin', true );
    localStorage.setItem( 'user', JSON.stringify( user ));
  }
  redirectUser(user.admin);
}

function redirectUser( admin ) {
  let redirectURL = admin ? "/admin/dashboard.html" : "/index.html";
  window.location = redirectURL;
}

document.getElementById("login").addEventListener( 'click', authenticateUser );