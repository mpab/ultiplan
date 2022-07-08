import { TaskRecord } from "./types";

export const tasksRead = (setRecords: (arg0: TaskRecord[]) => void) => {
  fetch("http://localhost:3001/api/tasks")
    .then((res) => res.json())
    .then((records) => {
      const result: TaskRecord[] = new Array<TaskRecord>();
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
      }
      setRecords(result);
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
