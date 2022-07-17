// initializes a project

import { RecordView } from "ultiplan-api/src/libs/db/db-record";
import { getDbFilepath } from "../utils/db-handle";

module.exports = async (handle: string) => {
  if (handle) {
    console.warn("DB already exists: " + handle);
    return;
  }

  const [new_db_handle, hidden_dir, db_filename] = getDbFilepath();

  console.log("no DB: " + new_db_handle);
  let records: RecordView[] = [];

  const fs = require("fs");

  if (!fs.existsSync(hidden_dir)) {
    fs.mkdir(hidden_dir, (err: any) => {
      if (err) console.error(err);
    });
    console.log("created directory: " + hidden_dir);
  }

  try {
    fs.writeFile(
      new_db_handle,
      JSON.stringify(records, null, "  "),
      function (err: any) {
        if (err) console.error(err);
      }
    );
  } catch (e) {
    console.error("could not create DB: " + new_db_handle);
    return;
  }

  console.log("created empty DB: " + new_db_handle);
};
