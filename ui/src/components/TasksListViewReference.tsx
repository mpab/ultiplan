import React, { useState } from "react";
import MaterialTable, { Column } from "@material-table/core";
import { Container } from "@mui/material";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { TaskView } from "../api/types";
import { readAllTasks, TasksApiReadCfg } from "../api/TaskTransactions";
import tableIcons from "./TableIcons";
import { useEffectOnce } from "../useEffectOnce";

const columns: Array<Column<TaskView>> = [
  //{ title: "Id", field: "id" },
  { title: "Description", field: "taskRecord.description" },
  { title: "Created", field: "taskRecord.created_on" },
  { title: "Completed", field: "taskRecord.completed_on" },
  { title: "Due", field: "taskRecord.due_on" },
  { title: "Status", field: "status" },
];

export const TasksListViewReference = () => {
  // -----------------------------------------------------
  //
  // Tasks CRUD and dependencies
  //
  const [views, setViews] = useState<TaskView[]>([]);
  const [summary, setSummary] = useState(``);

  useEffectOnce(() => {
    const cfg: TasksApiReadCfg = {
      success: (msg) => alert(`success\n` + msg),
      error: (msg) => alert(`error\n` + msg),
      setViews: setViews,
      setSummary: setSummary,
    };

    readAllTasks(cfg);
  });

  // -----------------------------------------------------

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  React.useEffect(() => {
    // Closes dialog after saving
    if (isDialogOpen) {
      setIsDialogOpen(false);
    }
  }, [isDialogOpen]);

  <MaterialTable
    columns={columns}
    data={views}
    icons={tableIcons}
    options={{
    }}
    title={"Tasks"}
    // actions={[
    //   {
    //     icon: tableIcons.Delete,
    //     tooltip: "Delete Task",
    //     onClick: (event, rowData) => tasks.deleteTask(rowData as TaskView),
    //   },
    //   {
    //     icon: Add,
    //     tooltip: "Add Task",
    //     isFreeAction: true,

    //     onClick: (event) => tasks.createTask(viewFromTask(taskNew(""))),
    //   },
    //   {
    //     icon: Edit,
    //     tooltip: "Edit Task",
    //     onClick: (event, rowData) => tasks.updateTask(rowData as TaskView),
    //   },
    // ]}
  />;

  return (
    <Container>
      <MaterialTable
        columns={columns}
        data={views}
        detailPanel={({ rowData }) => {
          return (
            <div
              style={{
                fontSize: 20,
                textAlign: "center",
                height: 100,
              }}
            >
              This is a detailed panel for {rowData.taskRecord.description}
            </div>
          );
        }}
      />

      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Add a new Task</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter a description</DialogContentText>
          <TextField
            autoFocus
            id="name"
            label="description"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
