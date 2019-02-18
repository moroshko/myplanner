import React, { useState, useCallback, useContext } from 'react';
import { SignedOutHeader } from '../shared/header-components';
import TextInput from '../shared/TextInput';
import Button from '../shared/Button';
import { signIn } from '../authAPI';
import { AppContext } from '../reducer';
import { NEW_ACCOUNT_PAGE, PASSWORD_RESET_PAGE } from '../constants';
import './SignIn.css';

function SignIn() {
  const { dispatchChange } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      setIsSigningIn(true);
      setErrorMessage(null);

      signIn({
        email: email.trim(),
        password: password.trim(),
      })
        .then(({ user }) => {
          dispatchChange({
            type: 'UPDATE_USER',
            user,
          });

          // SignIn will be unmounted at this point.
          // That's why we don't update the state.
        })
        .catch(error => {
          setErrorMessage(error.message);
          setIsSigningIn(false);
        });
    },
    [email, password]
  );
  const onHideErrorMessageClick = useCallback(() => {
    setErrorMessage(null);
  }, []);
  const onCreateNewAccount = useCallback(() => {
    dispatchChange({
      type: 'UPDATE_ACTIVE_PAGE',
      activePage: NEW_ACCOUNT_PAGE,
    });
  }, []);
  const onResetPassword = useCallback(() => {
    dispatchChange({
      type: 'UPDATE_ACTIVE_PAGE',
      activePage: PASSWORD_RESET_PAGE,
    });
  }, []);

  return (
    <>
      <SignedOutHeader />
      <div className="SignInContainer">
        <h1 className="SignInHeader">Sign In</h1>
        <form onSubmit={onSubmit}>
          <TextInput
            icon="envelope"
            placeholder="email"
            autoCapitalize="none"
            onChange={setEmail}
          />
          <div className="SignInPasswordContainer">
            <TextInput
              icon="lock"
              type="password"
              placeholder="password"
              autoCapitalize="none"
              onChange={setPassword}
            />
          </div>
          <div className="SignInButtonAndErrorMessageContainer">
            <Button
              primary
              fullWidth
              type="submit"
              disabled={
                email.trim() === '' || password.trim() === '' || isSigningIn
              }
            >
              {isSigningIn ? 'Please wait...' : 'Sign In'}
            </Button>
            {errorMessage && (
              <div className="SignInErrorMessage">
                {errorMessage}
                <Button tertiary onClick={onHideErrorMessageClick}>
                  Hide
                </Button>
              </div>
            )}
          </div>
        </form>
        <div className="SignInExtraButtons">
          <Button tertiary onClick={onCreateNewAccount}>
            Create New Account
          </Button>
          <Button tertiary onClick={onResetPassword}>
            Reset Password
          </Button>
        </div>
      </div>
    </>
  );
}

export default SignIn;
