// list all tasks

import { DbRecord } from "../db/db-record";

module.exports = async (args: { _: any[] }) => {
  const fs = require("fs");
  const jsonFile = process.cwd() + "\\data\\tasks.json";

  fs.readFile(jsonFile, function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const records = JSON.parse(data);
    for (let jsonRecord of records) {
      let record: DbRecord = jsonRecord;
      let category = categorise(record);
      console.log(category + " " + record.description);
    }
  });

  const categorise = (record: DbRecord) => {
    return "note";
  }
};
