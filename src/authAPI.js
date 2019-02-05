import { getAppNameForUser, getAuth } from './firebase';
import { setFirebaseAppNameToLocalStorage } from './localStorage';

function isTestUser(email) {
  return /myplanner_testuser/.test(email);
}

function signIn({ email, password }) {
  const appName = getAppNameForUser(isTestUser(email));

  setFirebaseAppNameToLocalStorage(appName);

  return getAuth().signInWithEmailAndPassword(email, password);
}

function onAuthStateChanged(callback) {
  return getAuth().onAuthStateChanged(callback);
}

function signOut() {
  return getAuth()
    .signOut()
    .then(() => {
      setFirebaseAppNameToLocalStorage(null);
    });
}

export { signIn, onAuthStateChanged, signOut };
