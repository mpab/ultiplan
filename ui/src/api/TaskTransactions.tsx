import { taskCreate, taskDelete, taskReadAll, taskUpdate } from "../api/tasks";
import { TaskView, viewFromTask } from "../api/types";
import { dateYYYYMMDDhhmmss, eToString, stringIsNullOrEmpty } from "../utils";

export interface TasksApiChangeCfg {
  success: (error: string) => void;
  error: (error: string) => void;
  views: TaskView[];
  setViews: (views: TaskView[]) => void;
}

// ------------------------------------------------------------
// API CRUD functions

export default class TasksTransactions {
  constructor(cfg: TasksApiChangeCfg) {
    this.cfg = cfg;
  }

  cfg: TasksApiChangeCfg;

  createTask = (taskView: TaskView) => {
    const index = this.cfg.views.indexOf(taskView);
    if (index >= 0) {
      this.cfg.error(`${taskView.taskRecord.description} exists`);
      return;
    }

    taskCreate(
      taskView.taskRecord,
      (response) => {
        console.log("taskCreate response:", response);
        if (response.status !== 201) {
          this.cfg.error(
            `could not create ${taskView.taskRecord.description} (code=${response.status})`
          );
          return;
        }

        return response.json();
      },
      (data) => {
        if (!data) return;
        const newView = viewFromTask(data);
        let newCollection = [...this.cfg.views];
        newCollection.push(newView);
        this.cfg.setViews(newCollection);
        this.cfg.success(`created ${newView.taskRecord.description}`);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        this.cfg.error(
          `could not create ${taskView.taskRecord.description} (${estr})`
        );
      }
    );
  };

  updateTask = (taskView: TaskView) => {
    const index = this.cfg.views.indexOf(taskView);
    if (index < 0) {
      this.cfg.error(`${taskView.taskRecord.description} not found`);
      return;
    }

    taskUpdate(
      taskView.taskRecord,
      (response) => {
        console.log("taskUpdate response:", response);
        if (response.status !== 200) {
          this.cfg.error(
            `could not update ${taskView.taskRecord.description} (code=${response.status})`
          );
          return;
        }

        return response.json();
      },
      (data) => {
        if (!data) return;
        const newView = viewFromTask(data);
        let newCollection = [...this.cfg.views];
        newCollection[index] = newView;
        this.cfg.setViews(newCollection);
        this.cfg.success(`updated ${newView.taskRecord.description}`);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        this.cfg.error(
          `could not update ${taskView.taskRecord.description} (${estr})`
        );
      }
    );
  };

  deleteTask = (taskView: TaskView) => {
    const index = this.cfg.views.indexOf(taskView);
    if (index < 0) {
      this.cfg.error(`${taskView.taskRecord.description} not found`);
      return;
    }

    taskDelete(
      taskView.taskRecord.id,
      (response) => {
        console.log("taskDelete response:", response);
        if (response.status !== 200) {
          this.cfg.error(
            `could not delete ${taskView.taskRecord.description} (code=${response.status})`
          );
          return;
        }

        return response;
      },
      (data) => {
        if (!data) return;
        let newCollection = [...this.cfg.views];
        newCollection.splice(index, 1);
        this.cfg.setViews(newCollection);
        this.cfg.success(`deleted ${taskView.taskRecord.description}`);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        this.cfg.error(
          `could not delete ${taskView.taskRecord.description} (${estr})`
        );
      }
    );
  };
}

export interface TasksApiReadCfg {
  success: (error: string) => void;
  error: (error: string) => void;
  setViews: (views: TaskView[]) => void;
  setSummary: (msg: string) => void;
}

export const readAllTasks = (cfg: TasksApiReadCfg) => {
  taskReadAll(
    (response) => {
      console.log("taskReadAll response:", response);
      if (response.status !== 200) {
        cfg.error(`could not read tasks (code=${response.status})`);
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
        const view: TaskView = viewFromTask(d);
        results.push(view);
        if (!stringIsNullOrEmpty(d.completed_on)) ++completed;
        projects.add(d.project);
      }

      console.log("taskReadAll count:", results.length);

      cfg.setViews(results);
      const project_list = Array.from(projects).join(", ");
      const summary = `${project_list}, ${
        data.length
      } tasks, ${completed} completed, @ ${dateYYYYMMDDhhmmss(new Date())}`;
      cfg.setSummary(summary);
    },
    (error) => {
      console.error(error);
      const estr = eToString(error);
      cfg.error(`could not read tasks (${estr})`);
    }
  );
};
