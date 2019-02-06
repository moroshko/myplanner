import React from 'react';
import classNames from 'classnames';

function LeftArrowIcon({ backgroundType }) {
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
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      />
    </svg>
  );
}

export default LeftArrowIcon;