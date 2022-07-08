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