export class CRUD {
  constructor(url: URL) {
    this.url = url;
  }
  url: URL;

  info = (
    processResponse: (response: any) => void,
    onSuccess: (data: any) => void,
    onError: (error: any) => void
  ) => {
    fetch(this.url + `info`, {})
      .then((response) => processResponse(response))
      .then((data) => onSuccess(data))
      .catch((error) => onError(error));
  };

  apiReadAll = (
    processResponse: (response: any) => void,
    onSuccess: (data: any) => void,
    onError: (error: any) => void
  ) => {
    fetch(this.url, {})
      .then((response) => processResponse(response))
      .then((data) => onSuccess(data))
      .catch((error) => onError(error));
  };

  apiDelete = (
    id: string,
    processResponse: (response: any) => void,
    onSuccess: (data: any) => void,
    onError: (error: any) => void
  ) => {
    fetch(this.url + id, {
      method: "DELETE",
    })
      .then((response) => processResponse(response))
      .then((data) => onSuccess(data))
      .catch((error) => onError(error));
  };

  apiCreate = (
    payload: any,
    processResponse: (response: any) => void,
    onSuccess: (data: any) => void,
    onError: (error: any) => void
  ) => {
    fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => processResponse(response))
      .then((data) => onSuccess(data))
      .catch((error) => onError(error));
  };

  apiUpdate = (
    payload: any,
    processResponse: (response: any) => void,
    onSuccess: (data: any) => void,
    onError: (error: any) => void
  ) => {
    fetch(this.url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => processResponse(response))
      .then((data) => onSuccess(data))
      .catch((error) => onError(error));
  };
}
