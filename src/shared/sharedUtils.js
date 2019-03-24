import { startOfDay } from 'date-fns';

function getNow() {
  return new Date();
}

function getToday() {
  return startOfDay(getNow());
}

function getCssVariable(name) {
  return getComputedStyle(document.body).getPropertyValue(name);
}

function timestamp() {
  return Math.floor(Date.now() / 1000);
}

function pluralize(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function uppercaseFirstLetter(str) {
  return str.length === 0 ? '' : str[0].toUpperCase() + str.slice(1);
}

function uppercaseFirstLetterOfEveryWord(str) {
  return str
    .trim()
    .split(/\s+/)
    .map(uppercaseFirstLetter)
    .join(' ');
}

function isDebugInfoVisible(user) {
  return user && user.email === 'michael.moroshko@gmail.com';
}

const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

export {
  getNow,
  getToday,
  getCssVariable,
  timestamp,
  pluralize,
  uppercaseFirstLetter,
  uppercaseFirstLetterOfEveryWord,
  isDebugInfoVisible,
  isMobile,
};
