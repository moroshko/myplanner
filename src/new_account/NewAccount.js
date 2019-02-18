import React, { useState, useEffect, useCallback, useContext } from 'react';
import { SignedOutHeader } from '../shared/header-components';
import TextInput from '../shared/TextInput';
import Button from '../shared/Button';
import {
  signUp,
  sendVerificationEmailTo,
  onAuthStateChanged,
} from '../authAPI';
import { AppContext } from '../reducer';
import { SIGN_IN_PAGE } from '../constants';
import './NewAccount.css';

const READY_TO_SIGN_UP = 1;
const SIGNING_UP = 2;
const SIGNED_UP_EMAIL_NOT_SENT = 3;
const SENDING_EMAIL = 4;
const EMAIL_SENT = 5;

function NewAccount() {
  const { state } = useContext(AppContext);
  const { user } = state;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(READY_TO_SIGN_UP);
  const [errorMessage, setErrorMessage] = useState(null);
  const onSubmit = useCallback(
    e => {
      e.preventDefault();

      setStatus(SIGNING_UP);
      setErrorMessage(null);

      signUp({
        email: email.trim(),
        password: password.trim(),
      })
        .then(() => {
          setStatus(SIGNED_UP_EMAIL_NOT_SENT);
        })
        .catch(error => {
          setErrorMessage(error.message);
          setStatus(READY_TO_SIGN_UP);
        });
    },
    [email, password]
  );

  useEffect(() => {
    return onAuthStateChanged(newUser => {
      if (
        status === SIGNED_UP_EMAIL_NOT_SENT &&
        newUser !== null &&
        user !== null &&
        user.email === email.trim()
      ) {
        setStatus(SENDING_EMAIL);

        sendVerificationEmailTo(newUser)
          .then(() => {
            setStatus(EMAIL_SENT);
          })
          .catch(error => {
            setStatus(READY_TO_SIGN_UP);
            setErrorMessage(error.message);
          });
      }
    });
  }, [user, email, status]);

  return (
    <>
      <SignedOutHeader withBackButtonTo={SIGN_IN_PAGE} />
      <div className="NewAccountContainer">
        <h1 className="NewAccountHeader">New Account</h1>
        <form onSubmit={onSubmit}>
          <TextInput
            icon="envelope"
            placeholder="email"
            autoCapitalize="none"
            disabled={status !== READY_TO_SIGN_UP}
            autoFocus
            onChange={setEmail}
          />
          <div className="NewAccountPasswordContainer">
            <TextInput
              icon="lock"
              type="password"
              placeholder="password"
              autoCapitalize="none"
              disabled={status !== READY_TO_SIGN_UP}
              onChange={setPassword}
            />
          </div>
          <div className="NewAccountButtonAndErrorMessageContainer">
            <Button
              primary
              fullWidth
              type="submit"
              disabled={
                email.trim() === '' ||
                password.trim() === '' ||
                status !== READY_TO_SIGN_UP
              }
            >
              {status === READY_TO_SIGN_UP
                ? 'Create'
                : status === EMAIL_SENT
                ? 'Success!'
                : 'Please wait...'}
            </Button>
            {errorMessage && (
              <div className="NewAccountErrorMessage">{errorMessage}</div>
            )}
          </div>
        </form>
        {status === EMAIL_SENT && (
          <div className="NewAccountSuccessMessage">
            We sent a verification email to <strong>{email.trim()}</strong>
            <br />
            Please click the link in it to verify your email.
          </div>
        )}
      </div>
    </>
  );
}

export default NewAccount;
