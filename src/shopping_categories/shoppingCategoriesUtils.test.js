import {
  isShoppingCategoryValid,
  cleanShoppingCategoryName,
} from './shoppingCategoriesUtils';

describe('isShoppingCategoryValid', () => {
  it('valid', () => {
    expect(isShoppingCategoryValid({ name: 'Fruits & Vegetables' })).toBe(true);
  });

  it('invalid', () => {
    expect(isShoppingCategoryValid({ name: ' \t   \n' })).toBe(false);
  });
});

describe('cleanShoppingCategoryName', () => {
  it('trims leading and trailing whitespaces', () => {
    expect(cleanShoppingCategoryName('  \t Fruits & Vegetables  \n\n')).toBe(
      'Fruits & Vegetables'
    );
  });

  it('uppercases the first letter of every word', () => {
    expect(cleanShoppingCategoryName(' fruits &   vegetables')).toBe(
      'Fruits & Vegetables'
    );
  });
});
