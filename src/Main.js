import React, { useEffect, useRef, useCallback, useContext } from 'react';
import classNames from 'classnames';
import { onAuthStateChanged } from './authAPI';
import { AppContext } from './reducer';
import { getUserGroup } from './userAPI';
import Login from './Login';
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
import { getFirebaseAppNameFromLocalStorage } from './localStorage';
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
  CALENDAR_PAGE,
  TODOS_PAGE,
  SHOPPING_PAGE,
  SHOPPING_ITEMS_PAGE,
  SHOPPING_CATEGORIES_PAGE,
} from './constants';
import './Main.css';

function App() {
  const { state, dispatchChange } = useContext(AppContext);
  const {
    loadingUser,
    user,
    activePage,
    isHeaderMenuOpen,
    isAutoSuggestOpen,
    openDialogName,
    openDialogData,
  } = state;
  const onOverlayClick = useCallback(() => {
    dispatchChange({
      type: 'HIDE_OVERLAY',
    });

    openDialogData && openDialogData.onClose && openDialogData.onClose();
  }, [openDialogData]);
  const isSameUser = useCallback(
    newUser => {
      return (
        !loadingUser &&
        ((newUser === null && user === null) ||
          (newUser !== null && user !== null && newUser.uid === user.uid))
      );
    },
    [loadingUser, user]
  );
  const authStateUnsubscribe = useRef();

  useEffect(() => {
    // If user === null, we want to subscribe to auth state changes,
    // so that if the user already logged in we skip the login page.
    if (getFirebaseAppNameFromLocalStorage(null) !== null) {
      authStateUnsubscribe.current = onAuthStateChanged(newUser => {
        if (!isSameUser(newUser)) {
          dispatchChange({
            type: 'UPDATE_USER',
            user: newUser,
          });
        }
      });
    }

    if (user !== null) {
      getUserGroup(user.uid).then(userGroup => {
        const owners = userGroup.users.map(owner => ({
          uid: owner.uid,
          name: owner.name,
          photoUrl: owner.photoUrl,
        }));
        const userIndex = owners.findIndex(owner => owner.uid === user.uid);
        const [currentUser] = owners.splice(userIndex, 1);
        const ownersWithCurrentUserFirst = [currentUser, ...owners];
        const todoOwners = [
          {
            uid: null,
            name: null,
            photoUrl: null,
          },
          ...ownersWithCurrentUserFirst,
        ];

        dispatchChange({
          type: 'UPDATE_TODO_OWNERS',
          todoOwners,
        });
      });
    }

    return () => {
      authStateUnsubscribe.current && authStateUnsubscribe.current();
    };
  }, [user]);

  return (
    <div className="MainContainer" style={{ maxWidth: MAX_WIDTH }}>
      {loadingUser ? null : user === null ? (
        <Login />
      ) : (
        <>
          <DebugInfo />
          {activePage === CALENDAR_PAGE && (
            <>
              <CalendarHeader />
              <CalendarMain />
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
          <Footer />
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

export default App;
