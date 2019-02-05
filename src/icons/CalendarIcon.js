import React from 'react';
import classNames from 'classnames';

function CalendarIcon({ highlighted }) {
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
        d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2zm0 5v10h14V9H5z"
      />
      <path
        className="IconSecondaryColor"
        d="M7 2a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1z"
      />
    </svg>
  );
}

export default CalendarIcon;
