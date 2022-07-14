import React, { useEffect, useState } from "react";
import MaterialTable, { Column } from "@material-table/core";
import { Container } from "@mui/material";
import tableIcons from "./TableIcons";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { taskDelete, taskCreate, taskUpdate, tasksRead } from "../api/tasks";

import { TaskRecord, taskRecordFromDescription, TaskView } from "../api/types";
import { stringIsNullOrEmpty } from "../utils";

// type Props = {
//   data: TaskRecord[],
// };

const columns: Array<Column<TaskRecord>> = [
  //{ title: "Id", field: "id" },
  { title: "Description", field: "description" },
  { title: "Project", field: "project" },
  { title: "Created", field: "created_on" },
  { title: "Completed", field: "completed_on" },
  { title: "Due", field: "due_on" },
  { title: "Status", field: "status" },
];

const options = {
  paging: true,
  pageSize: 10,
  emptyRowsWhenPaging: false,
  pageSizeOptions: [10, 20, 50],
};

export const TasksListViewReference = () => {
  // -----------------------------------------------------
  // records get/set
  const [records, setRecords] = useState<TaskRecord[]>([]);
  const [summary, setSummary] = useState<string>("");

  // useEffect(() => {
  //   tasksRead(setRecords, setSummary);
  // }, []);

  // -----------------------------------------------------

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteTaskRequest = (taskView: TaskView) => {
    if (stringIsNullOrEmpty(taskView.taskRecord.id)) {
      return;
    }

    if (
      window.confirm(
        `Delete Task?\n` +
          taskView.taskRecord.id +
          `\n` +
          taskView.taskRecord.description
      )
    ) {
      taskDelete(
        taskView.taskRecord.id,
        () => {},
        () => {},
        () => {}
      );
    }
  };

  const handleNewTaskRequest = () => {
    const description = prompt("Enter description: ", "todo");
    if (description) taskCreate(taskRecordFromDescription(description));
  };

  const handleEditTaskRequest = (taskView: TaskView) => {
    if (stringIsNullOrEmpty(taskView.taskRecord.id)) {
      alert(`task has no id, unable to edit`);
      return;
    }

    const description = prompt(
      "Description: ",
      taskView.taskRecord.description
    );
    if (description) taskUpdate(taskView.taskRecord);
  };

  React.useEffect(() => {
    // Closes dialog after saving
    // if (isDialogOpen) {
    //   setIsDialogOpen(false);
    // }
  }, [isDialogOpen]);

  //   <MaterialTable
  //   columns={columns}
  //   data={data}
  //   icons={tableIcons}
  //   options={{
  //     exportButton: true,
  //   }}
  //   title={"Tasks"}
  //   actions={[
  //     {
  //       icon: tableIcons.Delete,
  //       tooltip: "Delete Task",
  //       onClick: (event, rowData) => handleDeleteTaskRequest(rowData),
  //     },
  //     {
  //       icon: tableIcons.Add,
  //       tooltip: "Add Task",
  //       isFreeAction: true,

  //       onClick: (event) => handleNewTaskRequest(),
  //     },
  //     {
  //       icon: tableIcons.Edit,
  //       tooltip: "Edit Task",
  //       onClick: (event, rowData) => handleEditTaskRequest(rowData),
  //     },
  //   ]}
  // />

  return (
    <Container>
      <MaterialTable
        columns={columns}
        data={records}
        detailPanel={({ rowData }) => {
          return (
            <div
              style={{
                fontSize: 20,
                textAlign: "center",
                height: 100,
              }}
            >
              This is a detailed panel for {rowData.description}
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
