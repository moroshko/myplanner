import React, { useCallback, useContext } from 'react';
import { Header, HeaderMenu } from '../shared/header-components';
import { AddIcon } from '../icons';
import { AppContext } from '../reducer';
import { NEW_SHOPPING_ITEM_DIALOG, SHOPPING_PAGE } from '../constants';

function ShoppingItemsHeader() {
  const { state, dispatchChange } = useContext(AppContext);
  const { shoppingCategories } = state;
  const onAddItem = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_SHOPPING_ITEM_DIALOG,
    });
  }, []);

  return (
    <Header title="Shopping Items" withBackButtonTo={SHOPPING_PAGE}>
      {shoppingCategories !== null && shoppingCategories.length > 0 && (
        <button onClick={onAddItem}>
          <AddIcon backgroundType="dark" />
        </button>
      )}
      <HeaderMenu />
    </Header>
  );
}

export default ShoppingItemsHeader;
