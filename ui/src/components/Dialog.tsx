import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";

export const CreateCategory = (props: {
  setOpenDialog: (mode: boolean) => void;
  openDialog: boolean;
}) => {
  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };
  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={props.openDialog} // Use value directly here
        onClose={handleDialogClose}
      >
        <DialogTitle>Create Video Category</DialogTitle>
        <DialogContent>
          <TextField />
        </DialogContent>
        <DialogActions>
          <Button>Add Category</Button>
          <Button variant="outlined" onClick={handleDialogClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
