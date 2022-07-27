import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyCvAhDUZyfdySCF7Zva2cmWQ3UbwrpmXn4",
  authDomain: "spin-the-wicket.firebaseapp.com",
  databaseURL: "https://spin-the-wicket.firebaseio.com",
  projectId: "spin-the-wicket",
  storageBucket: "spin-the-wicket.appspot.com",
  messagingSenderId: "266369111079",
  appId: "1:266369111079:web:a97c5d94689c8018e0ea02",
  measurementId: "G-D35GYBXCGJ",
};
firebase.initializeApp(firebaseConfig);

// window.firebase = firebase;

export const firestore = firebase.firestore();
// export const auth = firebase.auth();
export const storage = firebase.storage();

export default firebase;
