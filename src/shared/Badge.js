import React from 'react';
import classNames from 'classnames';
import './Badge.css';

function Badge({ color, text }) {
  return (
    <span
      className={classNames('Badge', {
        BadgeBlue: color === 'blue',
        BadgeGreen: color === 'green',
        BadgeRed: color === 'red',
      })}
    >
      {text}
    </span>
  );
}

export default Badge;
