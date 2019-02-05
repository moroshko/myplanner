import React, { useContext } from 'react';
import { AppContext } from '../reducer';
import UserPhoto from './UserPhoto';
import './OwnerPicker.css';

function OwnerPicker({ value, onChange }) {
  const { state } = useContext(AppContext);
  const { todoOwners } = state;

  return (
    <div className="OwnerPicker">
      {todoOwners.map(owner => (
        <UserPhoto
          user={owner}
          active={owner.uid === value}
          onChange={onChange}
          key={owner.uid}
        />
      ))}
    </div>
  );
}

export default OwnerPicker;
