import { CRUD } from "../api/CRUD";
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

const tasksApiBaseUrl: URL = new URL(`http://localhost:3001/api/tasks/`)

export default class TasksTransactions {
  constructor(cfg: TasksApiChangeCfg) {
    this.cfg = cfg;
    this.crud = new CRUD(tasksApiBaseUrl);
  }

  cfg: TasksApiChangeCfg;
  crud: CRUD;

  createTask = (taskView: TaskView) => {
    const index = this.cfg.views.indexOf(taskView);
    if (index >= 0) {
      this.cfg.error(`${taskView.taskRecord.description} exists`);
      return;
    }

    this.crud.apiCreate(
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

    this.crud.apiUpdate(
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

    this.crud.apiDelete(
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
  new CRUD(tasksApiBaseUrl).apiReadAll(
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
      let completed = 0;

      for (const d of data) {
        const view: TaskView = viewFromTask(d);
        results.push(view);
        if (!stringIsNullOrEmpty(d.completed_on)) ++completed;
      }

      console.log("taskReadAll count:", results.length);

      cfg.setViews(results);
      const summary = `${
        data.length
      } tasks, ${completed} completed. (last checked ${dateYYYYMMDDhhmmss(
        new Date()
      )})`;
      cfg.setSummary(summary);
    },
    (error) => {
      console.error(error);
      const estr = eToString(error);
      cfg.error(`could not read tasks (${estr})`);
    }
  );
};

export interface TasksApiInfoCfg {
  success: (error: string) => void;
  error: (error: string) => void;
  setInfo: (msg: string) => void;
}

export const getTasksInfo = (cfg: TasksApiInfoCfg) => {
  new CRUD(tasksApiBaseUrl).info(
    (response) => {
      console.log("info response:", response);
      if (response.status !== 200) {
        cfg.error(`could not query tasks info (code=${response.status})`);
        return;
      }
      return response.text();
    },
    (data) => {
      if (!data) return;
      console.log("info data:", data);
      cfg.setInfo(`Project - ` + data);
    },
    (error) => {
      console.error(error);
      const estr = eToString(error);
      cfg.error(`could not query tasks info (${estr})`);
    }
  );
};
