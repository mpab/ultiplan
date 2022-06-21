// moves/renames a project (non-recursive)
// mv: `move/rename project <old name> <new name>`,

import { DbRecord } from "../db/db-record";
import { getAndCheckDbHandle, getDbHandle } from "../db/db-util";
import errorExit from "../utils/error-exit";

const mv = async (old_project: string, new_project: string) => {
  // specification
  // 1. exit with error if old project name is null or empty
  // 2. exit with error if new project name is null or empty
  // 3. exit with error if old project == new_project
  // 4. exit with error if new project already exists (file)
  // 5. exit with error if old project not found (folder, file)
  // 6. if (new folder does not exist) create a new project folder
  // 7. read all records from the old project into memory
  // 8. change all the records' projects to the new name
  // 9. write out the records in memory to the new project (folder, file)
  // notes
  // - merge is not supported

  const is_null_or_empty = require(`../utils/string-is-null-or-empty`);
  if (is_null_or_empty(old_project))
    errorExit(`old project "${old_project}" is invalid`); // 1
  if (is_null_or_empty(new_project))
    errorExit(`new project "${new_project}" is invalid`); // 2

  if (old_project == new_project)
    errorExit(`project names must be different`); // 3

  const fs = require("fs");

  try { // 4
    const stat = fs.statSync(new_project);
    if (stat.isDirectory()) errorExit(`new project "${new_project}" already exists`);
  } catch (err) {
  }

  const [old_handle, old_info] = getAndCheckDbHandle(old_project); // 5
  if (!old_handle) errorExit(`project "${old_project}" ${old_info}`);

  fs.renameSync(old_project, new_project);
  const [handle, info] = getAndCheckDbHandle(new_project);

  let records: DbRecord[] = [];

  fs.readFile(handle, function (err: any, json_string: string) {
    if (err) {
      console.warn(err);
    } else {
      records = JSON.parse(json_string);
    }

    for (const record of records) {
      record.project = new_project;
    }

    fs.writeFile(handle, JSON.stringify(records, null, "  "), function (err: any) {
      if (err) errorExit(err);
    });

    console.log(`moved: ${old_handle}->${handle}`);
  });
};

module.exports = async () => {
  let argv: string[] = process.argv.slice(3);

  await mv(argv[0], argv[1]);
};