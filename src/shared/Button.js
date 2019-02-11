import React from 'react';
import classNames from 'classnames';
import './Button.css';

function Button({
  type,
  primary,
  secondary,
  tertiary,
  danger,
  fullWidth,
  disabled,
  onClick,
  children,
}) {
  return (
    <button
      className={classNames('Button', {
        ButtonPrimary: primary,
        ButtonSecondary: secondary || (!primary && !tertiary),
        ButtonTertiary: tertiary,
        ButtonDanger: danger,
        ButtonFullWidth: fullWidth,
        ButtonDisabled: disabled,
      })}
      type={type || 'button'}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
