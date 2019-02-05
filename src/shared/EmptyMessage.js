import React from 'react';
import Button from './Button';
import './EmptyMessage.css';

function EmptyMessage({ buttonText, onButtonClick, children }) {
  return (
    <div className="EmptyMessage">
      {children}
      {buttonText && onButtonClick && (
        <div className="EmptyMessageButton">
          <Button primary onClick={onButtonClick}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyMessage;
