// list tasks (with recursive option)
// ls: `list all tasks <options> --r, -r ..... recursively`,

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
  const fs = require("fs");

  fs.readFile(handle, function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const records = JSON.parse(data);
    for (let jsonRecord of records) {
      let record: DbRecord = jsonRecord;
      console.log(lsFormatRecord(record));
    }
  });
};

module.exports = async (handle: string) => {
  const argv = require("minimist")(process.argv.slice(2));
  if (argv.csv) {
    lsCsv(handle);
    return;
  }

  if (argv.json) {
    lsJson(handle);
    return;
  }

  ls(handle);

  if (argv.r) {
    await require(`../utils/dir-visitor`)(ls, getAndCheckDbHandle);
  }
};
