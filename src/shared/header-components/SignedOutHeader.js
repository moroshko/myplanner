import React from 'react';
import Header from './Header';
import './SignedOutHeader.css';

function SignedOutHeader({ withBackButtonTo }) {
  return (
    <div className="SignedOutHeader">
      <Header title="My Planner" withBackButtonTo={withBackButtonTo} />
    </div>
  );
}

export default SignedOutHeader;
