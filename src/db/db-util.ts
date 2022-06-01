import errorExit from "../utils/error-exit";
import { DbRecord } from "./db-record";

const dbName = "tasks.json";

const path = require('path')
const projectDbPath = ".ultiplan";
const projectDbHandle = path.join(projectDbPath, dbName);
const globalDbPath = path.join(process.env.home, ".ultiplan");;
const globalDbHandle = path.join(globalDbPath, dbName);

export const getDbHandle = (use_logging: boolean = false) => {
  const fs = require("fs");
  try {
    //if (use_logging) console.log("looking for: " + projectDbHandle);
    fs.accessSync(projectDbHandle, fs.constants.F_OK);
    if (use_logging) console.log("using project DB: " + projectDbHandle);
    return projectDbHandle;
  } catch (e) {
    if (use_logging) console.log("no project DB: " + projectDbHandle);
  }

  

  try {
    //console.log("looking for: " + globalDbHandle);
    fs.accessSync(globalDbHandle, fs.constants.F_OK);
    if (use_logging) console.log("using global DB: " + globalDbHandle);
    return globalDbHandle;
  } catch (e) {
    if (use_logging) console.log("no global DB: " + globalDbHandle);
  }

  //if (use_logging) console.warn("no databases: " + projectDbHandle + ", " + globalDbHandle);
  return "";
};

const dbInitPath = (handle: string, path: string) => {
  const fs = require("fs");
  try {
    fs.accessSync(handle, fs.constants.F_OK);
    console.warn("DB already exists: " + handle);
    return;
  } catch (e) {
    console.log("no DB: " + handle);
  }
  let records: DbRecord[] = [];

  if (!fs.existsSync(path)) {
    fs.mkdir(path, (err: any) => {
      if (err) console.error(err);
    });
    console.log("created: " + path);
  } 

  console.log("using directory: " + path);

  try {
    fs.writeFile(
      projectDbHandle,
      JSON.stringify(records, null, "  "),
      function (err: any) {
        if (err) console.error(err);
      }
    );
  } catch (e) {
    console.error("could not create DB: " + handle);
  }

  console.log("created empty DB: " + handle);
} 

export const dbInit = () => {
  // this is buggy - probably a sync issue
  //dbInitPath(globalDbHandle, globalDbPath);
  dbInitPath(projectDbHandle, projectDbPath);
};
