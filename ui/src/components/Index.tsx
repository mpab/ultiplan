import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NotesIcon from "@mui/icons-material/Notes";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WaterfallChartIcon from "@mui/icons-material/WaterfallChart";
import EditRoadIcon from '@mui/icons-material/EditRoad';
import { FormatListNumbered } from "@mui/icons-material";
import { TasksListView } from "./TasksListView";
import { TasksCalendarView } from "./TasksCalendarView";
import { TasksGanttChartView } from "./TasksGanttChartView";
import { MeetingsListView } from "./MeetingsListView";
import { TasksKanbanView } from "./TasksKanbanView";
import { TasksListViewReference } from "./TasksListViewReference";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [view, setView] = React.useState(0);

  const viewNames = [
    "Tasks List View",
    "Tasks Kanban View",
    "Tasks Calendar View",
    "Tasks Gantt Chart View",
    "Tasks List View (reference)",
    "Meetings List View",
  ];

  // ------------------------------------------------------------

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {viewNames[view]}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          <ListItemText
            primary={
              <Typography variant="h6" style={{ color: "blue" }}>
                Tasks Views
              </Typography>
            }
          />

          <ListItem disablePadding>
            <ListItemButton onClick={() => setView(0)}>
              <ListItemIcon>
                <FormatListNumbered />
              </ListItemIcon>
              <ListItemText primary="List" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setView(1)}>
              <ListItemIcon>
                <EditRoadIcon />
              </ListItemIcon>
              <ListItemText primary="Kanban" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setView(2)}>
              <ListItemIcon>
                <CalendarMonthIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setView(3)}>
              <ListItemIcon>
                <WaterfallChartIcon />
              </ListItemIcon>
              <ListItemText primary="Chart" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setView(4)}>
              <ListItemIcon>
                <WaterfallChartIcon />
              </ListItemIcon>
              <ListItemText primary="Tasks List (reference)" />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItemText
            primary={
              <Typography variant="h6" style={{ color: "blue" }}>
                Meetings Views
              </Typography>
            }
          />
          <ListItem disablePadding>
            <ListItemButton onClick={() => setView(5)}>
              <ListItemIcon>
                <NotesIcon />
              </ListItemIcon>
              <ListItemText primary="List" />
            </ListItemButton>
          </ListItem>

          <Divider />
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {view === 0 && <TasksListView />}
        {view === 1 && <TasksKanbanView />}
        {view === 2 && <TasksCalendarView />}
        {view === 3 && <TasksGanttChartView />}
        {view === 4 && <TasksListViewReference />}
        {view === 5 && <MeetingsListView />}
      </Main>
    </Box>
  );
}
