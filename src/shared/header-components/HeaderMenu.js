import React, { useCallback, useContext } from 'react';
import HeaderMenuItem from './HeaderMenuItem';
import VerticalDotsIcon from '../../icons/VerticalDotsIcon';
import { AppContext } from '../../reducer';
import { signOut } from '../../authAPI';
import {
  SHOPPING_PAGE,
  SHOPPING_ITEMS_PAGE,
  SHOPPING_CATEGORIES_PAGE,
  NEW_GROUP_PAGE,
  SETTINGS_PAGE,
  ERROR_DIALOG,
} from '../../constants';
import './HeaderMenu.css';

function HeaderMenu() {
  const { state, dispatchChange } = useContext(AppContext);
  const { user, isHeaderMenuOpen, activePage } = state;
  const isShoppingActive =
    activePage === SHOPPING_PAGE ||
    activePage === SHOPPING_ITEMS_PAGE ||
    activePage === SHOPPING_CATEGORIES_PAGE;
  const onLogout = useCallback(() => {
    signOut().catch(error => {
      dispatchChange({
        type: 'SHOW_DIALOG',
        dialogName: ERROR_DIALOG,
        dialogData: {
          errorMessage: error.message,
        },
      });
    });
  }, []);

  return (
    <div className="HeaderMenuContainer">
      <button
        onClick={() => {
          dispatchChange({
            type: 'OPEN_HEADER_MENU',
          });
        }}
      >
        <VerticalDotsIcon backgroundType="dark" />
      </button>
      {isHeaderMenuOpen && (
        <div className="HeaderMenu">
          <div className="HeaderMenuItemsContainer">
            {isShoppingActive && (
              <>
                <HeaderMenuItem to={SHOPPING_ITEMS_PAGE}>
                  Shopping Items
                </HeaderMenuItem>
                <HeaderMenuItem to={SHOPPING_CATEGORIES_PAGE}>
                  Shopping Categories
                </HeaderMenuItem>
              </>
            )}
            {user.email === 'michael.moroshko@gmail.com' && (
              <HeaderMenuItem to={NEW_GROUP_PAGE}>
                Create New Group
              </HeaderMenuItem>
            )}
            <HeaderMenuItem to={SETTINGS_PAGE}>Settings</HeaderMenuItem>
          </div>
          <hr className="HeaderMenuItemsSeparator" />
          <div className="HeaderMenuItemsContainer">
            <HeaderMenuItem onClick={onLogout}>Logout</HeaderMenuItem>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderMenu;
