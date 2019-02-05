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
import Label from '../shared/Label';
import Select from '../shared/DropDown';
import { AppContext } from '../reducer';
import { isShoppingItemValid } from './shoppingItemsUtils';
import { updateShoppingItem, deleteShoppingItem } from './shoppingItemsAPI';
import { getCategorySelectOptionsPromise } from '../shopping_categories/shoppingCategoriesUtils';
import { ERROR_DIALOG } from '../constants';
import './EditShoppingItemDialog.css';

function EditShoppingItemDialog() {
  const { state, dispatchChange } = useContext(AppContext);
  const { openDialogData } = state;
  const [name, setName] = useState(openDialogData.shoppingItem.name);
  const [shoppingCategoryId, setShoppingCategoryId] = useState(
    openDialogData.shoppingItem.shoppingCategoryId
  );
  const onDelete = useCallback(() => {
    deleteShoppingItem({
      id: openDialogData.shoppingItem.id,
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
  }, [openDialogData.shoppingItem.id]);
  const onSave = useCallback(() => {
    if (!isShoppingItemValid({ name, shoppingCategoryId })) {
      return;
    }

    updateShoppingItem({
      id: openDialogData.shoppingItem.id,
      name,
      shoppingCategoryId,
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
  }, [name, shoppingCategoryId]);

  return (
    <Dialog onSubmit={onSave}>
      <DialogHeader title="Edit Shopping Item" />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. Cucumbers"
          value={name}
          onChange={setName}
        />
        <div className="EditShoppingItemDialogCategoryContainer">
          <div className="EditShoppingItemDialogCategoryLabelContainer">
            <Label text="Category:" />
          </div>
          <div className="EditShoppingItemDialogCategorySelectContainer">
            <Select
              getOptionsPromise={getCategorySelectOptionsPromise}
              value={shoppingCategoryId}
              onChange={setShoppingCategoryId}
            />
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <DialogButton danger leftAlign text="Delete" onClick={onDelete} />
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton
          disabled={!isShoppingItemValid({ name, shoppingCategoryId })}
          text="Save"
        />
      </DialogFooter>
    </Dialog>
  );
}

export default EditShoppingItemDialog;
