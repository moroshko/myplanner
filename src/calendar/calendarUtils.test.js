import { INVALID_TIME, NO_TIME_SPECIFIED_MESSAGE } from '../constants';
import {
  parseCalendarTodoText,
  timeStrTo24hours,
  timeStrTo12hours,
  parseTime,
  isCalendarTodoValid,
  getCalendarTodoHelperText,
} from './calendarUtils';

describe('timeStrTo24hours', () => {
  it('converts time to 24 hours format', () => {
    expect(timeStrTo24hours('12:00am')).toBe('00:00');
    expect(timeStrTo24hours('1:30am')).toBe('01:30');
    expect(timeStrTo24hours('10:15am')).toBe('10:15');
    expect(timeStrTo24hours('12:00pm')).toBe('12:00');
    expect(timeStrTo24hours('2:45pm')).toBe('14:45');
    expect(timeStrTo24hours('11:59pm')).toBe('23:59');
  });

  it('invalid time', () => {
    expect(timeStrTo24hours('23:00am')).toBe(INVALID_TIME);
    expect(timeStrTo24hours('78:30am')).toBe(INVALID_TIME);
  });
});

describe('timeStrTo12hours', () => {
  it('converts time to 12 hours format', () => {
    expect(timeStrTo12hours('00:00')).toBe('12:00am');
    expect(timeStrTo12hours('01:30')).toBe('1:30am');
    expect(timeStrTo12hours('10:15')).toBe('10:15am');
    expect(timeStrTo12hours('12:00')).toBe('12:00pm');
    expect(timeStrTo12hours('14:45')).toBe('2:45pm');
    expect(timeStrTo12hours('23:59')).toBe('11:59pm');
  });

  it('invalid time', () => {
    expect(timeStrTo24hours('24:00')).toBe(INVALID_TIME);
    expect(timeStrTo24hours('78:30')).toBe(INVALID_TIME);
  });
});

describe('parseTime', () => {
  it('midnight', () => {
    expect(parseTime('0:00')).toEqual({
      hours: 0,
      minutes: 0,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('00:00')).toEqual({
      hours: 0,
      minutes: 0,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('12am')).toEqual({
      hours: 12,
      minutes: 0,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('12:00am')).toEqual({
      hours: 12,
      minutes: 0,
      amPM: 'am',
      errorMessage: null,
    });
  });

  it('midday', () => {
    expect(parseTime('12pm')).toEqual({
      hours: 12,
      minutes: 0,
      amPM: 'pm',
      errorMessage: null,
    });

    expect(parseTime('12:00pm')).toEqual({
      hours: 12,
      minutes: 0,
      amPM: 'pm',
      errorMessage: null,
    });
  });

  it('ambiguous', () => {
    expect(parseTime('8:40')).toEqual({
      hours: 8,
      minutes: 40,
      amPM: null,
      errorMessage: 'am or pm?',
    });

    expect(parseTime('11:20')).toEqual({
      hours: 11,
      minutes: 20,
      amPM: null,
      errorMessage: 'am or pm?',
    });

    expect(parseTime('12:00')).toEqual({
      hours: 12,
      minutes: 0,
      amPM: null,
      errorMessage: 'am or pm?',
    });

    expect(parseTime('12:03')).toEqual({
      hours: 12,
      minutes: 3,
      amPM: null,
      errorMessage: 'am or pm?',
    });
  });

  it('invalid', () => {
    [
      '',
      '2',
      'am',
      '5:3am',
      '56:78',
      '0am',
      '0pm',
      '0:00am',
      '0:00pm',
      '13am',
      '13:00am',
      '24:00',
    ].forEach(timeStr => {
      expect(parseTime(timeStr)).toEqual({
        hours: null,
        minutes: null,
        amPM: null,
        errorMessage: 'Invalid time',
      });
    });
  });

  it('12 hours format', () => {
    expect(parseTime('12:30am')).toEqual({
      hours: 12,
      minutes: 30,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('1am')).toEqual({
      hours: 1,
      minutes: 0,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('08am')).toEqual({
      hours: 8,
      minutes: 0,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('09:15am')).toEqual({
      hours: 9,
      minutes: 15,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('11:45am')).toEqual({
      hours: 11,
      minutes: 45,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('12:30pm')).toEqual({
      hours: 12,
      minutes: 30,
      amPM: 'pm',
      errorMessage: null,
    });

    expect(parseTime('10pm')).toEqual({
      hours: 10,
      minutes: 0,
      amPM: 'pm',
      errorMessage: null,
    });

    expect(parseTime('11:59pm')).toEqual({
      hours: 11,
      minutes: 59,
      amPM: 'pm',
      errorMessage: null,
    });
  });

  it('24 hours format', () => {
    expect(parseTime('01:00')).toEqual({
      hours: 1,
      minutes: 0,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('08:40')).toEqual({
      hours: 8,
      minutes: 40,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('20:10')).toEqual({
      hours: 8,
      minutes: 10,
      amPM: 'pm',
      errorMessage: null,
    });

    expect(parseTime('23:59')).toEqual({
      hours: 11,
      minutes: 59,
      amPM: 'pm',
      errorMessage: null,
    });
  });

  it('hours-minutes separator', () => {
    expect(parseTime('5.30pm')).toEqual({
      hours: 5,
      minutes: 30,
      amPM: 'pm',
      errorMessage: null,
    });

    expect(parseTime('14,30')).toEqual({
      hours: 2,
      minutes: 30,
      amPM: 'pm',
      errorMessage: null,
    });
  });

  it('whitespaces', () => {
    expect(parseTime('  5:30  \t pm  \n')).toEqual({
      hours: 5,
      minutes: 30,
      amPM: 'pm',
      errorMessage: null,
    });
  });

  it('uppercase', () => {
    expect(parseTime('10AM')).toEqual({
      hours: 10,
      minutes: 0,
      amPM: 'am',
      errorMessage: null,
    });

    expect(parseTime('5:30PM')).toEqual({
      hours: 5,
      minutes: 30,
      amPM: 'pm',
      errorMessage: null,
    });
  });
});

describe('parseCalendarTodoText', () => {
  it('separates time and uppercases the first letter of description', () => {
    expect(parseCalendarTodoText(' 9.30 pm - chess lesson  ')).toMatchObject({
      timeStr: '9:30pm',
      description: 'Chess lesson',
      errorMessage: null,
    });
  });

  it('trims the description', () => {
    expect(
      parseCalendarTodoText('  9.30pm\t    chess lesson  \n\n')
    ).toMatchObject({
      timeStr: '9:30pm',
      description: 'Chess lesson',
      errorMessage: null,
    });
  });

  it('treats `-`s in the start of a description as a whitespace', () => {
    expect(
      parseCalendarTodoText('9.30pm - chess lesson - Jonathan')
    ).toMatchObject({
      timeStr: '9:30pm',
      description: 'Chess lesson - Jonathan',
      errorMessage: null,
    });
  });

  it('allows `:` as separator', () => {
    expect(parseCalendarTodoText('8:30am chess lesson')).toMatchObject({
      timeStr: '8:30am',
      description: 'Chess lesson',
      errorMessage: null,
    });
  });

  it('allows `,` as separator', () => {
    expect(parseCalendarTodoText('8,30am chess lesson')).toMatchObject({
      timeStr: '8:30am',
      description: 'Chess lesson',
      errorMessage: null,
    });
  });

  it('adds :00 when minutes are missing', () => {
    expect(parseCalendarTodoText('9pm chess lesson')).toMatchObject({
      timeStr: '9:00pm',
      description: 'Chess lesson',
      errorMessage: null,
    });
  });

  it('allows extra 0 for am times', () => {
    expect(parseCalendarTodoText('09.30am chess lesson')).toMatchObject({
      timeStr: '9:30am',
      description: 'Chess lesson',
      errorMessage: null,
    });
  });

  it('allows whitespace before am/pm', () => {
    expect(parseCalendarTodoText('8:30 pm chess lesson')).toMatchObject({
      timeStr: '8:30pm',
      description: 'Chess lesson',
      errorMessage: null,
    });
  });

  it('accepts 24 hours format', () => {
    expect(parseCalendarTodoText('09:30 chess lesson')).toMatchObject({
      timeStr: '9:30am',
      description: 'Chess lesson',
      errorMessage: null,
    });

    expect(parseCalendarTodoText('15:40 chess lesson')).toMatchObject({
      timeStr: '3:40pm',
      description: 'Chess lesson',
      errorMessage: null,
    });
  });

  it('sets timeStr to null when missing', () => {
    expect(parseCalendarTodoText('12 - eggs in a basket')).toMatchObject({
      timeStr: null,
      description: '12 - eggs in a basket',
      errorMessage: null,
    });

    expect(parseCalendarTodoText('8.30pmchess lessons')).toMatchObject({
      timeStr: null,
      description: '8.30pmchess lessons',
      errorMessage: null,
    });
  });

  it('sets description to null when missing', () => {
    expect(parseCalendarTodoText('8:30am  ')).toMatchObject({
      timeStr: '8:30am',
      description: null,
      errorMessage: null,
    });
  });

  it('sets timeStr and description to null when missing', () => {
    expect(parseCalendarTodoText('  ')).toMatchObject({
      timeStr: null,
      description: null,
      errorMessage: null,
    });
  });

  it('sets timeStr to null when hours are invalid', () => {
    expect(parseCalendarTodoText('0:00am chess lesson')).toMatchObject({
      timeStr: null,
      description: '0:00am chess lesson',
      errorMessage: 'Invalid time',
    });

    expect(parseCalendarTodoText('13:00pm chess lesson')).toMatchObject({
      timeStr: null,
      description: '13:00pm chess lesson',
      errorMessage: 'Invalid time',
    });
  });

  it('sets timeStr to null when minutes are invalid', () => {
    expect(parseCalendarTodoText('12:60pm chess lesson')).toMatchObject({
      timeStr: null,
      description: '12:60pm chess lesson',
      errorMessage: 'Invalid time',
    });
  });

  it('sets timeStr to null when time is ambiguous', () => {
    expect(parseCalendarTodoText('8:00 chess lesson')).toMatchObject({
      timeStr: null,
      description: '8:00 chess lesson',
      errorMessage: 'am or pm?',
    });
  });
});

describe('isCalendarTodoValid', () => {
  it('valid', () => {
    expect(isCalendarTodoValid({ text: '9.30pm chess lesson' })).toBe(true);
    expect(isCalendarTodoValid({ text: '2 chess lessons' })).toBe(true);
    expect(isCalendarTodoValid({ text: 'Big party' })).toBe(true);
  });

  it('invalid', () => {
    expect(isCalendarTodoValid({ text: '' })).toBe(false);
    expect(isCalendarTodoValid({ text: '  ' })).toBe(false);
    expect(isCalendarTodoValid({ text: '9.30pm ' })).toBe(false);
  });
});

describe('getCalendarTodoHelperText', () => {
  it('no time specified', () => {
    expect(
      getCalendarTodoHelperText({ timeStr: null, errorMessage: null })
    ).toEqual({
      text: NO_TIME_SPECIFIED_MESSAGE,
      type: 'normal',
    });
  });

  it('time is specified', () => {
    expect(
      getCalendarTodoHelperText({ timeStr: '5:30pm', errorMessage: null })
    ).toEqual({
      text: '5:30pm',
      type: 'normal',
    });
  });

  it('error', () => {
    expect(
      getCalendarTodoHelperText({ timeStr: '5:30', errorMessage: 'am or pm?' })
    ).toEqual({
      text: 'am or pm?',
      type: 'error',
    });
  });
});
