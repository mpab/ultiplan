import { CRUD } from "../api/CRUD";
import { TaskRecord, TaskView, viewFromTask } from "../api/types";

export interface TasksApiChangeCfg {
  success: (error: string) => void;
  error: (error: string) => void;
  views: TaskView[];
  setViews: (views: TaskView[]) => void;
}

// const eToString = (e: any): string => {
//   switch (e.constructor) {
//     case Error:
//       return "generic error";
//     case RangeError:
//       return "range error";
//     default:
//       return "unknown error";
//   }
// };

const logSuccess = (cfg: any, msg: string) => {
  console.log(msg);
  cfg.success(msg);
};

const logError = (cfg: any, msg: string) => {
  console.error(msg);
  cfg.error(msg);
};

// ------------------------------------------------------------
// API CRUD functions

const tasksApiBaseUrl: URL = new URL(`http://localhost:3001/api/tasks/`);

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
      logError(this.cfg, `${taskView.taskRecord.description} exists`);
      return;
    }

    this.crud.apiCreate(
      taskView.taskRecord,
      (response) => {
        console.log("taskCreate response:", response);
        if (response.status !== 201) {
          logError(
            this.cfg,
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
        logSuccess(this.cfg, `created ${newView.taskRecord.description}`);
      },
      (error) => {
        logError(
          this.cfg,
          `could not create ${taskView.taskRecord.description} because: ${error}`
        );
      }
    );
  };

  updateTask = (taskView: TaskView) => {
    const index = this.cfg.views.indexOf(taskView);
    if (index < 0) {
      logError(this.cfg, `${taskView.taskRecord.description} not found`);
      return;
    }

    this.crud.apiUpdate(
      taskView.taskRecord,
      (response) => {
        console.log("taskUpdate response:", response);
        if (response.status !== 200) {
          logError(
            this.cfg,
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
        logSuccess(this.cfg, `updated ${newView.taskRecord.description}`);
      },
      (error) => {
        logError(
          this.cfg,
          `could not update ${taskView.taskRecord.description} (${error})`
        );
      }
    );
  };

  deleteTask = (taskView: TaskView) => {
    const index = this.cfg.views.indexOf(taskView);
    if (index < 0) {
      logError(this.cfg, `${taskView.taskRecord.description} not found`);
      return;
    }

    this.crud.apiDelete(
      taskView.taskRecord.id,
      (response) => {
        console.log("taskDelete response:", response);
        if (response.status !== 200) {
          logError(
            this.cfg,
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
        logSuccess(this.cfg, `deleted ${taskView.taskRecord.description}`);
      },
      (error) => {
        logError(
          this.cfg,
          `could not delete ${taskView.taskRecord.description} (${error})`
        );
      }
    );
  };
}

export interface TasksApiReadCfg {
  success: (error: string) => void;
  error: (error: string) => void;
  setViews: (views: TaskView[]) => void;
}

export const readAllTasks = (cfg: TasksApiReadCfg) => {
  new CRUD(tasksApiBaseUrl).apiReadAll(
    (response) => {
      console.log("taskReadAll response:", response);
      if (response.status !== 200) {
        logError(cfg, `could not read tasks (code=${response.status})`);
        return;
      }
      return response.json();
    },
    (data) => {
      if (!data) {
        logSuccess(cfg, `read ${data.length} tasks`);
      };
      const views = data.map((task: TaskRecord) => viewFromTask(task))
      cfg.setViews(views);
    },
    (error) => {
      console.error(error);
      logError(cfg, `could not read tasks (${error})`);
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
        logError(cfg, `could not query tasks info (code=${response.status})`);
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
      logError(cfg, `could not read tasks (${error})`);
    }
  );
};
