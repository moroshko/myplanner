import React, { useContext } from 'react';
import { Header } from '../shared/header-components';
import { AppContext } from '../reducer';

function UsersHeader() {
  const { state } = useContext(AppContext);
  const { backButtonPage } = state;

  return <Header title="Users" withBackButtonTo={backButtonPage} />;
}

export default UsersHeader;
