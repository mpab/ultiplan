import React from "react";

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
import { TaskRecord, TaskStatus, TaskView } from "../api/types";
import { stringIsNullOrEmpty } from "../utils";
import { DeleteOutline } from "@mui/icons-material";

const TasksDeleteDialog = (props: {
  setOpenDialog: (mode: boolean) => void;
  openDialog: boolean;
  onConfirmHandler: (taskRecord: TaskRecord) => void;
  taskView: TaskView;
}) => {
  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  const handleClickOpen = () => {
    props.setOpenDialog(true);
  };

  const handleConfirm = () => {
    props.setOpenDialog(false);
    props.onConfirmHandler(props.taskView.taskRecord);
  };

  return (
    <React.Fragment>
      <Tooltip title="delete a task">
        <IconButton
          aria-label="delete task"
          size="small"
          onClick={handleClickOpen}
        >
          {!stringIsNullOrEmpty(props.taskView.taskRecord.completed_on) ||
          !stringIsNullOrEmpty(props.taskView.taskRecord.started_on) ||
          props.taskView.status === TaskStatus.unknown ? (
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
            {props.taskView.taskRecord.description}
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
