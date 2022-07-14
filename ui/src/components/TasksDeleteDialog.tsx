import React, { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { TaskStatus, TaskView } from "../api/types";
import { stringIsNullOrEmpty } from "../utils";
import { DeleteOutline } from "@mui/icons-material";

const TasksDeleteDialog = (props: {
  setOpenDialog: (mode: boolean) => void;
  openDialog: boolean;
  onConfirmHandler: (taskView: TaskView) => void;
  taskView: TaskView;
}) => {

  //alert(props.taskView.taskRecord.description);

  const [tv, stv] = useState(props.taskView);
  //alert(tv.taskRecord.description);

  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  const handleClickOpen = () => {
    props.setOpenDialog(true);
  };

  const handleConfirm = () => {
    props.setOpenDialog(false);
    props.onConfirmHandler(tv);
  };

  return (
    <React.Fragment>
      <Tooltip title="delete a task">
        <IconButton
          aria-label="delete task"
          size="small"
          onClick={handleClickOpen}
        >
          {!stringIsNullOrEmpty(tv.taskRecord.completed_on) ||
          !stringIsNullOrEmpty(tv.taskRecord.started_on) ||
          tv.status === TaskStatus.unknown ? (
            <></>
          ) : (
            <DeleteOutline color="error" />
          )}
        </IconButton>
      </Tooltip>
      <Dialog
        open={props.openDialog}
        onClose={handleDialogClose}
        aria-labelledby="delete-form-dialog-title"
        fullWidth
        maxWidth={'md'}
        BackdropProps={{style: {backgroundColor: 'transparent'}}}
      >
        <DialogTitle id="delete-form-dialog-title">Confirm delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
          {tv.taskRecord.id}
            {tv.taskRecord.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default TasksDeleteDialog;
