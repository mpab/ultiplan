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
};

const lsJson = () => {
  const fs = require("fs");

  fs.readFile(getDbHandle(), function (err: any, data: string) {
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

const lsRecurse = async () => {
  const fs = require("fs");
  const path = require("path");
  async function* walk(dir: string): any {
    for await (const d of await fs.promises.opendir(dir)) {
      if (d.isDirectory()) {
        const entry = path.join(dir, d.name);
        const handle = path.join(dir, d.name, getDbHandle(false));
        if (handle) {
          const fs = require("fs");
          fs.readFile(handle, function (err: any, data: string) {
            if (!err) {
              const records = JSON.parse(data);
              for (let jsonRecord of records) {
                let record: DbRecord = jsonRecord;
                console.log(lsFormatRecord(record));
              }
            }
          });
        }

        yield* await walk(entry);
      }
    }
  }
  for await (const p of walk("./")) console.log(p);
};

const ls = () => {
  const fs = require("fs");
  fs.readFile(getDbHandle(), function (err: any, data: string) {
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

module.exports = async () => {
  const argv = require("minimist")(process.argv.slice(2));
  if (argv.csv) {
    lsCsv();
    return;
  }

  if (argv.json) {
    lsJson();
    return;
  }

  if (argv.r) {
    await lsRecurse();
    return;
  }

  ls();
};
