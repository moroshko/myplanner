import { auth } from './firebase';

function signIn({ email, password }) {
  return auth.signInWithEmailAndPassword(email, password);
}

function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

function signOut() {
  return auth.signOut();
}

export { signIn, onAuthStateChanged, signOut };
