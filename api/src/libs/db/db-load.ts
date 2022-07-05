import * as fs from 'fs';

import stringIsNullOrEmpty from '../utils/string-is-null-or-empty';
import { DbRecord } from './db-record';

const dbLoad = (handle: string): DbRecord[] => {
  if (stringIsNullOrEmpty(handle)) {
    console.error(`invalid handle`);
    return [];
  }

  let data: string;
  try {
    data = fs.readFileSync(handle, 'utf-8');
  } catch (e) {
    console.error(e);
    console.error(`## file error reading: ${handle}`);
    return [];
  }
  //console.log(`parsing: ${fpath}...`);

  try {
    const records: DbRecord[] = JSON.parse(data);
    //console.log(`read ${records.length} records from ${handle}`);
    return records;
  } catch (e) {
    console.error(e);
    console.error(`## schema error in: ${handle}`);
  }

  return [];
};

export default dbLoad;
