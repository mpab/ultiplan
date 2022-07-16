import * as fs from 'fs';

import stringIsNullOrEmptyOrWhitespace from '../utils/string-is-null-or-empty-or-whitespace';
import { DbRecord_2022_07_16 } from './db-record';

const nameOfGeneric =
  <T>() =>
  (name: keyof T) =>
    name;

export const logErrorAndReturnCollection = (error: string): [[], string] => {
  console.error(error);
  return [[], error];
};

export function dbLoadGeneric<T>(handle: string): [T[], string] {
  if (stringIsNullOrEmptyOrWhitespace(handle)) {
    return logErrorAndReturnCollection(`invalid handle`);
  }

  let data: string;
  try {
    data = fs.readFileSync(handle, 'utf-8');
  } catch (e) {
    console.error(e);
    return logErrorAndReturnCollection(`## file error reading: ${handle}`);
  }

  try {
    const records: T[] = JSON.parse(data);
    //console.log(`read ${records.length} records from ${handle}`);
    if (!records.length) {
      console.log(`empty DB at ${handle}`);
    }
    return [records, ''];
  } catch (e) {
    console.error(e);
  }

  return logErrorAndReturnCollection(
    `## error: ${handle} is not schema ${nameOfGeneric<T>()} - use cli upschema command to upgrade`,
  );
}

export const dbLoad = (handle: string): [DbRecord_2022_07_16[], string] =>
  dbLoadGeneric<DbRecord_2022_07_16>(handle);

export default dbLoad;
