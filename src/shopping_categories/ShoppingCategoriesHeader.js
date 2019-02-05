import React, { useCallback, useContext } from 'react';
import { Header, HeaderMenu } from '../shared/header-components';
import { AddIcon } from '../icons';
import { AppContext } from '../reducer';
import { NEW_SHOPPING_CATEGORY_DIALOG, SHOPPING_PAGE } from '../constants';

function ShoppingCategoriesHeader() {
  const { dispatchChange } = useContext(AppContext);
  const onAddCategory = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_SHOPPING_CATEGORY_DIALOG,
    });
  }, []);

  return (
    <Header title="Shopping Categories" withBackButtonTo={SHOPPING_PAGE}>
      <button onClick={onAddCategory}>
        <AddIcon backgroundType="dark" />
      </button>
      <HeaderMenu />
    </Header>
  );
}

export default ShoppingCategoriesHeader;
