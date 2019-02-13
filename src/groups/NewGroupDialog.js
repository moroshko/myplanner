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
import { isGroupValid } from './groupsUtils';
import { createGroup } from './groupsAPI';
import { ERROR_DIALOG } from '../constants';

function NewDialogDialog() {
  const { dispatchChange } = useContext(AppContext);
  const [name, setName] = useState('');
  const onSubmit = useCallback(() => {
    if (!isGroupValid({ name })) {
      return;
    }

    createGroup({
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
      <DialogHeader title="New Group" />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. moroshko"
          value={name}
          onChange={setName}
        />
      </DialogContent>
      <DialogFooter>
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton disabled={!isGroupValid({ name })} text="Create" />
      </DialogFooter>
    </Dialog>
  );
}

export default NewDialogDialog;
