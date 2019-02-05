import React from 'react';
import ShoppingItem from './ShoppingItem';
import { ListHeader, List, ListItem } from '../shared/list-components';

function ShoppingItemsGroup({ shoppingCategory, shoppingItems }) {
  return (
    <ListItem vertical>
      <ListHeader>{shoppingCategory.name}</ListHeader>
      <List>
        {shoppingItems.map(shoppingItem => (
          <ShoppingItem shoppingItem={shoppingItem} key={shoppingItem.id} />
        ))}
      </List>
    </ListItem>
  );
}

export default ShoppingItemsGroup;
