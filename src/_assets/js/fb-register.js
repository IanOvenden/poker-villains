import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get } from 'firebase/database';
import AES from 'crypto-js/aes';
import { firebaseConfig } from './fb-config';

const app = initializeApp(firebaseConfig);

const db = getDatabase();

const name = document.getElementById("name");
const email = document.getElementById("email");
const username = document.getElementById("username");
const pwd = document.getElementById("password");
const submit = document.getElementById("register");

// register user
function registerUser() {

  // TODO: Sanitize input values


  get( child( ref( db ), "users/" + username.value ) ).then( (snapshot) => {

    if( snapshot.exists() ){
      alert( "Account exists" );
    }

    else {
      set( ref( db, "users/" + username.value ),
      {
        fullname: name.value,
        email: email.value,
        username: username.value,
        password: hashPwd(),
      })
      .then ( ()=> {
        alert( "User added successfully" );
      })
      .catch( (error)=> {
        alert( "error: " + error );
      })
    }
  })
}

submit.addEventListener( 'click', registerUser );

function hashPwd(){
  var pwdHash = AES.encrypt( pwd.value, pwd.value );
  return pwdHash.toString();
}