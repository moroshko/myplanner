import React from 'react';
import { Header } from '../shared/header-components';
import { LOGIN_PAGE } from '../constants';

function NewGroupHeader() {
  return <Header title="New Group" withBackButtonTo={LOGIN_PAGE} />;
}

export default NewGroupHeader;
