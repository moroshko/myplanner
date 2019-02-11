import React, { useCallback, useContext } from 'react';
import { AppContext } from '../../reducer';
import './HeaderMenuItem.css';

function HeaderMenuItem({ toPageWithBackButton, onClick, children }) {
  const { state, dispatchChange } = useContext(AppContext);
  const { activePage, backButtonPage } = state;
  const onMenuItemClick = useCallback(() => {
    if (toPageWithBackButton) {
      dispatchChange({
        type: 'UPDATE_ACTIVE_PAGE',
        activePage: toPageWithBackButton,
        backButtonPage:
          toPageWithBackButton === activePage ? backButtonPage : activePage,
      });
    }

    if (onClick) {
      onClick();
    }
  }, [toPageWithBackButton, onClick, activePage, backButtonPage]);

  return (
    <div className="HeaderMenuItem" onClick={onMenuItemClick}>
      {children}
    </div>
  );
}

export default HeaderMenuItem;
