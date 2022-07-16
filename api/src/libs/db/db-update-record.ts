import { RecordView } from './db-record';

import dbLoad from './db-load';
import dbSave from './db-save';

const dbUpdateRecord = (new_record: RecordView, handle: string): boolean => {
  const [records] = dbLoad(handle);
  if (!records.length) return false;
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
