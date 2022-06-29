const dbFileName = "tasks.json";
const projectDbPath = ".ultiplan";

export const getDbHandle = (
  dir = projectDbPath,
  fileName = dbFileName,
): string => {
  const path = require("path");
  return path.join(dir, fileName);
};

export const getAndCheckDbHandle = (
  dir = projectDbPath,
  fileName = dbFileName
): [handle: string | null, info: string, dir: string] => {
  //console.log(`getAndCheckDbHandle fileName: ${fileName}`);
  //console.log(`getAndCheckDbHandle dir: ${dir}`);

  const dbFilePath = getDbHandle(dir, fileName);
  //console.log(`getAndCheckDbHandle dbFilePath: ${dbFilePath}`);

  const fs = require("fs");
  try {
    fs.accessSync(dbFilePath, fs.constants.F_OK);
    return [
      dbFilePath,
      "using project DB: " + dbFilePath,
      projectDbPath,
    ];
  } catch (e) {
    //console.log(e)
  }

  return [null, "no project DB", projectDbPath];
};
