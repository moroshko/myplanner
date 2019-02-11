import React, { useContext } from 'react';
import { Header, HeaderMenu } from '../shared/header-components';
import { AppContext } from '../reducer';

function SettingsHeader() {
  const { state } = useContext(AppContext);
  const { backButtonPage } = state;

  return (
    <Header title="Settings" withBackButtonTo={backButtonPage}>
      <HeaderMenu />
    </Header>
  );
}

export default SettingsHeader;
