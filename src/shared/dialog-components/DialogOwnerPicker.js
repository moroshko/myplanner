import React from 'react';
import Label from '../Label';
import OwnerPicker from '../OwnerPicker';
import './DialogOwnerPicker.css';

function DialogOwnerPicker({ value, onChange }) {
  return (
    <div className="DialogOwnerPicker">
      <Label text="Owner:" />
      <div className="DialogOwnerPickerOwnersContainer">
        <OwnerPicker value={value} onChange={onChange} />
      </div>
    </div>
  );
}

export default DialogOwnerPicker;
