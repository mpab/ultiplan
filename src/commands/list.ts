// list all tasks

import { DbRecord } from "../db/db-record";
import { getDbHandle } from "../db/db-util";

module.exports = () => {
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
};
