import React, { useState, useCallback, useContext } from 'react';
import Logo from '../Logo';
import TextInput from '../shared/TextInput';
import Button from '../shared/Button';
import { signIn } from '../authAPI';
import { AppContext } from '../reducer';
import { NO_ACCOUNT_PAGE } from '../constants';
import './Login.css';

function Login() {
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

          // Login will be unmounted at this point.
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
  const onNoAccountClick = useCallback(() => {
    dispatchChange({
      type: 'UPDATE_ACTIVE_PAGE',
      activePage: NO_ACCOUNT_PAGE,
    });
  }, []);

  return (
    <div className="LoginContainer">
      <h1 className="LoginHeader">
        <Logo size={56} />
        My Planner
      </h1>
      <form onSubmit={onSubmit}>
        <TextInput icon="envelope" placeholder="email" onChange={setEmail} />
        <div className="LoginPasswordContainer">
          <TextInput
            icon="lock"
            type="password"
            placeholder="password"
            onChange={setPassword}
          />
        </div>
        <div className="LoginButtonAndErrorMessageContainer">
          <Button primary fullWidth type="submit" disabled={isButtonDisabled}>
            {isLoggingIn ? 'Please wait...' : 'Login'}
          </Button>
          {errorMessage && (
            <div className="LoginErrorMessage">
              {errorMessage}
              <Button tertiary onClick={onHideErrorMessageClick}>
                Hide
              </Button>
            </div>
          )}
        </div>
      </form>
      <div className="LoginExtraButtons">
        <Button tertiary onClick={onNoAccountClick}>
          I don't have an account
        </Button>
      </div>
    </div>
  );
}

export default Login;
