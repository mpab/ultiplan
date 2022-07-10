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

export type TaskView = {
  taskRecord: TaskRecord;
  status: string;
  summary: string;
  date: string;
};

export const taskRecordFromDescription = (description: string): TaskRecord  => {
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