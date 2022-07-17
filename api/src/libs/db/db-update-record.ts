import { DbRecord_2022_07_16 } from './db-record';

import dbLoad from './db-load';
import dbSave from './db-save';

const dbUpdateRecord = (
  new_record: DbRecord_2022_07_16,
  handle: string,
): DbRecord_2022_07_16 => {
  const [records] = dbLoad(handle);
  if (!records.length) return null;
  const record = records.find((r) => r.id === new_record.id);
  if (!record) {
    console.error(`record not found: id=${new_record.id}`);
    return null;
  }

  Object.keys(record).forEach((key) => (record[key] = new_record[key]));
  dbSave(records, handle);
  return record;
};

export default dbUpdateRecord;
