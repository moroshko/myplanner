import React, { useContext, useCallback } from 'react';
import DialogButton from './DialogButton';
import { AppContext } from '../../reducer';

function DialogCloseButton({ text }) {
  const { state, dispatchChange } = useContext(AppContext);
  const { openDialogData } = state;
  const closeDialog = useCallback(() => {
    dispatchChange({
      type: 'CLOSE_DIALOG',
    });

    openDialogData && openDialogData.onClose && openDialogData.onClose();
  }, [openDialogData]);

  return <DialogButton text={text} onClick={closeDialog} />;
}

export default DialogCloseButton;
