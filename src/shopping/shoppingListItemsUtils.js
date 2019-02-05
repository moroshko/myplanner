import { uppercaseFirstLetter } from '../shared/sharedUtils';

function isShoppingListItemValid({ note }) {
  // we allow an empty note
  return true;
}

function cleanShoppingListItemNote(note) {
  return uppercaseFirstLetter(note.trim());
}

function isItemInShoppingList({ groupedShoppingListItems, shoppingItemId }) {
  return groupedShoppingListItems.some(({ shoppingListItems }) =>
    shoppingListItems.some(
      shoppingListItem => shoppingListItem.shoppingItemId === shoppingItemId
    )
  );
}

export {
  isShoppingListItemValid,
  cleanShoppingListItemNote,
  isItemInShoppingList,
};
