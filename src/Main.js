import React, { useEffect, useRef, useCallback, useContext } from 'react';
import classNames from 'classnames';
import { onAuthStateChanged } from './authAPI';
import { AppContext } from './reducer';
import Login from './login/Login';
import NewGroupHeader from './new_group/NewGroupHeader';
import NewGroupMain from './new_group/NewGroupMain';
import DebugInfo from './DebugInfo';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarMain from './calendar/CalendarMain';
import TodosHeader from './todos/TodosHeader';
import TodosMain from './todos/TodosMain';
import ShoppingHeader from './shopping/ShoppingHeader';
import ShoppingMain from './shopping/ShoppingMain';
import ShoppingItemsHeader from './shopping_items/ShoppingItemsHeader';
import ShoppingItemsMain from './shopping_items/ShoppingItemsMain';
import ShoppingCategoriesHeader from './shopping_categories/ShoppingCategoriesHeader';
import ShoppingCategoriesMain from './shopping_categories/ShoppingCategoriesMain';
import SettingsHeader from './settings/SettingsHeader';
import SettingsMain from './settings/SettingsMain';
import Footer from './Footer';
import ErrorDialog from './shared/ErrorDialog';
import NewCalendarTodoDialog from './calendar/NewCalendarTodoDialog';
import EditCalendarTodoDialog from './calendar/EditCalendarTodoDialog';
import NewTodoDialog from './todos/NewTodoDialog';
import EditTodoDialog from './todos/EditTodoDialog';
import NewShoppingItemDialog from './shopping_items/NewShoppingItemDialog';
import EditShoppingItemDialog from './shopping_items/EditShoppingItemDialog';
import NewShoppingCategoryDialog from './shopping_categories/NewShoppingCategoryDialog';
import EditShoppingCategoryDialog from './shopping_categories/EditShoppingCategoryDialog';
import EditShoppingListItemDialog from './shopping/EditShoppingListItemDialog';
import DeleteCheckedShoppingListItemsConfirmationDialog from './shopping/DeleteCheckedShoppingListItemsConfirmationDialog';
import {
  ERROR_DIALOG,
  NEW_CALENDAR_TODO_DIALOG,
  EDIT_CALENDAR_TODO_DIALOG,
  NEW_TODO_DIALOG,
  EDIT_TODO_DIALOG,
  NEW_SHOPPING_ITEM_DIALOG,
  EDIT_SHOPPING_ITEM_DIALOG,
  NEW_SHOPPING_CATEGORY_DIALOG,
  EDIT_SHOPPING_CATEGORY_DIALOG,
  EDIT_SHOPPING_LIST_ITEM_DIALOG,
  DELETE_CHECKED_SHOPPING_LIST_ITEMS_CONFIRMATION_DIALOG,
  MAX_WIDTH,
  LOGIN_PAGE,
  NEW_GROUP_PAGE,
  CALENDAR_PAGE,
  TODOS_PAGE,
  SHOPPING_PAGE,
  SHOPPING_ITEMS_PAGE,
  SHOPPING_CATEGORIES_PAGE,
  SETTINGS_PAGE,
} from './constants';
import './Main.css';

function Main() {
  const { state, dispatchChange } = useContext(AppContext);
  const {
    loadingUser,
    activePage,
    isHeaderMenuOpen,
    isAutoSuggestOpen,
    openDialogName,
    openDialogData,
  } = state;
  const isFooterVisible =
    [LOGIN_PAGE, NEW_GROUP_PAGE].includes(activePage) === false;
  const onOverlayClick = useCallback(() => {
    dispatchChange({
      type: 'HIDE_OVERLAY',
    });

    openDialogData && openDialogData.onClose && openDialogData.onClose();
  }, [openDialogData]);
  const calendarMainRef = useRef();

  useEffect(() => {
    return onAuthStateChanged(user => {
      dispatchChange({
        type: 'UPDATE_USER',
        user,
      });
    });
  }, []);

  return (
    <div className="MainContainer" style={{ maxWidth: MAX_WIDTH }}>
      {loadingUser ? null : (
        <>
          <DebugInfo />
          {activePage === LOGIN_PAGE && <Login />}
          {activePage === NEW_GROUP_PAGE && (
            <>
              <NewGroupHeader />
              <NewGroupMain />
            </>
          )}
          {activePage === CALENDAR_PAGE && (
            <>
              <CalendarHeader
                onTitleClick={() => {
                  calendarMainRef.current.scrollToToday();
                }}
              />
              <CalendarMain ref={calendarMainRef} />
            </>
          )}
          {activePage === TODOS_PAGE && (
            <>
              <TodosHeader />
              <TodosMain />
            </>
          )}
          {activePage === SHOPPING_PAGE && (
            <>
              <ShoppingHeader />
              <ShoppingMain />
            </>
          )}
          {activePage === SHOPPING_ITEMS_PAGE && (
            <>
              <ShoppingItemsHeader />
              <ShoppingItemsMain />
            </>
          )}
          {activePage === SHOPPING_CATEGORIES_PAGE && (
            <>
              <ShoppingCategoriesHeader />
              <ShoppingCategoriesMain />
            </>
          )}
          {activePage === SETTINGS_PAGE && (
            <>
              <SettingsHeader />
              <SettingsMain />
            </>
          )}
          {isFooterVisible && <Footer />}
          {(isHeaderMenuOpen ||
            isAutoSuggestOpen ||
            openDialogName !== null) && (
            <div
              className={classNames('MainOverlay', {
                MainOverlayTransparent: isHeaderMenuOpen || isAutoSuggestOpen,
              })}
              onClick={onOverlayClick}
            >
              {openDialogName === ERROR_DIALOG && <ErrorDialog />}
              {openDialogName === NEW_CALENDAR_TODO_DIALOG && (
                <NewCalendarTodoDialog />
              )}
              {openDialogName === EDIT_CALENDAR_TODO_DIALOG && (
                <EditCalendarTodoDialog />
              )}
              {openDialogName === NEW_TODO_DIALOG && <NewTodoDialog />}
              {openDialogName === EDIT_TODO_DIALOG && <EditTodoDialog />}
              {openDialogName === NEW_SHOPPING_ITEM_DIALOG && (
                <NewShoppingItemDialog />
              )}
              {openDialogName === EDIT_SHOPPING_ITEM_DIALOG && (
                <EditShoppingItemDialog />
              )}
              {openDialogName === NEW_SHOPPING_CATEGORY_DIALOG && (
                <NewShoppingCategoryDialog />
              )}
              {openDialogName === EDIT_SHOPPING_CATEGORY_DIALOG && (
                <EditShoppingCategoryDialog />
              )}
              {openDialogName === EDIT_SHOPPING_LIST_ITEM_DIALOG && (
                <EditShoppingListItemDialog />
              )}
              {openDialogName ===
                DELETE_CHECKED_SHOPPING_LIST_ITEMS_CONFIRMATION_DIALOG && (
                <DeleteCheckedShoppingListItemsConfirmationDialog />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Main;
