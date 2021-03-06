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
import {
  taskNew,
  TaskView,
  viewFromTask,
} from "../api/types";
import { dateYYYYMMDD, stringIsNullOrEmptyOrWhitespace } from "../utils";
import { Add } from "@mui/icons-material";
import { TaskEditViewControl } from "./TasksEditViewControl";

const TasksAddDialog = (props: {
  setOpenDialog: (mode: boolean) => void;
  openDialog: boolean;
  onTaskViewEditComplete: (taskView: TaskView) => void;
}) => {
  const template = taskNew("");
  template.created_on = dateYYYYMMDD(new Date());
  const [cachedTaskView, setCachedTaskView] = useState(
    viewFromTask(template)
  );
  const [confirmIsDisabled, setConfirmIsDisabled] = useState(true);

  const onDialogClose = () => {
    props.setOpenDialog(false);
  };

  const handleClickOpen = () => {
    props.setOpenDialog(true);
  };

  const onTaskViewEditComplete = (taskView: TaskView) => {
    if (stringIsNullOrEmptyOrWhitespace(taskView.taskRecord.description)) {
      alert("empty description");
      return;
    }

    onDialogClose();
    props.onTaskViewEditComplete(taskView);
  };

  const onTaskViewChange = (taskView: TaskView): void => {
    setConfirmIsDisabled(
      stringIsNullOrEmptyOrWhitespace(taskView.taskRecord.description)
    );
    setCachedTaskView(taskView);
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
          <TaskEditViewControl
            forceEdit={true}
            taskView={cachedTaskView}
            onTaskViewChange={onTaskViewChange}
            onTaskViewEditComplete={onTaskViewEditComplete}
            isExpanded={true}
          ></TaskEditViewControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onTaskViewEditComplete(cachedTaskView)}
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
