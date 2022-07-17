// checks a project for data issues
// check: `check all project tasks <options> --r, -r ..... recursively`,

import { DbRecord_2022_07_16 } from "ultiplan-api/src/libs/db/db-record";
import stringIsNullOrEmptyOrWhitespace from "ultiplan-api/src/libs/utils/string-is-null-or-empty-or-whitespace";
import genGuid from "ultiplan-api/src/libs/utils/generate-uuid";
import dbSave from "ultiplan-api/src/libs/db/db-save";
import dbLoad from "ultiplan-api/src/libs/db/db-load";
import { safeGetDbHandle } from "../utils/db-handle";
import visit from "../utils/dir-visitor";
import dateYYYYMMDD from "ultiplan-api/src/libs/utils/dates";

const fixDates = (records: DbRecord_2022_07_16[]) => {
  let fixed = 0;
  for (let i = 0; i != records.length; ++i) {
    let record = records[i];
    if (stringIsNullOrEmptyOrWhitespace(record.dates.created_on)) {
      records[i].dates.created_on = dateYYYYMMDD(new Date());
      ++fixed;
    }
  }
  console.log(`fixed: ${fixed} ids`);
};

const fixIds = (records: DbRecord_2022_07_16[]) => {
  let fixed = 0;
  for (let i = 0; i != records.length; ++i) {
    let record = records[i];
    if (stringIsNullOrEmptyOrWhitespace(record.id)) {
      records[i].id = genGuid();
      ++fixed;
    }
  }
  console.log(`fixed: ${fixed} ids`);
};

const removeProjects = (records: DbRecord_2022_07_16[]) => {
  let removed = 0;
  for (let i = 0; i != records.length; ++i) {
    let o = records[i] as any;
    if (o[`project`]) {
      delete o[`project`];
      records[i] = o;
      ++removed;
    }
  }
  console.log(`removed: ${removed} project`);
};

const check = (handle: string, fix: boolean, verbose: boolean) => {
  if (stringIsNullOrEmptyOrWhitespace(handle)) return;

  const fpath = handle.replace(/\\/g, "/");

  let has_bad_ids = false;
  let has_no_dates_tag = false;
  let has_no_dates_created_on = false;
  let has_bad_projects = false;
  let filtered_records: DbRecord_2022_07_16[];

  const [records, error] = dbLoad(handle);
  if (error) return;

  console.log(`${records.length} records in file ${fpath}: parsing...`);
  console.log("----------------------------------------");

  let fail = false;

  try {
    // extract all projects & iterate
    filtered_records = records.filter((record) => {
      let o = record as any;
      if (o[`project`]) return record;
    });

    if (filtered_records.length) {
      fail = true;
      console.log(`- error: ${filtered_records.length} projects (should be 0)`);
      verbose && console.log(filtered_records);
      has_bad_projects = true;
    }

    filtered_records = records.filter((record) =>
      stringIsNullOrEmptyOrWhitespace(record.id)
    );

    if (filtered_records.length) {
      has_bad_ids = true;
      fail = true;
      console.log(`- ${filtered_records.length} record(s) have no id`);
      verbose && console.log(filtered_records);
    }

    filtered_records = records.filter((record) => !record.dates);
    if (filtered_records.length) {
      has_no_dates_tag = true;
      fail = true;
      console.log(`- ${filtered_records.length} record(s) have no dates tag`);
      verbose && console.dir(filtered_records);
    }

    filtered_records = records.filter((record) => record.dates);
    filtered_records = filtered_records.filter(
      (record) => record.dates.created_on
    );
    if (filtered_records.length < records.length) {
      has_no_dates_created_on = true;
      fail = true;
      console.log(
        `- ${records.length - filtered_records.length} record(s) have no dates created_on tag`
      );
      verbose && console.log(filtered_records);
    }
  } catch (e) {
    fail = true;
    console.log(`## schema error in: ${fpath}`);
    console.error(e);
  }

  console.log(fail ? "fail" : "pass");

  if (fix) {
    if (has_bad_ids) fixIds(records);
    if (has_bad_projects) removeProjects(records);
    if (has_no_dates_created_on) fixDates(records);
    dbSave(records, handle);
  }
};

module.exports = async (handle: string) => {
  const minimist = require(`minimist`);
  const args = minimist(process.argv.slice(2));

  let fix = false;
  if (args.fix || args.repair) {
    fix = true;
  } else {
    console.log("analysis mode - use --fix or --repair if required");
  }

  let verbose = false;
  if (args.v || args.verbose) {
    verbose = true;
  } else {
    console.log("terse mode - use --verbose or --v if required");
  }

  check(handle, fix, verbose);

  if (args.r || args.recurse) {
    await visit((dir: string) => {
      const [file_handle] = safeGetDbHandle(dir);
      if (!file_handle.length) return;
      check(handle, fix, verbose);
    }, process.cwd());
    return;
  }
};
