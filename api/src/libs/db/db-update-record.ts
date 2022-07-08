import { DbRecord } from './db-record';

import dbLoad from './db-load';
import dbSave from './db-save';

const dbUpdateRecord = (new_record: DbRecord, handle: string): boolean => {
  const records: DbRecord[] = dbLoad(handle);
  if (!records.length) {
    console.error(`no records: ${handle}`);
    return false;
  }
  const record = records.find((r) => r.id === new_record.id);
  if (!record) {
    console.error(`record not found: id=${new_record.id}`);
    return false;
  }

  Object.keys(record).forEach((key) => (record[key] = new_record[key]));
  dbSave(records, handle);
  return true;
};

export default dbUpdateRecord;
