import React, { useState, useCallback, useContext } from 'react';
import Logo from '../Logo';
import TextInput from '../shared/TextInput';
import Button from '../shared/Button';
import { signIn } from '../authAPI';
import { AppContext } from '../reducer';
import './SignIn.css';

function SignIn() {
  const { dispatchChange } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const isButtonDisabled =
    email.trim() === '' || password.trim() === '' || isLoggingIn;
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      setIsLoggingIn(true);
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
          setIsLoggingIn(false);
        });
    },
    [email, password]
  );
  const onHideErrorMessageClick = useCallback(() => {
    setErrorMessage(null);
  }, []);
  const onForgotPasswordClick = useCallback(() => {
    // TODO
  }, []);

  return (
    <div className="SignInContainer">
      <h1 className="SignInHeader">
        <Logo size={56} />
        My Planner
      </h1>
      <form onSubmit={onSubmit}>
        <TextInput icon="envelope" placeholder="email" onChange={setEmail} />
        <div className="SignInPasswordContainer">
          <TextInput
            icon="lock"
            type="password"
            placeholder="password"
            onChange={setPassword}
          />
        </div>
        <div className="SignInButtonAndErrorMessageContainer">
          <Button primary fullWidth type="submit" disabled={isButtonDisabled}>
            {isLoggingIn ? 'Please wait...' : 'Sign In'}
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
        <Button tertiary onClick={onForgotPasswordClick}>
          I forgot my password
        </Button>
      </div>
    </div>
  );
}

export default SignIn;
