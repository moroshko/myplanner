import React, { useCallback } from 'react';
import classNames from 'classnames';
import nanoid from 'nanoid';
import Label from './Label';
import { EnvelopeIcon, LockIcon, SearchIcon } from '../icons';
import './TextInput.css';

function TextInput({
  label,
  icon,
  helperText,
  onChange,
  inputRef,
  ...restProps
}) {
  const onValueChange = useCallback(
    e => {
      onChange(e.target.value);
    },
    [onChange]
  );
  const id = label ? nanoid() : null;

  return (
    <span className="TextInputContainer">
      {label && (
        <span className="TextInputLabel">
          <Label size="small" text={label} htmlFor={id} />
        </span>
      )}
      <span className="TextInputInnerContainer">
        {icon === 'search' && (
          <span className="TextInputIcon">
            <SearchIcon />
          </span>
        )}
        {icon === 'lock' && (
          <span className="TextInputIcon">
            <LockIcon />
          </span>
        )}
        {icon === 'envelope' && (
          <span className="TextInputIcon">
            <EnvelopeIcon />
          </span>
        )}
        {helperText && (
          <span className="TextInputHelperText">{helperText}</span>
        )}
        <input
          id={id}
          type="text"
          {...restProps}
          className={classNames('TextInput', {
            TextInputWithIcon: icon,
            TextInputWithHelperText: helperText,
          })}
          onChange={onValueChange}
          spellCheck={false}
          autoComplete="off"
          ref={inputRef}
        />
      </span>
    </span>
  );
}

export default TextInput;
