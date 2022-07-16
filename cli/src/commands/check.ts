// checks a project for data issues
// check: `check all project tasks <options> --r, -r ..... recursively`,

import {
  DbRecord_2022_07_16,
  RecordView,
} from "ultiplan-api/src/libs/db/db-record";
import { getAndCheckDbHandle } from "../utils/db-handle";
import visit from "ultiplan-api/src/libs/utils/dir-visitor";
import stringIsNullOrEmptyOrWhitespace from "ultiplan-api/src/libs/utils/string-is-null-or-empty-or-whitespace";
import genGuid from "ultiplan-api/src/libs/utils/generate-uuid";
import dbSave from "ultiplan-api/src/libs/db/db-save";
import dbLoad from "ultiplan-api/src/libs/db/db-load";

const checkRecordsBelongToProject = (
  project_name: string,
  records: RecordView[]
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

const fixIds = (data: DbRecord_2022_07_16[]) => {
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

  let has_bad_ids = false;
  let has_bad_dates = false;
  let filtered_records: DbRecord_2022_07_16[];

  const [records, error] = dbLoad(handle);
  if (error) return;

  console.log(`${records.length} records in file ${fpath}: parsing...`);
  console.log("----------------------------------------");

  let fail = false;

  try {
    // extract all projects & iterate
    const projects = [...new Set(records.map((record) => record.project))];

    if (projects.length > 1) {
      fail = true;
      console.log(`- error: ${projects.length} projects (should be 0 or 1)`);
      console.log(projects);
    }

    filtered_records = records.filter((record) =>
      stringIsNullOrEmptyOrWhitespace(record.id)
    );

    if (filtered_records.length) {
      has_bad_ids = true;
      fail = true;
      console.log(
        `- ${filtered_records.length} record(s) have no id`
      );
    }

    filtered_records = records.filter((record) => !record.dates);
    if (filtered_records.length) {
      has_bad_dates = true;
      fail = true;
      console.log(
        `- ${filtered_records.length} record(s) have no dates tag`
      );
        console.dir(filtered_records)
    }

    filtered_records = records.filter((record) =>
      !stringIsNullOrEmptyOrWhitespace(record.id)
    );
    filtered_records = filtered_records.filter((record) => record.dates);
    filtered_records = filtered_records.filter((record) => record.dates.created_on);
    if (filtered_records.length < records.length) {
      has_bad_dates = true;
      fail = true;
      console.log(
        `- ${filtered_records.length} record(s) have no dates created_on tag`
      );
    }

  } catch (e) {
    fail = true;
    console.log(`## schema error in: ${fpath}`);
    console.error(e);
  }

  console.log(fail ? "fail" : "pass");

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
