import { stringIsNullOrEmpty } from "../utils";
import { TaskRecord } from "./types";

export const tasksRead = (setRecords: (arg0: TaskRecord[]) => void, setSummary: any) => {
  const result = new Array<TaskRecord>();
  const projects = new Set<string>();
  let completed = 0;

  fetch("http://localhost:3001/api/tasks")
    .then((res) => res.json())
    .then((records) => {
      for (const d of records) {
        const task: TaskRecord = {
          id: d.id,
          description: d.description,
          project: d.project,
          created_on: d.created_on,
          started_on: d.started_on,
          due_on: d.due_on,
          completed_on: d.completed_on,
          tags: d.tags,
        };
        result.push(task);
        projects.add(d.project);
        if (!stringIsNullOrEmpty(task.completed_on)) ++completed;
      }
      setRecords(result);
      const project_list = Array.from(projects).join(', ');
      const summary = `${project_list}, ${records.length} tasks, ${completed} completed`;
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

export const taskCreate = (description: string) => {
  const task = {
    id: "",
    description: description,
    project: "",
    created_on: "",
    completed_on: "",
    due_on: "",
  };

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
