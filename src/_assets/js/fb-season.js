import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get } from 'firebase/database';


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

get(child(dbRef, `ruleset`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
