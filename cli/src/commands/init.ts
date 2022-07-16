// initializes a project

import { RecordView } from "ultiplan-api/src/libs/db/db-record";
import { getAndCheckDbHandle, getDbHandle } from "../utils/db-handle";

module.exports = () => {
  let [projectDbHandle, _, dir] = getAndCheckDbHandle();
  if (projectDbHandle) {
    console.warn("DB already exists: " + projectDbHandle);
    return;
  }

  projectDbHandle = getDbHandle();

  console.log("no DB: " + projectDbHandle);
  let records: RecordView[] = [];

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
