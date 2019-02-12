import React from 'react';
import classNames from 'classnames';
import TextInput from '../TextInput';
import './DialogTextInput.css';

function DialogTextInput({
  placeholder,
  value,
  onChange,
  helperText,
  helperTextType,
}) {
  return (
    <>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus
      />
      {helperText && (
        <div
          className={classNames('DialogTextInputHelperText', {
            DialogTextInputHelperTextError: helperTextType === 'error',
          })}
        >
          {helperText}
        </div>
      )}
    </>
  );
}

export default DialogTextInput;
