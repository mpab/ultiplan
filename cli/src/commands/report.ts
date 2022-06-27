// generate a tasks report

import { DbRecord, DbRecordItem } from "../db/db-record";
import { getAndCheckDbHandle } from "../db/db-util";

const formatRecord = (record: DbRecord) => {
  let text =
    "- " +
    (record.completed_on ? record.completed_on + ": " : "") +
    record.description;

  const formatElement = (element: string, indent: number) => {
    text = text + `\n` + ` `.repeat(indent << 2) + `- ` + element;
    //text = text + `\n - ${indent}: ` + element;
  };

  const formatItems = (items: DbRecordItem, indent = 0) => {
    if (!items) return;

    for (let item of items) {
      if (!item) {
        //formatElement(`NULL`, indent);
        continue;
      }

      if (Array.isArray(item)) {
        formatItems(item as unknown as DbRecordItem, indent + 1);
        continue;
      }

      formatElement(item as string, indent + 1);
    }
  };

  formatItems(record.tags);

  return text;
};

const recordsToMarkdown = (project_records: DbRecord[], project: string) => {
  console.log("## " + project);

  const todo: DbRecord[] = project_records.filter(
    (record) => record.project === project && !record.completed_on
  );

  const done: DbRecord[] = project_records
    .filter((record) => record.project === project && record.completed_on)
    .sort(function (a, b) {
      return ("" + b.completed_on).localeCompare(a.completed_on);
    });

  if (todo.length) {
    console.log("");
    console.log("### todo: " + project);
    for (let record of todo) console.log(formatRecord(record));
  }
  if (done.length) {
    console.log("");
    console.log("### done: " + project);
    for (let record of done) console.log(formatRecord(record));
  }
};

const projectToMarkdown = (
  unfilteredRecords: DbRecord[],
  project_name: string
) => {
  const records = unfilteredRecords.filter(
    (record) => record.project === project_name
  );
  if (!records.length) return;
  recordsToMarkdown(records, project_name);
};

const reportAsMarkdown = (handle: string, project_name = undefined) => {
  if (require(`../utils/string-is-null-or-empty`)(handle)) return;

  const fs = require("fs");
  fs.readFile(handle, function (err: any, data: string) {
    if (err) {
      console.log(`## error reading: ` + handle.replace(/\\/g, "/"));
      console.log("---");
      return;
    }

    try {
      const unfilteredRecords: DbRecord[] = JSON.parse(data);
      const args = require(`minimist`)(process.argv.slice(2));
      let project_name = args.project || args.p || undefined;

      if (project_name) {
        projectToMarkdown(unfilteredRecords, project_name);
        return;
      }

      // extract all projects & iterate
      const projects = [
        ...new Set(unfilteredRecords.map((record) => record.project)),
      ];

      for (project_name of projects) {
        const records = unfilteredRecords.filter(
          (record) => record.project === project_name
        );
        projectToMarkdown(records, project_name);
      }
    } catch (e) {
      console.log(`## unhandled schema in: ` + handle.replace(/\\/g, "/"));
    }
    console.log("---");
  });
};

module.exports = async (handle: string) => {
  const minimist = require(`minimist`);
  const args = minimist(process.argv.slice(2));
  let project_name = args.project || args.p || undefined;

  console.log(project_name ? `# PROJECTS (${project_name})` : "# PROJECTS");

  if (args.r || args.recurse) {
    await require(`../utils/dir-visitor`)((dir: string) => {
      const [handle] = getAndCheckDbHandle(dir);
      if (!handle) return;
      reportAsMarkdown(handle);
    });
    return;
  }

  reportAsMarkdown(handle, project_name);

};
