import { uppercaseFirstLetterOfEveryWord } from '../shared/sharedUtils';

function isShoppingItemValid({ name, shoppingCategoryId }) {
  return name.trim() !== '' && shoppingCategoryId !== null;
}

function cleanShoppingItemName(name) {
  return uppercaseFirstLetterOfEveryWord(name.trim());
}

export { isShoppingItemValid, cleanShoppingItemName };
