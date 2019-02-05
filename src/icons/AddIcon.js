import React from 'react';
import classNames from 'classnames';

function AddIcon({ backgroundType }) {
  return (
    <svg
      className={classNames({
        IconOnLightBackground: backgroundType === 'light',
        IconOnDarkBackground: backgroundType === 'dark',
        IconOnBlueBackground: backgroundType === 'blue',
      })}
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <circle className="IconPrimaryColor" cx="12" cy="12" r="10" />
      <path
        className="IconSecondaryColor"
        d="M13 11h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4z"
      />
    </svg>
  );
}

export default AddIcon;
