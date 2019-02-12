import React, { useContext } from 'react';
import { Header } from '../shared/header-components';
import { AppContext } from '../reducer';

function NewGroupHeader() {
  const { state } = useContext(AppContext);
  const { backButtonPage } = state;

  return <Header title="New Group" withBackButtonTo={backButtonPage} />;
}

export default NewGroupHeader;
