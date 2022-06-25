// checks a project for data issues
// check: `check all project tasks <options> --r, -r ..... recursively`,

import { exit } from "process";
import { DbRecord, DbRecordItem } from "../db/db-record";
import { getAndCheckDbHandle } from "../db/db-util";
import errorExit from "../utils/error-exit";

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
  const stringIsNullOrEmpty = require(`../utils/string-is-null-or-empty`);

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

  check((handle = handle), (project_name = project_name));

  if (args.r || args.recurse || undefined) {
    await require(`../utils/dir-visitor`)(check, getAndCheckDbHandle);
  }
};
