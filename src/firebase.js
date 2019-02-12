import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { getFirebaseAppNameFromLocalStorage } from './localStorage';
import { DEV_APP, TEST_APP, PROD_APP } from './constants';

/*
  Test users:

    User 1:
      email: michael.moroshko+myplanner_testuser1@gmail.com
      password: justTesting4now

    User 2:
      email: michael.moroshko+myplanner_testuser2@gmail.com
      password: letMeInPLEASE
*/

const configs = {
  [DEV_APP]: {
    apiKey: 'AIzaSyCPl3KLslx0XMmP8ryroxz35QNmIMrz9B0',
    authDomain: 'myplanner-dev-96028.firebaseapp.com',
    databaseURL: 'https://myplanner-dev-96028.firebaseio.com',
    projectId: 'myplanner-dev-96028',
    storageBucket: 'myplanner-dev-96028.appspot.com',
    messagingSenderId: '166357028703',
  },
  [TEST_APP]: {
    apiKey: 'AIzaSyCsSmlRNs7dUyTxbtooGIPIitHf0HOtfPI',
    authDomain: 'myplanner-test.firebaseapp.com',
    databaseURL: 'https://myplanner-test.firebaseio.com',
    projectId: 'myplanner-test',
    storageBucket: 'myplanner-test.appspot.com',
    messagingSenderId: '172224920498',
  },
  [PROD_APP]: {
    apiKey: 'AIzaSyDOI8oFqOVimf5s_GgV3YG39pchDWBZvOU',
    authDomain: 'myplanner-prod-54a89.firebaseapp.com',
    databaseURL: 'https://myplanner-prod-54a89.firebaseio.com',
    projectId: 'myplanner-prod-54a89',
    storageBucket: 'myplanner-prod-54a89.appspot.com',
    messagingSenderId: '83446074912',
  },
};

function getAppNameForUser(isTestUser) {
  if (isTestUser) {
    return TEST_APP;
  }

  if (process.env.NODE_ENV === 'production') {
    return PROD_APP;
  }

  return DEV_APP;
}

function getApp() {
  const appName = getFirebaseAppNameFromLocalStorage(null);

  if (appName === null) {
    throw new Error('Firebase app name is missing in local storage.');
  }

  try {
    return firebase.app(appName);
  } catch (_) {
    const config = configs[appName];

    if (!config) {
      throw new Error(`Unknown app name: ${appName}`);
    }

    firebase.initializeApp(config, appName);

    return firebase.app(appName);
  }
}

function getAuth() {
  return getApp().auth();
}

function getDb() {
  return getApp().firestore();
}

function getDeleteField() {
  return getApp().firestore.FieldValue.delete;
}

export { getAppNameForUser, getAuth, getDb, getDeleteField };
