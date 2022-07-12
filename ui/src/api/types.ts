import { GridStrategyProcessingApi } from "@mui/x-data-grid/hooks/core/strategyProcessing";

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
  unknown = "unknown",
  not_started = "not started",
  in_progress = "in progress",
  completed = "completed",
}

export type TaskView = {
  taskRecord: TaskRecord;
  status: TaskStatus;
  summary: string;
  date: string;
  dateSignificance: string;
};

export const taskRecordFromDescription = (description: string): TaskRecord => {
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
