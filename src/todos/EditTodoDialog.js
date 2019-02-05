import React, { useState, useContext, useCallback } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTextInput,
  DialogOwnerPicker,
  DialogFooter,
  DialogCloseButton,
  DialogButton,
  DialogSubmitButton,
} from '../shared/dialog-components';
import { AppContext } from '../reducer';
import { updateTodo, deleteTodo } from './todosAPI';
import { isTodoValid } from '../todos/todosUtils';
import { ERROR_DIALOG } from '../constants';

function EditTodoDialog() {
  const { state, dispatchChange } = useContext(AppContext);
  const { openDialogData } = state;
  const [description, setDescription] = useState(
    openDialogData.todo.description
  );
  const [ownerUid, setOwnerUid] = useState(openDialogData.todo.ownerUid);
  const onDelete = useCallback(() => {
    deleteTodo({
      id: openDialogData.todo.id,
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
  }, [openDialogData.todo.id]);
  const onSave = useCallback(() => {
    if (!isTodoValid({ description, ownerUid })) {
      return;
    }

    updateTodo({
      id: openDialogData.todo.id,
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
  }, [openDialogData.todo.id, description, ownerUid]);

  return (
    <Dialog onSubmit={onSave}>
      <DialogHeader title="Edit Todo" />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. Buy headphones"
          value={description}
          onChange={setDescription}
        />
        <DialogOwnerPicker value={ownerUid} onChange={setOwnerUid} />
      </DialogContent>
      <DialogFooter>
        <DialogButton danger leftAlign text="Delete" onClick={onDelete} />
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton
          disabled={!isTodoValid({ description, ownerUid })}
          text="Save"
        />
      </DialogFooter>
    </Dialog>
  );
}

export default EditTodoDialog;
