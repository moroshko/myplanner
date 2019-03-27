import React from 'react';
import queryString from 'query-string';
import groupBy from 'lodash.groupby';
import isEqual from 'lodash.isequal';
import { parse, differenceInDays, addDays, subDays } from 'date-fns';
import { getToday } from './shared/sharedUtils';
import { getEmptyCalendarDays } from './calendar/calendarUtils';
import {
  getActivePageFromLocalStorage,
  getTodosOwnerFilterFromLocalStorage,
  getIsShoppingFromLocalStorage,
} from './localStorage';
import {
  STATUS_LOADING,
  STATUS_LOADED,
  DATE_STR_FORMAT,
  ERROR_DIALOG,
  CALENDAR_PAGE,
  TEMP_USER_SETTINGS_CALENDAR_DAYS_BACK,
  EMAIL_VERIFICATION_PAGE,
  NEW_PASSWORD_PAGE,
  TODOS_PAGE,
  SHOPPING_PAGE,
  SIGN_IN_PAGE,
  NEW_ACCOUNT_PAGE,
} from './constants';

function getInitialCalendarState() {
  const today = getToday();
  const firstCalendarDate = subDays(
    today,
    TEMP_USER_SETTINGS_CALENDAR_DAYS_BACK
  );

  return {
    today,
    firstCalendarDate,
    headerDate: today, // Not `firstCalendarDate` because we scroll to today by default.
    calendarData: [],
  };
}

function getInitialTodosState() {
  return {
    todoOwners: null,
    todosOwnerFilter: getTodosOwnerFilterFromLocalStorage(null),
    todos: null,
  };
}

function getInitialShoppingState() {
  return {
    shoppingCategories: null,
    groupedShoppingItems: null,
    groupedShoppingListItems: null,
    isShopping: getIsShoppingFromLocalStorage(false),
  };
}

function getInitialState() {
  const { mode } = queryString.parse(window.location.search);

  return {
    loadingUser: true,
    user: null,
    activePage:
      mode === 'verifyEmail'
        ? EMAIL_VERIFICATION_PAGE
        : mode === 'resetPassword'
        ? NEW_PASSWORD_PAGE
        : null,
    backButtonPage: null,
    isHeaderMenuOpen: false,
    isAutoSuggestOpen: false,
    openDialogName: null,
    openDialogData: null,
    ...getInitialCalendarState(),
    ...getInitialTodosState(),
    ...getInitialShoppingState(),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_USER': {
      const { user } = action;
      let { activePage } = state;

      if (![EMAIL_VERIFICATION_PAGE, NEW_PASSWORD_PAGE].includes(activePage)) {
        activePage = SIGN_IN_PAGE;

        if (user !== null) {
          if (user.emailVerified) {
            activePage = getActivePageFromLocalStorage(CALENDAR_PAGE);
          } else {
            if (state.activePage === NEW_ACCOUNT_PAGE) {
              // user just signed up, wait on NEW_ACCOUNT_PAGE so that the verification email is sent
              activePage = NEW_ACCOUNT_PAGE;
            }
          }
        }
      }

      return {
        ...getInitialState(),
        loadingUser: false,
        user,
        activePage,
      };
    }

    case 'UPDATE_TODO_OWNERS': {
      const { todoOwners } = action;

      return {
        ...state,
        todoOwners,
      };
    }

    case 'UPDATE_TODAY': {
      const today = getToday();

      return {
        ...state,
        today,
      };
    }

    case 'UPDATE_ACTIVE_PAGE': {
      const { activePage, backButtonPage } = action;

      if (activePage === state.activePage) {
        return state;
      }

      let pageSpecificUpdate;

      switch (activePage) {
        case CALENDAR_PAGE: {
          pageSpecificUpdate = getInitialCalendarState();
          break;
        }

        case TODOS_PAGE: {
          pageSpecificUpdate = getInitialTodosState();
          break;
        }

        case SHOPPING_PAGE: {
          pageSpecificUpdate = getInitialShoppingState();
          break;
        }

        default: {
          pageSpecificUpdate = {};
        }
      }

      return {
        ...state,
        activePage,
        backButtonPage: backButtonPage || null,
        isHeaderMenuOpen: false,
        ...pageSpecificUpdate,
      };
    }

    case 'UPDATE_CALENDAR_HEADER_DATE': {
      const { headerDate } = action;

      return {
        ...state,
        headerDate,
      };
    }

    case 'OPEN_HEADER_MENU': {
      return {
        ...state,
        isHeaderMenuOpen: true,
      };
    }

    case 'FOCUS_AUTOSUGGEST': {
      return {
        ...state,
        isAutoSuggestOpen: true,
      };
    }

    case 'BLUR_AUTOSUGGEST': {
      return {
        ...state,
        isAutoSuggestOpen: false,
      };
    }

    case 'HIDE_OVERLAY': {
      return {
        ...state,
        isHeaderMenuOpen: false,
        openDialogName: null,
        openDialogData: null,
      };
    }

    case 'ADD_EMPTY_CALENDAR_DAYS': {
      const { fromDate, days, startIndex, stopIndex } = action;
      const { calendarData } = state;
      const emptyData = getEmptyCalendarDays({ fromDate, days });
      const newCalendarData = [...calendarData];

      for (let i = startIndex; i <= stopIndex; i++) {
        newCalendarData[i] = emptyData[i - startIndex];
        newCalendarData[i].status = STATUS_LOADING;
      }

      return {
        ...state,
        calendarData: newCalendarData,
      };
    }

    case 'ADD_CALENDAR_TODOS': {
      const { todos, startIndex, stopIndex } = action;
      const groupedTodos = groupBy(todos, 'dateStr');
      const { firstCalendarDate, calendarData } = state;
      const newCalendarData = [...calendarData];

      // Mark all retrieved days as LOADED
      for (let i = startIndex; i <= stopIndex; i++) {
        newCalendarData[i] = {
          ...newCalendarData[i],
          status: STATUS_LOADED,
        };

        if (!newCalendarData[i].todos) {
          newCalendarData[i].todos = [];
        }

        if (!newCalendarData[i].date) {
          newCalendarData[i].date = addDays(firstCalendarDate, i);
        }
      }

      // Add the retrieved todos
      Object.keys(groupedTodos).forEach(dateStr => {
        const newDataIndex = differenceInDays(
          parse(dateStr, DATE_STR_FORMAT, firstCalendarDate),
          firstCalendarDate
        );

        newCalendarData[newDataIndex] = {
          ...newCalendarData[newDataIndex],
          todos: groupedTodos[dateStr],
        };
      });

      return {
        ...state,
        calendarData: newCalendarData,
      };
    }

    case 'FAILED_TO_LOAD_CALENDAR_TODOS': {
      const { startIndex, stopIndex, errorMessage } = action;
      const { firstCalendarDate, calendarData } = state;
      const newCalendarData = [...calendarData];

      // Mark all retrieved days as LOADED
      for (let i = startIndex; i <= stopIndex; i++) {
        newCalendarData[i] = {
          ...newCalendarData[i],
          status: STATUS_LOADED,
        };

        if (!newCalendarData[i].todos) {
          newCalendarData[i].todos = [];
        }

        if (!newCalendarData[i].date) {
          newCalendarData[i].date = addDays(firstCalendarDate, i);
        }
      }

      return {
        ...state,
        calendarData: newCalendarData,
        openDialogName: ERROR_DIALOG,
        openDialogData: {
          errorMessage,
        },
      };
    }

    case 'UPDATE_CALENDAR_TODOS': {
      const { startIndex, stopIndex, todos } = action;
      const groupedTodos = groupBy(todos, 'dateStr');
      const { firstCalendarDate, calendarData } = state;
      const newCalendarData = [...calendarData];

      // Clear all updated days from todos
      // (this is needed is case we delete the only todo in a day)
      for (let i = startIndex; i <= stopIndex; i++) {
        newCalendarData[i] = {
          ...newCalendarData[i],
          todos: [],
        };
      }

      // Add all updated todos
      Object.keys(groupedTodos).forEach(dateStr => {
        const newDataIndex = differenceInDays(
          parse(dateStr, DATE_STR_FORMAT, firstCalendarDate),
          firstCalendarDate
        );

        newCalendarData[newDataIndex] = {
          ...newCalendarData[newDataIndex],
          todos: groupedTodos[dateStr],
        };
      });

      return {
        ...state,
        calendarData: newCalendarData,
      };
    }

    case 'SHOW_DIALOG': {
      const { dialogName, dialogData } = action;

      return {
        ...state,
        openDialogName: dialogName,
        openDialogData: dialogData || null,
      };
    }

    case 'CLOSE_DIALOG': {
      return {
        ...state,
        openDialogName: null,
        openDialogData: null,
      };
    }

    case 'ADD_TODOS': {
      const { todos } = action;

      return {
        ...state,
        todos,
      };
    }

    case 'OPTIMISTICALLY_UPDATE_TODOS_INDICES': {
      const { sourceIndex, destinationIndex } = action;
      const { todosOwnerFilter, todos } = state;
      const newTodos = [...todos];
      const ownerFirstIndex = newTodos.findIndex(
        todo => todo.ownerUid === todosOwnerFilter
      );
      const [movingTodo] = newTodos.splice(ownerFirstIndex + sourceIndex, 1);

      newTodos.splice(ownerFirstIndex + destinationIndex, 0, movingTodo);

      // fix all indices of the owner
      for (
        let index = ownerFirstIndex, len = newTodos.length;
        index < len && newTodos[index].ownerUid === todosOwnerFilter;
        index++
      ) {
        newTodos[index] = {
          ...newTodos[index],
          index: index - ownerFirstIndex,
        };
      }

      return {
        ...state,
        todos: newTodos,
      };
    }

    case 'UPDATE_TODOS_OWNER_FILTER': {
      const { todosOwnerFilter } = action;

      return {
        ...state,
        todosOwnerFilter,
      };
    }

    case 'UPDATE_TODOS': {
      const { todos } = action;

      if (isEqual(todos, state.todos)) {
        return state;
      }

      return {
        ...state,
        todos,
      };
    }

    case 'ADD_GROUPED_SHOPPING_ITEMS': {
      const { groupedShoppingItems } = action;

      return {
        ...state,
        groupedShoppingItems,
      };
    }

    case 'UPDATE_GROUPED_SHOPPING_ITEMS': {
      const { groupedShoppingItems } = action;

      if (isEqual(groupedShoppingItems, state.groupedShoppingItems)) {
        return state;
      }

      return {
        ...state,
        groupedShoppingItems,
      };
    }

    case 'ADD_SHOPPING_CATEGORIES': {
      const { shoppingCategories } = action;

      return {
        ...state,
        shoppingCategories,
      };
    }

    case 'OPTIMISTICALLY_UPDATE_SHOPPING_CATEGORIES_INDICES': {
      const { sourceIndex, destinationIndex } = action;
      const { shoppingCategories } = state;
      const newShoppingCategories = [...shoppingCategories];
      const [movingShoppingCategory] = newShoppingCategories.splice(
        sourceIndex,
        1
      );

      newShoppingCategories.splice(destinationIndex, 0, movingShoppingCategory);

      // fix all indices
      for (
        let index = 0, len = newShoppingCategories.length;
        index < len;
        index++
      ) {
        newShoppingCategories[index] = {
          ...newShoppingCategories[index],
          index,
        };
      }

      return {
        ...state,
        shoppingCategories: newShoppingCategories,
      };
    }

    case 'UPDATE_SHOPPING_CATEGORIES': {
      const { shoppingCategories } = action;

      if (isEqual(shoppingCategories, state.shoppingCategories)) {
        return state;
      }

      return {
        ...state,
        shoppingCategories,
      };
    }

    case 'ADD_GROUPED_SHOPPING_LIST_ITEMS': {
      const { groupedShoppingListItems } = action;

      return {
        ...state,
        groupedShoppingListItems,
      };
    }

    case 'UPDATE_GROUPED_SHOPPING_LIST_ITEMS': {
      const { groupedShoppingListItems } = action;

      if (isEqual(groupedShoppingListItems, state.groupedShoppingListItems)) {
        return state;
      }

      return {
        ...state,
        groupedShoppingListItems,
      };
    }

    case 'UPDATE_IS_SHOPPING': {
      const { isShopping } = action;

      return {
        ...state,
        isShopping,
      };
    }

    default: {
      return state;
    }
  }
}

const AppContext = React.createContext(null);

export { getInitialState, reducer, AppContext };
