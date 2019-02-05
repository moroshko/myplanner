import React, { useCallback, useContext } from 'react';
import { ListItem, ListItemButton } from '../shared/list-components';
import { AppContext } from '../reducer';
import { EDIT_SHOPPING_ITEM_DIALOG } from '../constants';

function ShoppingItem({ shoppingItem }) {
  const { name } = shoppingItem;
  const { dispatchChange } = useContext(AppContext);
  const onEditButtonClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: EDIT_SHOPPING_ITEM_DIALOG,
      dialogData: {
        shoppingItem,
      },
    });
  }, [shoppingItem]);

  return (
    <ListItem>
      <ListItemButton onClick={onEditButtonClick}>{name}</ListItemButton>
    </ListItem>
  );
}

export default ShoppingItem;
