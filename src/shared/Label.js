import React from 'react';
import classNames from 'classnames';

import './Label.css';

function Label({ size, text, htmlFor }) {
  return (
    <label
      className={classNames('Label', {
        LabelSmall: size === 'small',
      })}
      htmlFor={htmlFor}
    >
      {text}
    </label>
  );
}

export default Label;
