let userlink = document.getElementById( 'userlink' );
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
  window.location = "/login.html";
}

function checkAdmin( adminRights ){
  if( !adminRights ){
    window.location( "/index.html" );
  }
}

window.onload = function(){
  getUsername();

  if( currentUser == null ) {
    //throw the user out to login
    window.location="/login.html";
  } else {
    checkAdmin(currentUser.admin);
    userlink.innerText = currentUser.username;
  }
}

//Nav Toggle
function navToggle() {
  let menuItems = document.getElementById("menuItems");
  menuItems.classList.toggle("hidden");
  menuItems.classList.toggle("block");
}

let mobileNav = document.getElementById("mobileNav");
mobileNav.addEventListener( 'click', navToggle );

let signOut = document.getElementById("signOutBtn");
signOut.addEventListener( 'click', logOut );