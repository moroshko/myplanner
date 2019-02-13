import React, { useState, useEffect, useCallback, useContext } from 'react';
import EmptyMessage from '../shared/EmptyMessage';
import GroupsList from './GroupsList';
import { AppContext } from '../reducer';
import { getGroups, subscribeToGroupsUpdates } from './groupsAPI';
import { NEW_GROUP_DIALOG, ERROR_DIALOG } from '../constants';

function GroupsMain() {
  const { dispatchChange } = useContext(AppContext);
  const [groups, setGroups] = useState(null);
  const onAddGroupClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_GROUP_DIALOG,
    });
  }, []);

  useEffect(() => {
    getGroups()
      .then(setGroups)
      .catch(error => {
        dispatchChange({
          type: 'SHOW_DIALOG',
          dialogName: ERROR_DIALOG,
          dialogData: {
            errorMessage: error.message,
          },
        });
      });
  }, []);

  useEffect(() => {
    return subscribeToGroupsUpdates({
      onUpdate: ({ groups }) => setGroups(groups),
    });
  }, []);

  return groups === null ? null : groups.length === 0 ? (
    <EmptyMessage buttonText="Add Group" onButtonClick={onAddGroupClick}>
      There are no groups yet.
    </EmptyMessage>
  ) : (
    <GroupsList groups={groups} />
  );
}

export default GroupsMain;
