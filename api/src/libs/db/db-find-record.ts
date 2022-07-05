import { DbRecord } from './db-record';

import dbLoad from './db-load';

const dbFindRecord = (id: string, handle: string) => {
  const records: DbRecord[] = dbLoad(handle);
  if (!records.length) return;
  return records.filter((record) => record.id === id)[0];
};

export default dbFindRecord;
