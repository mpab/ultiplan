// list tasks (with recursive option)
// ls: `list all tasks <options> --r, -r recursively`,

import fs from 'fs';
import minimist from 'minimist';

import { DbRecord, DbRecordItem } from "libs/src/db/db-record";
import { getAndCheckDbHandle } from "libs/src/db/db-util";

import visit from "libs/src/utils/dir-visitor";
import stringIsNullOrEmpty from "libs/src/utils/string-is-null-or-empty";

const lsCsv = (handle: string) => {
  fs.readFile(handle, 'utf-8', function (err: any, data: string) {
    if (err) {
      console.error(err);
    }
    const json = JSON.parse(data);
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
    const csv = parse(json, opts);
    console.log(csv);
  });
};

const lsJson = (handle: string) => {
  fs.readFile(handle, 'utf-8', function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const json = JSON.parse(data);
    console.log(json);
  });
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

  fs.readFile(handle, 'utf-8', function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const records = JSON.parse(data);
    for (const item of records) {
      const record: DbRecord = item;
      console.log(lsFormatRecord(record));
      console.log();
    }
  });
};

module.exports = async (handle: string) => {
  const args = minimist(process.argv.slice(2));

  if (args.csv) {
    lsCsv(handle);
    return;
  }

  if (args.json) {
    lsJson(handle);
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
