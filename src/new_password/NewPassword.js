import React, { useState, useEffect, useCallback } from 'react';
import { SignedOutHeader } from '../shared/header-components';
import TextInput from '../shared/TextInput';
import Button from '../shared/Button';
import {
  signIn,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from '../authAPI';
import './NewPassword.css';

const VERIFYING_ACTION_CODE = 1;
const ACTION_CODE_VERIFIED = 2;
const ACTION_CODE_VERIFICATION_FAILED = 3;
const CONFIRMING_NEW_PASSWORD = 4;
const NEW_PASSWORD_CONFIRMED = 5;
const NEW_PASSWORD_CONFIRMATION_FAILED = 6;
const SIGNING_IN = 7;
const SIGN_IN_FAILED = 8;

function NewPassword() {
  const [status, setStatus] = useState(VERIFYING_ACTION_CODE);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const removeAllQueryParams = useCallback(() => {
    window.location.href = window.location.origin;
  }, []);
  const onSubmit = useCallback(
    e => {
      e.preventDefault();

      setStatus(CONFIRMING_NEW_PASSWORD);
      setErrorMessage(null);

      confirmPasswordReset(password.trim())
        .then(() => {
          setStatus(NEW_PASSWORD_CONFIRMED);
        })
        .catch(error => {
          setStatus(NEW_PASSWORD_CONFIRMATION_FAILED);
          setErrorMessage(error.message);
        });
    },
    [password]
  );
  const onSignIn = useCallback(() => {
    setStatus(SIGNING_IN);

    signIn({ email, password: password.trim() })
      .then(removeAllQueryParams)
      .catch(error => {
        setStatus(SIGN_IN_FAILED);
        setErrorMessage(error.message);
      });
  }, [email, password]);

  useEffect(() => {
    verifyPasswordResetCode()
      .then(email => {
        setStatus(ACTION_CODE_VERIFIED);
        setEmail(email);
      })
      .catch(error => {
        setStatus(ACTION_CODE_VERIFICATION_FAILED);
        setErrorMessage(error.message);
      });
  }, []);

  return (
    <>
      <SignedOutHeader />
      <div className="NewPasswordContainer">
        <h1 className="NewPasswordHeader">
          {status === ACTION_CODE_VERIFICATION_FAILED ||
          status === SIGN_IN_FAILED
            ? 'Error'
            : status === ACTION_CODE_VERIFIED ||
              status === CONFIRMING_NEW_PASSWORD ||
              status === NEW_PASSWORD_CONFIRMATION_FAILED
            ? 'Choose New Password'
            : status === NEW_PASSWORD_CONFIRMED || status === SIGNING_IN
            ? 'Password Changed Successfully!'
            : null}
        </h1>
        {(status === ACTION_CODE_VERIFIED ||
          status === CONFIRMING_NEW_PASSWORD ||
          status === NEW_PASSWORD_CONFIRMATION_FAILED) && (
          <form onSubmit={onSubmit}>
            <TextInput
              icon="lock"
              type="password"
              placeholder="password"
              autoCapitalize="none"
              autoFocus
              disabled={status === CONFIRMING_NEW_PASSWORD}
              onChange={setPassword}
            />
            <div className="NewPasswordSubmitButtonAndErrorMessageContainer">
              <Button
                primary
                fullWidth
                type="submit"
                disabled={
                  password.trim() === '' || status === CONFIRMING_NEW_PASSWORD
                }
              >
                {status === ACTION_CODE_VERIFIED ||
                status === NEW_PASSWORD_CONFIRMATION_FAILED
                  ? 'Continue'
                  : 'Please wait...'}
              </Button>
              {status === NEW_PASSWORD_CONFIRMATION_FAILED && (
                <div className="NewPasswordErrorMessage">{errorMessage}</div>
              )}
            </div>
          </form>
        )}
        {(status === NEW_PASSWORD_CONFIRMED || status === SIGNING_IN) && (
          <div className="NewPasswordButton">
            <Button
              primary
              fullWidth
              disabled={status === SIGNING_IN}
              onClick={onSignIn}
            >
              {status === NEW_PASSWORD_CONFIRMED
                ? 'Continue'
                : 'Please wait...'}
            </Button>
          </div>
        )}
        {(status === ACTION_CODE_VERIFICATION_FAILED ||
          status === SIGN_IN_FAILED) && (
          <div className="NewPasswordErrorMessage">
            {errorMessage}
            <div className="NewPasswordButton">
              <Button primary onClick={removeAllQueryParams}>
                Back to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NewPassword;
