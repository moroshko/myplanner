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
import { AppContext } from '../reducer';
import { isShoppingCategoryValid } from './shoppingCategoriesUtils';
import { createShoppingCategory } from './shoppingCategoriesAPI';
import { ERROR_DIALOG } from '../constants';

function NewShoppingCategoryDialog() {
  const { dispatchChange } = useContext(AppContext);
  const [name, setName] = useState('');
  const onSubmit = useCallback(() => {
    if (!isShoppingCategoryValid({ name })) {
      return;
    }

    createShoppingCategory({
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
  }, [name]);

  return (
    <Dialog onSubmit={onSubmit}>
      <DialogHeader title="New Shopping Category" />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. Fruits & Vegetables"
          value={name}
          onChange={setName}
        />
      </DialogContent>
      <DialogFooter>
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton
          disabled={!isShoppingCategoryValid({ name })}
          text="Create"
        />
      </DialogFooter>
    </Dialog>
  );
}

export default NewShoppingCategoryDialog;
