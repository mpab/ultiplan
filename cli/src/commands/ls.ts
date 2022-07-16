// list tasks (with recursive option)
// ls: `list all tasks <options> --r, -r recursively`,

import minimist from "minimist";
import dbLoad from "ultiplan-api/src/libs/db/db-load";

import { DbRecord_2022_07_16, RecordView } from "ultiplan-api/src/libs/db/db-record";
import { dbLoadAsView } from "ultiplan-api/src/libs/db/db-converters";
import { getAndCheckDbHandle } from "../utils/db-handle";

import visit from "ultiplan-api/src/libs/utils/dir-visitor";
import stringIsNullOrEmpty from "ultiplan-api/src/libs/utils/string-is-null-or-empty";

const lsCsv = (handle: string) => {
  const [records, error] = dbLoadAsView(handle);
  if (error) return;

  for (const item of records) {
    const record: RecordView = item;
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
    const csv = parse(record, opts);
    console.log(csv);
    console.log();
  }
};

const lsRaw = (handle: string) => {
  const [records, error] = dbLoad(handle);
  if (error) return;

  for (const r of records) {
    console.log(r as DbRecord_2022_07_16);
  }
};

const lsView = (handle: string) => {
  const [records, error] = dbLoadAsView(handle);
  if (error) return;

  for (const r of records) {
    console.log(r);
  }
};

const lsFormatRecord = (record: RecordView) => {
  const id = stringIsNullOrEmpty(record.id)
    ? "00000000-0000-0000-0000-000000000000"
    : record.id;
  let ret = `${record.project}-${id}\n${record.description}`;
  for (const tag of record.tags) {
    ret += `\n- ` + tag;
  }
  return ret;
};

const lsSummary = (handle: string) => {
  //console.log(`list ${handle}`)
  //console.log(`found DB ${handle}`)

  const [records, error] = dbLoadAsView(handle);
  if (error) return;

  for (const item of records) {
    const record: RecordView = item;
    console.log(lsFormatRecord(record));
    console.log();
  }
};

const ls = (args: minimist.ParsedArgs, handle: string) => {
  if (args.csv) {
    lsCsv(handle);
    return;
  }

  if (args.summary) {
    lsSummary(handle);
    return;
  }

  if (args.raw) {
    lsRaw(handle);
    return;
  }

  lsView(handle);
};

module.exports = async (handle: string) => {
  const args = minimist(process.argv.slice(2));

  if (args.r || args.recurse) {
    await visit((dir: string) => {
      const [handle] = getAndCheckDbHandle(dir);
      if (!handle) return;
      ls(args, handle);
    });
    return;
  }

  ls(args, handle);
};
