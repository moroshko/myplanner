import { getShoppingCategories } from './shoppingCategoriesAPI';
import { uppercaseFirstLetterOfEveryWord } from '../shared/sharedUtils';

function isShoppingCategoryValid({ name }) {
  return name.trim() !== '';
}

function cleanShoppingCategoryName(name) {
  return uppercaseFirstLetterOfEveryWord(name.trim());
}

function getCategorySelectOptionsPromise() {
  return getShoppingCategories().then(shoppingCategories => {
    return shoppingCategories.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  });
}

export {
  isShoppingCategoryValid,
  cleanShoppingCategoryName,
  getCategorySelectOptionsPromise,
};
