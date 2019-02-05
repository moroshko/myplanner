import React, { useContext, useCallback } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogCloseButton,
  DialogSubmitButton,
} from '../shared/dialog-components';
import { pluralize } from '../shared/sharedUtils';
import { AppContext } from '../reducer';
import { deleteAllCheckedShoppingListItems } from './shoppingListAPI';
import { setIsShoppingToLocalStorage } from '../localStorage';
import { ERROR_DIALOG } from '../constants';

function EditTodoDialog() {
  const { state, dispatchChange } = useContext(AppContext);
  const { openDialogData } = state;
  const { checkedItemsCount } = openDialogData;
  const onRemove = useCallback(() => {
    deleteAllCheckedShoppingListItems()
      .then(uncheckedCount => {
        if (uncheckedCount === 0) {
          dispatchChange({
            type: 'UPDATE_IS_SHOPPING',
            isShopping: false,
          });

          setIsShoppingToLocalStorage(false);
        }
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

    dispatchChange({
      type: 'CLOSE_DIALOG',
    });
  }, []);

  return (
    <Dialog onSubmit={onRemove}>
      <DialogHeader title="Are You Sure?" />
      <DialogContent>
        This will remove the{' '}
        {pluralize(checkedItemsCount, 'checked shopping item')} from the
        shopping list.
      </DialogContent>
      <DialogFooter>
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton text="Remove" />
      </DialogFooter>
    </Dialog>
  );
}

export default EditTodoDialog;
