// checks a project for data issues
// check: `check all project tasks <options> --r, -r ..... recursively`,

import { DbRecord } from "ultiplan-api/src/libs/db/db-record";
import { getAndCheckDbHandle } from "../utils/db-handle";
import visit from "ultiplan-api/src/libs/utils/dir-visitor";
import stringIsNullOrEmptyOrWhitespace from "ultiplan-api/src/libs/utils/string-is-null-or-empty-or-whitespace";
import genGuid from "ultiplan-api/src/libs/utils/generate-uuid";
import dbSave from "ultiplan-api/src/libs/db/db-save";
import dbLoad from "ultiplan-api/src/libs/db/db-load";

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

const fixIds = (data: DbRecord[]) => {
  let fixed = 0;
  for (let i = 0; i != data.length; ++i) {
    let record = data[i];
    if (stringIsNullOrEmptyOrWhitespace(record.id)) {
      data[i].id = genGuid();
      ++fixed;
    }
  }

  console.log(`fixed: ${fixed} ids`);
};

const check = (handle: string, fix: boolean, project_name = undefined) => {
  if (stringIsNullOrEmptyOrWhitespace(handle)) return;

  const fpath = handle.replace(/\\/g, "/");

  let json;
  let has_bad_ids = false;

  const records: DbRecord[] = dbLoad(handle);
  if (!records.length) return;

  console.log(`parsing: ${fpath}...`);

  let fail = false;

  try {
    // extract all projects & iterate
    const projects = [...new Set(records.map((record) => record.project))];

    if (projects.length > 1) {
      fail = true;
      console.log(`- error: ${projects.length} projects (can be 0 or 1)`);
    }

    const bad_ids = records.filter((record) =>
      stringIsNullOrEmptyOrWhitespace(record.id)
    );

    if (bad_ids.length) {
      has_bad_ids = true;
      fail = true;
      console.log(
        `- error: ${bad_ids.length} of ${records.length} record(s) have no id`
      );
    }
  } catch (e) {
    fail = true;
    console.log(`## schema error in: ${fpath}`);
    //console.log(e);
  }

  console.log(fail ? "fail" : "pass");
  console.log("----------------------------------------");

  if (fix) {
    if (has_bad_ids) fixIds(records);

    dbSave(records, handle);
  }
};

module.exports = async (handle: string) => {
  const minimist = require(`minimist`);
  const args = minimist(process.argv.slice(2));
  let project_name = args.project || args.p || undefined;

  let fix = false;
  if (args.fix || args.repair) {
    fix = true;
  } else {
    console.log("running in analysis mode - use --fix or --repair if required");
  }

  if (args.r || args.recurse) {
    await visit((dir: string) => {
      const [handle] = getAndCheckDbHandle(dir);
      if (!handle) return;
      check(handle, fix);
    });
    return;
  }

  check(handle, fix, project_name);
};
