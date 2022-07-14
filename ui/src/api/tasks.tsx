import { TaskRecord } from "./types";

export const taskReadAll = (
  processResponse: (response: any) => void,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) => {
  fetch(`http://localhost:3001/api/tasks`, {})
    .then((response) => processResponse(response))
    .then((data) => onSuccess(data))
    .catch((error) => onError(error));
};

export const taskDelete = (
  id: string,
  processResponse: (response: any) => void,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) => {
  fetch(`http://localhost:3001/api/tasks/${id}`, {
    method: "DELETE",
  })
    .then((response) => processResponse(response))
    .then((data) => onSuccess(data))
    .catch((error) => onError(error));
};

export const taskCreate = (
  taskRecord: TaskRecord,
  processResponse: (response: any) => void,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) => {
  fetch(`http://localhost:3001/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskRecord),
  })
    .then((response) => processResponse(response))
    .then((data) => onSuccess(data))
    .catch((error) => onError(error));
};

export const taskUpdate = (
  taskRecord: TaskRecord,
  processResponse: (response: any) => void,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) => {
  fetch(`http://localhost:3001/api/tasks`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskRecord),
  })
    .then((response) => processResponse(response))
    .then((data) => onSuccess(data))
    .catch((error) => onError(error));
};
