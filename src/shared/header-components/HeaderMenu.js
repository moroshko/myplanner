import React, { useCallback, useContext } from 'react';
import VerticalDotsIcon from '../../icons/VerticalDotsIcon';
import { AppContext } from '../../reducer';
import { signOut } from '../../authAPI';
import {
  SHOPPING_PAGE,
  SHOPPING_ITEMS_PAGE,
  SHOPPING_CATEGORIES_PAGE,
  ERROR_DIALOG,
} from '../../constants';
import './HeaderMenu.css';

function HeaderMenu() {
  const { state, dispatchChange } = useContext(AppContext);
  const { isHeaderMenuOpen, activePage } = state;
  const isShoppingActive =
    activePage === SHOPPING_PAGE ||
    activePage === SHOPPING_ITEMS_PAGE ||
    activePage === SHOPPING_CATEGORIES_PAGE;
  const onShoppingItemsClick = useCallback(() => {
    dispatchChange({
      type: 'UPDATE_ACTIVE_PAGE',
      activePage: SHOPPING_ITEMS_PAGE,
    });
  }, []);
  const onShoppingCategoriesClick = useCallback(() => {
    dispatchChange({
      type: 'UPDATE_ACTIVE_PAGE',
      activePage: SHOPPING_CATEGORIES_PAGE,
    });
  }, []);
  const onLogout = useCallback(() => {
    signOut()
      .then(() => {
        dispatchChange({
          type: 'UPDATE_USER',
          user: null,
        });
      })
      .catch(error => {
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
    <div className="HeaderMenu">
      <button
        className="HeaderMenuDotsButton"
        onClick={() => {
          dispatchChange({
            type: 'OPEN_HEADER_MENU',
          });
        }}
      >
        <VerticalDotsIcon backgroundType="dark" />
      </button>
      {isHeaderMenuOpen && (
        <div className="HeaderMenuList">
          {isShoppingActive && (
            <div className="HeaderMenuListItemsContainer">
              <div
                className="HeaderMenuListItem"
                onClick={onShoppingItemsClick}
              >
                Shopping Items
              </div>
              <div
                className="HeaderMenuListItem"
                onClick={onShoppingCategoriesClick}
              >
                Shopping Categories
              </div>
            </div>
          )}
          {isShoppingActive && <hr className="HeaderMenuListItemsSeparator" />}
          {isHeaderMenuOpen && (
            <div className="HeaderMenuListItemsContainer">
              <div className="HeaderMenuListItem" onClick={onLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderMenu;
