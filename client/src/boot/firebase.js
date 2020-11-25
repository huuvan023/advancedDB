import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBjaz51W1ydlk3WQeUunD8v-Q3QRimH6xk",
  authDomain: "advancedb-edd84.firebaseapp.com",
  databaseURL: "https://advancedb-edd84.firebaseio.com",
  projectId: "advancedb-edd84",
  storageBucket: "advancedb-edd84.appspot.com",
  messagingSenderId: "67245275776",
  appId: "1:67245275776:web:20e70518c100894314c465",
  measurementId: "G-J6K640N07Q"
};

firebase.initializeApp(firebaseConfig)


export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()
