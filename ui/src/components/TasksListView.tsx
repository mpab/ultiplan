import {
  Box,
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
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React from "react";
import { useEffect, useState } from "react";
import { taskCreate, taskDelete, tasksRead, taskUpdate } from "../api/tasks";

import { TaskRecord, TaskStatus, TaskView } from "../api/types";
import { dateYYYYMMDD, stringIsNullOrEmpty } from "../utils";
import TasksDeleteDialog from "./TasksDeleteDialog";
import TasksAddDialog from "./TasksAddDialog";

import toast from "./Toast";
import { TaskEditViewPanel } from "./TasksEditViewPanel";

const taskRecordToTaskView = (r: TaskRecord): TaskView => {
  let date = 'unknown';
  let dateSignificance = '';
  let status = TaskStatus.unknown;

  if (r.created_on) {
    status = TaskStatus.not_started;
    date = r.created_on;
    dateSignificance = `created`;
  }

  if (r.started_on) {
    status = TaskStatus.in_progress;
    date = r.started_on;
    dateSignificance = `started`;
  }

  if (r.completed_on) {
    status = TaskStatus.completed;
    date = r.completed_on;
    dateSignificance = `completed`;
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
    dateSignificance: dateSignificance,
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
    const [isExpanded, setIsExpanded] = useState(false);

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
      const [tags, setTags] = useState(taskView.taskRecord.tags);
      const [descriptionError, setDescriptionError] = useState("");

      const handleEndEdit = () => {
        console.log("TaskEditCell end edit");
        taskView.taskRecord.description = description;
        taskView.taskRecord.tags = tags;
        taskUpdate(taskView.taskRecord);
        toast.success(`changed: ${description}`);
      };

      return (
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
            },
          }}
        >
          <TableRow>
            <TableCell width={10}>
              {!isExpanded ? (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <KeyboardArrowRightIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <KeyboardArrowDownIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              )}
            </TableCell>
            <TableCell component="th" scope="row">
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
                <TaskEditViewPanel
                  {...{
                    description,
                    setDescription,
                    descriptionError,
                    setDescriptionError,
                    tags,
                    setTags,
                    handleEndEdit,
                    isExpanded,
                  }}
                ></TaskEditViewPanel>
              )}
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "none" } }}>
          <TableCell style={{ width: "70%" }}>
            <TaskEditCell />
          </TableCell>

          <TableCell style={{ width: "10%" }}>
            <TasksStatusSelect />
          </TableCell>
          <TableCell><div>{taskView.date}</div><div>{taskView.dateSignificance}</div></TableCell>
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
        <TableRow style={{ width: "100%" }}>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0, width: "100%" }}
            colSpan={12}
          ></TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  // -----------------------------------------------------

  const TableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell>
            <TasksAddDialog
              openDialog={openAddDialog}
              setOpenDialog={setOpenAddDialog}
              onConfirmHandler={(task: TaskRecord) => {
                if (task.description) {
                  taskCreate(task);
                  tasksRead(setRecords, setSummary);
                  toast.success(`added: ${task.description}`);
                  tasksRead(setRecords, setSummary);
                }
              }}
            />
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Project: {summary}
          </TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Action</TableCell>
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
          <Table size="small" stickyHeader aria-label="collapsible table" sx={{ minWidth: 800 }} >
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
