import {
  Box,
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
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useEffect } from "react";
import { useState } from "react";

import { taskNew, TaskStatus, TaskView, viewFromTask } from "../api/types";
import {
  dateYYYYMMDD,
  dateYYYYMMDDhhmmss,
  stringIsNullOrEmpty,
} from "../utils";
import TasksAddDialog from "./TasksAddDialog";

import toast from "./Toast";
import { TaskEditViewControl } from "./TasksEditViewControl";
import { DeleteOutline } from "@mui/icons-material";
import TaskDeleteDlg from "./TaskDeleteDlg";
import TasksTransactions, {
  getTasksInfo,
  readAllTasks,
  TasksApiInfoCfg,
  TasksApiReadCfg,
} from "../api/TaskTransactions";
import { useEffectOnce } from "../useEffectOnce";
import { StatusFilterControl } from "./StatusFilterControl";

export const TasksListView = () => {
  const [selectedTaskView, setSelectedTaskView] = useState(
    viewFromTask(taskNew(""))
  );
  const [isVisibleTaskDeleteDlg, setIsVisibleTaskDeleteDlg] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // -----------------------------------------------------
  //
  // Tasks CRUD and dependencies
  //
  const [unfilteredViews, setUnfilteredViews] = useState<TaskView[]>([]);
  const [summary, setSummary] = useState(``);

  const tasks = new TasksTransactions({
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    views: unfilteredViews,
    setViews: setUnfilteredViews,
  });

  const [tasksInfo, setTasksInfo] = useState(`unknown`);
  useEffect(() => {
    const cfg: TasksApiInfoCfg = {
      success: (msg) => toast.success(msg),
      error: (msg) => toast.error(msg),
      setInfo: setTasksInfo,
    };
    getTasksInfo(cfg);
  }, [unfilteredViews]);

  // -----------------------------------------------------
  // filtering
  const [taskStatusFilter, privateSetTaskStatusFilter] = useState(`any`);
  const taskStatusFilters: string[] = [...Object.values(TaskStatus)];
  const [filteredViews, setFilteredViews] = useState<TaskView[]>([]);

  const setTaskStatusFilter = (filter: string) => {
    privateSetTaskStatusFilter(filter);
  };

  useEffectOnce(() => {
    const cfg: TasksApiReadCfg = {
      success: (msg) => toast.success(msg),
      error: (msg) => toast.error(msg),
      setViews: setUnfilteredViews,
    };
    readAllTasks(cfg);
  });

  useEffect(() => {
    let newFilteredViews = unfilteredViews;
    switch (taskStatusFilter) {
      case TaskStatus.any:
        break;
      case TaskStatus.active:
        newFilteredViews = unfilteredViews.filter(
          (view) => view.status !== TaskStatus.completed
        );
        break;

      default:
        newFilteredViews = unfilteredViews.filter(
          (view) => view.status === taskStatusFilter
        );
        break;
    }
    setFilteredViews(newFilteredViews);
  }, [taskStatusFilter, unfilteredViews]);

  useEffect(() => {
    // setSummary...
    let completed = 0;
    let in_progress = 0;
    let not_started = 0;

    for (const v of unfilteredViews) {
      if (!stringIsNullOrEmpty(v.taskRecord.completed_on)) {
        ++completed;
      } else if (!stringIsNullOrEmpty(v.taskRecord.started_on)) {
        ++in_progress;
      } else if (!stringIsNullOrEmpty(v.taskRecord.created_on)) {
        ++not_started;
      }
    }

    const summary = `${tasksInfo}: ${unfilteredViews.length} tasks,
      ${completed} completed,
      ${in_progress} in progress,
      ${not_started} not started.
       (last checked ${dateYYYYMMDDhhmmss(new Date())})`;
    setSummary(summary);
  }, [tasksInfo, unfilteredViews]);

  // -----------------------------------------------------

  const Row = (props: { taskView: TaskView }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    let tv = props.taskView;

    // -----------------------------------------------------

    const TasksStatusSelect = () => {
      //const taskStatusMap = enumToMap(TaskStatus); //Map of keys to values
      let tasksStatusArray = Object.values(TaskStatus);

      // state machine
      // not_started -> started
      // not_started -> completed
      if (tv.status === TaskStatus.not_started) {
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.any
        );
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.not_started
        );
      }

      // in_progress -> completed
      if (tv.status === TaskStatus.in_progress) {
        tasksStatusArray = tasksStatusArray.filter(
          (ts) => ts !== TaskStatus.any
        );
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

        tasks.updateTask(tv);
      };

      return (
        <Box sx={{ maxWidth: 140 }}>
          <FormControl fullWidth>
            {tv.status === TaskStatus.completed ||
            tv.status === TaskStatus.any ? (
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
                  value={""}
                  labelId="task-status-select-label"
                  id="task-status-select-label-id"
                  label={tv.status}
                  onChange={handleOnChange}
                >
                  {tasksStatusArray.map((e, k) => (
                    <MenuItem value={e} key={k}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </FormControl>
        </Box>
      );
    };

    const TaskEditCell = () => {
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
          <TableBody>
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
                <TaskEditViewControl
                  forceEdit={false}
                  taskView={tv}
                  onTaskViewChange={() => {}}
                  onTaskViewEditComplete={() => {
                    tasks.updateTask(tv);
                  }}
                  isExpanded={isExpanded}
                ></TaskEditViewControl>
              </CompactTableCell>
            </TableRow>
          </TableBody>
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
                setSelectedTaskView(tv);
                setIsVisibleTaskDeleteDlg(true);
              }}
            >
              {!stringIsNullOrEmpty(tv.taskRecord.completed_on) ||
              !stringIsNullOrEmpty(tv.taskRecord.started_on) ||
              tv.status === TaskStatus.any ? (
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
                  tasks.createTask(taskView);
                }
              }}
            />
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {summary}
          </TableCell>
          <TableCell>
            <StatusFilterControl
              filters={taskStatusFilters}
              setFilter={setTaskStatusFilter}
              filter={taskStatusFilter}
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
              {filteredViews
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record, k) => (
                  <Row key={k} taskView={record} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredViews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
        />
      </Paper>
      <TaskDeleteDlg
        setIsVisibleTaskDeleteDlg={setIsVisibleTaskDeleteDlg}
        isVisibleTaskDeleteDlg={isVisibleTaskDeleteDlg}
        onClick_TaskDeleteDlg_Confirm={tasks.deleteTask}
        selectedTaskView={selectedTaskView}
      />
      <div id="snackbarhelper"></div>
    </React.Fragment>
  );
};
