import React, { useState, useContext, useCallback } from 'react';
import { format } from 'date-fns';
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
import { deleteCalendarTodo, updateCalendarTodo } from './calendarAPI';
import {
  parseCalendarTodoText,
  isCalendarTodoValid,
  getCalendarTodoHelperText,
} from '../calendar/calendarUtils';
import { ERROR_DIALOG } from '../constants';

function EditCalendarTodoDialog() {
  const { state, dispatchChange } = useContext(AppContext);
  const { openDialogData } = state;
  const defaultText =
    (openDialogData.todo.timeStr === null
      ? ''
      : `${openDialogData.todo.timeStr} `) + openDialogData.todo.description;
  const [text, setText] = useState(defaultText);
  const { timeStr, errorMessage } = parseCalendarTodoText(text);
  const [helperText, setHelperText] = useState(
    getCalendarTodoHelperText({ timeStr, errorMessage })
  );
  const onTextChange = useCallback(text => {
    const { timeStr, errorMessage } = parseCalendarTodoText(text);

    setHelperText(getCalendarTodoHelperText({ timeStr, errorMessage }));
    setText(text);
  }, []);
  const onDelete = useCallback(() => {
    deleteCalendarTodo({
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
    if (!isCalendarTodoValid({ text })) {
      return;
    }

    updateCalendarTodo({
      id: openDialogData.todo.id,
      text,
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
  }, [openDialogData.todo.id, text]);

  return (
    <Dialog onSubmit={onSave}>
      <DialogHeader
        title="Edit Todo"
        helperText={format(openDialogData.date, 'd E')}
      />
      <DialogContent>
        <DialogTextInput
          placeholder="e.g. 5.30pm chess lesson"
          value={text}
          onChange={onTextChange}
          helperText={helperText.text}
          helperTextType={helperText.type}
        />
      </DialogContent>
      <DialogFooter>
        <DialogButton danger leftAlign text="Delete" onClick={onDelete} />
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton
          disabled={!isCalendarTodoValid({ text })}
          text="Save"
        />
      </DialogFooter>
    </Dialog>
  );
}

export default EditCalendarTodoDialog;
