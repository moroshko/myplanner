import React, { useCallback } from 'react';
import './Dialog.css';

function Dialog({ onSubmit, children }) {
  const onFormClick = useCallback(e => {
    e.stopPropagation();
  }, []);
  const onFormSubmit = useCallback(
    e => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <form className="Dialog" onClick={onFormClick} onSubmit={onFormSubmit}>
      {children}
    </form>
  );
}

export default Dialog;
