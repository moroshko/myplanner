import React, { useState, useEffect, useCallback } from 'react';
import { SignedOutHeader } from '../shared/header-components';
import Button from '../shared/Button';
import { verifyEmail } from '../authAPI';
import './EmailVerification.css';

const VERIFYING_EMAIL = 1;
const EMAIL_VERIFIED = 2;
const EMAIL_VERIFICATION_FAILED = 3;

function EmailVerification() {
  const [status, setStatus] = useState(VERIFYING_EMAIL);
  const [errorMessage, setErrorMessage] = useState(null);
  const removeAllQueryParams = useCallback(() => {
    window.location.href = window.location.origin;
  }, []);

  useEffect(() => {
    verifyEmail()
      .then(() => {
        setStatus(EMAIL_VERIFIED);
      })
      .catch(error => {
        setStatus(EMAIL_VERIFICATION_FAILED);
        setErrorMessage(error.message);
      });
  }, []);

  return (
    <>
      <SignedOutHeader />
      <div className="EmailVerificationContainer">
        <h1 className="EmailVerificationHeader">
          {status === EMAIL_VERIFIED && 'Email Verified Successfully!'}
          {status === EMAIL_VERIFICATION_FAILED && 'Error'}
        </h1>
        {status === EMAIL_VERIFIED && (
          <div className="EmailVerificationButton">
            <Button primary fullWidth onClick={removeAllQueryParams}>
              Continue
            </Button>
          </div>
        )}
        {errorMessage && (
          <div className="EmailVerificationErrorMessage">
            {errorMessage}
            <div className="EmailVerificationButton">
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

export default EmailVerification;
