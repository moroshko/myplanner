import React, { useEffect, useCallback, useContext } from 'react';
import ShoppingCategoriesList from './ShoppingCategoriesList';
import { AppContext } from '../reducer';
import {
  getShoppingCategories,
  subscribeToShoppingCategoriesUpdates,
} from './shoppingCategoriesAPI';
import { ERROR_DIALOG } from '../constants';

function ShoppingCategoriesMain() {
  const { state, dispatchChange } = useContext(AppContext);
  const { shoppingCategories } = state;
  const onUpdate = useCallback(({ shoppingCategories }) => {
    dispatchChange({
      type: 'UPDATE_SHOPPING_CATEGORIES',
      shoppingCategories,
    });
  }, []);
  const onUpdateError = useCallback(error => {
    // Just swallowing the error here since Dialogs are not visible
    // to logged out users.
  }, []);

  useEffect(() => {
    getShoppingCategories()
      .then(shoppingCategories => {
        dispatchChange({
          type: 'ADD_SHOPPING_CATEGORIES',
          shoppingCategories,
        });
      })
      .catch(error => {
        dispatchChange({
          type: 'SHOW_DIALOG',
          dialogName: ERROR_DIALOG,
          dialogData: {
            errorMessage: error.message,
          },
        });
      });
  }, []);

  useEffect(() => {
    return subscribeToShoppingCategoriesUpdates({
      onUpdate,
      onError: onUpdateError,
    });
  }, []);

  return shoppingCategories === null ? null : (
    <ShoppingCategoriesList shoppingCategories={shoppingCategories} />
  );
}

export default ShoppingCategoriesMain;
