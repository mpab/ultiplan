// generate a tasks report

import { DbRecord } from "../db/db-record";
import { getAndCheckDbHandle, getDbHandle } from "../db/db-util";

const formatRecord = (record: DbRecord) => {
  let text =
    "- " +
    (record.completed_on ? record.completed_on + ": " : "") +
    record.description;

  for (const tag of record.tags) {
    if (tag.constructor === Array) {
      //text = text + `\n  - ARRAY`;
      let idx = 0;
      for (const el of tag)
        if (idx++ === 0) {
          text = text + `\n  - ` + el;
        } else {
          for (const sub_el of el) {
            text = text + `\n    - ` + sub_el;
          }
        }
      continue;
    }
    text = text + `\n  - ` + tag;
  }

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
  console.log("---");
};

const reportAsMarkdown = (handle: string, project_name = undefined) => {
  const args = require(`minimist`)(process.argv.slice(2));
  const fs = require("fs");
  fs.readFile(handle, function (err: any, data: string) {
    if (err) {
      //if (logErrors) console.error(err);
      return;
    }

    const unfilteredRecords: DbRecord[] = JSON.parse(data);
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
  });
};

const reportRecurse = async () => {
  const fs = require("fs");
  const path = require("path");

  async function* walk(dir: string): any {
    for await (const d of await fs.promises.opendir(dir)) {
      if (d.isDirectory()) {
        const entry = path.join(dir, d.name);
        const [handle, info] = getAndCheckDbHandle(entry);
        if (handle) {
          reportAsMarkdown(handle);
        }

        yield* await walk(entry);
      }
    }
  }
  for await (const p of walk("./"));
};

module.exports = async (handle: string) => {
  const minimist = require(`minimist`);
  const args = minimist(process.argv.slice(2));

  let project_name = args.project || args.p || undefined;

  console.log(project_name ? `# PROJECTS (${project_name})` : "# PROJECTS");

  reportAsMarkdown((handle = handle), (project_name = project_name));

  if (args.r || args.recurse || undefined) {
    await reportRecurse();
  }
};
