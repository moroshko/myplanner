import React, { useState, useCallback, useContext } from 'react';
import { Spring, animated } from 'react-spring';
import { CheckboxIcon } from '../icons';
import { ListItem, ListItemButton } from '../shared/list-components';
import { AppContext } from '../reducer';
import {
  checkShoppingListItem,
  uncheckShoppingListItem,
} from './shoppingListAPI';
import { EDIT_SHOPPING_LIST_ITEM_DIALOG, ERROR_DIALOG } from '../constants';
import './ShoppingListItem.css';

function ShoppingListItem({
  shoppingListItem,
  isHighlighted,
  onCheckboxClick,
}) {
  const { id, name, note, checkTimestamp } = shoppingListItem;
  const isChecked = checkTimestamp != null;
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatchChange } = useContext(AppContext);
  const { isShopping } = state;
  const onEditButtonClick = useCallback(() => {
    dispatchChange({
      type: 'SHOW_DIALOG',
      dialogName: EDIT_SHOPPING_LIST_ITEM_DIALOG,
      dialogData: {
        shoppingListItem,
      },
    });
  }, [shoppingListItem]);
  const _onCheckboxClick = useCallback(() => {
    setIsLoading(true);
    onCheckboxClick(id);

    if (isChecked) {
      uncheckShoppingListItem({
        id,
      })
        .catch(error => {
          dispatchChange({
            type: 'SHOW_DIALOG',
            dialogName: ERROR_DIALOG,
            dialogData: {
              errorMessage: error.message,
            },
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      checkShoppingListItem({
        id,
      })
        .catch(error => {
          dispatchChange({
            type: 'SHOW_DIALOG',
            dialogName: ERROR_DIALOG,
            dialogData: {
              errorMessage: error.message,
            },
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isChecked, onCheckboxClick]);

  return (
    <ListItem checked={isChecked} highlighted={isHighlighted}>
      <ListItemButton
        secondaryText={note}
        disabled={isShopping}
        onClick={onEditButtonClick}
      >
        {name}
      </ListItemButton>
      <Spring
        native
        force
        from={{
          display: isShopping ? 'none' : 'flex',
          opacity: isShopping ? 0 : 1,
        }}
        to={{
          display: isShopping ? 'flex' : 'none',
          opacity: isShopping ? 1 : 0,
        }}
      >
        {props => (
          <animated.button
            className="ShoppingListItemCheckbox"
            disabled={isLoading}
            style={props}
            onClick={_onCheckboxClick}
          >
            <CheckboxIcon checked={isChecked} loading={isLoading} />
          </animated.button>
        )}
      </Spring>
    </ListItem>
  );
}

export default ShoppingListItem;
