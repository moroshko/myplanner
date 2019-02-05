import React from 'react';
import './CheckboxIcon.css';

function CheckboxIcon({ checked, loading }) {
  return checked ? (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        className={
          loading ? 'CheckboxIconSpinnerBackground' : 'IconPrimaryColor'
        }
        d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
      {loading && (
        <path className="CheckboxIconSpinner" d="M12,3  A10,10 0 0,1 21,12" />
      )}
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        className={
          loading ? 'CheckboxIconSpinnerBackground' : 'IconPrimaryColor'
        }
        d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
      {loading && (
        <path className="CheckboxIconSpinner" d="M12,3  A10,10 0 0,1 21,12" />
      )}
    </svg>
  );
}

export default CheckboxIcon;
