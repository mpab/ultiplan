import {
  Box,
  Button,
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
import React, { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { taskCreate, taskDelete, tasksRead, taskUpdate } from "../api/tasks";

import { TaskRecord, TaskStatus, TaskView } from "../api/types";
import { dateYYYYMMDD, stringIsNullOrEmpty } from "../utils";
import TasksDeleteDialog from "./TasksDeleteDialog";
import TasksAddDialog from "./TasksAddDialog";

import toast from "./Toast";

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
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  // -----------------------------------------------------
  // records get/set
  const [records, setRecords] = useState<TaskRecord[]>([]);

  const [summary, setSummary] = useState<string>("");

  useEffect(() => {
    tasksRead(setRecords, setSummary);
  }, []);

  // -----------------------------------------------------

  const Row = (props: { taskView: TaskView }) => {
    // -----------------------------------------------------
    // expander
    const taskView = props.taskView;
    const [expanderIsOpen, setExpanderIsOpen] = useState(false);

    // -----------------------------------------------------

    const handleDeleteTaskRequest = (taskView: TaskView) => {
      if (stringIsNullOrEmpty(taskView.taskRecord.id)) {
        return;
      }

      taskDelete(taskView.taskRecord.id);
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
      if (taskView.status === TaskStatus.not_started) {
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.not_started
        );
      }

      // in_progress -> completed
      if (taskView.status === TaskStatus.in_progress) {
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.not_started
        );
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.in_progress
        );
      }

      const handleOnChange = (event: SelectChangeEvent) => {
        const newTaskStatus = event.target.value as TaskStatus;
        switch (newTaskStatus) {
          case TaskStatus.completed:
            taskView.taskRecord.completed_on = dateYYYYMMDD(new Date());
            break;

          case TaskStatus.in_progress:
            taskView.taskRecord.started_on = dateYYYYMMDD(new Date());
            break;
        }

        taskUpdate(taskView.taskRecord);
        tasksRead(setRecords, setSummary);
        toast.success(`changed: ${taskView.status} -> ${newTaskStatus}`);
        tasksRead(setRecords, setSummary);
      };

      return (
        <Box sx={{ maxWidth: 140 }}>
          <FormControl fullWidth>
            {taskView.status === TaskStatus.completed ||
            taskView.status === TaskStatus.unknown ? (
              <>
                <TextField
                  value={taskView.status}
                  InputProps={{
                    readOnly: true,
                  }}
                ></TextField>
              </>
            ) : (
              <>
                <InputLabel>{taskView.status}</InputLabel>
                <Select
                  labelId="task-status-select-label"
                  id="task-status-select-label-id"
                  label={taskView.status}
                  onChange={handleOnChange}
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

    const TaskEditCell = () => {
      const [description, setDescription] = useState(
        taskView.taskRecord.description
      );

      const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
      };

      const handleGotFocus = () => {
        //setExpanderIsOpen(true);
      };

      const handleLostFocus = () => {
        //setExpanderIsOpen(false);
        setDescription(taskView.taskRecord.description);
      };

      const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "Enter") {
          return;
        }

        taskView.taskRecord.description = description;
        taskUpdate(taskView.taskRecord);
        tasksRead(setRecords, setSummary);
        toast.success(`changed: ${description}`);
        tasksRead(setRecords, setSummary);
      };

      const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "Enter") {
          return;
        }
      };

      return (
        <TableCell component="th" scope="row" style={{ width: "70%" }}>
          {stringIsNullOrEmpty(taskView.taskRecord.id) ||
          taskView.status === TaskStatus.unknown ||
          taskView.status === TaskStatus.completed ? (
            <TextField
              style={{ width: "100%" }}
              value={description}
              InputProps={{
                readOnly: true,
              }}
            />
          ) : (
            <TextField
              value={description}
              style={{ width: "100%" }}
              onChange={handleOnChange}
              onKeyDown={(e) => handleKeyDown(e)}
              onKeyUp={(e) => handleKeyUp(e)}
              onFocus={handleGotFocus}
              onBlur={handleLostFocus}
            />
          )}
        </TableCell>
      );
    };

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setExpanderIsOpen(!expanderIsOpen)}
            >
              {expanderIsOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TaskEditCell />
          <TableCell></TableCell>
          <TableCell>
            <TasksStatusSelect />
          </TableCell>
          <TableCell>{taskView.date}</TableCell>
          <TableCell>
            <TasksDeleteDialog
              openDialog={openDeleteDialog}
              setOpenDialog={setOpenDeleteDialog}
              onConfirmHandler={() => {
                handleDeleteTaskRequest(taskView);
                tasksRead(setRecords, setSummary);
                toast.success(`deleted: ${taskView.taskRecord.description}`);
                tasksRead(setRecords, setSummary);
              }}
              taskView={taskView}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={expanderIsOpen} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="details">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th">{taskView.summary}</TableCell>
                    </TableRow>
                    {taskView.taskRecord.tags.map(
                      (tagRow: string, id: number) => (
                        <TableRow key={id}>
                          <TableCell component="th" scope="row">
                            - {tagRow}
                          </TableCell>
                        </TableRow>
                      )
                    )}
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
        toast.success(`added: ${task.description}`);
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
                  <Row key={key} taskView={taskRecordToTaskView(record)} />
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
      <div id="snackbarhelper"></div>
    </React.Fragment>
  );
};
