import React, { useState, useContext, useCallback } from 'react';
import { format } from 'date-fns';
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
import { createCalendarTodo } from './calendarAPI';
import {
  parseCalendarTodoText,
  isCalendarTodoValid,
  getCalendarTodoHelperText,
} from '../calendar/calendarUtils';
import { ERROR_DIALOG } from '../constants';

function NewCalendarTodoDialog() {
  const [text, setText] = useState('');
  const [helperText, setHelperText] = useState(
    getCalendarTodoHelperText({ timeStr: null, errorMessage: null })
  );
  const { state, dispatchChange } = useContext(AppContext);
  const { openDialogData } = state;
  const onTextChange = useCallback(text => {
    const { timeStr, errorMessage } = parseCalendarTodoText(text);

    setHelperText(getCalendarTodoHelperText({ timeStr, errorMessage }));
    setText(text);
  }, []);
  const onSubmit = useCallback(() => {
    if (!isCalendarTodoValid({ text })) {
      return;
    }

    createCalendarTodo({
      date: openDialogData.date,
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
  }, [openDialogData.date, text]);

  return (
    <Dialog onSubmit={onSubmit}>
      <DialogHeader
        title="New Todo"
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
        <DialogCloseButton text="Cancel" />
        <DialogSubmitButton
          disabled={!isCalendarTodoValid({ text })}
          text="Create"
        />
      </DialogFooter>
    </Dialog>
  );
}

export default NewCalendarTodoDialog;
