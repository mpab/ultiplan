import { DbRecord } from './db-record';

import dbLoad from './db-load';
import dbSave from './db-save';

const dbDeleteRecord = (id: string, handle: string): boolean => {
  const records: DbRecord[] = dbLoad(handle);
  if (!records.length) return false;
  const filtered_records = records.filter((record) => record.id !== id);
  if (filtered_records.length === records.length) return false;
  //console.log(`deleted ${id} from ${handle}`);
  dbSave(filtered_records, handle);
  return true;
};

export default dbDeleteRecord;
