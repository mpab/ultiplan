import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";
import { useEffect, useState } from "react";
import { taskCreate, taskDelete, tasksRead, taskUpdate } from "../api/tasks";
//import { TaskRecord } from "../api/types";

import { TaskRecord, TaskView } from "../api/types";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";

const stringIsNullOrEmpty = (str: string | null): boolean => {
  return typeof str == "undefined" || !str || !str.trim;
};

const dateYYYYMMDD = (date: {
  getTime: () => number;
  getTimezoneOffset: () => number;
}) => {
  const ms_per_minute = 60000;
  return new Date(date.getTime() - date.getTimezoneOffset() * ms_per_minute)
    .toISOString()
    .split("T")[0];
};

const taskRecordToTaskView = (r: TaskRecord): TaskView => {
  let status = "unknown";
  let date = "unknown";

  if (r.created_on) {
    status = "todo";
    date = r.created_on + ` [C]`;
  }

  if (r.started_on) {
    status = "started";
    date = r.created_on + ` [S]`;
  }

  if (r.completed_on) {
    status = "done";
    date = r.completed_on + ` [D]`;
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

export const TaskList = () => {
  // ----------------
  // records get/set
  const [records, setRecords] = useState<TaskRecord[]>([]);

  useEffect(() => {
    tasksRead(setRecords);
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
        alert(`task has no id, unable to delete`);
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
        taskDelete(taskView.taskRecord.id);
        tasksRead(setRecords);
        tasksRead(setRecords);
      }
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
      tasksRead(setRecords);
      tasksRead(setRecords);
    };

    const handleMarkTaskAsCompleteRequest = (taskView: TaskView) => {
      if (stringIsNullOrEmpty(taskView.taskRecord.id)) {
        alert(`task has no id, unable to mark as complete`);
        return;
      }

      if (
        window.confirm(
          `Mark as complete?\n` +
            taskView.taskRecord.id +
            `\n` +
            taskView.taskRecord.description
        )
      ) {
        taskView.taskRecord.completed_on = dateYYYYMMDD(new Date());
        taskUpdate(taskView.taskRecord);
        tasksRead(setRecords);
        tasksRead(setRecords);
        tasksRead(setRecords);
      }
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
            <IconButton
              aria-label="mark as complete"
              size="small"
              onClick={(event) => {
                if (stringIsNullOrEmpty(row.taskRecord.completed_on))
                  handleMarkTaskAsCompleteRequest(row);
              }}
            >
              {stringIsNullOrEmpty(row.taskRecord.completed_on) &&
              !stringIsNullOrEmpty(row.taskRecord.id) ? (
                <Switch checked={false} />
              ) : (
                <Switch disabled defaultChecked color="success"/>
              )}
            </IconButton>
            {row.status}
          </TableCell>
          <TableCell>{row.date}</TableCell>
          <TableCell>
            <IconButton
              aria-label="delete task"
              size="small"
              onClick={(event) => handleDeleteTaskRequest(row)}
            >
              <DeleteOutline />
            </IconButton>
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
    const handleAddTaskRequest = () => {
      const description = prompt("Enter description: ", "todo");
      if (description) {
        taskCreate(description);
        tasksRead(setRecords);
        tasksRead(setRecords);
      }
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell>
            {" "}
            <IconButton
              aria-label="add task"
              size="small"
              onClick={(event) => handleAddTaskRequest()}
            >
              <Add />
            </IconButton>
          </TableCell>
          <TableCell>Description</TableCell>
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClose = () => {
    setIsDialogOpen(false);
  };

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
