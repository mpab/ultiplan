// list tasks (with recursive option)
// ls: `list all tasks <options> --r, -r recursively`,

import fs from 'fs';
import minimist from 'minimist';
import dbLoad from 'ultiplan-api/src/libs/db/db-load';

import { DbRecord } from "ultiplan-api/src/libs/db/db-record";
import { getAndCheckDbHandle } from "../utils/db-handle";

import visit from "ultiplan-api/src/libs/utils/dir-visitor";
import stringIsNullOrEmpty from "ultiplan-api/src/libs/utils/string-is-null-or-empty";

const lsCsv = (handle: string) => {
  const records = dbLoad(handle);

  for (const item of records) {
    const record: DbRecord = item;
    const { parse } = require("json2csv");
    const fields = [
      "description",
      "created_on",
      "started_on",
      "due_on",
      "completed_on",
      "project",
      "tags",
    ];
    const opts = { fields };
    const csv = parse(record, opts);
    console.log(csv);
    console.log();
  }
};

const lsAttr = (handle: string) => {
  const records = dbLoad(handle);

  for (const item of records) {
    const record: DbRecord = item;
    console.dir(record);
    console.log();
  }
};

const lsFormatRecord = (record: DbRecord) => {
  const id = stringIsNullOrEmpty(record.id) ? "00000000-0000-0000-0000-000000000000" : record.id;
  let ret = `${record.project}-${id}\n${record.description}`;
  for (const tag of record.tags) {
    ret += `\n- ` + tag;
  }
  return ret;
};

const ls = (handle: string) => {
  //console.log(`list ${handle}`)
  //console.log(`found DB ${handle}`)

  const records = dbLoad(handle);

  for (const item of records) {
    const record: DbRecord = item;
    console.log(lsFormatRecord(record));
    console.log();
  }
};

module.exports = async (handle: string) => {
  const args = minimist(process.argv.slice(2));

  if (args.csv) {
    lsCsv(handle);
    return;
  }

  if (args.attr) {
    lsAttr(handle);
    return;
  }

  if (args.r || args.recurse) {
    await visit((dir: string) => {
      const [handle] = getAndCheckDbHandle(dir);
      if (!handle) return;
      ls(handle);
    });
    return;
  }

  ls(handle);

};
