import { TaskRecord } from "../types";

export const apiGet = (setRecords: (arg0: TaskRecord[]) => void) => {
    fetch("http://localhost:3001/api")
      .then((res) => res.json())
      .then((records) => {
        const result: TaskRecord[] = new Array<TaskRecord>();
        for (const d of records) {
          let status = 'unknown';
          if (d.created_on) {
            status = 'todo';
          }
          if (d.completed_on) {
            status = 'done';
          }
          const task = {
            //id: d.id,
            description: d.description,
            project: d.project,
            created_on: d.created_on,
            completed_on: d.completed_on,
            due_on: d.due_on,
            status: status,
          };
          result.push(task);
        }
        setRecords(result);
      });
  };