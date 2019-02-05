import React from 'react';
import classNames from 'classnames';

function ShoppingIcon({ highlighted }) {
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
        d="M7 4h14a1 1 0 0 1 .9 1.45l-4 8a1 1 0 0 1-.9.55H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
      />
      <path
        className="IconSecondaryColor"
        d="M17.73 19a2 2 0 1 1-3.46 0H8.73a2 2 0 1 1-3.42-.08A3 3 0 0 1 5 13.17V4H3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1v10h11a1 1 0 0 1 0 2H6a1 1 0 0 0 0 2h12a1 1 0 0 1 0 2h-.27z"
      />
    </svg>
  );
}

export default ShoppingIcon;
