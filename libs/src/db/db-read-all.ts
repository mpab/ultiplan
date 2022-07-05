import fs from "fs";

import stringIsNullOrEmpty from "../utils/string-is-null-or-empty";
import { DbRecord } from "./db-record";

const index = (handle: string): DbRecord[] => {
  console.log(`db-read-all: ${handle}`);

  if (stringIsNullOrEmpty(handle)) return [];
  const fpath = handle.replace(/\\/g, "/");

  if (!fs.existsSync(handle)) {
    console.error(`${handle} not found`);
    return [];
  }

  let data: string;
  try {
    data = fs.readFileSync(handle, "utf-8");
  } catch (e) {
    console.error(`## file error reading: ${fpath}`);
    console.log(e);
    return [];
  }
  console.log(`parsing: ${fpath}...`);

  try {
    const records: DbRecord[] = JSON.parse(data);
    return records;
  } catch (e) {
    console.error(`## schema error in: ${fpath}`);
  }

  return [];
};

module.exports = (handle: string): DbRecord[] => {
  return index(handle);
};

export default index;
