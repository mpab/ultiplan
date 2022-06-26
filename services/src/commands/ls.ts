// list tasks (with recursive option)
// ls: `list all tasks <options> --r, -r recursively`,

import { DbRecord } from "../db/db-record";
import { getAndCheckDbHandle } from "../db/db-util";

const lsCsv = (handle: string) => {
  const fs = require("fs");
  fs.readFile(handle, function (err: any, data: string) {
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
  const fs = require("fs");

  fs.readFile(handle, function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const json = JSON.parse(data);
    console.log(json);
  });
};

const lsFormatRecord = (record: DbRecord) => {
  return record.project + ": " + record.description;
};

const ls = (handle: string) => {
  //console.log(`list ${handle}`)
  //console.log(`found DB ${handle}`)

  const fs = require("fs");
  fs.readFile(handle, function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const records = JSON.parse(data);
    for (const item of records) {
      const record: DbRecord = item;
      console.log(lsFormatRecord(record));
    }
  });
};

module.exports = async (handle: string) => {
  const args = require("minimist")(process.argv.slice(2));
  if (args.csv) {
    lsCsv(handle);
    return;
  }

  if (args.json) {
    lsJson(handle);
    return;
  }

  ls(handle);

  if (args.r || args.recurse || undefined) {
    await require(`../utils/dir-visitor`)((dir: string) => {
      const [handle] = getAndCheckDbHandle(dir);
      if (!handle) return;
      ls(handle);
    });
  }

};
