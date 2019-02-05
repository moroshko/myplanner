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
  updateShoppingCategory,
  deleteShoppingCategory,
} from './shoppingCategoriesAPI';
import { isShoppingCategoryValid } from './shoppingCategoriesUtils';
import { ERROR_DIALOG } from '../constants';

function EditShoppingCategoryDialog() {
  const { state, dispatchChange } = useContext(AppContext);
  const { openDialogData } = state;
  const [name, setName] = useState(openDialogData.shoppingCategory.name);
  const onDelete = useCallback(() => {
    deleteShoppingCategory({
      id: openDialogData.shoppingCategory.id,
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
  }, [openDialogData.shoppingCategory.id]);
  const onSave = useCallback(() => {
    if (!isShoppingCategoryValid({ name })) {
      return;
    }

    updateShoppingCategory({
      id: openDialogData.shoppingCategory.id,
      name,
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
  }, [openDialogData.shoppingCategory.id, name]);

  return (
    <Dialog onSubmit={onSave}>
      <DialogHeader title="Edit Shopping Category" />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. Fruits & Vegetables"
          value={name}
          onChange={setName}
        />
      </DialogContent>
      <DialogFooter>
        <DialogButton danger leftAlign text="Delete" onClick={onDelete} />
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton
          disabled={!isShoppingCategoryValid({ name })}
          text="Save"
        />
      </DialogFooter>
    </Dialog>
  );
}

export default EditShoppingCategoryDialog;
