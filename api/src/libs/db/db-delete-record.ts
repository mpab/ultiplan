import { DbRecord } from './db-record';

import dbLoad from './db-load';
import dbSave from './db-save';

const dbDeleteRecord = (id: string, handle: string): boolean => {
  const records: DbRecord[] = dbLoad(handle);
  if (!records.length) {
    console.log(`no DB at ${handle}`);
    return false;
  }
  console.log(`${handle}: ${records.length} records`);
  const filtered_records = records.filter((record) => record.id != id);
  if (filtered_records.length === records.length) {
    console.log(`filter of id: ${id} over ${handle} had no effect`);
    return false;
  }
  //console.log(`deleted ${id} from ${handle}`);
  dbSave(filtered_records, handle);
  return true;
};

export default dbDeleteRecord;
