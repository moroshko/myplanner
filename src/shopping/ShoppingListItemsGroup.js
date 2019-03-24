import React, { useCallback, useContext } from 'react';
import ShoppingListItem from './ShoppingListItem';
import {
  List,
  ListHeader,
  ListHeaderButton,
  ListItem,
} from '../shared/list-components';
import { AppContext } from '../reducer';
import {
  DELETE_CHECKED_SHOPPING_LIST_ITEMS_CONFIRMATION_DIALOG,
  SHOPPING_CATEGORY_CHECKED_ITEMS_ID,
} from '../constants';

function ShoppingListItemsGroup({
  shoppingCategory,
  shoppingListItems,
  highlightedItemsMap,
  onCheckboxClick,
}) {
  const { state, dispatchChange } = useContext(AppContext);
  const { isShopping } = state;
  const isCheckedItemsCategory =
    shoppingCategory.id === SHOPPING_CATEGORY_CHECKED_ITEMS_ID;
  const onClear = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: DELETE_CHECKED_SHOPPING_LIST_ITEMS_CONFIRMATION_DIALOG,
      dialogData: {
        checkedItemsCount: shoppingListItems.length,
      },
    });
  }, [shoppingListItems.length]);

  return (
    <ListItem vertical>
      <ListHeader highlighted={isShopping && !isCheckedItemsCategory}>
        {shoppingCategory.name}
        {isCheckedItemsCategory && (
          <ListHeaderButton onClick={onClear}>Clear</ListHeaderButton>
        )}
      </ListHeader>
      <List>
        {shoppingListItems.map(shoppingListItem => (
          <ShoppingListItem
            shoppingListItem={shoppingListItem}
            isHighlighted={highlightedItemsMap[shoppingListItem.id] === true}
            onCheckboxClick={onCheckboxClick}
            key={shoppingListItem.id}
          />
        ))}
      </List>
    </ListItem>
  );
}

export default ShoppingListItemsGroup;
