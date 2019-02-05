import React, { memo } from 'react';
import classNames from 'classnames';
import './UserPhoto.css';

function UserPhoto({ user, active, onChange }) {
  if (onChange) {
    return (
      <button
        className={classNames('UserPhoto', 'UserPhotoButton', {
          UserPhotoActive: active,
        })}
        onClick={() => {
          onChange(user.uid);
        }}
        type="button"
      >
        {user.uid === null ? (
          <span className="UserPhotoNoOne">No one</span>
        ) : (
          <img className="UserPhotoImage" src={user.photoUrl} alt={user.name} />
        )}
      </button>
    );
  }

  return (
    <span className="UserPhoto">
      {user.uid === null ? (
        <span className="UserPhotoNoOne">No one</span>
      ) : (
        <img className="UserPhotoImage" src={user.photoUrl} alt={user.name} />
      )}
    </span>
  );
}

export default memo(UserPhoto);
