// initializes a project (creates a task database)

import { DbRecord } from "../db/db-record";
import { getAndCheckDbHandle, getDbHandle } from "../db/db-util";

module.exports = () => {
  let [projectDbHandle, _, dir] = getAndCheckDbHandle();
  if (projectDbHandle) {
    console.warn("DB already exists: " + projectDbHandle);
    return;
  }

  projectDbHandle = getDbHandle();

  console.log("no DB: " + projectDbHandle);
  let records: DbRecord[] = [];

  const fs = require("fs");

  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, (err: any) => {
      if (err) console.error(err);
    });
    console.log("created directory: " + dir);
  }

  try {
    fs.writeFile(
      projectDbHandle,
      JSON.stringify(records, null, "  "),
      function (err: any) {
        if (err) console.error(err);
      }
    );
  } catch (e) {
    console.error("could not create DB: " + projectDbHandle);
    return;
  }

  console.log("created empty DB: " + projectDbHandle);
};
