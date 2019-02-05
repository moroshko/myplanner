import React, { useCallback } from 'react';
import classNames from 'classnames';
import { EnvelopeIcon, LockIcon, SearchIcon } from '../icons';
import './TextInput.css';

function TextInput({ icon, helperText, onChange, inputRef, ...restProps }) {
  const onValueChange = useCallback(
    e => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <span className="TextInputContainer">
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
      {helperText && <span className="TextInputHelperText">{helperText}</span>}
      <input
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
  );
}

export default TextInput;
