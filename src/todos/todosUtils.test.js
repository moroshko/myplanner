import { isTodoValid, cleanTodoDescription } from './todosUtils';

describe('isTodoValid', () => {
  it('valid', () => {
    expect(isTodoValid({ description: 'Read a book', ownerUid: null })).toBe(
      true
    );
    expect(isTodoValid({ description: 'Read a book', ownerUid: '123' })).toBe(
      true
    );
  });

  it('invalid', () => {
    expect(isTodoValid({ description: '', ownerUid: undefined })).toBe(false);
    expect(
      isTodoValid({ description: 'Read a book', ownerUid: undefined })
    ).toBe(false);
    expect(isTodoValid({ description: '', ownerUid: null })).toBe(false);
    expect(isTodoValid({ description: '', ownerUid: '123' })).toBe(false);
    expect(isTodoValid({ description: ' \t   \n', ownerUid: '123' })).toBe(
      false
    );
  });
});

describe('cleanTodoDescription', () => {
  it('trims leading and trailing whitespaces', () => {
    expect(cleanTodoDescription('  \t Buy food  \n\n')).toBe('Buy food');
  });

  it('uppercases the first letter', () => {
    expect(cleanTodoDescription('buy food')).toBe('Buy food');
  });
});
