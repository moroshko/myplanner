import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from 'react';
import sortBy from 'lodash.sortby';
import ShoppingListItemsGroup from './ShoppingListItemsGroup';
import EmptyMessage from '../shared/EmptyMessage';
import { List } from '../shared/list-components';
import {
  getGroupedShoppingListItems,
  subscribeToGroupedShoppingListItemsUpdates,
} from '../shopping/shoppingListAPI';
import { AppContext } from '../reducer';
import { setIsShoppingToLocalStorage } from '../localStorage';
import { ERROR_DIALOG, SHOPPING_CATEGORY_CHECKED_ITEMS_ID } from '../constants';

function ShoppingList() {
  const [highlightedItemsMap, setHighlightedItemsMap] = useState({});

  // Keep track of the latest `highlightedItemsMap`
  // We need it because in `setTimeout` below we need access to the latest `highlightedItemsMap`.
  const latestHighlightedItemsMap = useRef(null);

  useEffect(() => {
    latestHighlightedItemsMap.current = highlightedItemsMap;
  });

  const { state, dispatchChange } = useContext(AppContext);
  const { groupedShoppingListItems, isShopping } = state;
  const shoppingListItemsToDisplay = useMemo(() => {
    if (groupedShoppingListItems === null) {
      return null;
    }

    if (!isShopping) {
      return groupedShoppingListItems;
    }

    const result = [];
    let allCheckedShoppingListItems = [];

    groupedShoppingListItems.forEach(
      ({ shoppingCategory, shoppingListItems }) => {
        const checkedShoppingListItems = shoppingListItems.filter(
          shoppingListItem => shoppingListItem.checkTimestamp != null
        );

        if (checkedShoppingListItems.length < shoppingListItems.length) {
          // There are unchecked items!
          result.push({
            shoppingCategory,
            shoppingListItems: shoppingListItems.filter(
              shoppingListItem => shoppingListItem.checkTimestamp == null
            ),
          });
        }

        allCheckedShoppingListItems = allCheckedShoppingListItems.concat(
          checkedShoppingListItems
        );
      }
    );

    if (allCheckedShoppingListItems.length > 0) {
      allCheckedShoppingListItems = sortBy(allCheckedShoppingListItems, [
        // descending checkTimestamp order
        shoppintListItem => -shoppintListItem.checkTimestamp,
      ]);

      result.push({
        shoppingCategory: {
          id: SHOPPING_CATEGORY_CHECKED_ITEMS_ID,
          index: Number.MAX_SAFE_INTEGER,
          name: 'Checked Items',
        },
        shoppingListItems: allCheckedShoppingListItems,
      });
    }

    return result;
  }, [groupedShoppingListItems, isShopping]);
  const onCheckboxClick = useCallback(
    shoppingListItemId => {
      setHighlightedItemsMap({
        ...highlightedItemsMap,
        [shoppingListItemId]: true,
      });

      setTimeout(() => {
        setHighlightedItemsMap({
          ...latestHighlightedItemsMap.current,
          [shoppingListItemId]: false,
        });
      }, 3000);
    },
    [highlightedItemsMap]
  );
  const onUpdate = useCallback(
    ({ groupedShoppingListItems }) => {
      dispatchChange({
        type: 'UPDATE_GROUPED_SHOPPING_LIST_ITEMS',
        groupedShoppingListItems,
      });

      if (isShopping && groupedShoppingListItems.length === 0) {
        dispatchChange({
          type: 'UPDATE_IS_SHOPPING',
          isShopping: false,
        });

        setIsShoppingToLocalStorage(false);
      }
    },
    [isShopping]
  );
  const onUpdateError = useCallback(error => {
    // Just swallowing the error here since Dialogs are not visible
    // to logged out users.
  }, []);

  useEffect(() => {
    getGroupedShoppingListItems()
      .then(groupedShoppingListItems => {
        dispatchChange({
          type: 'ADD_GROUPED_SHOPPING_LIST_ITEMS',
          groupedShoppingListItems,
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
    return subscribeToGroupedShoppingListItemsUpdates({
      onUpdate,
      onError: onUpdateError,
    });
  }, []);

  if (shoppingListItemsToDisplay === null) {
    return null;
  }

  if (!isShopping && shoppingListItemsToDisplay.length === 0) {
    return (
      <EmptyMessage>
        Nothing to buy.
        <br />
        Search above to add items.
      </EmptyMessage>
    );
  }

  return (
    <List>
      {shoppingListItemsToDisplay.map(
        ({ shoppingCategory, shoppingListItems }) => (
          <ShoppingListItemsGroup
            shoppingCategory={shoppingCategory}
            shoppingListItems={shoppingListItems}
            highlightedItemsMap={isShopping ? highlightedItemsMap : {}}
            onCheckboxClick={onCheckboxClick}
            key={shoppingCategory.id}
          />
        )
      )}
    </List>
  );
}

export default ShoppingList;
