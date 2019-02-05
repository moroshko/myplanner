import React from 'react';
import classNames from 'classnames';
import Button from '../Button';
import './DialogButton.css';

function DialogButton({
  type,
  primary,
  danger,
  leftAlign,
  disabled,
  text,
  onClick,
}) {
  return (
    <span
      className={classNames('DialogButton', {
        DialogButtonLeftAlign: leftAlign,
      })}
    >
      <Button
        type={type || 'button'}
        primary={primary}
        danger={danger}
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </Button>
    </span>
  );
}

export default DialogButton;
