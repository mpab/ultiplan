import React from "react";
import { taskCreate, taskDelete, taskReadAll, taskUpdate } from "../api/tasks";
import { TaskView, viewFromTask } from "../api/types";
import { dateYYYYMMDDhhmmss, eToString, stringIsNullOrEmpty } from "../utils";

export interface TasksTransactionsParams {
  success: (error: string) => void;
  error: (error: string) => void;
  views: TaskView[];
  setViews: (views: TaskView[]) => void;
  setSummary: (msg: string) => void;
}

export default class TasksTransactions extends React.Component {
  constructor(params: TasksTransactionsParams) {
    super(params);
    this.params = params;
  }

  params: TasksTransactionsParams;

  // ------------------------------------------------------------
  // API CRUD functions

  createTask = (taskView: TaskView) => {
    const index = this.params.views.indexOf(taskView);
    if (index >= 0) {
      this.params.error(`${taskView.taskRecord.description} exists`);
      return;
    }

    taskCreate(
      taskView.taskRecord,
      (response) => {
        console.log("taskCreate response:", response);
        if (response.status !== 201) {
          this.params.error(
            `could not create ${taskView.taskRecord.description} (code=${response.status})`
          );
          return;
        }

        return response.json();
      },
      (data) => {
        if (!data) return;
        const newView = viewFromTask(data);
        let newCollection = [...this.params.views];
        newCollection.push(newView);
        this.params.setViews(newCollection);
        this.params.success(`created ${newView.taskRecord.description}`);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        this.params.error(
          `could not create ${taskView.taskRecord.description} (${estr})`
        );
      }
    );
  };

  readAllTasks = () => {
    taskReadAll(
      (response) => {
        console.log("taskReadAll response:", response);
        if (response.status !== 200) {
          this.params.error(`could not read tasks (code=${response.status})`);
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

        this.params.setViews(results);
        const project_list = Array.from(projects).join(", ");
        const summary = `${project_list}, ${
          data.length
        } tasks, ${completed} completed, @ ${dateYYYYMMDDhhmmss(new Date())}`;
        this.params.setSummary(summary);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        this.params.error(`could not read tasks (${estr})`);
      }
    );
  };

  updateTask = (taskView: TaskView) => {
    const index = this.params.views.indexOf(taskView);
    if (index < 0) {
      this.params.error(`${taskView.taskRecord.description} not found`);
      return;
    }

    taskUpdate(
      taskView.taskRecord,
      (response) => {
        console.log("taskUpdate response:", response);
        if (response.status !== 200) {
          this.params.error(
            `could not update ${taskView.taskRecord.description} (code=${response.status})`
          );
          return;
        }

        return response.json();
      },
      (data) => {
        if (!data) return;
        const newView = viewFromTask(data);
        let newCollection = [...this.params.views];
        newCollection[index] = newView;
        this.params.setViews(newCollection);
        this.params.success(`updated ${newView.taskRecord.description}`);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        this.params.error(
          `could not update ${taskView.taskRecord.description} (${estr})`
        );
      }
    );
  };

  deleteTask = (taskView: TaskView) => {
    const index = this.params.views.indexOf(taskView);
    if (index < 0) {
      this.params.error(`${taskView.taskRecord.description} not found`);
      return;
    }

    taskDelete(
      taskView.taskRecord.id,
      (response) => {
        console.log("taskDelete response:", response);
        if (response.status !== 200) {
          this.params.error(
            `could not delete ${taskView.taskRecord.description} (code=${response.status})`
          );
          return;
        }

        return response;
      },
      (data) => {
        if (!data) return;
        let newCollection = [...this.params.views];
        newCollection.splice(index, 1);
        this.params.setViews(newCollection);
        this.params.success(`deleted ${taskView.taskRecord.description}`);
      },
      (error) => {
        console.error(error);
        const estr = eToString(error);
        this.params.error(
          `could not delete ${taskView.taskRecord.description} (${estr})`
        );
      }
    );
  };
}
