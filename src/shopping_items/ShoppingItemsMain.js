import React, { useEffect, useCallback, useContext } from 'react';
import ShoppingItemsList from './ShoppingItemsList';
import { AppContext } from '../reducer';
import {
  getShoppingCategories,
  subscribeToShoppingCategoriesUpdates,
} from '../shopping_categories/shoppingCategoriesAPI';
import {
  getGroupedShoppingItems,
  subscribeToGroupedShoppingItemsUpdates,
} from './shoppingItemsAPI';
import { ERROR_DIALOG } from '../constants';

function ShoppingItemsMain() {
  const { state, dispatchChange } = useContext(AppContext);
  const { shoppingCategories, groupedShoppingItems } = state;
  const onCategoriesUpdate = useCallback(({ shoppingCategories }) => {
    dispatchChange({
      type: 'UPDATE_SHOPPING_CATEGORIES',
      shoppingCategories,
    });
  }, []);
  const onCategoriesUpdateError = useCallback(error => {
    // Just swallowing the error here since Dialogs are not visible
    // to logged out users.
  }, []);
  const onItemsUpdate = useCallback(({ groupedShoppingItems }) => {
    dispatchChange({
      type: 'UPDATE_GROUPED_SHOPPING_ITEMS',
      groupedShoppingItems,
    });
  }, []);
  const onItemsUpdateError = useCallback(error => {
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
      onUpdate: onCategoriesUpdate,
      onError: onCategoriesUpdateError,
    });
  }, []);

  useEffect(() => {
    getGroupedShoppingItems()
      .then(groupedShoppingItems => {
        dispatchChange({
          type: 'ADD_GROUPED_SHOPPING_ITEMS',
          groupedShoppingItems,
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
    return subscribeToGroupedShoppingItemsUpdates({
      onUpdate: onItemsUpdate,
      onError: onItemsUpdateError,
    });
  }, []);

  return shoppingCategories === null || groupedShoppingItems === null ? null : (
    <ShoppingItemsList
      shoppingCategories={shoppingCategories}
      groupedShoppingItems={groupedShoppingItems}
    />
  );
}

export default ShoppingItemsMain;
