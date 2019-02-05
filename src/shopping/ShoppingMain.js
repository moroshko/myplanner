import React, { useEffect, useMemo, useCallback, useContext } from 'react';
import { Spring, animated } from 'react-spring';
import createTrie from 'autosuggest-trie';
import classNames from 'classnames';
import sortBy from 'lodash.sortby';
import ShoppingList from './ShoppingList';
import AutoSuggest from '../shared/AutoSuggest';
import { AddIcon, CheckIcon } from '../icons';
import {
  getGroupedShoppingItems,
  subscribeToGroupedShoppingItemsUpdates,
} from '../shopping_items/shoppingItemsAPI';
import { addShoppingListItem } from './shoppingListAPI';
import { isItemInShoppingList } from './shoppingListItemsUtils';
import { AppContext } from '../reducer';
import { ERROR_DIALOG } from '../constants';
import './ShoppingMain.css';

function ShoppingMain() {
  const { state, dispatchChange } = useContext(AppContext);
  const { groupedShoppingItems, groupedShoppingListItems, isShopping } = state;
  const allSuggestions = useMemo(() => {
    return (groupedShoppingItems || []).reduce(
      (acc, { shoppingItems }) => acc.concat(shoppingItems),
      []
    );
  }, [groupedShoppingItems]);
  const autoCompleteTrie = useMemo(() => createTrie(allSuggestions, 'name'), [
    allSuggestions,
  ]);
  const getSuggestions = useCallback(
    value => {
      const matchedSuggestions = autoCompleteTrie
        .getMatches(value)
        .map(suggestion => ({
          ...suggestion,
          inShoppingList: isItemInShoppingList({
            groupedShoppingListItems,
            shoppingItemId: suggestion.id,
          }),
        }));

      return sortBy(matchedSuggestions, [
        'inShoppingList',
        matchedSuggestion => -matchedSuggestion.popularity,
        'name',
      ]);
    },
    [autoCompleteTrie, groupedShoppingListItems]
  );
  const renderSuggestion = useCallback(suggestion => {
    return (
      <>
        <span className="ShoppingMainSuggestionIcon">
          {suggestion.inShoppingList ? (
            <CheckIcon highlighted />
          ) : (
            <AddIcon backgroundType="light" />
          )}
        </span>
        <span
          className={classNames({
            ShoppingMainSuggestionInShoppingList: suggestion.inShoppingList,
          })}
        >
          {suggestion.name}
        </span>
      </>
    );
  }, []);
  const onSuggestionSelected = useCallback(
    selectedItem => {
      const { id: selectedShoppingItemId } = selectedItem;
      const alreadyInShoppingList = isItemInShoppingList({
        groupedShoppingListItems,
        shoppingItemId: selectedShoppingItemId,
      });

      if (!alreadyInShoppingList) {
        addShoppingListItem({ shoppingItemId: selectedItem.id }).catch(
          error => {
            dispatchChange({
              type: 'SHOW_DIALOG',
              dialogName: ERROR_DIALOG,
              dialogData: {
                errorMessage: error.message,
              },
            });
          }
        );
      }
    },
    [groupedShoppingListItems]
  );
  const onSuggestionsChange = useCallback(suggestions => {
    if (suggestions.length === 0) {
      dispatchChange({
        type: 'HIDE_OVERLAY',
      });
    } else {
      dispatchChange({
        type: 'OPEN_AUTOSUGGEST',
      });
    }
  }, []);
  const onUpdate = useCallback(({ groupedShoppingItems }) => {
    dispatchChange({
      type: 'UPDATE_GROUPED_SHOPPING_ITEMS',
      groupedShoppingItems,
    });
  }, []);
  const onUpdateError = useCallback(error => {
    // Just swallowing the error here since Dialogs are not visible
    // to logged out users.
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
      onUpdate,
      onError: onUpdateError,
    });
  }, []);

  return (
    <div className="ShoppingMain">
      <Spring
        native
        force
        config={{ tension: 2000, friction: 100 }}
        from={{ height: isShopping ? 'auto' : 0 }}
        to={{ height: isShopping ? 0 : 'auto' }}
      >
        {props => (
          <animated.div
            style={{
              ...props,
              flexShrink: 0,
              overflow: isShopping ? 'hidden' : 'visible',
            }}
          >
            <div className="ShoppingMainAutoSuggestContainer">
              <AutoSuggest
                placeholder="What would you like to buy?"
                noSuggestionsMessage="No matches found"
                disabled={
                  groupedShoppingItems === null ||
                  groupedShoppingListItems === null
                }
                getSuggestions={getSuggestions}
                renderSuggestion={renderSuggestion}
                onSuggestionSelected={onSuggestionSelected}
                onSuggestionsChange={onSuggestionsChange}
              />
            </div>
          </animated.div>
        )}
      </Spring>
      <ShoppingList />
    </div>
  );
}

export default ShoppingMain;
