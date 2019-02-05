import React, { useState, useContext, useCallback } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTextInput,
  DialogFooter,
  DialogCloseButton,
  DialogButton,
  DialogSubmitButton,
} from '../shared/dialog-components';
import { AppContext } from '../reducer';
import {
  updateShoppingListItemNote,
  deleteShoppingListItem,
} from './shoppingListAPI';
import { isShoppingListItemValid } from './shoppingListItemsUtils';
import { ERROR_DIALOG } from '../constants';

function EditTodoDialog() {
  const { state, dispatchChange } = useContext(AppContext);
  const { openDialogData } = state;
  const [note, setNote] = useState(openDialogData.shoppingListItem.note || '');
  const onDelete = useCallback(() => {
    deleteShoppingListItem({
      id: openDialogData.shoppingListItem.id,
    }).catch(error => {
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
  }, [openDialogData.shoppingListItem.id]);
  const onSave = useCallback(() => {
    if (!isShoppingListItemValid({ note })) {
      return;
    }

    updateShoppingListItemNote({
      id: openDialogData.shoppingListItem.id,
      note,
    }).catch(error => {
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
  }, [openDialogData.shoppingListItem.id, note]);

  return (
    <Dialog onSubmit={onSave}>
      <DialogHeader title={`${openDialogData.shoppingListItem.name} note`} />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. 2 bags"
          value={note}
          onChange={setNote}
        />
      </DialogContent>
      <DialogFooter>
        <DialogButton danger leftAlign text="Remove" onClick={onDelete} />
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton
          disabled={!isShoppingListItemValid({ note })}
          text="Save"
        />
      </DialogFooter>
    </Dialog>
  );
}

export default EditTodoDialog;
