import React, { useState, useCallback, useContext } from 'react';
import TextInput from './shared/TextInput';
import Button from './shared/Button';
import { signIn } from './authAPI';
import { AppContext } from './reducer';
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

  return (
    <form className="LoginContainer" onSubmit={onSubmit}>
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
          <div className="LoginErrorMessage">{errorMessage}</div>
        )}
      </div>
    </form>
  );
}

export default Login;
