// export tasks as markdown

import { DbRecord } from "../db/db-record";
import { dbHandle } from "../db/db-util";

module.exports = () => {
  const fs = require("fs");
  fs.readFile(dbHandle, function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }

    console.log("# PROJECTS");
    console.log("");

    let project = "ultiplan";

    const unfilteredRecords: DbRecord[] = JSON.parse(data);

    console.log("## project: " + project);
    console.log("");

    const todo: DbRecord[] = unfilteredRecords
      .filter(record => record.project === project && !record.completed_on);
    
    const done: DbRecord[] = unfilteredRecords
      .filter(record => record.project === project && record.completed_on);

    console.log("### todo: " + project);
    console.log("");
    for (let record of todo) console.log(format(record));
    console.log("");
    console.log("### done: " + project);
    console.log("");
    for (let record of done) console.log(format(record));
  });

  const format = (record: DbRecord) => {
    return "- " + (record.completed_on ? record.completed_on + ": " : "") + record.description;
  }
};
