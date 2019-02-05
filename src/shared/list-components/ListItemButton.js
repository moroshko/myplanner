import React from 'react';
import classNames from 'classnames';
import UserPhoto from '../UserPhoto';
import './ListItemButton.css';

function ListItemButton({
  userPhoto,
  secondaryText,
  disabled,
  onClick,
  children,
}) {
  return (
    <button
      className={classNames('ListItemButton', {
        ListItemButtonWithPhoto: userPhoto,
        ListItemButtonWithSecondaryText: secondaryText,
        ListItemButtonDisabled: disabled,
      })}
      disabled={disabled}
      onClick={onClick}
    >
      {userPhoto && <UserPhoto user={userPhoto} />}
      <span
        className={classNames('ListItemButtonContent', {
          ListItemButtonContentWithPhoto: userPhoto,
        })}
      >
        <span className="ListItemButtonChildren">{children}</span>
        {secondaryText && (
          <span className="ListItemButtonSecondaryText">{secondaryText}</span>
        )}
      </span>
    </button>
  );
}

export default ListItemButton;
