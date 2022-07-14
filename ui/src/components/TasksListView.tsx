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
import React from "react";
import { useEffect, useState } from "react";
import { taskCreate, taskDelete, taskReadAll, taskUpdate } from "../api/tasks";

import {
  taskRecordFromDescription,
  TaskStatus,
  TaskView,
  taskViewFromTaskRecord,
} from "../api/types";
import { dateYYYYMMDD, dateYYYYMMDDhhmmss, eToString, stringIsNullOrEmpty } from "../utils";
import TasksAddDialog from "./TasksAddDialog";

import toast from "./Toast";
import { TaskEditViewControl } from "./TasksEditViewControl";
import { DeleteOutline } from "@mui/icons-material";
import TaskDeleteDlg from "./TaskDeleteDlg";

export const TasksListView = () => {
  // -----------------------------------------------------
  // records get/set
  const [taskViewCollection, setTaskViewCollection] = useState<TaskView[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [selectedTaskView, setSelectedTaskView] = useState<TaskView>(
    taskViewFromTaskRecord(taskRecordFromDescription(""))
  );

  // ------------------------------------------------------------
  // Dialog state & callbacks
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [isVisibleTaskDeleteDlg, setIsVisibleTaskDeleteDlg] = useState(false);

  // ------------------------------------------------------------
  // API CRUD functions

  const createTask = (taskView: TaskView) => {
    const index = taskViewCollection.indexOf(taskView);
    if (index >= 0) {
      toast.error(`${taskView.taskRecord.description} exists`);
      return;
    }

    taskCreate(
      taskView.taskRecord,
      (response) => {
        console.log("taskCreate response:", response);
        if (response.status !== 201) {
          toast.error(
            `could not create ${taskView.taskRecord.description} (code=${response.status})`
          );
          return;
        }

        return response;
      },
      (data) => {
        if (!data) return;
        let newCollection = [...taskViewCollection];
        newCollection.push(taskView);
        setTaskViewCollection(newCollection);
        toast.success(`created ${taskView.taskRecord.description}`);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        toast.error(
          `could not create ${taskView.taskRecord.description} (${estr})`
        );
      }
    );
  };

  const deleteTask = (taskView: TaskView) => {
    const index = taskViewCollection.indexOf(taskView);
    if (index < 0) {
      toast.error(`${taskView.taskRecord.description} not found`);
      return;
    }

    taskDelete(
      taskView.taskRecord.id,
      (response) => {
        console.log("taskDelete response:", response);
        if (response.status !== 200) {
          toast.error(
            `could not delete ${taskView.taskRecord.description} (code=${response.status})`
          );
          return;
        }

        return response;
      },
      (data) => {
        if (!data) return;
        let newCollection = [...taskViewCollection];
        newCollection.splice(index, 1);
        setTaskViewCollection(newCollection);
        toast.success(`deleted ${taskView.taskRecord.description}`);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        toast.error(
          `could not delete ${taskView.taskRecord.description} (${estr})`
        );
      }
    );
  };

  const updateTask = (taskView: TaskView) => {
    const index = taskViewCollection.indexOf(taskView);
    if (index < 0) {
      toast.error(`${taskView.taskRecord.description} not found`);
      return;
    }

    taskView = taskViewFromTaskRecord(taskView.taskRecord); // force task view attributes update

    taskUpdate(
      taskView.taskRecord,
      (response) => {
        console.log("taskUpdate response:", response);
        if (response.status !== 200) {
          toast.error(
            `could not update ${taskView.taskRecord.description} (code=${response.status})`
          );
          return;
        }

        return response;
      },
      (data) => {
        if (!data) return;
        let newCollection = [...taskViewCollection];
        newCollection[index] = taskView;
        setTaskViewCollection(newCollection);
        toast.success(`updated ${taskView.taskRecord.description}`);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        toast.error(
          `could not update ${taskView.taskRecord.description} (${estr})`
        );
      }
    );
  };

  // -----------------------------------------------------
  // status filtering

  const statusFilters = [...Object.values(TaskStatus)];
  const [statusFilterProp, setStatusFilterProp] = useState("any");

  const readAllTasks = () => {
    taskReadAll(
      (response) => {
        console.log("tasksRead response:", response);
        if (response.status !== 200) {
          toast.error(`could not read tasks (code=${response.status})`);
          return;
        }

        return response.json();
      },
      (data) => {
        if (!data) return;

        const results = new Array<TaskView>();
        const projects = new Set<string>();
        let completed = 0;

        for (const d of data) {
          const view: TaskView = taskViewFromTaskRecord(d);
          results.push(view);
          if (!stringIsNullOrEmpty(d.completed_on)) ++completed;
          projects.add(d.project);
        }

        setTaskViewCollection(results);
        const project_list = Array.from(projects).join(", ");
        const summary = `${project_list}, ${
          data.length
        } tasks, ${completed} completed, @ ${dateYYYYMMDDhhmmss(new Date())}`;
        setSummary(summary);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        toast.error(`could not read tasks (${estr})`);
      }
    );
  };

  const [refresh, setRefresh] = useState(0);
  const triggerRefresh = () => setRefresh(1 + refresh);

  useEffect(() => {
    readAllTasks();
  }, [statusFilterProp, refresh]);

  // -----------------------------------------------------

  const Row = (props: { taskView: TaskView }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    let tv = props.taskView;

    if (statusFilterProp !== "any" && statusFilterProp !== tv.status)
      return <></>;

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

        updateTask(tv);
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
              <TaskEditViewControl
                forceEdit={false}
                taskView={tv}
                onTaskViewChange={() => {}}
                onTaskViewEditComplete={() => {
                  updateTask(tv);
                }}
                isExpanded={isExpanded}
              ></TaskEditViewControl>
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
                  createTask(taskView);
                  triggerRefresh(); // hacky bug fix... element remains locked if refresh not triggered
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
              {taskViewCollection
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
          count={taskViewCollection.length}
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
        onClick_TaskDeleteDlg_Confirm={deleteTask}
        selectedTaskView={selectedTaskView}
      />
      <div id="snackbarhelper"></div>
    </React.Fragment>
  );
};
