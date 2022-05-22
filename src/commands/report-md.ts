// generate a tasks report in markdown

import { DbRecord } from "../db/db-record";
import { dbHandle } from "../db/db-util";

module.exports = () => {
  const minimist = require(`minimist`);
  const args = minimist(process.argv.slice(2));

  const fs = require("fs");
  fs.readFile(dbHandle, function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }

    console.log("# PROJECTS");
    console.log("");

    const unfilteredRecords: DbRecord[] = JSON.parse(data);
    let project_name = args.project || args.p || undefined;

    if (project_name) {
      const records = unfilteredRecords.filter(record => record.project === project_name);
      report(records, project_name);
      console.log("");
      console.log("---");
      console.log("");
      return;
    }
  
    // extract all projects & iterate
    const projects = [...new Set(unfilteredRecords.map(record => record.project))];

    for (project_name of projects) {
      const records = unfilteredRecords.filter(record => record.project === project_name);
      report(records, project_name);
      console.log("");
      console.log("---");
      console.log("");
    }    
  });

  const report = (project_records: DbRecord[], project: string) => {
    console.log("## project: " + project);
    console.log("");

    const todo: DbRecord[] = project_records
      .filter(record => record.project === project && !record.completed_on);
    
    const done: DbRecord[] = project_records
      .filter(record => record.project === project && record.completed_on);

    console.log("### todo: " + project);
    console.log("");
    for (let record of todo) console.log(format(record));
    console.log("");
    console.log("### done: " + project);
    console.log("");
    for (let record of done) console.log(format(record));

  }

  const format = (record: DbRecord) => {
    return "- " + (record.completed_on ? record.completed_on + ": " : "") + record.description;
  }
};
