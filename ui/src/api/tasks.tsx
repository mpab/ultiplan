import { TaskRecord } from "../types";

export const tasksRead = (setRecords: (arg0: TaskRecord[]) => void) => {
  fetch("http://localhost:3001/api/tasks")
    .then((res) => res.json())
    .then((records) => {
      const result: TaskRecord[] = new Array<TaskRecord>();
      for (const d of records) {
        let status = "unknown";
        if (d.created_on) {
          status = "todo";
        }
        if (d.completed_on) {
          status = "done";
        }
        const task = {
          id: d.id,
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

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export const taskDelete = (id: string) => {
  fetch(`http://localhost:3001/api/tasks/${id}`, {
    method: "DELETE", // or 'PUT'
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
    id: '',
    description: description,
    project: '',
    created_on: '',
    completed_on: '',
    due_on: '',
  };

  fetch(`http://localhost:3001/api/tasks`, {
    method: "POST", // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
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
