import {
  isShoppingItemValid,
  cleanShoppingItemName,
} from './shoppingItemsUtils';

describe('isShoppingItemValid', () => {
  it('valid', () => {
    expect(
      isShoppingItemValid({ name: 'Cucumbers', shoppingCategoryId: '123' })
    ).toBe(true);
  });

  it('invalid', () => {
    expect(
      isShoppingItemValid({ name: 'Cucumbers', shoppingCategoryId: null })
    ).toBe(false);
    expect(
      isShoppingItemValid({ name: ' \t   \n', shoppingCategoryId: '123' })
    ).toBe(false);
  });
});

describe('cleanShoppingItemName', () => {
  it('trims leading and trailing whitespaces', () => {
    expect(cleanShoppingItemName('  \t Cucumbers  \n\n')).toBe('Cucumbers');
  });

  it('uppercases the first letter of every word', () => {
    expect(cleanShoppingItemName(' sweet kale  salad')).toBe(
      'Sweet Kale Salad'
    );
  });
});
