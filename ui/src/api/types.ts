import { stringIsNullOrEmpty } from "../utils";

export type TaskRecord = {
  id: string;
  project: string;
  description: string;
  created_on: string;
  started_on: string;
  due_on: string;
  completed_on: string;
  tags: string[];
};

export enum TaskStatus {
  any = "any",
  not_started = "not started",
  in_progress = "in progress",
  completed = "completed",
  active = "active",
}

export type TaskView = {
  taskRecord: TaskRecord;
  status: TaskStatus;
  summary: string;
  date: string;
  dateSignificance: string;
  errors: string[];
};

export const taskNew = (description: string): TaskRecord => {
  return {
    id: "",
    description: description,
    project: "",
    created_on: "",
    started_on: "",
    completed_on: "",
    due_on: "",
    tags: [],
  };
};

export const viewFromTask = (r: TaskRecord): TaskView => {
  let date = "unknown";
  let dateSignificance = "";
  let status = TaskStatus.any;

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
    errors: [],
  };
};
