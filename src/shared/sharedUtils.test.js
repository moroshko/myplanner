import {
  pluralize,
  uppercaseFirstLetter,
  uppercaseFirstLetterOfEveryWord,
} from './sharedUtils';

describe('pluralize', () => {
  it('count = 0', () => {
    expect(pluralize(0, 'item')).toBe('0 items');
  });

  it('count = 1', () => {
    expect(pluralize(1, 'item')).toBe('1 item');
  });

  it('count > 1', () => {
    expect(pluralize(3, 'item')).toBe('3 items');
  });
});

describe('uppercaseFirstLetter', () => {
  it('handles empty string', () => {
    expect(uppercaseFirstLetter('')).toBe('');
  });

  it('uppercases the first letter', () => {
    expect(uppercaseFirstLetter('buy food')).toBe('Buy food');
  });
});

describe('uppercaseFirstLetterOfEveryWord', () => {
  it('uppercases the first letter of every word', () => {
    expect(uppercaseFirstLetterOfEveryWord('fruits and vegetables')).toBe(
      'Fruits And Vegetables'
    );
  });

  it('removes leading and trailing whitespaces', () => {
    expect(
      uppercaseFirstLetterOfEveryWord('  fruits and vegetables\t\n\n')
    ).toBe('Fruits And Vegetables');
  });

  it('collapses whitespaces between words', () => {
    expect(uppercaseFirstLetterOfEveryWord('fruits  &    vegetables')).toBe(
      'Fruits & Vegetables'
    );
  });
});
