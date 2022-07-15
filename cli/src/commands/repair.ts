// checks a project for data issues
// check: `check all project tasks <options> --r, -r ..... recursively`,

import { DbRecord } from "ultiplan-api/src/libs/db/db-record";
import { getAndCheckDbHandle } from "../utils/db-handle";
import visit from "ultiplan-api/src/libs/utils/dir-visitor";
import stringIsNullOrEmpty from "ultiplan-api/src/libs/utils/string-is-null-or-empty";

const checkRecordsBelongToProject = (
  project_name: string,
  records: DbRecord[]
) => {
  console.log(`checking project: ${project_name}`);
  let errors = 0;
  for (const record of records) {
    if (record.project !== project_name) {
      console.log(`mismatch: ${project_name} ${record}`);
      ++errors;
    }
  }

  if (!errors) console.log(`passed`);
};

const check = (handle: string, project_name = undefined) => {

  if (stringIsNullOrEmpty(handle)) return;

  const fpath = handle.replace(/\\/g, "/");

  let data;

  try {
    data = require("fs").readFileSync(handle);
  } catch (e) {
    console.log(`## file error reading: ${fpath}`);
    console.log(e);
    return;
  }

  console.log(`parsing: ${fpath}...`);

  let fail = false;

  try {
    const unfilteredRecords: DbRecord[] = JSON.parse(data);
    const args = require(`minimist`)(process.argv.slice(2));

    // extract all projects & iterate
    const projects = [
      ...new Set(unfilteredRecords.map((record) => record.project)),
    ];

    if (projects.length > 1) {
      fail = true;
      console.log(`- error: ${projects.length} projects (can be 0 or 1)`);
    }

    const bad_ids = unfilteredRecords.filter((record) => stringIsNullOrEmpty(record.id))

    if (bad_ids.length) {
      fail = true;
      console.log(`- error: ${bad_ids.length} of ${unfilteredRecords.length} record(s) have no id`);
    }

  } catch (e) {
    fail = true;
    console.log(`## schema error in: ${fpath}`);
    //console.log(e);
  }

  console.log(fail ? "fail" : "pass");
  console.log("----------------------------------------")
};

module.exports = async (handle: string) => {
  const minimist = require(`minimist`);
  const args = minimist(process.argv.slice(2));
  let project_name = args.project || args.p || undefined;

  if (args.r || args.recurse) {
    await visit((dir: string) => {
      const [handle] = getAndCheckDbHandle(dir);
      if (!handle) return;
      check(handle);
    });
    return;
  }

  check(handle, project_name);
};
