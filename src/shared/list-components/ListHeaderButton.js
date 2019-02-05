import React from 'react';
import './ListHeaderButton.css';

function ListHeaderButton({ onClick, children }) {
  return (
    <button className="ListHeaderButton" type="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default ListHeaderButton;
