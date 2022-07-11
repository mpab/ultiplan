import React, { ChangeEvent, useState } from "react";

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
import { TaskRecord, taskRecordFromDescription } from "../api/types";
import { stringIsNullOrEmpty } from "../utils";
import { Add } from "@mui/icons-material";

const TasksAddDialog = (props: {
  setOpenDialog: (mode: boolean) => void;
  openDialog: boolean;
  onConfirmHandler: (task: TaskRecord) => void;
}) => {
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  const handleClickOpen = () => {
    props.setOpenDialog(true);
  };

  const handleConfirm = () => {
    props.setOpenDialog(false);
    const task = taskRecordFromDescription(description);
    props.onConfirmHandler(task);
  };

  const isFormInvalid = stringIsNullOrEmpty(description);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setDescriptionError(stringIsNullOrEmpty(e.target.value) ? 'description cannot be empty' : '');
    setDescription(e.target.value);
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
        onClose={handleDialogClose}
        aria-labelledby="add-form-dialog-title"
        fullWidth
        maxWidth={'md'}
        BackdropProps={{style: {backgroundColor: 'transparent'}}}
      >
        <DialogTitle id="add-form-dialog-title">Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={description}
            helperText={descriptionError}
            multiline
            rows={5}
            onChange={(e) => handleInputChange(e)}
          />
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