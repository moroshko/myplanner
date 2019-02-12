import { isGroupValid, cleanGroupName } from './groupsUtils';

describe('isGroupValid', () => {
  it('valid', () => {
    expect(isGroupValid({ name: 'ab' })).toBe(true);
    expect(isGroupValid({ name: 'moroshko' })).toBe(true);
    expect(isGroupValid({ name: ' moroshko  ' })).toBe(true);
    expect(isGroupValid({ name: 'moroshko_family' })).toBe(true);
  });

  it('invalid', () => {
    expect(isGroupValid({ name: '' })).toBe(false);
    expect(isGroupValid({ name: 'm' })).toBe(false);
    expect(isGroupValid({ name: '  m  ' })).toBe(false);
    expect(isGroupValid({ name: '_moroshko' })).toBe(false);
    expect(isGroupValid({ name: 'Moroshko' })).toBe(false);
    expect(isGroupValid({ name: 'mor123' })).toBe(false);
  });
});

describe('cleanGroupName', () => {
  it('trims leading and trailing whitespaces', () => {
    expect(cleanGroupName('  \t moroshko  \n\n')).toBe('moroshko');
  });
});
