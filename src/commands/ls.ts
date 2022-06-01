// list tasks (non-recursively)

import { DbRecord } from "../db/db-record";
import { getDbHandle } from "../db/db-util";

const lsCsv = () => {
    const fs = require("fs");
    fs.readFile(getDbHandle(), function (err: any, data: string) {
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
}
const lsJson = () => {
  const fs = require("fs");

  fs.readFile(getDbHandle(), function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const json = JSON.parse(data);
    console.log(json);
  });
}

const ls = () => {
  const fs = require("fs");
  fs.readFile(getDbHandle(), function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const records = JSON.parse(data);
    for (let jsonRecord of records) {
      let record: DbRecord = jsonRecord;
      console.log(format(record));
    }
  });

  const format = (record: DbRecord) => {
    return record.project + ": " + record.description;
  }
}

module.exports = () => {

  const argv = require('minimist')(process.argv.slice(2));
  if (argv.csv) {
    lsCsv();
    return;
  }

  if (argv.json) {
    lsJson();
    return;
  }

  ls();
};
