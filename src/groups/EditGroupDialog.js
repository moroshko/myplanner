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
import { updateGroup } from './groupsAPI';
import { isGroupValid } from './groupsUtils';
import { ERROR_DIALOG } from '../constants';

function EditGroupDialog() {
  const { state, dispatchChange } = useContext(AppContext);
  const { openDialogData } = state;
  const [name, setName] = useState(openDialogData.group.name);
  const onSave = useCallback(() => {
    if (!isGroupValid({ name })) {
      return;
    }

    updateGroup({
      id: openDialogData.group.id,
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
  }, [openDialogData.group.id, name]);

  return (
    <Dialog onSubmit={onSave}>
      <DialogHeader title="Edit Group" />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. your last name"
          value={name}
          onChange={setName}
          helperText="Should contain a-z and _ only, start with a letter, and be at least 2 characters long."
        />
      </DialogContent>
      <DialogFooter>
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton disabled={!isGroupValid({ name })} text="Save" />
      </DialogFooter>
    </Dialog>
  );
}

export default EditGroupDialog;
