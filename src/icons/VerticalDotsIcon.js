import React from 'react';
import classNames from 'classnames';

function VerticalDotsIcon({ backgroundType }) {
  return (
    <svg
      className={classNames({
        IconOnDarkBackground: backgroundType === 'dark',
      })}
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        className="IconPrimaryColor"
        fillRule="evenodd"
        d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
      />
    </svg>
  );
}

export default VerticalDotsIcon;
