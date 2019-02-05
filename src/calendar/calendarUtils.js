import memoize from 'lodash.memoize';
import { parse, format, addDays } from 'date-fns';
import { uppercaseFirstLetter } from '../shared/sharedUtils';
import {
  TIME_12_HOURS_FORMAT,
  TIME_12_HOURS_WITHOUT_MINUTES_FORMAT,
  TIME_24_HOURS_FORMAT,
  INVALID_TIME,
  NO_TIME_SPECIFIED_MESSAGE,
} from '../constants';

function getEmptyCalendarDays({ fromDate, days }) {
  return Array.from({ length: days }, (_, offset) => {
    const date = addDays(fromDate, offset);

    return {
      date,
      todos: [],
    };
  });
}

function timeStrTo24hours(timeStr) {
  const date = parse(timeStr, TIME_12_HOURS_FORMAT, new Date());

  if (isNaN(date.getTime())) {
    return INVALID_TIME;
  }

  return format(date, TIME_24_HOURS_FORMAT);
}

function timeStrTo12hours(timeStr) {
  const date = parse(timeStr, TIME_24_HOURS_FORMAT, new Date());

  if (isNaN(date.getTime())) {
    return INVALID_TIME;
  }

  return format(date, TIME_12_HOURS_FORMAT).toLowerCase();
}

function isInvalidDate(date) {
  return isNaN(date.getTime());
}

const TIME_REGEX_PATTERN = '\\s*(\\d{1,2})([:.,](\\d{2}))?\\s*(am|pm)?\\s*';
const TIME_REGEX = new RegExp(`^${TIME_REGEX_PATTERN}$`, 'i');
/*
  input: '12:30am'

  matches:
    [0] '12:30am'
    [1] '12'
    [2] ':30'
    [3] '30'
    [4] 'am'
*/

const invalidTime = {
  hours: null,
  minutes: null,
  amPM: null,
  errorMessage: 'Invalid time',
};

function parseTime(timeStr) {
  const matches = timeStr.match(TIME_REGEX);

  if (matches === null) {
    return invalidTime;
  }

  const amPM = matches[4] || null;

  if (matches[2] == null && amPM === null) {
    return invalidTime;
  }

  const cleanTimeStr = timeStr.replace(/\s+/g, '').replace(/[.,]/, ':');
  const date12 = parse(cleanTimeStr, TIME_12_HOURS_FORMAT, new Date());
  const date12withoutMinutes = parse(
    cleanTimeStr,
    TIME_12_HOURS_WITHOUT_MINUTES_FORMAT,
    new Date()
  );
  const date24 = parse(cleanTimeStr, TIME_24_HOURS_FORMAT, new Date());

  if (
    isInvalidDate(date12) &&
    isInvalidDate(date12withoutMinutes) &&
    isInvalidDate(date24)
  ) {
    return invalidTime;
  }

  const hoursStr = matches[1];
  const hours = Number(hoursStr);
  const minutesStr = matches[3] || '00';
  const minutes = Number(minutesStr);

  if (amPM === null) {
    const dateAM = parse(`${cleanTimeStr}am`, TIME_12_HOURS_FORMAT, new Date());
    const datePM = parse(`${cleanTimeStr}pm`, TIME_12_HOURS_FORMAT, new Date());

    if (
      hoursStr[0] !== '0' &&
      !isInvalidDate(dateAM) &&
      !isInvalidDate(datePM)
    ) {
      return {
        hours,
        minutes,
        amPM,
        errorMessage: 'am or pm?',
      };
    }

    return {
      hours: hours > 12 ? hours - 12 : hours,
      minutes,
      amPM: format(date24, 'a').toLowerCase(),
      errorMessage: null,
    };
  }

  return {
    hours,
    minutes,
    amPM: amPM.toLowerCase(),
    errorMessage: null,
  };
}

const TODO_REGEX = new RegExp(`^(${TIME_REGEX_PATTERN})([\\s-]+(.*))?$`, 'i');
/*
  input: ' 9.30 pm - chess lesson  '

  matches:
    [0] '9.30 pm - chess lesson'
    [1] '9.30 pm '
    [2] '9'
    [3] '.30'
    [4] '30'
    [5] 'pm'
    [6] '- chess lesson'
    [7] 'chess lesson'
*/

function parseCalendarTodoText(text) {
  const trimmedText = text.trim();
  const cleanText = trimmedText ? uppercaseFirstLetter(trimmedText) : null;
  const matches = trimmedText.match(TODO_REGEX);

  if (matches === null) {
    // No time specified
    return {
      timeStr: null,
      description: cleanText,
      errorMessage: null,
    };
  }

  const timeStr = matches[1];

  if (/^\d+\s*$/.test(timeStr)) {
    // Description starts with a number
    return {
      timeStr: null,
      description: cleanText,
      errorMessage: null,
    };
  }

  const { hours, minutes, amPM, errorMessage } = parseTime(timeStr);

  if (errorMessage !== null) {
    return {
      timeStr: null,
      description: cleanText,
      errorMessage,
    };
  }

  const hoursStr = String(hours);
  const minutesStr = String(minutes).padStart(2, '0');
  const description = matches[7] ? uppercaseFirstLetter(matches[7]) : null;

  return {
    timeStr: `${hoursStr}:${minutesStr}${amPM}`,
    description,
    errorMessage: null,
  };
}

const isCalendarTodoValid = memoize(({ text }) => {
  const { description, errorMessage } = parseCalendarTodoText(text);

  return errorMessage === null && description !== null;
});

function getCalendarTodoHelperText({ timeStr, errorMessage }) {
  return {
    text:
      errorMessage !== null
        ? errorMessage
        : timeStr !== null
        ? timeStr
        : NO_TIME_SPECIFIED_MESSAGE,
    type: errorMessage === null ? 'normal' : 'error',
  };
}

export {
  getEmptyCalendarDays,
  timeStrTo24hours,
  timeStrTo12hours,
  parseTime,
  parseCalendarTodoText,
  isCalendarTodoValid,
  getCalendarTodoHelperText,
};
