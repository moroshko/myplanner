import React, { useCallback, useContext } from 'react';
import { Header, HeaderMenu } from '../shared/header-components';
import { AddIcon } from '../icons';
import { AppContext } from '../reducer';
import { NEW_GROUP_DIALOG } from '../constants';

function GroupsHeader() {
  const { state, dispatchChange } = useContext(AppContext);
  const { backButtonPage } = state;
  const onAddGroup = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_GROUP_DIALOG,
    });
  }, []);

  return (
    <Header title="Groups" withBackButtonTo={backButtonPage}>
      <button onClick={onAddGroup}>
        <AddIcon backgroundType="dark" />
      </button>
      <HeaderMenu />
    </Header>
  );
}

export default GroupsHeader;
