import React, { useState, useCallback, useContext } from 'react';
import TextInput from '../shared/TextInput';
import Button from '../shared/Button';
import { createGroup } from './groupsAPI';
import { AppContext } from '../reducer';
import { LOGIN_PAGE } from '../constants';
import './NewGroupMain.css';

function NewGroupMain() {
  const { dispatchChange } = useContext(AppContext);
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const isButtonDisabled = groupName.trim() === '' || isCreating;
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      setIsCreating(true);
      setErrorMessage(null);

      createGroup({
        name: groupName,
      })
        .then(() => {
          dispatchChange({
            type: 'UPDATE_ACTIVE_PAGE',
            activePage: LOGIN_PAGE,
          });

          // NewGroupMain will be unmounted at this point.
          // That's why we don't update the state.
        })
        .catch(error => {
          setErrorMessage(error.message);
          setIsCreating(false);
        });
    },
    [groupName]
  );

  return (
    <form className="NewGroupMain" onSubmit={onSubmit}>
      <TextInput
        label="Group Name"
        autoFocus
        placeholder="e.g. moroshko"
        onChange={setGroupName}
      />
      <div className="NewGroupMainButtonAndErrorMessageContainer">
        <Button primary fullWidth type="submit" disabled={isButtonDisabled}>
          {isCreating ? 'Please wait...' : 'Create'}
        </Button>
        {errorMessage && (
          <div className="NewGroupMainErrorMessage">{errorMessage}</div>
        )}
      </div>
    </form>
  );
}

export default NewGroupMain;
