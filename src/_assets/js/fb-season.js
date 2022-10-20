import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get } from 'firebase/database';
import { firebaseConfig } from './fb-config';

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
