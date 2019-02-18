import queryString from 'query-string';
import { auth } from './firebase';

function getActionCodeFromURL() {
  return queryString.parse(window.location.search).oobCode;
}

function signIn({ email, password }) {
  return auth.signInWithEmailAndPassword(email, password);
}

function signUp({ email, password }) {
  return auth.createUserWithEmailAndPassword(email, password);
}

function sendVerificationEmailTo(user) {
  return user.sendEmailVerification();
}

function verifyEmail() {
  return auth.applyActionCode(getActionCodeFromURL()).then(() => {
    /* 
      Having:
        return auth.currentUser.reload();
      is not enough. 
      The client would update its auth.currentUser.emailVerified to true,
      but the backend needs a refreshed token to know that the email was verified.
    */
    return auth.currentUser.getIdTokenResult(true);
  });
}

function sendPasswordResetEmail(email) {
  return auth.sendPasswordResetEmail(email);
}

function verifyPasswordResetCode() {
  return auth.verifyPasswordResetCode(getActionCodeFromURL());
}

function confirmPasswordReset(newPassword) {
  return auth.confirmPasswordReset(getActionCodeFromURL(), newPassword);
}

function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

function signOut() {
  return auth.signOut();
}

export {
  signIn,
  signUp,
  sendVerificationEmailTo,
  verifyEmail,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  onAuthStateChanged,
  signOut,
};
