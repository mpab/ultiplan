import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider, withSnackbar } from 'notistack';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  success: function (msg) {
    this.toast(msg, 'success');
  },
  toast: function (msg, variant) {
    const Display = withSnackbar(({ message, enqueueSnackbar }) => {
      enqueueSnackbar(message, { variant });
      return null;
    });
    const mountPoint = document.getElementById('snackbarhelper');
    ReactDOM.render(
      <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}>
        <Display message={msg} variant={variant} />
      </SnackbarProvider>,
      mountPoint)
  }
}