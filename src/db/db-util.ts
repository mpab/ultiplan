import errorExit from "../utils/error-exit";
import { DbRecord } from "./db-record";

export const dbPath: string = "./data/";
export const dbHandle: string = dbPath + "tasks.json";

export const dbValidate = (exit: boolean = true) => {
  const fs = require("fs");
  try {
    fs.accessSync(dbHandle, fs.constants.F_OK);
    return "";
  } catch (e) {}
  return "database not found: " + dbHandle + ", use dbinit";
};

export const dbInit = () => {
  const fs = require("fs");
  try {
    fs.accessSync(dbHandle, fs.constants.F_OK);
    console.warn("database already exists: " + dbHandle);
    return;
  } catch (e) {}
  let records: DbRecord[] = [];

  if (!fs.existsSync(dbPath)) {
    fs.mkdir(dbPath, (err: any) => {
      if (err) errorExit(err);;

      fs.writeFile(
        dbHandle,
        JSON.stringify(records, null, "  "),
        function (err: any) {
          if (err) {
            errorExit(err);
          }
        }
      );
    });
  }
};
