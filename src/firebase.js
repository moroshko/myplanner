import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

if (process.env.NODE_ENV === 'production') {
  firebase.initializeApp({
    apiKey: 'AIzaSyDOI8oFqOVimf5s_GgV3YG39pchDWBZvOU',
    authDomain: 'myplanner-prod-54a89.firebaseapp.com',
    databaseURL: 'https://myplanner-prod-54a89.firebaseio.com',
    projectId: 'myplanner-prod-54a89',
    storageBucket: 'myplanner-prod-54a89.appspot.com',
    messagingSenderId: '83446074912',
  });
} else {
  firebase.initializeApp({
    apiKey: 'AIzaSyCPl3KLslx0XMmP8ryroxz35QNmIMrz9B0',
    authDomain: 'myplanner-dev-96028.firebaseapp.com',
    databaseURL: 'https://myplanner-dev-96028.firebaseio.com',
    projectId: 'myplanner-dev-96028',
    storageBucket: 'myplanner-dev-96028.appspot.com',
    messagingSenderId: '166357028703',
  });
}

const auth = firebase.auth();
const db = firebase.firestore();
const deleteField = firebase.firestore.FieldValue.delete;

export { auth, db, deleteField };
