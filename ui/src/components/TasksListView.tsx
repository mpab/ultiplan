import {
  Box,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";
import { useEffect, useState } from "react";
import { taskCreate, taskDelete, tasksRead, taskUpdate } from "../api/tasks";

import { TaskRecord, TaskStatus, TaskView } from "../api/types";
import { EditOutlined } from "@mui/icons-material";
import { dateYYYYMMDD, stringIsNullOrEmpty } from "../utils";
import TasksDeleteDialog from "./TasksDeleteDialog";
import TasksAddDialog from "./TasksAddDialog";

const taskRecordToTaskView = (r: TaskRecord): TaskView => {
  let date = "unknown";
  let status = TaskStatus.unknown;

  if (r.created_on) {
    status = TaskStatus.not_started;
    date = r.created_on + ` [created]`;
  }

  if (r.started_on) {
    status = TaskStatus.in_progress;
    date = r.created_on + ` [started]`;
  }

  if (r.completed_on) {
    status = TaskStatus.completed;
    date = r.completed_on + ` [done]`;
  }

  let summary = "";
  if (!stringIsNullOrEmpty(r.id)) {
    summary += `id: ${r.id}, `;
  }

  if (!stringIsNullOrEmpty(r.project)) {
    summary += `project: ${r.project}, `;
  }

  if (!stringIsNullOrEmpty(r.created_on)) {
    summary += `created: ${r.created_on}, `;
  }

  if (!stringIsNullOrEmpty(r.started_on)) {
    summary += `started: ${r.started_on}, `;
  }

  if (!stringIsNullOrEmpty(r.completed_on)) {
    summary += `completed: ${r.completed_on}, `;
  }

  if (!stringIsNullOrEmpty(r.due_on)) {
    summary += `due: ${r.due_on}, `;
  }

  // TODO
  // calculate if overdue

  summary = summary.slice(0, summary.length - 2);

  return {
    taskRecord: r,
    date: date,
    status: status,
    summary: summary,
  };
};

export const TasksListView = () => {
  // ------------------------------------------------------------
  // Dialogs
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  // const handleOpenAddDialog = () => {
  //   setOpenAddDialog(true);
  // };

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  // const handleOpenDeleteDialog = () => {
  //   setOpenDeleteDialog(true);
  // };

  // -----------------------------------------------------
  // records get/set
  const [records, setRecords] = useState<TaskRecord[]>([]);

  const [summary, setSummary] = useState<string>("");

  useEffect(() => {
    tasksRead(setRecords, setSummary);
  }, []);

  // -----------------------------------------------------

  const Row = (props: { row: ReturnType<typeof taskRecordToTaskView> }) => {
    // -----------------------------------------------------
    // expander
    const { row } = props;
    const [open, setOpen] = useState(false);

    // -----------------------------------------------------

    const handleDeleteTaskRequest = (taskView: TaskView) => {
      if (stringIsNullOrEmpty(taskView.taskRecord.id)) {
        return;
      }

      taskDelete(taskView.taskRecord.id);
      tasksRead(setRecords, setSummary);
      taskDelete(taskView.taskRecord.id);
      tasksRead(setRecords, setSummary);
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

      if (stringIsNullOrEmpty(description)) {
        //alert(`empty descriptions are not allowed`);
        return;
      }

      taskView.taskRecord.description = description as string;
      taskUpdate(taskView.taskRecord);
      tasksRead(setRecords, setSummary);
      tasksRead(setRecords, setSummary);
    };

    const TasksStatusSelect = () => {
      //const taskStatusMap = enumToMap(TaskStatus); //Map of keys to values
      let tasksStatusArray = Object.values(TaskStatus).filter(
        (ts) => ts !== TaskStatus.unknown
      );

      // state machine
      // not_started -> started
      // not_started -> completed
      if (row.status === TaskStatus.not_started) {
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.not_started
        );
      }

      // in_progress -> completed
      if (row.status === TaskStatus.in_progress) {
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.not_started
        );
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.in_progress
        );
      }

      const handleTaskStatusChange = (event: SelectChangeEvent) => {
        const newTaskStatus = event.target.value as TaskStatus;
        //setTaskStatus(newTaskStatus);

        switch (newTaskStatus) {
          case TaskStatus.completed:
            row.taskRecord.completed_on = dateYYYYMMDD(new Date());
            break;

          case TaskStatus.in_progress:
            row.taskRecord.started_on = dateYYYYMMDD(new Date());
            break;
        }

        taskUpdate(row.taskRecord);
        tasksRead(setRecords, setSummary);
        tasksRead(setRecords, setSummary);
      };

      return (
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            {row.status === TaskStatus.completed ||
            row.status === TaskStatus.unknown ? (
              <>
                <TextField
                  value={row.status}
                  InputProps={{
                    readOnly: true,
                  }}
                ></TextField>
              </>
            ) : (
              <>
                <InputLabel>{row.status}</InputLabel>
                <Select
                  labelId="task-status-select-label"
                  id="task-status-select-label-id"
                  label={row.status}
                  onChange={handleTaskStatusChange}
                >
                  {tasksStatusArray.map((e) => (
                    <MenuItem value={e}>{e}</MenuItem>
                  ))}
                </Select>
              </>
            )}
          </FormControl>
        </Box>
      );
    };

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <IconButton
              aria-label="edit task"
              size="small"
              onClick={(event) => handleEditTaskRequest(row)}
            >
              {stringIsNullOrEmpty(row.taskRecord.completed_on) &&
              !stringIsNullOrEmpty(row.taskRecord.id) ? (
                <EditOutlined />
              ) : (
                <></>
              )}
            </IconButton>
            {row.taskRecord.description}
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <TasksStatusSelect />
          </TableCell>
          <TableCell>{row.date}</TableCell>
          <TableCell>
            <TasksDeleteDialog
              openDialog={openDeleteDialog}
              setOpenDialog={setOpenDeleteDialog}
              onConfirmHandler={() => handleDeleteTaskRequest(row)}
              taskRecord={row.taskRecord}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="details">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th">{row.summary}</TableCell>
                    </TableRow>
                    {row.taskRecord.tags.map((tagRow, id) => (
                      <TableRow key={id}>
                        <TableCell component="th" scope="row">
                          - {tagRow}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  // -----------------------------------------------------

  const TableHeader = () => {
    const addTask = (task: TaskRecord) => {
      if (task.description) {
        taskCreate(task);
        tasksRead(setRecords, setSummary);
        tasksRead(setRecords, setSummary);
      }
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell>
            <TasksAddDialog
              openDialog={openAddDialog}
              setOpenDialog={setOpenAddDialog}
              onConfirmHandler={addTask}
            />
          </TableCell>
          <TableCell>Project: {summary}</TableCell>
          <TableCell />
          <TableCell>Status</TableCell>
          <TableCell>Date</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
    );
  };

  // -----------------------------------------------------
  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // -----------------------------------------------------

  let height = rowsPerPage <= 10 ? rowsPerPage * 90 : 900;
  //height =
  //  document.body.clientHeight < height ? document.body.clientHeight : height;

  return (
    <React.Fragment>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer component={Paper} sx={{ maxHeight: height }}>
          <Table stickyHeader aria-label="collapsible table">
            <TableHeader />
            <TableBody>
              {records
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record, key) => (
                  <Row key={key} row={taskRecordToTaskView(record)} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={records.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
        />
      </Paper>
    </React.Fragment>
  );
};
