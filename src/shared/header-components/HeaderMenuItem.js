import React, { useCallback, useContext } from 'react';
import { AppContext } from '../../reducer';
import './HeaderMenuItem.css';

function HeaderMenuItem({ to, onClick, children }) {
  const { state, dispatchChange } = useContext(AppContext);
  const { activePage, backButtonPage } = state;
  const onMenuItemClick = useCallback(() => {
    if (to) {
      dispatchChange({
        type: 'UPDATE_ACTIVE_PAGE',
        activePage: to,
        backButtonPage: to === activePage ? backButtonPage : activePage,
      });
    }

    if (onClick) {
      onClick();
    }
  }, [to, onClick, activePage, backButtonPage]);

  return (
    <div className="HeaderMenuItem" onClick={onMenuItemClick}>
      {children}
    </div>
  );
}

export default HeaderMenuItem;
