const dbName = "tasks.json";

const path = require("path");

const projectDbPath = ".ultiplan";

export const getDbHandle = (): string => {
  return path.join(projectDbPath, dbName);
};

export const getAndCheckDbHandle = (
  dir = ""
): [handle: string | null, info: string, dir: string] => {
  const fs = require("fs");
  const handle = getDbHandle();
  const projectDbHandle = dir ? path.join(dir, handle) : handle;
  try {
    fs.accessSync(projectDbHandle, fs.constants.F_OK);
    return [
      projectDbHandle,
      "using project DB: " + projectDbHandle,
      projectDbPath,
    ];
  } catch (e) {}

  return [null, "no project DB", projectDbPath];
};
