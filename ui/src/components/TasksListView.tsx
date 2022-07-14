import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React from "react";
import { useEffect, useState } from "react";
import { taskCreate, taskDelete, tasksRead, taskUpdate } from "../api/tasks";

import {
  TaskRecord,
  TaskStatus,
  TaskView,
  taskViewFromTaskRecord,
} from "../api/types";
import { dateYYYYMMDD, stringIsNullOrEmpty } from "../utils";
import TasksDeleteDialog from "./TasksDeleteDialog";
import TasksAddDialog from "./TasksAddDialog";

import toast from "./Toast";
import { TaskEditViewControl } from "./TasksEditViewControl";
import { DeleteOutline } from "@mui/icons-material";

export const TasksListView = () => {
  // ------------------------------------------------------------
  // Dialogs
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // -----------------------------------------------------
  // records get/set
  const [records, setRecords] = useState<TaskView[]>([]);
  const [summary, setSummary] = useState<string>("");

  // -----------------------------------------------------
  // status filtering

  const statusFilters = [
    "all",
    ...Object.values(TaskStatus).filter((ts) => ts !== TaskStatus.unknown),
  ];
  const [statusFilterProp, setStatusFilterProp] = useState("all");

  // -----------------------------------------------------

  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    tasksRead(
      (task: TaskRecord, views: TaskView[]) => {
        const view: TaskView = taskViewFromTaskRecord(task);
        views.push(view);
      },
      setRecords,
      setSummary
    );
    //toast.success(`tasksRead: ${trigger}`);
  }, [trigger]);

  const queryTasks = () => {
    setTrigger(trigger + 1);
  };

  useEffect(() => {
    if (statusFilterProp === "all") {
      tasksRead(
        (task: TaskRecord, views: TaskView[]) => {
          const view: TaskView = taskViewFromTaskRecord(task);
          views.push(view);
        },
        setRecords,
        setSummary
      );
      //toast.success(`tasksRead: ${statusFilterProp}`);
      return;
    }

    tasksRead(
      (task: TaskRecord, views: TaskView[]) => {
        const view: TaskView = taskViewFromTaskRecord(task);
        if (view.status === statusFilterProp) views.push(view);
      },
      setRecords,
      setSummary
    );
    //toast.success(`tasksRead: ${statusFilterProp}`);
  }, [statusFilterProp]);

  // -----------------------------------------------------

  const Row = (props: { taskView: TaskView }) => {
    // -----------------------------------------------------
    // expander
    const [isExpanded, setIsExpanded] = useState(false);
    const [tv, stv] = useState(props.taskView);

    // -----------------------------------------------------

    const onDeleteTaskRequest = (taskView: TaskView) => {
      if (stringIsNullOrEmpty(taskView.taskRecord.id)) {
        return;
      }

      taskDelete(taskView.taskRecord.id);
      queryTasks();
      toast.success(`deleted: ${taskView.taskRecord.description}`);
    };

    const TasksStatusSelect = () => {
      //const taskStatusMap = enumToMap(TaskStatus); //Map of keys to values
      let tasksStatusArray = Object.values(TaskStatus).filter(
        (ts) => ts !== TaskStatus.unknown
      );

      // state machine
      // not_started -> started
      // not_started -> completed
      if (tv.status === TaskStatus.not_started) {
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.not_started
        );
      }

      // in_progress -> completed
      if (tv.status === TaskStatus.in_progress) {
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
            tv.taskRecord.completed_on = dateYYYYMMDD(new Date());
            break;

          case TaskStatus.in_progress:
            tv.taskRecord.started_on = dateYYYYMMDD(new Date());
            break;
        }

        taskUpdate(tv.taskRecord);
        queryTasks();
        toast.success(`changed: ${tv.status} -> ${newTaskStatus}`);
      };

      return (
        <Box sx={{ maxWidth: 140 }}>
          <FormControl fullWidth>
            {tv.status === TaskStatus.completed ||
            tv.status === TaskStatus.unknown ? (
              <>
                <TextField
                  value={tv.status}
                  InputProps={{
                    readOnly: true,
                  }}
                ></TextField>
              </>
            ) : (
              <>
                <InputLabel>{tv.status}</InputLabel>
                <Select
                  labelId="task-status-select-label"
                  id="task-status-select-label-id"
                  label={tv.status}
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
      const onTaskViewEditComplete = (taskView: TaskView) => {
        taskUpdate(taskView.taskRecord);
        queryTasks();
        toast.success(`updated: ${taskView.taskRecord.description}`);
      };

      const CompactTableCell = styled(TableCell)({
        padding: 2,
      });

      return (
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
            },
          }}
        >
          <TableRow>
            <CompactTableCell width={10}>
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
            </CompactTableCell>
            <CompactTableCell component="th" scope="row">
              {stringIsNullOrEmpty(tv.taskRecord.id) ||
              tv.status === TaskStatus.unknown ||
              tv.status === TaskStatus.completed ? (
                <TextField
                  style={{ width: "100%" }}
                  value={tv.taskRecord.description}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              ) : (
                <TaskEditViewControl
                  {...{
                    taskView: tv,
                    onTaskViewChange: () => {},
                    onTaskViewEditComplete,
                    isExpanded,
                  }}
                ></TaskEditViewControl>
              )}
            </CompactTableCell>
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
          <TableCell>
            <div>{tv.date}</div>
            <div>{tv.dateSignificance}</div>
          </TableCell>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                // eslint-disable-next-line no-restricted-globals, no-template-curly-in-string
                confirm(`confirm delete\n` + tv.taskRecord.description) && onDeleteTaskRequest(tv);
              }}
            >
              {!stringIsNullOrEmpty(tv.taskRecord.completed_on) ||
              !stringIsNullOrEmpty(tv.taskRecord.started_on) ||
              tv.status === TaskStatus.unknown ? (
                <></>
              ) : (
                <DeleteOutline color="error" />
              )}
            </IconButton>
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

  interface StatusFilterProps {
    statusFilters: string[];
    setStatusFilter: (filter: string) => void;
  }

  const StatusFilter = (props: StatusFilterProps) => {
    const onStatusFilterChange = (event: SelectChangeEvent) => {
      props.setStatusFilter(event.target.value);
    };

    return (
      <Box sx={{ maxWidth: 140 }}>
        <FormControl fullWidth>
          <InputLabel>{statusFilterProp}</InputLabel>
          <Select
            labelId="task-status-select-label"
            id="task-status-select-label-id"
            label="Status"
            onChange={onStatusFilterChange}
          >
            {props.statusFilters.map((e) => (
              <MenuItem value={e}>{e}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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
              onTaskViewEditComplete={(taskView: TaskView) => {
                if (taskView.taskRecord.description) {
                  taskCreate(taskView.taskRecord);
                  queryTasks();
                  toast.success(`added: ${taskView.taskRecord.description}`);
                }
              }}
            />
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Project: {summary}
          </TableCell>
          <TableCell>
            <StatusFilter
              statusFilters={statusFilters}
              setStatusFilter={setStatusFilterProp}
            />
          </TableCell>
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
  let height = rowsPerPage <= 10 ? rowsPerPage * 120 : 900;

  return (
    <React.Fragment>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer component={Paper} sx={{ maxHeight: height }}>
          <Table
            size="small"
            stickyHeader
            aria-label="collapsible table"
            sx={{ minWidth: 800 }}
          >
            <TableHeader />
            <TableBody>
              {records
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record, key) => (
                  <Row key={key} taskView={record} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
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
