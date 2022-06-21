// checks if all of the tasks in a project have the same name
// check: `check all project tasks <options> --r, -r ..... recursively`,

import { exit } from "process";
import { DbRecord, DbRecordItem } from "../db/db-record";
import { getAndCheckDbHandle, getDbHandle } from "../db/db-util";
import errorExit from "../utils/error-exit";

const checkRecordsBelongToProject = (project_name: string, records: DbRecord[]) => {
  console.log(`checking project: ${project_name}`)
  let errors = 0;
  for (const record of records) {
    if (record.project !== project_name) {
      console.log(`mismatch: ${project_name} ${record}`);
      ++errors;
    }
  }

  if (!errors) console.log(`passed`);
}

const check = (handle: string, project_name = undefined) => {
  if (require(`../utils/string-is-null-or-empty`)(handle)) return;

  const fpath = handle.replace(/\\/g, "/");

  const fs = require("fs");
  fs.readFile(handle, function (err: any, data: string) {
    if (err) {
      console.log(`## error reading: ` + fpath);
      return;
    }

    try {
      const unfilteredRecords: DbRecord[] = JSON.parse(data);
      const args = require(`minimist`)(process.argv.slice(2));
      let project_name = args.project || args.p || undefined;

      // extract all projects & iterate
      const projects = [
        ...new Set(unfilteredRecords.map((record) => record.project)),
      ];

      if (projects.length == 0) {
        console.log(`passed: empty project ${fpath}`);
        return;
      }

      if (projects.length == 1) {
        console.log(`passed: one project in ${fpath}`);
        return;
      }

      console.log(`failed: ${projects.length} projects in ${fpath}`);

    } catch (e) {
      console.log(`## unhandled schema in: ` + fpath);
      console.log(e);
    }
  });
};

module.exports = async (handle: string) => {
  const minimist = require(`minimist`);
  const args = minimist(process.argv.slice(2));
  let project_name = args.project || args.p || undefined;

  check((handle = handle), (project_name = project_name));

  if (args.r || args.recurse || undefined) {
    await require(`../utils/dir-visitor`)(check, getAndCheckDbHandle);
  }
};
