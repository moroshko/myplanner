import React from 'react';
import { Header } from '../shared/header-components';
import { LOGIN_PAGE } from '../constants';

function NoAccountHeader() {
  return <Header withBackButtonTo={LOGIN_PAGE} />;
}

export default NoAccountHeader;
