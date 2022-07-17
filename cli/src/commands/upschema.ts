// upgrades the DB schema
// upschema: `upgrade the DB schema --r, -r ..... recursively`,

import {
  DbRecord_2022_07_16,
  RecordView,
} from "ultiplan-api/src/libs/db/db-record";
import { safeGetDbHandle } from "../utils/db-handle";
import visit from "../utils/dir-visitor";
import dbSave from "ultiplan-api/src/libs/db/db-save";
import { recordFromView } from "ultiplan-api/src/libs/db/db-converters";
import {
  dbLoadGeneric,
  logErrorAndReturnCollection,
} from "ultiplan-api/src/libs/db/db-load";

export const dbLoadViewAsDbRecord_2022_07_16 = (
  handle: string
): [DbRecord_2022_07_16[], string] => {
  const records = new Array<DbRecord_2022_07_16>();
  const [views, error] = dbLoadGeneric<RecordView>(handle);
  if (error) return [records, error];

  for (const item of views) {
    let record;
    try {
      const view = item as RecordView;
      record = recordFromView(view);
    } catch (e) {
      return logErrorAndReturnCollection("schema error");
    }

    records.push(record);
  }

  return [records, ""];
};

const upSchema = (handle: string) => {
  const [records, error] = dbLoadViewAsDbRecord_2022_07_16(handle);
  if (error) return;
  dbSave(records, handle);
};

module.exports = async (handle: string) => {
  const minimist = require(`minimist`);
  const args = minimist(process.argv.slice(2));
  upSchema(handle);
  if (args.r || args.recurse) {
    await visit((dir: string) => {
      const [file_handle] = safeGetDbHandle(dir);
      if (file_handle.length) {
        upSchema(file_handle);
      }
    }, process.cwd());
  }
};
