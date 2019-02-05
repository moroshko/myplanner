const STRING = 0;
const BOOLEAN = 1;
const PREFIX = 'my-planner::';
const FIREBASE_APP_NAME = 'firebaseAppName';
const ACTIVE_PAGE = 'activePage';
const TODOS_OWNER_FILTER = 'todosOwnerFilter';
const IS_SHOPPING = 'isShopping';

function getPrefixedKey(key) {
  return `${PREFIX}${key}`;
}

function setLocalStorageItem(key, value) {
  if (
    value !== null &&
    typeof value !== 'string' &&
    typeof value !== 'boolean'
  ) {
    throw new Error(
      'Currently, only null, string, and boolean values can be stored in local storage.'
    );
  }

  if (value === null) {
    localStorage.removeItem(getPrefixedKey(key));
  } else {
    localStorage.setItem(getPrefixedKey(key), String(value));
  }
}

function getLocalStorageItem(key, type, defaultValue) {
  const value = localStorage.getItem(getPrefixedKey(key));

  if (value === null) {
    return defaultValue;
  }

  if (type === STRING) {
    return value;
  }

  if (type === BOOLEAN) {
    return value === String(true);
  }

  throw new Error(`Unknown local storage type: ${type}`);
}

function getFirebaseAppNameFromLocalStorage(defaultValue) {
  return getLocalStorageItem(FIREBASE_APP_NAME, STRING, defaultValue);
}

function setFirebaseAppNameToLocalStorage(value) {
  setLocalStorageItem(FIREBASE_APP_NAME, value);
}

function getActivePageFromLocalStorage(defaultValue) {
  return getLocalStorageItem(ACTIVE_PAGE, STRING, defaultValue);
}

function setActivePageToLocalStorage(value) {
  setLocalStorageItem(ACTIVE_PAGE, value);
}

function getTodosOwnerFilterFromLocalStorage(defaultValue) {
  return getLocalStorageItem(TODOS_OWNER_FILTER, STRING, defaultValue);
}

function setTodosOwnerFilterToLocalStorage(value) {
  setLocalStorageItem(TODOS_OWNER_FILTER, value);
}

function getIsShoppingFromLocalStorage(defaultValue) {
  return getLocalStorageItem(IS_SHOPPING, BOOLEAN, defaultValue);
}

function setIsShoppingToLocalStorage(value) {
  setLocalStorageItem(IS_SHOPPING, value);
}

export {
  getFirebaseAppNameFromLocalStorage,
  setFirebaseAppNameToLocalStorage,
  getActivePageFromLocalStorage,
  setActivePageToLocalStorage,
  getTodosOwnerFilterFromLocalStorage,
  setTodosOwnerFilterToLocalStorage,
  getIsShoppingFromLocalStorage,
  setIsShoppingToLocalStorage,
};
