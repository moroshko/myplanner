import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { isMobile } from '../sharedUtils';
import './Dialog.css';

function Dialog({ onSubmit, children }) {
  const [isHidden, setIsHidden] = useState(isMobile);
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

  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        setIsHidden(false);
      }, 300); // Wait until mobile keyboard is visible
    }
  }, []);

  return (
    <form
      className={classNames('Dialog', {
        DialogHidden: isHidden,
      })}
      onClick={onFormClick}
      onSubmit={onFormSubmit}
    >
      {children}
    </form>
  );
}

export default Dialog;
