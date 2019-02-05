import {
  isShoppingListItemValid,
  cleanShoppingListItemNote,
  isItemInShoppingList,
} from './shoppingListItemsUtils';

describe('isShoppingListItemValid', () => {
  it('valid', () => {
    expect(isShoppingListItemValid({ note: '2' })).toBe(true);
    expect(isShoppingListItemValid({ note: ' ' })).toBe(true);
  });
});

describe('cleanShoppingListItemNote', () => {
  it('trims leading and trailing whitespaces', () => {
    expect(cleanShoppingListItemNote('  \t 2  \n\n')).toBe('2');
  });

  it('uppercases the first letter', () => {
    expect(cleanShoppingListItemNote('not too much')).toBe('Not too much');
  });
});

describe('isItemInShoppingList', () => {
  const groupedShoppingListItems = [
    {
      shoppingCategory: {
        id: '4eI3iVISeI3syOUr00Wm',
        name: 'Fruits & Vegetables',
        index: 0,
      },
      shoppingListItems: [
        {
          id: '7z1i7YBOCvSdA0rsWRn5',
          shoppingItemId: '32ZyDRZtfJEZnwyxrsFx',
          note: '2 bags',
          name: 'Cucumbers',
          shoppingCategoryId: '4eI3iVISeI3syOUr00Wm',
        },
        {
          id: 'p0eS6axXnLyOZVn83K9l',
          shoppingItemId: 'L8IwxndbrypBCd7D2QfT',
          name: 'Spinach',
          shoppingCategoryId: '4eI3iVISeI3syOUr00Wm',
        },
      ],
    },
    {
      shoppingCategory: {
        id: 'qm1VcxwlPWXXAFCuF7tx',
        name: 'Frozen',
        index: 1,
      },
      shoppingListItems: [
        {
          id: 'jN6LvNKsya0nqKh0ktiO',
          shoppingItemId: 'RgR47IVgQIgKWwrDF6Sg',
          name: 'Frozen corn',
          shoppingCategoryId: 'qm1VcxwlPWXXAFCuF7tx',
        },
        {
          id: 'qgyrVnAandA33t7TTo50',
          shoppingItemId: '6uq0wNrOTz3pWdMno4Ev',
          name: 'Chocolate icecream',
          shoppingCategoryId: 'qm1VcxwlPWXXAFCuF7tx',
        },
      ],
    },
    {
      shoppingCategory: {
        id: '0GdWorQg9uSccJ3tvYKi',
        name: 'Milk & Cheese',
        index: 2,
      },
      shoppingListItems: [
        {
          id: 'OwSPUehqRe13mc1pDcwm',
          shoppingItemId: 'n5VlUnjhcjOwKkcEOBSY',
          name: 'Chocolate milk',
          shoppingCategoryId: '0GdWorQg9uSccJ3tvYKi',
        },
      ],
    },
    {
      shoppingCategory: {
        id: '1duYnzQHGmgnThWaYarm',
        name: 'Meat & Fish',
        index: 3,
      },
      shoppingListItems: [
        {
          id: 'XBdSj0bkJKctZQBlXav1',
          shoppingItemId: 'CbB5YHpqJlD2LG8okUCR',
          name: 'Chicken breasts',
          shoppingCategoryId: '1duYnzQHGmgnThWaYarm',
        },
        {
          id: 'yFf68tPOT2DXqi9ZWv10',
          shoppingItemId: '1NFP9XjMxo0vuDOFx4sL',
          name: 'Chicken thighs',
          shoppingCategoryId: '1duYnzQHGmgnThWaYarm',
        },
      ],
    },
  ];

  it('item in list', () => {
    expect(
      isItemInShoppingList({
        groupedShoppingListItems,
        shoppingItemId: 'CbB5YHpqJlD2LG8okUCR',
      })
    ).toBe(true);
  });

  it('item not in list', () => {
    expect(
      isItemInShoppingList({ groupedShoppingListItems, shoppingItemId: '123' })
    ).toBe(false);
  });
});
