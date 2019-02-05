import React, { useState, useContext, useCallback } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTextInput,
  DialogFooter,
  DialogCloseButton,
  DialogSubmitButton,
} from '../shared/dialog-components';
import Label from '../shared/Label';
import Select from '../shared/DropDown';
import { AppContext } from '../reducer';
import { isShoppingItemValid } from './shoppingItemsUtils';
import { createShoppingItem } from './shoppingItemsAPI';
import { getCategorySelectOptionsPromise } from '../shopping_categories/shoppingCategoriesUtils';
import { ERROR_DIALOG } from '../constants';
import './NewShoppingItemDialog.css';

function NewShoppingItemDialog() {
  const { dispatchChange } = useContext(AppContext);
  const [name, setName] = useState('');
  const [shoppingCategoryId, setShoppingCategoryId] = useState(null);
  const onSubmit = useCallback(() => {
    if (!isShoppingItemValid({ name, shoppingCategoryId })) {
      return;
    }

    createShoppingItem({
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
    <Dialog onSubmit={onSubmit}>
      <DialogHeader title="New Shopping Item" />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. Cucumbers"
          value={name}
          onChange={setName}
        />
        <div className="NewShoppingItemDialogCategoryContainer">
          <div className="NewShoppingItemDialogCategoryLabelContainer">
            <Label text="Category:" />
          </div>
          <div className="NewShoppingItemDialogCategorySelectContainer">
            <Select
              getOptionsPromise={getCategorySelectOptionsPromise}
              value={shoppingCategoryId}
              onChange={setShoppingCategoryId}
            />
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton
          disabled={!isShoppingItemValid({ name, shoppingCategoryId })}
          text="Create"
        />
      </DialogFooter>
    </Dialog>
  );
}

export default NewShoppingItemDialog;
