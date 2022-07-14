import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { TaskView } from "../api/types";

export interface TaskDeleteDlgProps {
  setIsVisibleTaskDeleteDlg: (mode: boolean) => void;
  isVisibleTaskDeleteDlg: boolean;
  onClick_TaskDeleteDlg_Confirm: (taskView: TaskView) => void;
  selectedTaskView: TaskView;
}

const TaskDeleteDlg = (props: TaskDeleteDlgProps) => {
  const handleClose = () => {
    props.setIsVisibleTaskDeleteDlg(false);
  };

  const handleConfirm = () => {
    handleClose();
    props.onClick_TaskDeleteDlg_Confirm(props.selectedTaskView);
  };

  return (
      <Dialog
        open={props.isVisibleTaskDeleteDlg}
        onClose={handleClose}
        aria-labelledby="delete-form-dialog-title"
        fullWidth
        maxWidth={'md'}
        BackdropProps={{style: {backgroundColor: 'transparent'}}}
      >
        <DialogTitle id="delete-form-dialog-title">Confirm delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {props.selectedTaskView.taskRecord.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default TaskDeleteDlg;
