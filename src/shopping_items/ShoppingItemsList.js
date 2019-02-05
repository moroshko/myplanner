import React, { useCallback, useContext } from 'react';
import ShoppingItemsGroup from './ShoppingItemsGroup';
import EmptyMessage from '../shared/EmptyMessage';
import { List } from '../shared/list-components';
import { AppContext } from '../reducer';
import {
  NEW_SHOPPING_CATEGORY_DIALOG,
  NEW_SHOPPING_ITEM_DIALOG,
} from '../constants';

function ShoppingItemsList({ shoppingCategories, groupedShoppingItems }) {
  const { dispatchChange } = useContext(AppContext);
  const onAddShoppingCategoryClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_SHOPPING_CATEGORY_DIALOG,
    });
  }, []);
  const onAddShoppingItemClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: NEW_SHOPPING_ITEM_DIALOG,
    });
  }, []);

  return shoppingCategories.length === 0 ? (
    <EmptyMessage
      buttonText="Add Category"
      onButtonClick={onAddShoppingCategoryClick}
    >
      You need to create a shopping category before adding items.
    </EmptyMessage>
  ) : groupedShoppingItems.length === 0 ? (
    <EmptyMessage buttonText="Add Item" onButtonClick={onAddShoppingItemClick}>
      You don't have any items yet.
    </EmptyMessage>
  ) : (
    <List>
      {groupedShoppingItems.map(({ shoppingCategory, shoppingItems }) => (
        <ShoppingItemsGroup
          shoppingCategory={shoppingCategory}
          shoppingItems={shoppingItems}
          key={shoppingCategory.id}
        />
      ))}
    </List>
  );
}

export default ShoppingItemsList;
