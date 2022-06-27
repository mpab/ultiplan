import { TaskRecord } from "../types";

export const apiGet = (setRecords: (arg0: TaskRecord[]) => void) => {
    fetch("http://localhost:3001/api")
      .then((res) => res.json())
      .then((records) => {
        const result: TaskRecord[] = new Array<TaskRecord>();
        for (const d of records) {
          const task = {
            id: d.id,
            project: d.project,
            description: d.description,
          };
          result.push(task);
        }
        setRecords(result);
      });
  };