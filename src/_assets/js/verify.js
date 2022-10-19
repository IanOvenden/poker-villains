let userlink = document.getElementById( 'userlink' );
let signoutlink = document.getElementById( 'signoutlink' );
var currentUser = null;

function getUsername(){
  let persistLogin = localStorage.getItem( 'persistLogin' );

  if ( persistLogin ) {
    currentUser = JSON.parse( localStorage.getItem( 'user' ));
  } else {
    currentUser = JSON.parse( sessionStorage.getItem( 'user' ));
  }
}

function logOut() {
  sessionStorage.removeItem( 'user' );
  localStorage.removeItem( 'user' );
  localStorage.removeItem( 'persistLogin' );
  window.location = "login.html";
}

window.onload = function(){
  getUsername();

  if( currentUser == null ) {
    //throw the user out to login
    window.location="login.html";
  } else {
    userlink.innerText = currentUser.username;
    signoutlink.addEventListener( 'click', logOut );
  }
}