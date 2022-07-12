import React, { ChangeEvent, useEffect, useState } from "react";

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
import { stringIsNullOrEmpty } from "../utils";
import { Add } from "@mui/icons-material";
import { TaskEditViewPanel } from "./TasksEditViewPanel";

const TasksAddDialog = (props: {
  setOpenDialog: (mode: boolean) => void;
  openDialog: boolean;
  onConfirmHandler: (task: TaskRecord) => void;
}) => {
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [tags, setTags] = useState(Array<string>());

  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  const handleClickOpen = () => {
    props.setOpenDialog(true);
  };

  const handleConfirm = () => {
    props.setOpenDialog(false);
    const task = taskRecordFromDescription(description);
    task.tags = tags;
    props.onConfirmHandler(task);
  };

  const handleEndEdit = () => {
    console.log("TasksAddDialog end edit");
  };

  const isFormInvalid = stringIsNullOrEmpty(description);

  return (
    <React.Fragment>
      <Tooltip title="add a new task">
        <IconButton aria-label="add" onClick={handleClickOpen}>
          <Add />
        </IconButton>
      </Tooltip>
      <Dialog
        open={props.openDialog}
        onClose={handleDialogClose}
        aria-labelledby="add-form-dialog-title"
        fullWidth
        maxWidth={"md"}
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
      >
        <DialogTitle id="add-form-dialog-title">Add Task</DialogTitle>
        <DialogContent>
          <TaskEditViewPanel
            {...{
              description,
              setDescription,
              descriptionError,
              setDescriptionError,
              tags,
              setTags,
              handleEndEdit,
              isExpanded: true
            }}
          ></TaskEditViewPanel>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirm}
            color="primary"
            disabled={isFormInvalid}
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

export default TasksAddDialog;
