import React, { useState, useCallback } from 'react';
import { SignedOutHeader } from '../shared/header-components';
import TextInput from '../shared/TextInput';
import Button from '../shared/Button';
import { sendPasswordResetEmail } from '../authAPI';
import { SIGN_IN_PAGE } from '../constants';
import './PasswordReset.css';

const READY_TO_SEND_EMAIL = 1;
const SENDING_EMAIL = 2;
const EMAIL_SENT = 3;

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(READY_TO_SEND_EMAIL);
  const [errorMessage, setErrorMessage] = useState(null);
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      setStatus(SENDING_EMAIL);
      setErrorMessage(null);

      sendPasswordResetEmail(email.trim())
        .then(() => {
          setStatus(EMAIL_SENT);
        })
        .catch(error => {
          setErrorMessage(error.message);
          setStatus(READY_TO_SEND_EMAIL);
        });
    },
    [email]
  );

  return (
    <>
      <SignedOutHeader withBackButtonTo={SIGN_IN_PAGE} />
      <div className="PasswordResetContainer">
        <h1 className="PasswordResetHeader">Password Reset</h1>
        <form onSubmit={onSubmit}>
          <TextInput
            icon="envelope"
            placeholder="email"
            autoCapitalize="none"
            autoFocus
            disabled={status !== READY_TO_SEND_EMAIL}
            onChange={setEmail}
          />
          <div className="PasswordResetButtonAndErrorMessageContainer">
            <Button
              primary
              fullWidth
              type="submit"
              disabled={email.trim() === '' || status !== READY_TO_SEND_EMAIL}
            >
              {status === READY_TO_SEND_EMAIL
                ? 'Send Password Reset Email'
                : status === SENDING_EMAIL
                ? 'Please wait...'
                : 'Success!'}
            </Button>
            {errorMessage && (
              <div className="PasswordResetErrorMessage">{errorMessage}</div>
            )}
          </div>
        </form>
        {status === EMAIL_SENT && (
          <div className="PasswordResetSuccessMessage">
            We sent a you an email to <strong>{email.trim()}</strong>
            <br />
            Please click the link in it to reset your password.
          </div>
        )}
      </div>
    </>
  );
}

export default PasswordReset;
