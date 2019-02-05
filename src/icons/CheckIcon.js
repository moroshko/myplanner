import React from 'react';
import classNames from 'classnames';

function CheckIcon({ highlighted }) {
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
        d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"
      />
    </svg>
  );
}

export default CheckIcon;
