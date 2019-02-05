import React from 'react';
import DialogButton from './DialogButton';

function DialogSubmitButton({ disabled, text }) {
  return <DialogButton type="submit" primary disabled={disabled} text={text} />;
}

export default DialogSubmitButton;
