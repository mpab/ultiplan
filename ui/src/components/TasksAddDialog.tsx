import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { TaskRecord, taskRecordFromDescription } from "../api/types";
import { stringIsNullOrEmptyOrWhitespace } from "../utils";
import { Add } from "@mui/icons-material";
import { TaskEditViewPanel } from "./TasksEditViewPanel";

const TasksAddDialog = (props: {
  setOpenDialog: (mode: boolean) => void;
  openDialog: boolean;
  onTaskRecordEditComplete: (taskRecord: TaskRecord) => void;
}) => {
  const [taskRecord, setTaskRecord] = useState(taskRecordFromDescription(``));
  const [confirmIsDisabled, setConfirmIsDisabled] = useState(true);

  const onDialogClose = () => {
    props.setOpenDialog(false);
  };

  const handleClickOpen = () => {
    props.setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (stringIsNullOrEmptyOrWhitespace(taskRecord.description)) {
      alert('empty description');
      return;
    }

    onDialogClose();
    props.onTaskRecordEditComplete(taskRecord);
  };

  const onTaskRecordChange = (newTaskRecord: TaskRecord): void => {
    setTaskRecord(newTaskRecord);
    setConfirmIsDisabled(stringIsNullOrEmptyOrWhitespace(taskRecord.description));
  };

  return (
    <React.Fragment>
      <Tooltip title="add a new task">
        <IconButton aria-label="add" onClick={handleClickOpen}>
          <Add />
        </IconButton>
      </Tooltip>
      <Dialog
        open={props.openDialog}
        onClose={onDialogClose}
        aria-labelledby="add-form-dialog-title"
        fullWidth
        maxWidth={"md"}
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
      >
        <DialogTitle id="add-form-dialog-title">Add Task</DialogTitle>
        <DialogContent>
          <TaskEditViewPanel
            {...{
              taskRecord,
              onTaskRecordChange,
              onTaskRecordEditComplete: handleConfirm,
              isExpanded: true,
            }}
          ></TaskEditViewPanel>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirm}
            color="primary"
            disabled={confirmIsDisabled}
          >
            Confirm
          </Button>
          <Button onClick={onDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default TasksAddDialog;
