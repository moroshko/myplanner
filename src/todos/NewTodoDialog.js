import React, { useState, useContext, useCallback } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTextInput,
  DialogOwnerPicker,
  DialogFooter,
  DialogCloseButton,
  DialogSubmitButton,
} from '../shared/dialog-components';
import { AppContext } from '../reducer';
import { isTodoValid } from '../todos/todosUtils';
import { createTodo } from './todosAPI';
import { ERROR_DIALOG } from '../constants';

function NewTodoDialog() {
  const { state, dispatchChange } = useContext(AppContext);
  const { todosOwnerFilter } = state;
  const [description, setDescription] = useState('');
  const [ownerUid, setOwnerUid] = useState(todosOwnerFilter);
  const onSubmit = useCallback(() => {
    if (!isTodoValid({ description, ownerUid })) {
      return;
    }

    createTodo({
      description,
      ownerUid,
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
  }, [description, ownerUid]);

  return (
    <Dialog onSubmit={onSubmit}>
      <DialogHeader title="New Todo" />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. Buy headphones"
          value={description}
          onChange={setDescription}
        />
        <DialogOwnerPicker value={ownerUid} onChange={setOwnerUid} />
      </DialogContent>
      <DialogFooter>
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton
          disabled={!isTodoValid({ description, ownerUid })}
          text="Create"
        />
      </DialogFooter>
    </Dialog>
  );
}

export default NewTodoDialog;
