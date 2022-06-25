const dbFileName = "tasks.json";

const path = require("path");

const projectDbPath = ".ultiplan";

export const getDbHandle = (
  fileName = dbFileName,
): string => {
  return path.join(projectDbPath, fileName);
};

export const getAndCheckDbHandle = (
  fileName = dbFileName
): [handle: string | null, info: string, dir: string] => {
  const fs = require("fs");
  const dbFilePath = getDbHandle(fileName);
  try {
    fs.accessSync(dbFilePath, fs.constants.F_OK);
    return [
      dbFilePath,
      "using project DB: " + dbFilePath,
      projectDbPath,
    ];
  } catch (e) {
  }

  return [null, "no project DB", projectDbPath];
};
