import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
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

  const handleConfirm = (event: any) => {
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
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirm Task Delete</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={props.taskView.taskRecord.description}
            multiline
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirm}
            color="primary"
          >
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