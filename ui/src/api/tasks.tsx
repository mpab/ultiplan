import { stringIsNullOrEmpty } from "../utils";
import { TaskRecord, TaskView, taskViewFromTaskRecord } from "./types";


export const tasksRead = (
  filter: (task: TaskRecord, results: TaskView[]) => void,
  setRecords: (arg0: TaskView[]) => void,
  setSummary: (arg0: string) => void
) => {
  const results = new Array<TaskView>();
  const projects = new Set<string>();
  let completed = 0;

  fetch("http://localhost:3001/api/tasks")
    .then((res) => res.json())
    .then((records) => {
      for (const d of records) {
        filter(d, results);
        if (!stringIsNullOrEmpty(d.completed_on)) ++completed;
        projects.add(d.project);
      }
      setRecords(results);
      const project_list = Array.from(projects).join(', ');
      const summary = `${project_list}, ${records.length} tasks, ${completed} completed, @ ${new Date()}`;
      setSummary(summary);
    });
};

export const taskDelete = (id: string) => {
  fetch(`http://localhost:3001/api/tasks/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const taskCreate = (task: TaskRecord) => {
  fetch(`http://localhost:3001/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const taskUpdate = (taskRecord: TaskRecord) => {
  fetch(`http://localhost:3001/api/tasks`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskRecord),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
