import React, { useContext } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogCloseButton,
} from './dialog-components';
import { AppContext } from '../reducer';

function ErrorDialog() {
  const { state } = useContext(AppContext);
  const { openDialogData } = state;

  return (
    <Dialog>
      <DialogHeader title="Error" />
      <DialogContent>{openDialogData.errorMessage}</DialogContent>
      <DialogFooter>
        <DialogCloseButton text="OK" />
      </DialogFooter>
    </Dialog>
  );
}

export default ErrorDialog;
