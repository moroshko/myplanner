import React from 'react';
import './DialogHeader.css';

function DialogHeader({ title, helperText }) {
  return (
    <div className="DialogHeader">
      <div className="DialogHeaderTitle">{title}</div>
      <div className="DialogHeaderHelperText">{helperText}</div>
    </div>
  );
}

export default DialogHeader;
