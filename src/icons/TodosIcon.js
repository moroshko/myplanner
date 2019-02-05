import React from 'react';
import classNames from 'classnames';

function TodosIcon({ highlighted }) {
  return (
    <svg
      className={classNames({
        IconHighlighted: highlighted,
      })}
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        className="IconPrimaryColor"
        d="M7,5H21V7H7V5M7,13V11H21V13H7M7,19V17H21V19H7"
      />
      <path
        className="IconSecondaryColor"
        d="M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"
      />
    </svg>
  );
}

export default TodosIcon;
